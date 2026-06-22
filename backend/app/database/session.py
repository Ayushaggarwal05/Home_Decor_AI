from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator
from app.core.config import settings

# Initialize database connection engine
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True, # Proactively ping connections to recycle stale/dead sockets
        pool_size=10,
        max_overflow=20
    )

# Set up local session maker context
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    """Yield DB transaction sessions to endpoints and close connection contexts on resolve."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
