from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from app.models.room import Room
from typing import Dict, Any

router = APIRouter(prefix="/compare", tags=["Room Comparison"])

@router.get("", response_model=dict)
def compare_room_metrics(
    room_a_id: int,
    room_b_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Computes layout optimization score deltas between two rooms."""
    roomA = db.query(Room).filter(Room.id == room_a_id).first()
    roomB = db.query(Room).filter(Room.id == room_b_id).first()

    if not roomA or not roomB or roomA.user_id != current_user.id or roomB.user_id != current_user.id:
        raise HTTPException(
            status_code=404, 
            detail="One or both of the compared room resources not found."
        )

    scoreA = roomA.analysis.scores if roomA.analysis else {}
    scoreB = roomB.analysis.scores if roomB.analysis else {}

    # Calculate differences
    deltas = {}
    if scoreA and scoreB:
        for key in ["overall", "flow", "symmetry", "clutter", "accessibility", "lighting"]:
            deltas[key] = scoreA.get(key, 0) - scoreB.get(key, 0)

    return {
        "room_a": {"id": roomA.id, "name": roomA.name, "scores": scoreA},
        "room_b": {"id": roomB.id, "name": roomB.name, "scores": scoreB},
        "deltas": deltas
    }
