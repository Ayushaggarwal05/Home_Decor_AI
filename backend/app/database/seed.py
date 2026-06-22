from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.room import Room
from app.models.analysis import Analysis
from app.models.furniture import Furniture
from app.models.optimization import Optimization
from app.models.redesign import Redesign
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_db(db: Session) -> None:
    # 1. Create Demo User
    user = db.query(User).filter(User.email == "sarah.j@designstudio.ai").first()
    if not user:
        user = User(
            email="sarah.j@designstudio.ai",
            hashed_password=get_password_hash("password123"),
            full_name="Sarah Jenkins",
            tier="Pro"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"Seeded User: {user.email}")
    
    # 1b. Create Admin User
    admin = db.query(User).filter(User.email == "admin@designstudio.ai").first()
    if not admin:
        admin = User(
            email="admin@designstudio.ai",
            hashed_password=get_password_hash("adminpassword123"),
            full_name="System Administrator",
            tier="Enterprise"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        logger.info(f"Seeded Admin User: {admin.email}")
    
    # 2. Create sample Room
    room = db.query(Room).filter(Room.name == "Modern Living Area").first()
    if not room:
        room = Room(
            name="Modern Living Area",
            image_url="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
            space_type="living_room",
            style_preference="Modern Minimalist",
            length=18.0,
            width=14.0,
            unit="ft",
            user_id=user.id
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        logger.info(f"Seeded Room: {room.name}")

        # 3. Create room detections
        f1 = Furniture(label="Sofa", confidence=0.98, x=20.0, y=40.0, width=45.0, height=25.0, room_id=room.id)
        f2 = Furniture(label="Coffee Table", confidence=0.94, x=30.0, y=68.0, width=25.0, height=15.0, room_id=room.id)
        db.add_all([f1, f2])
        
        # 4. Create analysis details
        analysis = Analysis(
            clutter_level="Medium",
            symmetry_score=82,
            accessibility_score=78,
            overall_score=84,
            flow_score=88,
            lighting_score=95,
            occupancy_grid={
                "rows": 10,
                "cols": 10,
                "grid": [[0.1]*10 for _ in range(10)] # Sim grid
            },
            reasoning=[
                {"title": "Excellent Natural Light Alignment", "description": "The seating group is perfectly aligned with southern windows.", "type": "positive"},
                {"title": "Sofa Backrest Exposure", "description": "The sofa backrest faces the main doorway.", "type": "warning"}
            ],
            room_id=room.id
        )
        db.add(analysis)
        db.commit()
        logger.info(f"Seeded Analysis for Room: {room.id}")

if __name__ == "__main__":
    logger.info("Initializing database seeder...")
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
        logger.info("Database seeding completed successfully.")
    finally:
        db.close()
