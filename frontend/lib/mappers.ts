// ===========================================================================
// DATA MAPPERS — Backend (snake_case) → Frontend (camelCase)
// All API responses flow through these mappers before touching stores/components.
// ===========================================================================

import {
  BackendRoom,
  BackendAnalysis,
  BackendRedesign,
  BackendOptimization,
  BackendUser,
  Room,
  AnalysisResult,
  RedesignResult,
  OptimizationResult,
  AuthUser,
  AIJobStatus,
  OccupancyMap,
  OccupancyCell,
  OptimizationScore,
  DetectionResult,
  PlacementReasoning,
} from '../types';

// ---------------------------------------------------------------------------
// OccupancyMap normalizer
// Backend stores the grid in occupancy_grid field; frontend uses occupancyMap
// ---------------------------------------------------------------------------
function mapOccupancyGrid(
  rawGrid: BackendAnalysis['occupancy_grid'] | undefined
): OccupancyMap {
  if (!rawGrid) {
    return { grid: [], rows: 0, cols: 0 };
  }
  return {
    grid: rawGrid.grid as OccupancyCell[][],
    rows: rawGrid.rows,
    cols: rawGrid.cols,
  };
}

// ---------------------------------------------------------------------------
// Analysis mapper
// ---------------------------------------------------------------------------
export function mapBackendAnalysis(raw: BackendAnalysis): AnalysisResult {
  const scores: OptimizationScore = {
    overall: raw.scores.overall,
    flow: raw.scores.flow,
    symmetry: raw.scores.symmetry,
    clutter: raw.scores.clutter,
    accessibility: raw.scores.accessibility,
    lighting: raw.scores.lighting,
  };

  const detections: DetectionResult[] = (raw.detections || []).map((d) => ({
    id: String(d.id ?? `det-${d.label}`),
    label: d.label,
    confidence: d.confidence,
    boundingBox: {
      x: d.boundingBox.x,
      y: d.boundingBox.y,
      width: d.boundingBox.width,
      height: d.boundingBox.height,
    },
  }));

  const reasoning: PlacementReasoning[] = (raw.reasoning || []).map((r) => ({
    id: r.id ?? `r-${r.title}`,
    title: r.title,
    description: r.description,
    type: r.type as 'positive' | 'warning' | 'improvement',
    associatedFurnitureId: r.associatedFurnitureId,
  }));

  return {
    roomId: String(raw.room_id),
    clutterLevel: raw.clutter_level as 'Low' | 'Medium' | 'High',
    symmetryScore: raw.symmetry_score,
    accessibilityScore: raw.accessibility_score,
    scores,
    detections,
    reasoning,
    occupancyMap: mapOccupancyGrid(raw.occupancy_grid),
  };
}

// ---------------------------------------------------------------------------
// Redesign mapper
// ---------------------------------------------------------------------------
export function mapBackendRedesign(raw: BackendRedesign): RedesignResult {
  return {
    id: String(raw.id),
    roomId: String(raw.room_id),
    status: raw.status as AIJobStatus,
    prompt: raw.prompt,
    style: raw.selected_style,
    originalImageUrl: raw.original_image_url,
    redesignedImageUrl: raw.redesigned_image_url ?? '',
    suggestions: raw.suggestions ?? [],
    createdAt: raw.created_at,
  };
}

// ---------------------------------------------------------------------------
// Optimization mapper
// ---------------------------------------------------------------------------
export function mapBackendOptimization(
  raw: BackendOptimization
): OptimizationResult {
  const toScore = (
    obj?: Record<string, number>
  ): OptimizationScore | undefined => {
    if (!obj) return undefined;
    return {
      overall: obj.overall ?? 0,
      flow: obj.flow ?? 0,
      symmetry: obj.symmetry ?? 0,
      clutter: obj.clutter ?? 0,
      accessibility: obj.accessibility ?? 0,
      lighting: obj.lighting ?? 0,
    };
  };

  return {
    id: String(raw.id),
    roomId: String(raw.room_id),
    status: raw.status as AIJobStatus,
    originalScores: toScore(raw.original_scores),
    optimizedScores: toScore(raw.optimized_scores),
    suggestions: raw.suggestions,
    createdAt: raw.created_at,
  };
}

// ---------------------------------------------------------------------------
// Room mapper — does NOT include analysis (fetched separately via polling)
// ---------------------------------------------------------------------------
export function mapBackendRoom(raw: BackendRoom): Room {
  const spaceTypeMap: Record<string, Room['type']> = {
    living_room: 'living_room',
    bedroom: 'bedroom',
    office: 'office',
    kitchen: 'kitchen',
    dining: 'dining',
  };

  return {
    id: String(raw.id),
    name: raw.name,
    imageUrl: raw.image_url,
    type: spaceTypeMap[raw.space_type] ?? 'living_room',
    stylePreference: raw.style_preference,
    createdAt: raw.created_at,
    dimensions:
      raw.length && raw.width
        ? {
            length: raw.length,
            width: raw.width,
            unit: (raw.unit as 'ft' | 'm') ?? 'ft',
          }
        : undefined,
    analysis: undefined,
    redesigns: [],
  };
}

// ---------------------------------------------------------------------------
// User mapper
// ---------------------------------------------------------------------------
export function mapBackendUser(raw: BackendUser): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    fullName: raw.full_name ?? null,
    tier: (raw.tier as AuthUser['tier']) ?? 'Free',
    isActive: raw.is_active,
    createdAt: raw.created_at,
  };
}
