from celery import Celery
from app.core.config import settings
from app.database.session import SessionLocal
from app.models.room import Room
from app.models.analysis import Analysis
from app.models.furniture import Furniture
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

        # Simulate heavy neural detection delay
        time.sleep(2.0)

        # 1. Object detections simulation
        detector = DetectionModelInterface()
        detected_items = detector.predict_objects(b"") # Mock bytes
        
        # Insert detected elements
        for label, conf, box in detected_items:
            f = Furniture(
                label=label,
                confidence=conf,
                x=box[0],
                y=box[1],
                width=box[2],
                height=box[3],
                room_id=room.id
            )
            db.add(f)
        db.commit()

        # 2. Occupancy grid generation
        mapper = SpaceMapperInterface()
        grid = mapper.generate_occupancy_matrix(room.furniture, (room.length, room.width))

        # 3. Spatial scores
        scorer = ScoringModelInterface()
        scores = scorer.calculate_scores(room.furniture)

        # Create or update room analysis log
        analysis = db.query(Analysis).filter(Analysis.room_id == room.id).first()
        if not analysis:
            analysis = Analysis(
                clutter_level="Low" if scores["clutter"] > 80 else "Medium",
                symmetry_score=scores["symmetry"],
                accessibility_score=scores["accessibility"],
                overall_score=scores["overall"],
                flow_score=scores["flow"],
                lighting_score=scores["lighting"],
                occupancy_grid=grid,
                reasoning=[
                    {"title": "Open Circulation Loop", "description": "No direct pathway obstructions found.", "type": "positive"},
                    {"title": "Optimal Window Align", "description": "Daylight is correctly directed.", "type": "positive"}
                ],
                room_id=room.id
            )
            db.add(analysis)
        else:
            analysis.symmetry_score = scores["symmetry"]
            analysis.overall_score = scores["overall"]
            analysis.occupancy_grid = grid
            
        db.commit()
        logger.info(f"Spatial analysis completed successfully for room {room_id}")
        return analysis.id

    except Exception as exc:
        db.rollback()
        logger.error(f"Error in spatial analysis task: {exc}. Retrying...")
        raise self.retry(exc=exc)
    finally:
        db.close()
