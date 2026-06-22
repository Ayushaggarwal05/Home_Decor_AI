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
