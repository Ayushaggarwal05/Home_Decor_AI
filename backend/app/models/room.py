from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    space_type = Column(String, nullable=False) # e.g., living_room, bedroom, office
    style_preference = Column(String, nullable=False) # e.g., Japandi, Scandinavian
    length = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    unit = Column(String, default="ft") # ft or m
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="rooms")
    furniture = relationship("Furniture", back_populates="room", cascade="all, delete-orphan")
    analysis = relationship("Analysis", uselist=False, back_populates="room", cascade="all, delete-orphan")
    redesigns = relationship("Redesign", back_populates="room", cascade="all, delete-orphan")
    optimizations = relationship("Optimization", back_populates="room", cascade="all, delete-orphan")
class UserRoom:
    pass
