from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class OptimizationRequest(BaseModel):
    room_id: int

class OptimizationSuggestion(BaseModel):
    id: str
    title: str
    description: str

class OptimizationResponse(BaseModel):
    id: int
    room_id: int
    status: str
    original_scores: Optional[Dict[str, Any]] = None
    optimized_scores: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True
