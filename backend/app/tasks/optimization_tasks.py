from app.tasks.analysis_tasks import celery_app
from app.database.session import SessionLocal
from app.models import User, Room, Furniture, Analysis, Optimization, Redesign
import logging
import time

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def run_layout_optimization_task(self, optimization_id: int) -> int:
    """Asynchronously audits spatial pathways and computes alternative furniture coords."""
    logger.info(f"Starting layout optimization task for ID: {optimization_id}")
    db = SessionLocal()
    try:
        opt = db.query(Optimization).filter(Optimization.id == optimization_id).first()
        if not opt:
            logger.error(f"Optimization record {optimization_id} not found.")
            return -1

        opt.status = "running"
        db.commit()

        # Simulate geometry layout computing delay
        time.sleep(2.0)

        # 1. Fetch room details
        room = db.query(Room).filter(Room.id == opt.room_id).first()
        if not room:
            logger.error(f"Room for optimization {optimization_id} not found.")
            opt.status = "failed"
            db.commit()
            return -1

        # 2. Map furniture models to layout input arrays
        original_layout = [
            {
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

        if not original_layout:
            logger.info(f"No furniture detected in room {room.id}. Generating recommended starter blueprints for space: {room.space_type}.")
            if "bedroom" in (room.space_type or "").lower():
                original_layout = [
                    {"label": "Bed", "boundingBox": {"x": 25.0, "y": 20.0, "width": 40.0, "height": 35.0}},
                    {"label": "Nightstand", "boundingBox": {"x": 12.0, "y": 22.0, "width": 10.0, "height": 12.0}},
                    {"label": "Sideboard", "boundingBox": {"x": 75.0, "y": 50.0, "width": 20.0, "height": 15.0}},
                    {"label": "Door", "boundingBox": {"x": 5.0, "y": 85.0, "width": 12.0, "height": 10.0}}
                ]
            else:
                original_layout = [
                    {"label": "Sofa", "boundingBox": {"x": 20.0, "y": 30.0, "width": 35.0, "height": 22.0}},
                    {"label": "Coffee Table", "boundingBox": {"x": 30.0, "y": 56.0, "width": 18.0, "height": 14.0}},
                    {"label": "Armchair", "boundingBox": {"x": 65.0, "y": 40.0, "width": 15.0, "height": 16.0}},
                    {"label": "Sideboard", "boundingBox": {"x": 15.0, "y": 80.0, "width": 25.0, "height": 12.0}},
                    {"label": "Door", "boundingBox": {"x": 80.0, "y": 85.0, "width": 12.0, "height": 10.0}}
                ]

        # 3. Calculate baseline spatial ratings
        from app.ai.scoring.scorer import ExplainableScoringEngine
        scorer = ExplainableScoringEngine()
        baseline_res = scorer.calculate_room_scores(original_layout)
        original_scores = baseline_res["scores"]

        # 4. Trigger Genetic Optimization Solver for multi-blueprint generation
        from app.ai.optimization.solver import LayoutConstraintSolver
        solver = LayoutConstraintSolver(population_size=35, generations=45)
        blueprints = solver.optimize_multiple_layouts(
            original_layout,
            room_length=room.length or 16.0,
            room_width=room.width or 12.0,
            max_blueprints=15
        )

        top_blueprint = blueprints[0] if blueprints else {
            "layout": original_layout,
            "scores": original_scores,
            "suggestions": []
        }

        # 5. Save results and candidate blueprints to Optimization DB entity
        opt.original_scores = original_scores
        opt.optimized_scores = top_blueprint.get("scores", original_scores)
        opt.suggestions = top_blueprint.get("suggestions", [])
        opt.blueprints = blueprints
        opt.status = "completed"
        db.commit()
        
        logger.info(f"Layout optimization task completed with {len(blueprints)} blueprints for ID: {optimization_id}")
        return opt.id

    except Exception as exc:
        db.rollback()
        logger.error(f"Error in optimization task: {exc}. Retrying...")
        if opt:
            opt.status = "failed"
            db.commit()
        raise self.retry(exc=exc)
    finally:
        db.close()
