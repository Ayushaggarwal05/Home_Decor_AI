from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RedesignRequest(BaseModel):
    room_id: int
    selected_style: str = Field(..., description="e.g. Japandi Harmony")
    prompt: Optional[str] = Field(default="", description="Instruction overrides for diffusion generation")

class RedesignResponse(BaseModel):
    id: int
    room_id: int
    status: str
    prompt: str
    selected_style: str
    original_image_url: str
    redesigned_image_url: Optional[str] = None
    suggestions: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True
