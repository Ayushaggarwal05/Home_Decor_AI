# 🧠 Matter AI — Backend API

> **FastAPI + Python backend** for the Matter AI Interior Design & Space Optimization SaaS platform. Powers spatial intelligence, room analysis, layout optimization, generative redesign, and all data persistence.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [AI Engine Architecture](#-ai-engine-architecture)
- [API Reference](#-api-reference)
- [Local Setup](#-local-setup)
- [Docker Setup](#-docker-setup)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Environment Variables](#-environment-variables)
- [Production Features](#-production-features)

---

## ⚡ Tech Stack

| Technology     | Version | Purpose                              |
| -------------- | ------- | ------------------------------------ |
| **FastAPI**    | 0.110+  | Async REST API framework             |
| **Python**     | 3.12+   | Core language runtime                |
| **PostgreSQL** | 15      | Relational database                  |
| **SQLAlchemy** | 2.0+    | ORM with declarative typed models    |
| **Alembic**    | 1.13+   | Schema migration management          |
| **Pydantic**   | v2      | Request/response validation          |
| **Celery**     | 5.3+    | Distributed background task workers  |
| **Redis**      | 7       | Task broker, result backend, caching |
| **PyJWT**      | 2.8+    | JWT access and refresh token signing |
| **bcrypt**     | 5.0+    | Secure password hashing              |
| **Pillow**     | 10.2+   | Image compression and processing     |
| **Cloudinary** | 1.39+   | CDN cloud image storage              |
| **Docker**     | —       | Containerization                     |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── ai/                           # 🧠 Core AI Engine Modules
│   │   ├── detection/
│   │   │   ├── detector.py           # Hybrid YOLOv8 + OpenRouter Qwen3-VL / Grounding DINO
│   │   │   └── __init__.py           # DetectionModelInterface
│   │   ├── segmentation/
│   │   │   ├── segmenter.py          # OpenCV Douglas-Peucker & SAM boundary extraction
│   │   │   └── __init__.py
│   │   ├── space_mapping/
│   │   │   ├── mapper.py             # Occupancy grid with anisotropic obstacle inflation
│   │   │   └── __init__.py           # SpaceMapperInterface
│   │   ├── spatial/
│   │   │   └── spatial_relationship_graph.py # NetworkX Spatial Relationship Graph (SRG)
│   │   ├── optimization/
│   │   │   ├── solver.py             # NSGA-II Genetic Algorithm layout constraint solver
│   │   │   └── __init__.py
│   │   ├── placement/
│   │   │   ├── placer.py             # Focal point placement heuristics
│   │   │   └── __init__.py
│   │   ├── scoring/
│   │   │   ├── scorer.py             # Explainable scoring engine (5 spatial metrics)
│   │   │   └── __init__.py           # ScoringModelInterface
│   │   ├── retrieval/
│   │   │   ├── retriever.py          # Style inspiration retrieval matcher
│   │   │   └── __init__.py           # ConceptRetrievalInterface
│   │   └── generation/
│   │       ├── generator.py          # Google Gemini 2.0 Flash & Imagen 3 render pipeline
│   │       └── __init__.py           # ImageGenerationInterface
│   │
│   ├── api/                          # 🌐 REST API Layer
│   │   ├── dependencies/
│   │   │   ├── auth.py               # JWT authentication dependency
│   │   │   └── rate_limiter.py       # Redis sliding-window rate limiter
│   │   ├── routes/
│   │   │   ├── auth.py               # Signup, login, refresh, /me
│   │   │   ├── upload.py             # Room image upload
│   │   │   ├── analyze.py            # Spatial analysis endpoints
│   │   │   ├── optimize.py           # Layout optimization jobs
│   │   │   ├── redesign.py           # Blueprint-conditioned generative redesign
│   │   │   ├── scoring.py            # Score recalculation
│   │   │   ├── compare.py            # Room metric comparison
│   │   │   └── retrieval.py          # Style inspiration retrieval
│   │   └── router.py                 # Central API router mount
│   │
│   ├── core/                         # 🔐 Core System Configuration
│   │   ├── config.py                 # Pydantic Settings (all env vars)
│   │   ├── security.py               # JWT signing, bcrypt hashing
│   │   ├── logging.py                # Structured log format + CorrelationIdFilter
│   │   ├── middleware.py             # RequestTracingMiddleware (correlation ID + latency)
│   │   └── exceptions.py             # AuraException hierarchy + JSON handlers
│   │
│   ├── database/                     # 🗄️ Database Management
│   │   ├── session.py                # SQLAlchemy SessionLocal + get_db dependency
│   │   ├── base.py                   # Declarative base class
│   │   └── seed.py                   # CLI database seeding script
│   │
│   ├── models/                       # 📊 SQLAlchemy ORM Models
│   │   ├── user.py                   # User accounts (email, tier, hashed_password)
│   │   ├── room.py                   # Room records (image_url, dimensions, style)
│   │   ├── furniture.py              # Detected furniture bounding boxes
│   │   ├── analysis.py               # Spatial analysis results + scores property
│   │   ├── optimization.py           # GA optimization results + suggestions
│   │   └── redesign.py               # Generative redesign tracking + renders
│   │
│   ├── schemas/                      # ✅ Pydantic Validation Schemas
│   │   ├── user_schema.py            # UserCreate, UserResponse, TokenResponse, TokenRefreshRequest
│   │   ├── room_schema.py            # RoomCreate, RoomResponse
│   │   ├── analysis_schema.py        # AnalysisResponse, AnalysisScore
│   │   ├── optimization_schema.py    # OptimizationRequest, OptimizationResponse
│   │   └── redesign_schema.py        # RedesignRequest, RedesignResponse
│   │
│   ├── services/                     # 🔧 Business Logic Services
│   │   ├── upload_service.py         # Image validation, compression, storage routing
│   │   ├── room_service.py           # Room creation and query operations
│   │   ├── detection_service.py      # Object detection pipeline orchestration
│   │   ├── optimization_service.py   # Optimization DB creation + task dispatch
│   │   ├── placement_service.py      # Placement constraint checking
│   │   ├── redesign_service.py       # Redesign request creation + task dispatch
│   │   ├── scoring_service.py        # Score recalculation coordinator
│   │   ├── retrieval_service.py      # Inspiration catalog query coordinator
│   │   └── generation_service.py     # Generative image pipeline coordinator
│   │
│   ├── storage/                      # ☁️ Storage Clients
│   │   ├── local_storage.py          # Local filesystem upload client (dev)
│   │   └── cloudinary.py             # Cloudinary CDN upload client (prod)
│   │
│   ├── tasks/                        # ⚙️ Celery Background Tasks
│   │   ├── analysis_tasks.py         # Spatial analysis pipeline (default queue)
│   │   ├── optimization_tasks.py     # Genetic Algorithm solver (default queue)
│   │   └── redesign_tasks.py         # Generative rendering (heavy_ai queue)
│   │
│   ├── tests/                        # 🧪 Pytest Test Suite
│   │   ├── conftest.py               # DB fixtures, client, Celery mocks
│   │   ├── test_ai_engines.py        # IoU, GA solver, scoring engine tests
│   │   ├── test_auth_api.py          # Auth signup/login/refresh API tests
│   │   ├── test_room_api.py          # Room upload/scan/analysis API tests
│   │   ├── test_caching.py           # Redis cache decorator tests
│   │   ├── test_detector.py          # Detection pipeline tests
│   │   ├── test_geometry.py          # Coordinate & polygon geometry tests
│   │   └── test_hybrid_detector.py   # Hybrid YOLO + VLM reconciliation tests
│   │
│   ├── utils/                        # 🛠️ Utilities
│   │   ├── geometry_utils.py         # IoU bounding box intersection calculator
│   │   ├── image_utils.py            # Pillow compression + MIME type validation
│   │   └── cache.py                  # @cache_response Redis caching decorator
│   │
│   └── main.py                       # FastAPI application entry point
│
├── Dockerfile                        # Dev Docker image
├── Dockerfile.prod                   # Production hardened multi-stage image
├── docker-compose.yml                # Local dev compose (web + db + redis + worker)
├── docker-compose.prod.yml           # Production compose (GPU-ready heavy worker)
├── render.yaml                       # Render.com Blueprints deployment spec
├── requirements.txt                  # Python dependencies
├── .env                              # Environment variables (local)
└── README.md                         # This file
```

---

## 🧠 AI Engine Architecture

The AI pipeline is fully deterministic and explainable. Generative AI is strictly guided by the computed 2D layout constraints at the final rendering stage.

### Detection → `app/ai/detection/detector.py`

- **Hybrid Detection Pipeline**:
  - `YOLOv8Detector`: Closed-vocabulary convolutional model for rapid detection of standard furniture categories and door/window boundaries.
  - **Open-Vocabulary VLM Grounding**: Employs Qwen3-VL 30B via OpenRouter (`qwen/qwen3-vl-30b-a3b-instruct`) or Grounding DINO with room-type prompt conditioning for niche furniture and architectural fixtures.
  - **Subclass-Aware Containment Suppression**: Automatically suppresses nested micro-hallucinations (e.g. cushions inside sofas, decor on tables) through containment ratio and IoU threshold filtering.
  - **Semantic Vocabulary Reconciliation**: Normalizes disparate class names into canonical Home Decor taxonomy.

### Segmentation & Boundary Extraction → `app/ai/segmentation/segmenter.py`

- `RoomSegmenter`: Combines real-time OpenCV morphological boundary extraction with Douglas-Peucker polygon approximation (sub-30ms, $O(W \times H)$) for room perimeters, with SAM fallback for complex wall/floor masking.

### Space Mapping & Grid Generation → `app/ai/space_mapping/mapper.py`

- `OccupancyGridGenerator`: Converts bounding boxes and walls into a 10×10 occupancy matrix (`occupied`, `buffer`, `empty`).
- **Anisotropic Obstacle Inflation**: Selectively suppresses clearance padding along outer wall perimeters, eliminating "corridor pinching" while preserving interior walking pathways.

### Spatial Relationship Graph (SRG) → `app/ai/spatial/spatial_relationship_graph.py`

- Builds a NetworkX graph linking furniture objects and room envelope boundaries. Evaluates conversational clusters, line-of-sight focal alignments, and natural light vectors.

### Optimization → `app/ai/optimization/solver.py`

- `LayoutConstraintSolver`: An elitist **NSGA-II Multi-Objective Genetic Algorithm**:
  - **Graph-Preserving Crossover**: Inherits functionally coupled furniture ensembles (e.g., dining table + chairs) as unified rigid geometric blocks.
  - **5 Targeted Domain Mutations**: `group_slide`, `focal_align`, `wall_snap`, `conversational_balance`, and `avoid_doorway`.
  - **Fitness Function**: Hard constraints (zero physical collision, boundary containment, doorway clearance) and soft objectives (symmetry, flow, lighting exposure).
  - **State Hashing & Memoization**: Caches layout evaluations to accelerate convergence across 60 generations.

### Scoring → `app/ai/scoring/scorer.py`

- `ExplainableScoringEngine`: Computes deterministic `0–100` scores with natural-language rationales:
  - **Clutter**: Furniture footprint density vs. room floor area
  - **Symmetry**: Visual mass distribution across room centerlines
  - **Accessibility**: Pathway clearance checking via collision geometry
  - **Flow**: Circulation network graph conductivity
  - **Lighting**: Daylight portal orientation and obstruction vectors

### Generation → `app/ai/generation/generator.py`

- `RedesignImageGenerator`: Multimodal generative redesign powered by **Google Gemini 2.0 Flash and Google Imagen 3 (`imagen-3.0-generate-002`)**:
  - Translates selected 2D architectural blueprint layouts and structural envelope anchors (doors, windows, walls) into spatial conditioning prompts.
  - Renders photorealistic 8K concept images adhering to chosen design presets (`Japandi Harmony`, `Industrial Loft`, `Scandinavian Crisp`, `Modern Biophilic`, `Mid-Century Chic`, `Parisian Luxury`).
  - Includes curated high-resolution visual fallbacks and design recommendations.

---

## 🌐 API Reference

All routes are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <access_token>`.

### Authentication

| Method | Endpoint            | Auth | Description                             |
| ------ | ------------------- | ---- | --------------------------------------- |
| `POST` | `/api/auth/signup`  | ❌   | Register new user                       |
| `POST` | `/api/auth/login`   | ❌   | Login (returns access + refresh tokens) |
| `POST` | `/api/auth/refresh` | ❌   | Rotate refresh token for a new pair     |
| `GET`  | `/api/auth/me`      | ✅   | Get current authenticated user          |

### Upload

| Method | Endpoint      | Auth | Description                                |
| ------ | ------------- | ---- | ------------------------------------------ |
| `POST` | `/api/upload` | ✅   | Upload room image (max 5MB, JPEG/PNG/WebP) |

### Analysis

| Method | Endpoint                        | Auth | Description                             |
| ------ | ------------------------------- | ---- | --------------------------------------- |
| `POST` | `/api/analyze/room`             | ✅   | Create room scan, queue Celery analysis |
| `GET`  | `/api/analyze/rooms`            | ✅   | List all user room scans                |
| `GET`  | `/api/analyze/room/{id}`        | ✅   | Get single room details                 |
| `GET`  | `/api/analyze/room/{id}/result` | ✅   | Get analysis results (202 if pending)   |

### Optimization

| Method | Endpoint                 | Auth | Description                        |
| ------ | ------------------------ | ---- | ---------------------------------- |
| `POST` | `/api/optimize`          | ✅   | Trigger GA layout optimization job |
| `GET`  | `/api/optimize/{job_id}` | ✅   | Poll job status and results        |

### Redesign

| Method | Endpoint                       | Auth | Description                          |
| ------ | ------------------------------ | ---- | ------------------------------------ |
| `POST` | `/api/redesign`                | ✅   | Trigger generative redesign pipeline (supports style, prompt, `blueprint_id`, `blueprint_layout`) |
| `GET`  | `/api/redesign/{job_id}`       | ✅   | Poll redesign status and render URLs |
| `GET`  | `/api/redesign/room/{room_id}` | ✅   | List all redesigns for a room        |

### Scoring & Utilities

| Method | Endpoint                      | Auth | Description                            |
| ------ | ----------------------------- | ---- | -------------------------------------- |
| `POST` | `/api/scoring/recalculate`    | ✅   | Recalculate scores for a custom layout |
| `GET`  | `/api/retrieval/inspirations` | ✅   | Fetch matched inspiration catalog URLs |
| `GET`  | `/api/compare`                | ✅   | Compare score deltas between two rooms |

---

## 🛠️ Local Setup (Without Docker)

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run the API Server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 5. Run Celery Workers (separate terminals)

```bash
# CPU worker — analysis, boundary extraction, and GA optimization tasks
celery -A app.tasks.analysis_tasks.celery_app worker -Q default --loglevel=info

# Heavy AI worker — generative redesign rendering tasks
celery -A app.tasks.analysis_tasks.celery_app worker -Q heavy_ai --loglevel=info --concurrency=1
```

---

## 🐳 Docker Setup (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Services started:
# - FastAPI web server:      http://localhost:8000
# - Swagger documentation:   http://localhost:8000/docs
# - PostgreSQL database:     localhost:5432
# - Redis broker:            localhost:6379
# - Celery default worker:   background
```

To run the backend services easily on Windows using PowerShell, make sure **Docker Desktop** is running, then run these commands inside the `backend` folder:

### 1. Start Services in the Background (Detached Mode)

```powershell
docker compose up -d
```

_Starts the FastAPI server, PostgreSQL db, Redis broker, and Celery worker. Once started, this releases your terminal so you can close it or use it for other commands._

### 2. View Live Logs (Highly Recommended for Debugging)

```powershell
docker compose logs -f
```

_Stream logs from all 4 services to monitor incoming requests and Celery background task processing._

### 3. Stop All Services (Frees up RAM & CPU)

```powershell
docker compose down
```

_Gracefully stops all backend processes and frees up system memory. Your database records will be kept safe._

### 4. Rebuild Services (When dependencies change)

If you update `requirements.txt` or modify the `Dockerfile`, force a rebuild when starting:

```powershell
docker compose up -d --build
```

### 5. Hard Reset Database (Fresh Start)

To erase your PostgreSQL database volume and recreate a clean database:

```powershell
docker compose down -v
```

---

## 🧪 Testing

```bash
# Run full Pytest suite
python -m pytest app/tests/ -v

# Run AI engine unit tests
python -m pytest app/tests/test_ai_engines.py -v

# Run hybrid detection & geometry validation
python -m pytest app/tests/test_hybrid_detector.py app/tests/test_geometry.py -v

# Run syntax compilation check across all modules
python -m compileall -f app
```

**Test Suites:**
| File | Coverage |
|------|----------|
| `test_ai_engines.py` | IoU overlap geometry, GA solver convergence, scoring metrics |
| `test_auth_api.py` | Signup, login, refresh token rotation, invalid token rejection |
| `test_room_api.py` | Image upload validation, room scan creation, inspiration retrieval |
| `test_caching.py` | Redis cache bypass in test environments |
| `test_detector.py` | Standalone object detection pipeline |
| `test_hybrid_detector.py` | Hybrid YOLOv8 + VLM containment ratio suppression and label normalization |
| `test_geometry.py` | Coordinate math, bounding box polygons, and IoU intersection |

---

## 🚢 Production Deployment

### Hardened Docker Image

```bash
docker build -t aura-backend -f Dockerfile.prod .
```

- Multi-stage build (builder + runner)
- Runs as non-root `appuser` (UID 10000)
- Minimal runtime image (python:3.12-slim)

### Production Compose

```bash
docker-compose -f docker-compose.prod.yml up --build
```

| Service          | Queue      | Concurrency | GPU               |
| ---------------- | ---------- | ----------- | ----------------- |
| `web`            | —          | —           | No                |
| `default_worker` | `default`  | 4           | No                |
| `heavy_worker`   | `heavy_ai` | 1           | Optional (NVIDIA) |

### Render.com Blueprint

1. Push `render.yaml` to your GitHub repo
2. Go to **Render → New Blueprint → Connect repo**
3. All services (API, worker, Redis, PostgreSQL) auto-provision

---

## 🔐 Environment Variables

```env
# Application
ENV=development                    # development | production | testing
SECRET_KEY=your-secret-key

# JWT Tokens
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_HOURS=12

# PostgreSQL
POSTGRES_USER=homedecor_user
POSTGRES_PASSWORD=homedecor_password
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_DB=homedecor_db

# Redis & Celery
REDIS_URL=redis://redis:6379/0
CELERY_ALWAYS_EAGER=false

# OpenRouter / VLM Object Detection
OPENROUTER_API_KEY=your_openrouter_api_key
DINO_API_MODEL=qwen/qwen3-vl-30b-a3b-instruct

# Google Gemini & Imagen API (Generative Redesign)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
IMAGEN_MODEL=imagen-3.0-generate-002

# Cloudinary (production storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚡ Production Features

| Feature                  | Implementation                                                             |
| ------------------------ | -------------------------------------------------------------------------- |
| **JWT Refresh Rotation** | Access (30m) + Refresh (7d) tokens, `/auth/refresh` rotation endpoint      |
| **Rate Limiting**        | Redis sliding-window limiter (10 req/min on POST endpoints)                |
| **Request Tracing**      | `X-Correlation-ID` headers injected into every request and log entry       |
| **Latency Logging**      | Per-request latency logged via `RequestTracingMiddleware`                  |
| **Redis Caching**        | `@cache_response` decorator with TTL support for inspiration catalog       |
| **Image Compression**    | Pillow progressive JPEG, Lanczos downsampling, iterative quality reduction |
| **File Size Limits**     | 5MB upload hard limit enforced before storage writes                       |
| **Celery Queue Routing** | `default` queue (CPU tasks) vs `heavy_ai` queue (GPU renders)              |
| **Bcrypt Hashing**       | Direct bcrypt (Python 3.13 compatible, no passlib wrapper)                 |
| **Error Handling**       | Custom `AuraException` hierarchy with structured JSON responses            |
