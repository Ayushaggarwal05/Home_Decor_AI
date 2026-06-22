from fastapi import APIRouter
from app.api.routes import auth, upload, analyze, optimize, redesign, scoring, compare, retrieval, tasks

api_router = APIRouter(prefix="/api")

# Centralize API endpoint router subgroups
api_router.include_router(auth.router)
api_router.include_router(upload.router)
api_router.include_router(analyze.router)
api_router.include_router(optimize.router)
api_router.include_router(redesign.router)
api_router.include_router(scoring.router)
api_router.include_router(compare.router)
api_router.include_router(retrieval.router)
api_router.include_router(tasks.router)
