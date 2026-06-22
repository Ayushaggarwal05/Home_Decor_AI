from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.room_schema import RoomCreate, RoomResponse
from app.schemas.analysis_schema import AnalysisResponse
from app.services.room_service import RoomService
from typing import List

router = APIRouter(prefix="/analyze", tags=["Spatial Scan & Analysis"])

@router.post("/room", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room_scan(
    room_in: RoomCreate,
    image_url: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Registers room model details and queues background spatial audits."""
    service = RoomService()
    room = service.create_room(db, room_in, image_url, current_user.id)
    return room

@router.get("/rooms", response_model=List[RoomResponse])
def get_user_rooms_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch user's scanned rooms history."""
    service = RoomService()
    return service.get_rooms_by_user(db, current_user.id)

@router.get("/room/{room_id}", response_model=RoomResponse)
def get_room_details(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch individual room details."""
    service = RoomService()
    room = service.get_room_by_id(db, room_id)
    if not room or room.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Room resource not found.")
    return room

@router.get("/room/{room_id}/result", response_model=AnalysisResponse)
def get_room_analysis_results(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch spatial metrics results grid if computed."""
    service = RoomService()
    room = service.get_room_by_id(db, room_id)
    if not room or room.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Room resource not found.")
    
    if not room.analysis:
        raise HTTPException(status_code=202, detail="Spatial audits still pending in Celery queue.")
        
    return room.analysis
