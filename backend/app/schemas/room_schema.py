from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RoomBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    space_type: str = Field(..., description="e.g. living_room, bedroom, office")
    style_preference: str = Field(..., description="e.g. Japandi Harmony")
    length: Optional[float] = None
    width: Optional[float] = None
    unit: str = "ft"

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int
    image_url: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
