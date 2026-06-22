from fastapi import APIRouter, Depends, Request
from app.api.dependencies.auth import get_current_user
from app.services.retrieval_service import RetrievalService
from app.utils.cache import cache_response
from typing import List

router = APIRouter(prefix="/retrieval", tags=["Inspiration Retrieval"])

@router.get("/inspirations", response_model=List[str])
@cache_response(expire_seconds=600)
def fetch_design_inspirations(
    prompt: str,
    style: str,
    request: Request,
    current_user: str = Depends(get_current_user)
):
    """Pulls matched visual catalog assets from embedding databases."""
    service = RetrievalService()
    return service.get_style_inspirations(prompt, style)
