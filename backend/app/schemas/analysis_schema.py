from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class FurnitureDetection(BaseModel):
    id: Optional[int] = None
    label: str
    confidence: float
    boundingBox: BoundingBox

class AnalysisScore(BaseModel):
    overall: int
    flow: int
    symmetry: int
    clutter: int
    accessibility: int
    lighting: int

class ReasoningItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    type: str # positive, warning, improvement
    associatedFurnitureId: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: int
    room_id: int
    clutter_level: str
    symmetry_score: int
    accessibility_score: int
    scores: AnalysisScore
    detections: List[FurnitureDetection]
    reasoning: List[ReasoningItem]
    occupancy_grid: Dict[str, Any]

    class Config:
        from_attributes = True
