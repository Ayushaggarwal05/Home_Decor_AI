from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import AuraException, aura_exception_handler
from app.api.router import api_router
from app.database.base import Base
from app.database.session import engine

# Import models to ensure they are registered on Base.metadata before creation
from app.models.user import User
from app.models.room import Room
from app.models.furniture import Furniture
from app.models.analysis import Analysis
from app.models.optimization import Optimization
from app.models.redesign import Redesign

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables if they do not exist
    Base.metadata.create_all(bind=engine)
    yield

# Initialize system log profiles
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Aura AI Spatial Intelligence & Optimization backend orchestration engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ---------------------------------------------------------------------------
# CORS — allow Next.js dev server + production origin
# When Next.js proxies API calls via rewrites, requests come from the
# Next.js server itself, so origin = http://localhost:3000 in dev.
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Next.js dev server
    "http://127.0.0.1:3000",
    "http://localhost:8000",      # FastAPI Swagger UI self-calls
]

# Allow additional origins from environment
if hasattr(settings, "FRONTEND_URL") and settings.FRONTEND_URL:
    ALLOWED_ORIGINS.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

# Mount correlation ID and tracing middleware
from app.core.middleware import RequestTracingMiddleware
app.add_middleware(RequestTracingMiddleware)

# Register central Exception interceptor logic
app.add_exception_handler(AuraException, aura_exception_handler)

# Mount API Routers mapping
app.include_router(api_router)


@app.get("/health", tags=["System Diagnostics"])
def health_check() -> dict:
    """Return central diagnostics status parameters."""
    return {
        "status": "operational",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENV
    }
