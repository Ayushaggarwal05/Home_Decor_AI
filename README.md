# 🏠 Matter AI — Interior Design & Space Optimization SaaS

> **AI-powered spatial intelligence platform** that analyzes room layouts, generates optimization scores, produces 2D architectural floorplan blueprints, and generates AI-designed room concepts using computer vision and generative multimodal AI.

---

## ✨ What is Matter AI?

Matter AI is a full-stack, research-grade SaaS platform with **two core operational modes** plus architectural blueprinting and export capabilities:

| Mode | Description |
| --- | --- |
| 🔬 **Research Lab** | Upload a room image → receive occupancy maps, spatial relationship graphs, visual mass symmetry analysis, space utilization scores, clutter indices, placement reasoning, and accessibility metrics. |
| 🎨 **Smart Design Studio** | Upload a room image + choose candidate 2D floorplan blueprints + a style prompt → receive AI-generated redesign renders via Google Gemini & Imagen 3, before/after comparisons, and curated decor inspirations. |
| 📐 **Interactive 2D Floorplan Blueprints** | View architectural CAD-style SVG layout blueprints, inspect furniture dimensions, clear zones, and doorway/window envelope anchors. |
| 📄 **Audit Reports & Spatial Datasets** | One-click export to high-resolution Printable PDF Audit Reports, raw GeoJSON/Spatial datasets, and clipboard summary briefings. |

The platform's core intellectual property is its **deterministic, explainable spatial intelligence engine** — powered by an elitist NSGA-II Genetic Algorithm optimizer, a Hybrid YOLOv8 + Zero-Shot VLM (Qwen3-VL via OpenRouter / Grounding DINO) perception pipeline with subclass containment suppression, OpenCV morphological boundary mapping, and an explainable scoring architecture. Generative AI (Google Gemini 2.0 Flash / Imagen 3) is strictly guided by the computed 2D architectural blueprint layout.

---

## 🏗️ Monorepo Structure

```
HomeDecor/
├── backend/                  # FastAPI + Python AI backend
│   ├── app/
│   │   ├── ai/               # Core AI engines (detection, optimization, scoring, spatial graph)
│   │   ├── api/              # REST API routes and dependencies
│   │   ├── core/             # Security, config, logging, middleware
│   │   ├── database/         # SQLAlchemy session management & seeds
│   │   ├── models/           # ORM database models (users, rooms, furniture, analysis, redesign)
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
└── frontend/                 # Next.js 16 (App Router) + React 19 frontend
    ├── app/                  # App Router pages
    │   ├── (marketing)/      # Landing, about, features, pricing
    │   ├── (auth)/           # Login, signup, forgot-password, reset-password
    │   ├── studio/           # Creative Asymmetric Studio workspace & active spaces grid
    │   ├── upload/           # Room scan upload flow with room scale & space type presets
    │   ├── research/         # Spatial intelligence analysis lab & relationship graphs
    │   ├── redesign/         # Generative AI studio with 2D blueprint selection & slider
    │   ├── compare/          # Side-by-side room scan metric delta comparison
    │   └── settings/         # User preferences and unit system
    ├── components/           # Reusable React components
    │   ├── blueprint/        # SVG 2D floorplan blueprints, modal viewer, and selector
    │   ├── export/           # PDF printable audit report template and export modal
    │   ├── visualization/    # Occupancy grid, heatmaps, detection overlay, graph, symmetry
    │   ├── scoring/          # Score gauges, clutter meters, optimization breakdowns
    │   ├── upload/           # Dropzones, camera guidance, scale/type presets
    │   ├── comparison/       # Before/after interactive slider and comparison grid
    │   ├── marketing/        # Dual mode hero, workflow steps, pricing, metrics showcase
    │   ├── layout/           # Full-width navbars, sidebar, floating dock, studio footer
    │   ├── dashboard/        # Analytics summaries and recent scans feeds
    │   ├── auth/             # Modals, password strength indicator, social buttons
    │   ├── animations/       # Framer Motion transitions
    │   └── ui/               # Buttons, modals, tabs, toasts
    ├── services/             # Axios API service layer
    ├── store/                # Zustand global state (roomStore)
    ├── types/                # TypeScript type definitions
    ├── providers/            # React Query & context providers
    └── lib/                  # Utility functions
```

---

## 🧠 AI Engine Architecture

The core AI pipeline (located in `backend/app/ai/`) operates as a modular, deterministic pipeline feeding an aesthetic generative stage:

```
Room Image Upload
      │
      ▼
Hybrid Perception Pipeline
├── YOLOv8 Detection                  → High-confidence furniture & door detection
├── OpenRouter Qwen3-VL / DINO        → Zero-shot open-vocabulary detection & architectural fixtures
└── Subclass Containment Suppression   → Eliminates micro-hallucinations & reconciles nested labels
      │
      ▼
OpenCV Douglas-Peucker Boundary       → Real-time sub-30ms floorplan polygon perimeter extraction
      │
      ▼
Multi-Tier Occupancy Grid Map         → Anisotropic obstacle inflation (perimeter-wall exemptions)
      │
      ▼
Spatial Relationship Graph (SRG)      → NetworkX graph of functional clusters & visual line-of-sight
      │
      ▼
NSGA-II Multi-Objective Solver        → Graph-preserving connected component crossover & 5 mutations
      │
      ▼
Explainable Scoring Engine            → Clutter, Flow, Symmetry, Accessibility, Lighting (0-100)
      │
      ▼
2D Floorplan Blueprint Synthesis      → Candidate CAD-style floorplan blueprints with coordinate anchors
      │
      ▼
Google Gemini / Imagen 3 Generative   → Blueprint-constrained photorealistic room render
(with Curated Style Fallback)
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
| --- | --- |
| **FastAPI** | High-performance async REST API framework |
| **Python 3.12+** | Core runtime |
| **PostgreSQL 15** | Relational database (rooms, users, analyses, optimizations, redesigns) |
| **SQLAlchemy 2.x** | Declarative ORM with typed models |
| **Alembic** | Database schema migration management |
| **Celery + Redis** | Distributed background task queues and sliding-window rate limiting |
| **Ultralytics YOLOv8** | Fast convolutional furniture and architectural boundary detection |
| **OpenRouter / Qwen3-VL** | Zero-shot vision-language model for open-vocabulary detection |
| **Google Gemini & Imagen 3** | Multimodal prompt synthesis and photorealistic room redesign generation |
| **NetworkX & SciPy** | Spatial Relationship Graph (SRG) construction and geometric calculations |
| **OpenCV & Pillow** | Morphological boundary extraction, compression, and progressive encoding |
| **Cloudinary** | CDN image storage (production) |
| **Docker** | Containerized development and production deployment |

### Frontend

| Technology | Purpose |
| --- | --- |
| **Next.js 16 (App Router)** | React Server Components, client layouts, file-based routing |
| **React 19** | Concurrent UI rendering |
| **TypeScript 5.x** | Static type safety across state, components, and API client |
| **Tailwind CSS v4** | Modern CSS variable design system and utility-first styling |
| **Zustand 5** | Lightweight global client state management (`roomStore.ts`) |
| **TanStack Query v5** | Server state synchronization, query caching, background polling |
| **Framer Motion 12** | Smooth layout animations, page transitions, and interactive slider |
| **Recharts 3** | Radar metric charts, space usage analytics |
| **Axios** | HTTP API client with auth token interceptors |
| **Lucide React** | Modern vector icon system |

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

# 3. Start the full backend stack (API + DB + Redis + Celery Workers)
cd backend
docker-compose up --build

# 4. In a separate terminal, start the frontend
cd ../frontend
npm install
npm run dev
```

**Services running:**
| Service | URL |
| --- | --- |
| 🌐 Frontend Client | http://localhost:3000 |
| ⚡ Backend REST API | http://localhost:8000 |
| 📖 Interactive OpenAPI Docs | http://localhost:8000/docs |
| 🔁 ReDoc Documentation | http://localhost:8000/redoc |

### Option B: Manual Local Development

See detailed setup instructions in:
- [`backend/README.md`](./backend/README.md) — Backend setup, environment variables, Celery workers
- [`frontend/README.md`](./frontend/README.md) — Frontend setup, components, and client architecture

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Register new user account |
| `POST` | `/api/auth/login` | Login, receive access + refresh tokens |
| `POST` | `/api/auth/refresh` | Rotate refresh token |
| `GET` | `/api/auth/me` | Get authenticated user profile |
| `POST` | `/api/upload` | Upload room image (max 5MB, format conversion) |
| `POST` | `/api/analyze/room` | Register room scan and trigger spatial analysis |
| `GET` | `/api/analyze/rooms` | List authenticated user's scanned rooms |
| `GET` | `/api/analyze/room/{id}/result` | Fetch spatial analysis results (scores, occupancy, boxes) |
| `POST` | `/api/optimize` | Trigger NSGA-II layout optimization |
| `GET` | `/api/optimize/{job_id}` | Poll optimization status and retrieve candidate layouts |
| `POST` | `/api/redesign` | Trigger AI redesign using style preset & blueprint layout |
| `GET` | `/api/redesign/{job_id}` | Poll redesign job and fetch rendered images |
| `POST` | `/api/scoring/recalculate` | Recalculate spatial scores for a custom coordinate layout |
| `GET` | `/api/retrieval/inspirations` | Fetch matched style inspiration catalog |
| `GET` | `/api/compare` | Compare spatial metrics between two room scans |

---

## 🧪 Testing

```bash
# Run full backend test suite
cd backend
python -m pytest app/tests/ -v

# Run AI engine unit tests only
python -m pytest app/tests/test_ai_engines.py -v

# Run detector & geometry tests
python -m pytest app/tests/test_hybrid_detector.py app/tests/test_geometry.py -v
```

**Test coverage:**
- Hybrid YOLOv8 + Zero-Shot VLM detection reconciliation & containment suppression
- IoU bounding box intersections and polygon geometry utilities
- NSGA-II Genetic Algorithm convergence, obstacle collision avoidance, and fitness scoring
- Explainable scoring engine (clutter, flow, symmetry, accessibility, lighting)
- Auth API flow (signup, login, refresh token rotation)
- Room scan and analysis pipeline
- Redis cache bypass and invalidation logic

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
| --- | --- |
| `web` | FastAPI API server (hardened, non-root user) |
| `default_worker` | Celery worker for room analysis, boundary extraction, and GA optimization (CPU) |
| `heavy_worker` | Celery worker for generative redesign rendering |
| `db` | PostgreSQL 15 with persistent volumes |
| `redis` | Redis 7 with AOF persistence |

---

## 📁 Environment Variables

### Backend (`.env`)

```env
ENV=development
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_HOURS=12

POSTGRES_USER=homedecor_user
POSTGRES_PASSWORD=homedecor_password
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_DB=homedecor_db

REDIS_URL=redis://redis:6379/0
CELERY_ALWAYS_EAGER=false

# OpenRouter / Vision-Language Model
OPENROUTER_API_KEY=your_openrouter_api_key
DINO_API_MODEL=qwen/qwen3-vl-30b-a3b-instruct

# Google Gemini & Imagen API (Generative Redesign)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
IMAGEN_MODEL=imagen-3.0-generate-002

# Cloudinary CDN Storage
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
