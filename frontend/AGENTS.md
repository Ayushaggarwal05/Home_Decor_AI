<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Matter AI — Frontend Agent Developer Guidelines

## 1. Technology Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 (`globals.css`)
- **State Management**: Zustand 5 (`store/roomStore.ts`)
- **Data Fetching & Caching**: TanStack Query v5 (`@tanstack/react-query`)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Charts**: Recharts 3

## 2. Page & Directory Conventions
- `app/(marketing)/`: Public landing, about, features, pricing. Use `MarketingNavbar` and `MarketingFooter`.
- `app/(auth)/`: Authentication pages (`login`, `signup`, `forgot-password`, `reset-password`). Uses isolated layout without studio theme overrides.
- `app/studio/`: Primary studio dashboard workspace with asymmetric active spaces grid, studio footer, and workspace navigation.
- `app/upload/`: Room image upload with dropzone, camera guidance modals, and scale/space type presets.
- `app/research/`: Spatial intelligence analysis lab (scores, 10x10 occupancy matrix, heatmaps, Spatial Relationship Graphs).
- `app/redesign/`: Generative AI redesign studio with 2D blueprint selector, Google Gemini/Imagen 3 renders, and interactive before/after slider.
- `app/compare/`: Side-by-side multi-scan comparison with score deltas.
- `components/blueprint/`: Architectural CAD-style SVG floorplan blueprint visualizer, modal, and selector.
- `components/export/`: Print-ready A4 PDF report template (`PrintableReportTemplate.tsx`) and modal export trigger.

## 3. Styling & Theme Isolation Rules
- Use Tailwind CSS v4 utility classes and theme tokens (`var(--gold-...)`, `var(--bg-...)`, `var(--charcoal-...)`).
- Never leak studio workspace theme variables into marketing or auth pages; theme overrides must remain strictly scoped to workspace layouts.
- Prefer client components (`"use client"`) only where interactive state, Zustand store access, or browser event listeners are required.

## 4. State Management & API Integration
- **Client State**: Access global room and layout data via `useRoomStore()` from `store/roomStore.ts`.
- **API Services**: Call backend APIs exclusively through the service layer in `services/` (`room.service.ts`, `optimization.service.ts`, `redesign.service.ts`, `scoring.service.ts`).
- **Axios Configuration**: The singleton Axios client in `services/api.ts` automatically attaches Bearer tokens from localStorage and handles refresh tokens on 401 errors.
