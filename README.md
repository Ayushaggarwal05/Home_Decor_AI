# 🏠 Aura AI — Interior Design & Space Optimization SaaS

> **AI-powered spatial intelligence platform** that analyzes room layouts, generates optimization scores, and produces AI-designed room concepts using computer vision and generative AI.

---

## ✨ What is Aura AI?

Aura AI is a full-stack, research-grade SaaS platform with **two core operational modes**:

| Mode                       | Description                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔬 **Research Lab**        | Upload a room image → receive occupancy maps, symmetry analysis, space utilization scores, clutter indices, placement reasoning, and accessibility metrics. |
| 🎨 **Smart Design Studio** | Upload a room image + a style prompt → receive AI-generated redesign renders, before/after comparisons, and curated decor inspirations.                     |

The platform's intellectual property is its **deterministic, explainable spatial intelligence engine** — powered by a custom Genetic Algorithm optimizer, YOLOv8 object detection, and an explainable scoring architecture. Generative AI (Stable Diffusion) is only used for the final image render step.

---

## 🏗️ Monorepo Structure

```
HomeDecor/
├── backend/                  # FastAPI + Python AI backend
│   ├── app/
│   │   ├── ai/               # Core AI engines (detection, optimization, scoring)
│   │   ├── api/              # REST API routes and dependencies
│   │   ├── core/             # Security, config, logging, middleware
│   │   ├── database/         # SQLAlchemy session management
│   │   ├── models/           # ORM database models
│   │   ├── schemas/          # Pydantic request/response validators
│   │   ├── services/         # Business logic orchestration layer
│   │   ├── storage/          # Local and Cloudinary upload clients
│   │   ├── tasks/            # Celery background task workers
│   │   ├── tests/            # Pytest test suites
│   │   └── utils/            # Geometry, image, and caching utilities
│   ├── Dockerfile            # Development Docker image
│   ├── Dockerfile.prod       # Production hardened Docker image
│   ├── docker-compose.yml    # Local dev orchestration
│   ├── docker-compose.prod.yml # Production orchestration (GPU-ready)
│   ├── render.yaml           # Render.com Blueprints deployment spec
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # Next.js 15 App Router frontend
    ├── app/                  # Pages (App Router)
    │   ├── (marketing)/      # Landing, pricing, about, features
    │   ├── dashboard/        # User dashboard
    │   ├── upload/           # Room image upload flow
    │   ├── research/         # Spatial analysis results
    │   ├── redesign/         # AI redesign studio
    │   ├── compare/          # Side-by-side room comparison
    │   └── settings/         # User preferences
    ├── components/           # Reusable React components
    ├── services/             # Axios API service layer
    ├── store/                # Zustand global state
    ├── types/                # TypeScript type definitions
    ├── providers/            # React context providers
    └── lib/                  # Utility functions
```

---

## 🧠 AI Engine Architecture

The core AI pipeline (located in `backend/app/ai/`) is structured as a series of modular, composable engines:

```
Image Upload
    │
    ▼
YOLOv8 Detection          → Detects furniture, doors, windows + bounding boxes
    │
    ▼
SAM Segmentation           → Wall contours, floor boundaries, free-space masks
    │
    ▼
Occupancy Grid Generator   → 2D coordinate matrix (occupied / buffer / walkable cells)
    │
    ▼
Genetic Algorithm Solver   → Optimizes furniture placement (IoU constraints, symmetry, clearance)
    │
    ▼
Explainable Scoring Engine → Clutter, Flow, Symmetry, Accessibility, Lighting (0-100 scores)
    │
    ▼
CLIP Retrieval Matcher     → Matches style prompts to curated inspiration catalog
    │
    ▼
Stable Diffusion Generator → AI render of optimized/restyled room (final output)
```

---

## 🛠️ Tech Stack

### Backend

| Technology         | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **FastAPI**        | High-performance async REST API framework       |
| **Python 3.12+**   | Core runtime                                    |
| **PostgreSQL**     | Relational database (rooms, users, analyses)    |
| **SQLAlchemy 2.x** | ORM with typed declarative models               |
| **Alembic**        | Database schema migration management            |
| **Celery + Redis** | Distributed background task queues              |
| **Pydantic v2**    | Request/response validation                     |
| **PyJWT**          | JWT access + refresh token signing              |
| **bcrypt**         | Secure password hashing                         |
| **Pillow**         | Image compression and progressive JPEG encoding |
| **Cloudinary**     | CDN image storage (production)                  |
| **Docker**         | Containerized development and deployment        |

### Frontend

| Technology            | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| **Next.js 15**        | App Router, server components, file-based routing |
| **TypeScript**        | Full type safety                                  |
| **Tailwind CSS v4**   | Utility-first styling                             |
| **Zustand**           | Lightweight global state management               |
| **TanStack Query v5** | Server state, caching, background refetching      |
| **Framer Motion**     | Animations and page transitions                   |
| **Axios**             | HTTP API client                                   |
| **Lucide React**      | Icon library                                      |
| **Recharts**          | Radar and metric charts                           |

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** installed and running
- **Node.js 20+** (for frontend local development)
- **Python 3.12+** (for backend local development)

### Option A: Full Stack via Docker (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd HomeDecor

# 2. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# 3. Start the full backend stack (API + DB + Redis + Worker)
cd backend
docker-compose up --build

# 4. In a separate terminal, start the frontend
cd ../frontend
npm install
npm run dev
```

**Services running:**
| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚡ Backend API | http://localhost:8000 |
| 📖 Swagger Docs | http://localhost:8000/docs |
| 🔁 ReDoc Docs | http://localhost:8000/redoc |

### Option B: Manual Local Development

See detailed setup instructions in:

- [`backend/README.md`](./backend/README.md) — Backend setup, environment variables, Celery workers
- [`frontend/README.md`](./frontend/README.md) — Frontend setup, environment variables, scripts

---

## 🌐 API Endpoints Overview

| Method | Endpoint                        | Description                                   |
| ------ | ------------------------------- | --------------------------------------------- |
| `POST` | `/api/auth/signup`              | Register new user account                     |
| `POST` | `/api/auth/login`               | Login, receive access + refresh tokens        |
| `POST` | `/api/auth/refresh`             | Rotate refresh token                          |
| `GET`  | `/api/auth/me`                  | Get authenticated user profile                |
| `POST` | `/api/upload`                   | Upload room image (max 5MB)                   |
| `POST` | `/api/analyze/room`             | Register room scan, trigger analysis          |
| `GET`  | `/api/analyze/rooms`            | List user's scanned rooms                     |
| `GET`  | `/api/analyze/room/{id}/result` | Fetch spatial analysis results                |
| `POST` | `/api/optimize`                 | Trigger Genetic Algorithm layout optimization |
| `GET`  | `/api/optimize/{job_id}`        | Poll optimization job status                  |
| `POST` | `/api/redesign`                 | Trigger AI generative redesign                |
| `GET`  | `/api/redesign/{job_id}`        | Poll redesign job and fetch renders           |
| `POST` | `/api/scoring/recalculate`      | Recalculate scores for a custom layout        |
| `GET`  | `/api/retrieval/inspirations`   | Fetch matched style inspiration catalog       |
| `GET`  | `/api/compare`                  | Compare spatial metrics between two rooms     |

---

## 🧪 Testing

```bash
# Run full backend test suite
cd backend
python -m pytest app/tests/ -v

# Run original AI engine unit tests only
python -m unittest app/tests/test_ai_engines.py
```

**Test coverage:**

- IoU bounding box intersection calculations
- Genetic Algorithm layout convergence and fitness
- Explainable scoring engine (clutter / symmetry / accessibility)
- Auth API flow (signup, login, refresh token rotation)
- Room scan and analysis API pipeline
- Redis cache bypass logic

---

## 🚢 Deployment

### Render.com (One-click Blueprint)

```bash
# From the backend directory
# Push render.yaml to your connected GitHub repo
# Go to Render → New Blueprint → Connect repo
```

### Production Docker Compose

```bash
cd backend
docker-compose -f docker-compose.prod.yml up --build
```

**Production containers:**
| Container | Role |
|-----------|------|
| `web` | FastAPI API server (non-root user) |
| `default_worker` | Celery worker for analysis & optimization (CPU) |
| `heavy_worker` | Celery worker for Stable Diffusion renders (GPU-ready) |
| `db` | PostgreSQL 15 with persistent volumes |
| `redis` | Redis 7 with AOF persistence |

---

## 📁 Environment Variables

### Backend (`.env`)

```env
ENV=development
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

POSTGRES_USER=homedecor_user
POSTGRES_PASSWORD=homedecor_password
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_DB=homedecor_db

REDIS_URL=redis://redis:6379/0

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📄 License

This project is proprietary software. All rights reserved.
