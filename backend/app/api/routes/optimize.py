from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies.auth import get_current_user
from app.api.dependencies.rate_limiter import RateLimiter
from app.models.user import User
from app.schemas.optimization_schema import OptimizationRequest, OptimizationResponse
from app.services.optimization_service import OptimizationService

router = APIRouter(prefix="/optimize", tags=["Layout Optimization"])

@router.post("", response_model=OptimizationResponse, status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(RateLimiter(requests_limit=10, window_seconds=60))])
def request_layout_adjustments(
    req: OptimizationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Triggers layout coordinates improvements and schedules a Celery job."""
    service = OptimizationService()
    opt = service.trigger_layout_optimization(db, req.room_id)
    return opt

@router.get("/{job_id}", response_model=OptimizationResponse)
def get_optimization_job_status(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Poll Celery task status parameters and retrieve suggestions."""
    service = OptimizationService()
    opt = service.get_optimization_by_id(db, job_id)
    if not opt:
        raise HTTPException(status_code=404, detail="Optimization record not found.")
    return opt

@router.get("/room/{room_id}", response_model=OptimizationResponse)
def get_room_blueprints(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch latest optimization record with blueprints for a room, or trigger calculation."""
    from app.models.room import Room
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room or room.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Room resource not found.")

    service = OptimizationService()
    opt = service.get_latest_optimization_by_room(db, room_id)

    retrigger = False
    if not opt:
        retrigger = True
    elif opt.status == "failed":
        retrigger = True
    elif opt.status == "completed" and (not opt.blueprints or len(opt.blueprints) == 0):
        retrigger = True
    elif opt.status == "pending":
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        if opt.created_at:
            created = opt.created_at if opt.created_at.tzinfo else opt.created_at.replace(tzinfo=timezone.utc)
            if (now - created).total_seconds() > 20:
                retrigger = True

    if retrigger:
        opt = service.trigger_layout_optimization(db, room_id)
    return opt

