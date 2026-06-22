from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Furniture(Base):
    __tablename__ = "furniture"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=False) # e.g. Sofa, Bookshelf, Coffee Table
    confidence = Column(Float, nullable=False) # Detection model confidence

    # Bounding box coordinates in percentage values (0.0 to 100.0)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)

    # Physical metric dimensions (optional details)
    dim_width = Column(Float, nullable=True)
    dim_depth = Column(Float, nullable=True)
    dim_height = Column(Float, nullable=True)

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    room = relationship("Room", back_populates="furniture")
