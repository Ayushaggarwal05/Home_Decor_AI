# 🎨 Aura AI — Frontend

> **Next.js 15 App Router frontend** for the Aura AI Interior Design & Space Optimization SaaS. Delivers a premium, animation-rich interface for room upload, AI analysis visualization, layout optimization, and generative redesign.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Component Library](#-component-library)
- [State Management](#-state-management)
- [API Services](#-api-services)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)

---

## ⚡ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.x (App Router) | File-based routing, server components, layouts |
| **React** | 19.x | UI rendering |
| **TypeScript** | 5.x | Full type safety across all components and services |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Zustand** | 5.x | Lightweight global client state management |
| **TanStack Query** | v5 | Server state, caching, background refetching |
| **Framer Motion** | 12.x | Page transitions and micro-animations |
| **Axios** | 1.18+ | HTTP API client with interceptors |
| **Lucide React** | 1.21+ | Icon library |
| **Recharts** | 3.x | Radar charts, metric visualizations |

---

## 📁 Project Structure

```
frontend/
├── app/                              # 📱 Next.js App Router pages
│   ├── (marketing)/                  # Route group — public marketing pages
│   │   ├── page.tsx                  # 🏠 Landing page
│   │   ├── about/                    # About page
│   │   ├── features/                 # Features showcase
│   │   └── pricing/                  # Pricing tiers
│   ├── dashboard/                    # 📊 User dashboard
│   │   └── page.tsx                  # Room scan history + analytics summary
│   ├── upload/                       # 📤 Room upload flow
│   │   └── page.tsx                  # Drag-and-drop upload + metadata form
│   ├── research/                     # 🔬 Spatial analysis results
│   │   └── page.tsx                  # Scores, occupancy grid, heatmaps, overlays
│   ├── redesign/                     # 🎨 AI redesign studio
│   │   └── page.tsx                  # Prompt input, before/after slider, suggestions
│   ├── compare/                      # ⚖️ Room comparison
│   │   └── page.tsx                  # Side-by-side metric delta comparison
│   ├── settings/                     # ⚙️ User preferences
│   │   └── page.tsx                  # Unit system, account settings
│   ├── api/                          # Next.js API routes (if any)
│   ├── globals.css                   # Global base styles and CSS variables
│   ├── layout.tsx                    # Root layout (fonts, providers, navbar)
│   └── loading.tsx                   # Global loading skeleton
│
├── components/                       # 🧩 Reusable React Components
│   ├── layout/                       # Structural layout components
│   │   ├── Navbar.tsx                # Top navigation bar with auth state
│   │   ├── Sidebar.tsx               # Collapsible sidebar navigation
│   │   ├── DashboardShell.tsx        # Dashboard page wrapper with sidebar
│   │   └── PageContainer.tsx         # Consistent page width/padding container
│   │
│   ├── upload/                       # Upload flow components
│   │   ├── UploadDropzone.tsx        # Drag-and-drop file upload zone
│   │   ├── UploadProgress.tsx        # Upload progress indicator and status
│   │   ├── ImagePreview.tsx          # Uploaded image preview card
│   │   └── PromptInput.tsx           # Style prompt text input field
│   │
│   ├── room/                         # Room display components
│   │   ├── RoomCard.tsx              # Room scan thumbnail card with metadata
│   │   └── RoomDetails.tsx           # Detailed room info panel
│   │
│   ├── scoring/                      # Metric and scoring components
│   │   ├── ScoreCard.tsx             # Individual score display card (0-100)
│   │   ├── MetricGauge.tsx           # Circular gauge for score visualization
│   │   ├── ClutterMeter.tsx          # Clutter level indicator bar
│   │   └── OptimizationBreakdown.tsx # Optimization suggestions list panel
│   │
│   ├── visualization/                # Spatial data visualization components
│   │   ├── OccupancyGrid.tsx         # 2D occupancy grid matrix renderer
│   │   ├── HeatmapViewer.tsx         # Color-coded heatmap overlay
│   │   ├── DetectionOverlay.tsx      # Bounding box overlay on room image
│   │   ├── SymmetryViewer.tsx        # Symmetry axis visualization
│   │   └── SpaceUsageChart.tsx       # Space utilization bar/pie chart
│   │
│   ├── comparison/                   # Comparison components
│   │   ├── BeforeAfterSlider.tsx     # Interactive drag slider (before/after)
│   │   └── ComparisonGrid.tsx        # Two-panel side-by-side grid comparison
│   │
│   ├── dashboard/                    # Dashboard-specific components
│   │   ├── RecentScans.tsx           # Latest room scans feed
│   │   └── AnalyticsSummary.tsx      # Quick stats (total rooms, avg score, etc.)
│   │
│   ├── charts/                       # Data chart components
│   │   └── RadarMetricChart.tsx      # Pentagon radar chart for all 5 metrics
│   │
│   ├── animations/                   # Animation wrapper components
│   │   └── FadeIn.tsx                # Framer Motion fade-in entrance wrapper
│   │
│   └── ui/                           # Primitive UI components
│       ├── Button.tsx                # Styled button with variants
│       ├── Modal.tsx                 # Overlay modal dialog
│       └── Tabs.tsx                  # Tabbed content switcher
│
├── services/                         # 🌐 Axios API Service Layer
│   ├── api.ts                        # Base Axios instance + auth interceptors
│   ├── room.service.ts               # Room CRUD, upload, analysis polling
│   ├── optimization.service.ts       # Optimization job creation + status polling
│   ├── redesign.service.ts           # Redesign job creation + status polling
│   └── scoring.service.ts            # Score recalculation API calls
│
├── store/                            # 🗃️ Zustand State Management
│   └── roomStore.ts                  # Global room state (active room, analysis, scores)
│
├── types/                            # 🔷 TypeScript Type Definitions
│   └── index.ts                      # Room, Analysis, Score, Furniture, Redesign types
│
├── providers/                        # ⚡ React Context Providers
│   └── QueryProvider.tsx             # TanStack Query client provider wrapper
│
├── lib/                              # 🛠️ Utility Functions
│   └── utils.ts                      # cn() Tailwind class merging utility
│
├── public/                           # Static assets
├── middleware.ts                     # Next.js middleware (auth routing guards)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.*                 # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

---

## 🗺️ Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|--------------|
| `/` | Landing page with hero, features, and CTA | ❌ |
| `/about` | About the platform and team | ❌ |
| `/features` | Feature showcase and AI capabilities | ❌ |
| `/pricing` | Subscription tier comparison | ❌ |
| `/dashboard` | User's room scan history and quick stats | ✅ |
| `/upload` | Upload a new room image and configure scan | ✅ |
| `/research` | View spatial analysis results for a room | ✅ |
| `/redesign` | AI generative redesign studio | ✅ |
| `/compare` | Compare spatial metrics between two rooms | ✅ |
| `/settings` | Account and unit preferences | ✅ |

---

## 🧩 Component Library

### Layout
| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation with user menu, notification badges |
| `Sidebar` | Collapsible icon sidebar with active route highlighting |
| `DashboardShell` | Full-screen layout shell combining sidebar + content area |
| `PageContainer` | Max-width constrained container with consistent padding |

### Visualization
| Component | Description |
|-----------|-------------|
| `OccupancyGrid` | Renders a color-coded 10×10 grid (empty / buffer / occupied) |
| `HeatmapViewer` | Gradient-shaded heatmap overlay on room image |
| `DetectionOverlay` | Draws YOLOv8 bounding boxes over the room image |
| `SymmetryViewer` | Displays the room centerline and symmetry weight indicators |
| `SpaceUsageChart` | Bar chart of walkable / buffer / occupied cell percentages |

### Scoring
| Component | Description |
|-----------|-------------|
| `ScoreCard` | Single metric card with score, label, and trend indicator |
| `MetricGauge` | SVG circular gauge for a single 0–100 score |
| `ClutterMeter` | Horizontal progress bar with Low / Medium / High color states |
| `OptimizationBreakdown` | Scrollable list of GA solver suggestions with action items |
| `RadarMetricChart` | Recharts pentagon radar showing all 5 metrics at once |

### Comparison
| Component | Description |
|-----------|-------------|
| `BeforeAfterSlider` | Interactive drag slider to reveal before/after room renders |
| `ComparisonGrid` | Two-column grid with score delta indicators per metric |

---

## 🗃️ State Management

Zustand is used for client-side global state via `store/roomStore.ts`:

```typescript
// Key state slices
interface RoomStore {
  selectedRoomId: number | null       // Currently viewed room
  analysisResult: AnalysisResponse | null  // Loaded analysis data
  optimizationResult: OptimizationResponse | null
  redesignResult: RedesignResponse | null
  
  // Actions
  setSelectedRoom(id: number): void
  setAnalysisResult(data: AnalysisResponse): void
  clearRoom(): void
}
```

**TanStack Query** handles all server-state (API data fetching, polling, caching, refetching). Zustand stores only derived client-side selections.

---

## 🌐 API Services

All API calls are made through typed Axios service functions in `services/`:

```typescript
// Base Axios instance with auth interceptors (services/api.ts)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Request interceptor attaches Bearer token from localStorage
// Response interceptor handles 401 → token refresh flow
```

| Service | Key Functions |
|---------|--------------|
| `room.service.ts` | `uploadRoomImage()`, `createRoomScan()`, `getRoomList()`, `getAnalysisResult()` |
| `optimization.service.ts` | `triggerOptimization()`, `getOptimizationStatus()` |
| `redesign.service.ts` | `requestRedesign()`, `getRedesignStatus()`, `getRedesignHistory()` |
| `scoring.service.ts` | `recalculateScores()` |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js **20+**
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Configure Environment
```bash
# Create local environment file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The backend must be running at `http://localhost:8000` for API calls to work. See [backend/README.md](../backend/README.md) for setup instructions.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL (e.g., `http://localhost:8000`) |

---

## 📜 Scripts

```bash
# Start development server with hot reload
npm run dev

# Build optimized production bundle
npm run build

# Start production server (after build)
npm start

# Run ESLint code quality checks
npm run lint
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo on [vercel.com](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL` environment variable to your production backend URL
4. Deploy → Vercel handles build, CDN, and edge functions automatically

### Docker
```bash
# Build frontend image
docker build -t aura-frontend .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-api.com aura-frontend
```
