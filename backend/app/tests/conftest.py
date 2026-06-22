import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import get_db
from app.database.base import Base
from app.core.config import settings

# Isolated SQLite test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    # Construct schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup schema
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    
    # Enforce testing profile settings
    settings.ENV = "testing"
    
    with TestClient(app) as c:
        yield c
        
    app.dependency_overrides.clear()

@pytest.fixture(autouse=True)
def mock_celery_tasks(mocker):
    """Mocks all async Celery tasks delay dispatches to run cleanly in isolation."""
    mocker.patch("app.tasks.analysis_tasks.run_spatial_analysis_task.delay")
    mocker.patch("app.tasks.optimization_tasks.run_layout_optimization_task.delay")
    mocker.patch("app.tasks.redesign_tasks.run_generative_redesign_task.delay")
