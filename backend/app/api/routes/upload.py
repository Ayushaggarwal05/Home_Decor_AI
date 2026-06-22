from fastapi import APIRouter, Depends, UploadFile, File
from app.services.upload_service import UploadService
from app.api.dependencies.auth import get_current_user
from app.api.dependencies.rate_limiter import RateLimiter
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Upload Space"])

@router.post("", response_model=dict, dependencies=[Depends(RateLimiter(requests_limit=10, window_seconds=60))])
async def upload_room_asset(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Processes uploaded graphic room files, pushes to storage, and resolves URL."""
    service = UploadService()
    url = await service.upload_room_image(file)
    return {"url": url}
