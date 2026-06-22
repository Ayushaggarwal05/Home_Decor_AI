from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies.auth import get_current_user
from app.api.dependencies.rate_limiter import RateLimiter
from app.models.user import User
from app.models.room import Room
from app.schemas.redesign_schema import RedesignRequest, RedesignResponse
from app.services.redesign_service import RedesignService
from typing import List

router = APIRouter(prefix="/redesign", tags=["Generative Redesign"])

@router.post("", response_model=RedesignResponse, status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(RateLimiter(requests_limit=10, window_seconds=60))])
def request_generative_style_changes(
    req: RedesignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Schedules stable-diffusion processes using prompt directives."""
    db_room = db.query(Room).filter(Room.id == req.room_id).first()
    if not db_room or db_room.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Room resource not found.")

    service = RedesignService()
    redesign = service.request_room_redesign(db, req, db_room.image_url)
    return redesign

@router.get("/room/{room_id}", response_model=List[RedesignResponse])
def get_room_redesigns_history(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch previous style changes generated for room."""
    service = RedesignService()
    return service.get_redesigns_by_room(db, room_id)

@router.get("/{job_id}", response_model=RedesignResponse)
def get_redesign_job_status(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Poll redesign task completion state and fetch render links."""
    service = RedesignService()
    redesign = service.get_redesign_by_id(db, job_id)
    if not redesign:
        raise HTTPException(status_code=404, detail="Redesign record not found.")
    return redesign
