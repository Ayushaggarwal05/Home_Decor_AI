from sqlalchemy.orm import Session
from app.models.room import Room
from app.schemas.room_schema import RoomCreate
from app.tasks.analysis_tasks import run_spatial_analysis_task
from typing import List, Optional

class RoomService:
    """Manages database room entities and dispatches layout computation jobs."""

    def create_room(self, db: Session, room_in: RoomCreate, image_url: str, user_id: int) -> Room:
        """Saves a room image link and spawns Celery task to calculate spatial occupancy."""
        room = Room(
            name=room_in.name,
            image_url=image_url,
            space_type=room_in.space_type,
            style_preference=room_in.style_preference,
            length=room_in.length,
            width=room_in.width,
            unit=room_in.unit,
            user_id=user_id
        )
        db.add(room)
        db.commit()
        db.refresh(room)

        # Trigger spatial analysis async Celery task pipeline via Redis broker
        run_spatial_analysis_task.delay(room.id)
        
        return room

    def get_room_by_id(self, db: Session, room_id: int) -> Optional[Room]:
        """Fetch single room entity."""
        return db.query(Room).filter(Room.id == room_id).first()

    def get_rooms_by_user(self, db: Session, user_id: int) -> List[Room]:
        """Fetch all historical room records for user."""
        return db.query(Room).filter(Room.user_id == user_id).order_by(Room.created_at.desc()).all()
