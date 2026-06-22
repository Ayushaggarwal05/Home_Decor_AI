from sqlalchemy.orm import Session
from app.models.redesign import Redesign
from app.schemas.redesign_schema import RedesignRequest
from app.tasks.redesign_tasks import run_generative_redesign_task
from typing import List, Optional

class RedesignService:
    """Orchestrates Stable Diffusion requests and Celery generation tasks."""

    def request_room_redesign(
        self, 
        db: Session, 
        req: RedesignRequest, 
        original_image_url: str
    ) -> Redesign:
        """Create redesign tracker log and dispatch task to Celery."""
        redesign = Redesign(
            status="pending",
            prompt=req.prompt,
            selected_style=req.selected_style,
            original_image_url=original_image_url,
            room_id=req.room_id
        )
        db.add(redesign)
        db.commit()
        db.refresh(redesign)

        # Dispatch async stable diffusion generation pipeline task to Celery
        run_generative_redesign_task.delay(redesign.id)
        
        return redesign

    def get_redesign_by_id(self, db: Session, redesign_id: int) -> Optional[Redesign]:
        """Fetch single redesign task state."""
        return db.query(Redesign).filter(Redesign.id == redesign_id).first()

    def get_redesigns_by_room(self, db: Session, room_id: int) -> List[Redesign]:
        """Fetch design runs of room."""
        return db.query(Redesign).filter(Redesign.room_id == room_id).order_by(Redesign.created_at.desc()).all()
