from celery import Celery
from app.core.config import settings
from app.database.session import SessionLocal
from app.models.room import Room
from app.models.analysis import Analysis
from app.models.furniture import Furniture
from app.models.user import User
from app.models.redesign import Redesign
from app.models.optimization import Optimization
from app.ai.detection import DetectionModelInterface
from app.ai.space_mapping import SpaceMapperInterface
from app.ai.scoring import ScoringModelInterface
import logging
import time

logger = logging.getLogger(__name__)

# Initialize the Celery application instance
celery_app = Celery(
    "aura_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Standard configuration settings
celery_app.conf.update(
    task_always_eager=settings.CELERY_ALWAYS_EAGER,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300, # 5 minutes hard limit
    task_routes={
        "app.tasks.analysis_tasks.run_spatial_analysis_task": {"queue": "default"},
        "app.tasks.optimization_tasks.run_layout_optimization_task": {"queue": "default"},
        "app.tasks.redesign_tasks.run_generative_redesign_task": {"queue": "heavy_ai"}
    }
)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def run_spatial_analysis_task(self, room_id: int) -> int:
    """Asynchronously audits room assets and generates layout metrics grids."""
    logger.info(f"Starting spatial analysis background task for room: {room_id}")
    db = SessionLocal()
    try:
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            logger.error(f"Room {room_id} not found in database session.")
            return -1

        # Load actual image bytes
        import os
        import requests
        
        image_bytes = b""
        image_url = room.image_url
        if image_url.startswith("http://") or image_url.startswith("https://"):
            try:
                response = requests.get(image_url, timeout=15)
                if response.status_code == 200:
                    image_bytes = response.content
                else:
                    logger.error(f"Failed to fetch image from URL: status {response.status_code}")
            except Exception as e:
                logger.error(f"Exception fetching image URL {image_url}: {e}")
        else:
            # Local file path loading
            local_path = image_url.lstrip('/')
            if os.path.exists(local_path):
                try:
                    with open(local_path, "rb") as f:
                        image_bytes = f.read()
                except Exception as e:
                    logger.error(f"Failed to read local image file {local_path}: {e}")
            else:
                logger.error(f"Local image file not found at: {local_path}")

        # 1. Object detections
        detector = DetectionModelInterface()
        detected_items = detector.predict_objects(image_bytes)
        
        # Average physical dimensions for typical furniture items (width, depth, height) in ft
        AVG_DIMENSIONS = {
            "sofa": (7.0, 3.0, 2.8),
            "bed": (6.5, 5.0, 3.0),
            "coffee table": (3.5, 2.0, 1.5),
            "dining table": (5.0, 3.0, 2.5),
            "chair": (1.5, 1.5, 3.0),
            "armchair": (3.0, 3.0, 3.0),
            "desk": (4.5, 2.2, 2.5),
            "bookshelf": (3.0, 1.2, 6.0),
            "sideboard": (5.0, 1.5, 2.5),
            "potted plant": (1.5, 1.5, 3.0),
            "door": (3.0, 0.5, 6.8),
            "window": (4.0, 0.5, 4.0)
        }

        # Insert detected elements
        for label, conf, box in detected_items:
            dims = AVG_DIMENSIONS.get(label.lower(), (3.0, 2.0, 2.5))
            f = Furniture(
                label=label,
                confidence=conf,
                x=box[0],
                y=box[1],
                width=box[2],
                height=box[3],
                dim_width=dims[0],
                dim_depth=dims[1],
                dim_height=dims[2],
                room_id=room.id
            )
            db.add(f)
        db.commit()

        # 2. Occupancy grid generation
        mapper = SpaceMapperInterface()
        grid = mapper.generate_occupancy_matrix(room.furniture, (room.length, room.width))

        # 3. Spatial scores & dynamic reasoning
        scorer = ScoringModelInterface()
        result = scorer.calculate_scores_and_reasoning(room.furniture)
        scores = result["scores"]
        reasoning = result["reasoning"]

        # 4. Serialize spatial relationship graph
        from app.ai.spatial.spatial_relationship_graph import SpatialRelationshipGraph
        layout_elements = [
            {
                "id": str(f.id),
                "label": f.label,
                "boundingBox": {
                    "x": f.x,
                    "y": f.y,
                    "width": f.width,
                    "height": f.height
                }
            }
            for f in room.furniture
        ]
        rel_graph = SpatialRelationshipGraph(layout_elements, room_length=room.length or 16.0, room_width=room.width or 12.0)
        serialized_graph = rel_graph.serialize_graph()

        # Create or update room analysis log
        analysis = db.query(Analysis).filter(Analysis.room_id == room.id).first()
        if not analysis:
            analysis = Analysis(
                clutter_level=result["clutter_level"],
                symmetry_score=scores["symmetry"],
                accessibility_score=scores["accessibility"],
                overall_score=scores["overall"],
                flow_score=scores["flow"],
                lighting_score=scores["lighting"],
                occupancy_grid=grid,
                reasoning=reasoning,
                graph_data=serialized_graph,
                room_id=room.id
            )
            db.add(analysis)
        else:
            analysis.clutter_level = result["clutter_level"]
            analysis.symmetry_score = scores["symmetry"]
            analysis.accessibility_score = scores["accessibility"]
            analysis.overall_score = scores["overall"]
            analysis.flow_score = scores["flow"]
            analysis.lighting_score = scores["lighting"]
            analysis.occupancy_grid = grid
            analysis.reasoning = reasoning
            analysis.graph_data = serialized_graph
            
        db.commit()
        logger.info(f"Spatial analysis completed successfully for room {room_id}")
        return analysis.id

    except Exception as exc:
        db.rollback()
        logger.error(f"Error in spatial analysis task: {exc}. Retrying...")
        raise self.retry(exc=exc)
    finally:
        db.close()
