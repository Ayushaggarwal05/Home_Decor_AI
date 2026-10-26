from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class RedesignRequest(BaseModel):
    room_id: int
    selected_style: str = Field(..., description="e.g. Japandi Harmony")
    prompt: Optional[str] = Field(default="", description="Instruction overrides for diffusion generation")
    blueprint_id: Optional[str] = Field(default=None, description="Selected blueprint identifier")
    blueprint_layout: Optional[List[Dict[str, Any]]] = Field(default=None, description="Coordinates of chosen blueprint")

class RedesignResponse(BaseModel):
    id: int
    room_id: int
    status: str
    prompt: str
    selected_style: str
    blueprint_id: Optional[str] = None
    original_image_url: str
    redesigned_image_url: Optional[str] = None
    suggestions: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True
