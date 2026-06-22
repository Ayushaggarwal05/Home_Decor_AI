from app.tasks.analysis_tasks import celery_app
from app.database.session import SessionLocal
from app.models.optimization import Optimization
from app.models.room import Room
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
            logger.warning(f"No furniture items found for room {room.id}. Optimization skipped.")
            opt.original_scores = {"overall": 100, "flow": 100, "symmetry": 100, "clutter": 100, "accessibility": 100, "lighting": 100}
            opt.optimized_scores = opt.original_scores
            opt.suggestions = [{"id": "sug-empty", "title": "Empty Space Mapped", "description": "Add furniture items to perform layout constraint optimization audits."}]
            opt.status = "completed"
            db.commit()
            return opt.id

        # 3. Calculate baseline spatial ratings
        from app.ai.scoring.scorer import ExplainableScoringEngine
        scorer = ExplainableScoringEngine()
        baseline_res = scorer.calculate_room_scores(original_layout)
        original_scores = baseline_res["scores"]

        # 4. Trigger Genetic Optimization Solver
        from app.ai.optimization.solver import LayoutConstraintSolver
        solver = LayoutConstraintSolver(population_size=30, generations=40)
        optimized_layout, suggestions = solver.optimize_layout(
            original_layout,
            room_length=room.length or 16.0,
            room_width=room.width or 12.0
        )

        # 5. Compute optimized spatial ratings
        optimized_res = scorer.calculate_room_scores(optimized_layout)
        optimized_scores = optimized_res["scores"]

        # 6. Save results to Optimization DB entity
        opt.original_scores = original_scores
        opt.optimized_scores = optimized_scores
        opt.suggestions = suggestions
        opt.status = "completed"
        db.commit()
        
        logger.info(f"Layout optimization task completed successfully for ID: {optimization_id}")
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
