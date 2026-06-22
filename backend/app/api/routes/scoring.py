from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.analysis_schema import AnalysisScore
from app.services.scoring_service import ScoringService
from typing import List, Dict, Any

router = APIRouter(prefix="/scoring", tags=["Layout Scoring"])

@router.post("/recalculate", response_model=AnalysisScore)
def recalculate_layout_ratings(
    furniture_layout: List[Dict[str, Any]],
    current_user: User = Depends(get_current_user)
):
    """Recalculates Flow and Symmetry variables ratings for custom layouts."""
    service = ScoringService()
    scores = service.evaluate_layout_score(furniture_layout)
    return scores
