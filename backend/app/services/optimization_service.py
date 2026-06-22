from sqlalchemy.orm import Session
from app.models.optimization import Optimization
from app.tasks.optimization_tasks import run_layout_optimization_task
from typing import Optional

class OptimizationService:
    """Orchestrates spatial path clearing tasks and coordinate adjustments."""

    def trigger_layout_optimization(self, db: Session, room_id: int) -> Optimization:
        """Create database log and run Celery task."""
        opt = Optimization(
            status="pending",
            room_id=room_id
        )
        db.add(opt)
        db.commit()
        db.refresh(opt)

        # Trigger Celery geometry layout solver task
        run_layout_optimization_task.delay(opt.id)
        
        return opt

    def get_optimization_by_id(self, db: Session, opt_id: int) -> Optional[Optimization]:
        """Fetch optimization state."""
        return db.query(Optimization).filter(Optimization.id == opt_id).first()
