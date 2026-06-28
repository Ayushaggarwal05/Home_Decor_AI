from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    
    # High-level ratings
    clutter_level = Column(String, default="Low") # Low, Medium, High
    symmetry_score = Column(Integer, default=100)
    accessibility_score = Column(Integer, default=100)
    
    # Detailed spatial metrics
    overall_score = Column(Integer, default=100)
    flow_score = Column(Integer, default=100)
    lighting_score = Column(Integer, default=100)
    
    # Complex fields stored in database as structured JSON documents
    # occupancy_grid holds {rows: int, cols: int, grid: Array<Array<Cell>>}
    occupancy_grid = Column(JSON, nullable=False)
    
    # reasoning holds Array<{id: str, title: str, description: str, type: str}>
    reasoning = Column(JSON, nullable=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Relationships
    room = relationship("Room", back_populates="analysis")

    @property
    def scores(self):
        """Calculates a numeric clutter value based on clutter_level to return all rating scores."""
        clutter_val = 90
        if self.clutter_level == "High":
            clutter_val = 40
        elif self.clutter_level == "Medium":
            clutter_val = 70
        return {
            "overall": self.overall_score or 80,
            "flow": self.flow_score or 80,
            "symmetry": self.symmetry_score or 80,
            "clutter": clutter_val,
            "accessibility": self.accessibility_score or 80,
            "lighting": self.lighting_score or 80
        }

    @property
    def detections(self):
        """Returns the list of furniture detections from the associated room."""
        return self.room.furniture if self.room else []

