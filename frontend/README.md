# 🎨 Matter AI — Frontend

> **Next.js 15 App Router frontend** for the Matter AI Interior Design & Space Optimization SaaS. Delivers a premium, animation-rich interface for room upload, AI analysis visualization, layout optimization, and generative redesign.

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
│   ├── (marketing)/                  # Public marketing route group
│   │   ├── page.tsx                  # 🏠 Landing page (hero, dual mode, metrics, pricing)
│   │   ├── about/                    # About page
│   │   ├── features/                 # Features showcase
│   │   └── pricing/                  # Pricing tiers
│   ├── (auth)/                       # Authentication route group
│   │   ├── layout.tsx                # Isolated auth layout
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── forgot-password/          # Forgot password page
│   │   └── reset-password/           # Password reset page
│   ├── studio/                       # 🏛️ Primary Studio Workspace
│   │   └── page.tsx                  # Active spaces grid, quick actions, studio stats
│   ├── upload/                       # 📤 Room Upload & Presets
│   │   └── page.tsx                  # Image dropzone, scale & space type presets
│   ├── research/                     # 🔬 Spatial Analysis Lab
│   │   └── page.tsx                  # Scores, occupancy grid, relationship graphs, overlays
│   ├── redesign/                     # 🎨 AI Redesign Studio
│   │   └── page.tsx                  # 2D blueprint selection, Gemini/Imagen 3 renders, slider
│   ├── compare/                      # ⚖️ Room Comparison
│   │   └── page.tsx                  # Side-by-side metric delta comparison
│   ├── settings/                     # ⚙️ User Preferences
│   │   └── page.tsx                  # Unit system, user settings
│   ├── api/health/                   # Healthcheck endpoint
│   ├── globals.css                   # Global styles & theme CSS variables
│   ├── layout.tsx                    # Root layout with QueryProvider and Navbars
│   └── loading.tsx                   # Global loading skeleton
│
├── components/                       # 🧩 Reusable React Components
│   ├── blueprint/                    # 📐 Interactive 2D Blueprint Components
│   │   ├── BlueprintFloorplan.tsx    # SVG CAD-style floorplan blueprint renderer
│   │   ├── BlueprintModal.tsx        # High-res modal viewer for blueprint layout
│   │   └── BlueprintSelector.tsx     # Candidate blueprint card selector
│   │
│   ├── export/                       # 📄 Multi-Format Export Components
│   │   ├── ExportReportModal.tsx     # Export trigger modal (PDF, JSON, Summary)
│   │   └── PrintableReportTemplate.tsx # Printable A4-formatted PDF audit template
│   │
│   ├── layout/                       # Structural layout components
│   │   ├── Navbar.tsx                # Workspace top navbar with golden accents
│   │   ├── Sidebar.tsx               # Collapsible sidebar navigation
│   │   ├── FloatingDock.tsx          # Floating quick-navigation dock
│   │   ├── StudioFooter.tsx          # Dark slate & golden studio footer
│   │   ├── DashboardShell.tsx        # Workspace layout shell
│   │   └── PageContainer.tsx         # Consistent page width container
│   │
│   ├── marketing/                    # Landing page sections
│   │   ├── MarketingNavbar.tsx       # Full-width marketing navigation bar
│   │   ├── HeroSection.tsx           # Asymmetric studio hero with stacked typography
│   │   ├── FeatureDualMode.tsx       # Research Lab vs Design Studio split preview
│   │   ├── InteractiveDemo.tsx       # Live interactive demo card
│   │   ├── MetricsShowcase.tsx       # Spatial intelligence score preview
│   │   ├── WorkflowSteps.tsx         # 3-step scan-to-render walkthrough
│   │   ├── PricingSection.tsx        # Pricing tiers table
│   │   └── MarketingFooter.tsx       # Marketing footer
│   │
│   ├── upload/                       # Upload flow components
│   │   ├── UploadDropzone.tsx        # Drag-and-drop file upload zone
│   │   ├── CameraGuidanceBanner.tsx  # Best practices notice for photos
│   │   ├── CameraGuidanceModal.tsx   # Detailed perspective & lighting guide
│   │   ├── RoomScaleSelector.tsx     # Room size presets (Compact, Standard, Expansive)
│   │   ├── SpaceTypeSelector.tsx     # Space type (Living Room, Bedroom, Studio, Office)
│   │   ├── StylePresetSelector.tsx   # Aesthetic preset cards
│   │   ├── UploadProgress.tsx        # Upload progress indicator
│   │   ├── ImagePreview.tsx          # Uploaded image preview card
│   │   └── PromptInput.tsx           # Style prompt text input
│   │
│   ├── room/                         # Room scan cards & previews
│   │   ├── RoomCard.tsx              # Room scan card with quick stats
│   │   └── RoomDetails.tsx           # Detailed room information panel
│   │
│   ├── scoring/                      # Spatial score displays
│   │   ├── ScoreCard.tsx             # Metric card (0-100)
│   │   ├── MetricGauge.tsx           # Circular SVG gauge
│   │   ├── ClutterMeter.tsx          # Clutter density horizontal bar
│   │   └── OptimizationBreakdown.tsx # Actionable layout optimization items
│   │
│   ├── visualization/                # Spatial intelligence visualizers
│   │   ├── OccupancyGrid.tsx         # 2D occupancy matrix (walkable / buffer / occupied)
│   │   ├── HeatmapViewer.tsx         # Color-coded density heatmap
│   │   ├── DetectionOverlay.tsx      # Object bounding box overlay
│   │   ├── RelationshipGraph.tsx     # Spatial Relationship Graph (SRG) visualizer
│   │   ├── SpacingConnectors.tsx     # Clearance vector lines
│   │   ├── SymmetryViewer.tsx        # Room centerline & visual mass balance
│   │   └── SpaceUsageChart.tsx       # Floor area distribution chart
│   │
│   ├── comparison/                   # Comparison components
│   │   ├── BeforeAfterSlider.tsx     # Interactive comparison slider
│   │   └── ComparisonGrid.tsx        # Multi-metric delta comparison grid
│   │
│   ├── dashboard/                    # Studio dashboard widgets
│   │   ├── RecentScans.tsx           # Latest room scans feed
│   │   └── AnalyticsSummary.tsx      # Aggregate spatial score summary
│   │
│   ├── charts/                       # Metric charts
│   │   └── RadarMetricChart.tsx      # Pentagon radar chart of 5 spatial metrics
│   │
│   ├── auth/                         # Authentication modals & helpers
│   │   ├── ForgotPasswordModal.tsx   # Password recovery dialog
│   │   ├── PasswordStrengthBar.tsx   # Real-time password strength meter
│   │   └── SocialAuthButtons.tsx     # Social login buttons
│   │
│   ├── animations/                   # Animation wrappers
│   │   └── FadeIn.tsx                # Framer Motion entrance wrapper
│   │
│   └── ui/                           # Base UI primitives
│       ├── Button.tsx                # Styled button variants
│       ├── Modal.tsx                 # Accessible modal dialog
│       ├── Tabs.tsx                  # Segmented tabs switcher
│       └── Toast.tsx                 # Toast notification feedback
│
├── services/                         # 🌐 Axios API Service Layer
│   ├── api.ts                        # Base Axios instance + JWT interceptors
│   ├── room.service.ts               # Room scans, image upload, analysis polling
│   ├── optimization.service.ts       # NSGA-II optimization job trigger & polling
│   ├── redesign.service.ts           # Gemini/Imagen 3 redesign requests & history
│   └── scoring.service.ts            # Score recalculation service
│
├── store/                            # 🗃️ Zustand Global State
│   └── roomStore.ts                  # Active room, analyses, scores, blueprints, layout state
│
├── types/                            # 🔷 TypeScript Definitions
│   └── index.ts                      # Data models and API contract types
│
├── providers/                        # ⚡ React Context Providers
│   └── QueryProvider.tsx             # TanStack Query client wrapper
│
├── lib/                              # 🛠️ Utility Functions
│   └── utils.ts                      # cn() Tailwind class merging utility
│
├── public/                           # Static assets
├── middleware.ts                     # Auth route protection middleware
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

---

## 🗺️ Pages & Routes

| Route | Description | Auth Required |
| --- | --- | --- |
| `/` | Landing page featuring dual-mode preview, interactive demo, and pricing | ❌ |
| `/about` | About the Matter AI spatial intelligence platform | ❌ |
| `/features` | Detailed breakdown of deterministic spatial mapping vs generative AI | ❌ |
| `/pricing` | Subscription tiers and plan breakdown | ❌ |
| `/login` / `/signup` | User authentication and session provisioning | ❌ |
| `/studio` | Creative Asymmetric Studio workspace, active spaces grid, and quick actions | ✅ |
| `/upload` | Room image drag-and-drop with room scale and space type selectors | ✅ |
| `/research` | Spatial analysis lab (scores, occupancy grid, heatmaps, relationship graph) | ✅ |
| `/redesign` | Multimodal AI redesign studio with 2D blueprint selection & comparison slider | ✅ |
| `/compare` | Side-by-side metric delta comparison across multiple scans | ✅ |
| `/settings` | Account settings, measurement unit preferences (Metric / Imperial) | ✅ |

---

## 🧩 Component Library

### 2D Floorplan Blueprints
| Component | Description |
| --- | --- |
| `BlueprintFloorplan` | Architectural CAD-style SVG layout blueprint with dimensional grids and furniture footprints |
| `BlueprintModal` | High-resolution modal viewer with dimension annotations and export options |
| `BlueprintSelector` | Visual selector enabling users to choose between candidate optimized layout blueprints |

### Export & Audit
| Component | Description |
| --- | --- |
| `ExportReportModal` | Modal offering Printable PDF Audit Reports, GeoJSON/Spatial datasets, and clipboard summary |
| `PrintableReportTemplate` | A4-formatted, print-ready document template containing spatial scores, recommendations, and blueprints |

### Layout & Navigation
| Component | Description |
| --- | --- |
| `Navbar` | Studio top navbar with active room indicator and golden theme accents |
| `MarketingNavbar` | Full-width public navigation bar with CTA buttons |
| `Sidebar` | Collapsible sidebar with active page indicators |
| `FloatingDock` | Quick-navigation pill dock for seamless switching between Research Lab and Design Studio |
| `StudioFooter` | Dark slate & golden themed footer with status diagnostics |
| `DashboardShell` | Workspace layout shell combining sidebar and content container |
| `PageContainer` | Consistent page width container |

### Visualization & Spatial Reasoning
| Component | Description |
| --- | --- |
| `OccupancyGrid` | 10×10 coordinate matrix visualizing walkable, buffer, and occupied room zones |
| `HeatmapViewer` | Color-graded density heatmap overlay directly aligned with room capture |
| `DetectionOverlay` | Interactive bounding box overlay identifying detected furniture and confidence scores |
| `RelationshipGraph` | Visual NetworkX Spatial Relationship Graph (SRG) showing functional clusters and focal vectors |
| `SpacingConnectors` | Visual clearance vector lines between neighboring furniture objects |
| `SymmetryViewer` | Visualizes the room's centerline visual mass equilibrium and weighted offsets |
| `SpaceUsageChart` | Percentage breakdown of usable floor area vs occupied furniture volume |

### Scoring & Optimization
| Component | Description |
| --- | --- |
| `ScoreCard` | Individual spatial score card (0-100) with category rating and badge |
| `MetricGauge` | Animated circular SVG gauge for single-metric display |
| `ClutterMeter` | Color-coded horizontal gauge tracking clutter density |
| `OptimizationBreakdown` | Prioritized list of layout optimization recommendations with actionable adjustments |
| `RadarMetricChart` | Recharts pentagon radar chart displaying all 5 spatial scores simultaneously |

### Comparison
| Component | Description |
| --- | --- |
| `BeforeAfterSlider` | Smooth touch/mouse drag slider comparing original photo with AI redesigned concept |
| `ComparisonGrid` | Side-by-side room comparison cards showing exact metric deltas |

### Upload & Inputs
| Component | Description |
| --- | --- |
| `UploadDropzone` | Responsive drag-and-drop file upload zone with file validation |
| `CameraGuidanceBanner` | Banner prompting users with best practices for room photography |
| `CameraGuidanceModal` | Detailed illustrated guide for perspective, lighting, and clearance capture |
| `RoomScaleSelector` | Presets for room dimensions (Compact, Standard, Expansive) |
| `SpaceTypeSelector` | Presets for space functional context (Living Room, Bedroom, Studio, Office) |
| `StylePresetSelector` | Aesthetic style cards for Japandi, Scandinavian, Industrial, Parisian, etc. |

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
