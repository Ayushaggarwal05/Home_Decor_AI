from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Optimization(Base):
    __tablename__ = "optimizations"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending") # pending, running, completed, failed
    
    # Store initial and final score metrics details for delta checking
    original_scores = Column(JSON, nullable=True)
    optimized_scores = Column(JSON, nullable=True)
    
    # List of layout suggestions: Array<{id: str, title: str, description: str}>
    suggestions = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    room = relationship("Room", back_populates="optimizations")
