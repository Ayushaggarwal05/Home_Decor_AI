from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Redesign(Base):
    __tablename__ = "redesigns"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending") # pending, generating, completed, failed
    
    prompt = Column(String, nullable=False)
    selected_style = Column(String, nullable=False) # e.g. Japandi Harmony
    
    original_image_url = Column(String, nullable=False)
    redesigned_image_url = Column(String, nullable=True) # Populated on completion
    
    # Text list of styling advice suggestions
    suggestions = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    room = relationship("Room", back_populates="redesigns")
