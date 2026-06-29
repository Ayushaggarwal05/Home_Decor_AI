// ===========================================================================
// FRONTEND TYPE DEFINITIONS — Aura AI Platform
// Includes both the canonical camelCase frontend types AND
// the raw snake_case backend response shapes for typed mapping.
// ===========================================================================

// ---------------------------------------------------------------------------
// Core geometry & spatial types
// ---------------------------------------------------------------------------

export interface BoundingBox {
  x: number;        // Percentage from left (0–100)
  y: number;        // Percentage from top (0–100)
  width: number;    // Percentage width (0–100)
  height: number;   // Percentage height (0–100)
}

export interface Furniture {
  id: string;
  label: string;
  category: string;
  confidence: number;
  boundingBox: BoundingBox;
  dimensions?: {
    width: number;
    depth: number;
    height: number;
    unit: 'm' | 'ft';
  };
}

export interface OptimizationScore {
  overall: number;
  flow: number;
  symmetry: number;
  clutter: number;
  accessibility: number;
  lighting: number;
}

export interface OccupancyCell {
  x: number;
  y: number;
  status: 'occupied' | 'empty' | 'buffer';
  weight: number;   // 0–1 intensity for heatmap
}

export interface OccupancyMap {
  grid: OccupancyCell[][];
  rows: number;
  cols: number;
}

export interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
  dimWidth?: number;
  dimDepth?: number;
  dimHeight?: number;
}

export interface PlacementReasoning {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'improvement';
  associatedFurnitureId?: string;
}

export interface PlacementMetadata {
  furnitureId: string;
  suggestedX: number;
  suggestedY: number;
  rotation: number;
  clearance: number;
  reason: string;
}

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  boundingBox?: BoundingBox;
  center_x?: number;
  center_y?: number;
  movable?: boolean;
  anchor_priority?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ---------------------------------------------------------------------------
// Analysis types
// ---------------------------------------------------------------------------

export interface AnalysisResult {
  roomId: string;
  occupancyMap: OccupancyMap;
  scores: OptimizationScore;
  detections: DetectionResult[];
  reasoning: PlacementReasoning[];
  clutterLevel: 'Low' | 'Medium' | 'High';
  symmetryScore: number;
  accessibilityScore: number;
  graphData?: GraphData;
}

// ---------------------------------------------------------------------------
// Redesign types
// ---------------------------------------------------------------------------

export type AIJobStatus = 'pending' | 'generating' | 'running' | 'completed' | 'failed';

export interface RedesignResult {
  id: string;
  roomId: string;
  originalImageUrl: string;
  redesignedImageUrl: string;
  style: string;
  prompt: string;
  createdAt: string;
  suggestions: string[];
  status: AIJobStatus;
}

// ---------------------------------------------------------------------------
// Optimization types
// ---------------------------------------------------------------------------

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
}

export interface OptimizationResult {
  id: string;
  roomId: string;
  status: AIJobStatus;
  originalScores?: OptimizationScore;
  optimizedScores?: OptimizationScore;
  suggestions?: OptimizationSuggestion[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Upload types
// ---------------------------------------------------------------------------

export interface UploadResponse {
  url: string;
}

// ---------------------------------------------------------------------------
// Room types
// ---------------------------------------------------------------------------

export interface Room {
  id: string;
  name: string;
  imageUrl: string;
  type: 'living_room' | 'bedroom' | 'office' | 'kitchen' | 'dining';
  dimensions?: {
    length: number;
    width: number;
    unit: 'ft' | 'm';
  };
  stylePreference: string;
  createdAt: string;
  analysis?: AnalysisResult;
  redesigns?: RedesignResult[];
}

// ---------------------------------------------------------------------------
// Score metrics (alias for component convenience)
// ---------------------------------------------------------------------------

export type ScoreMetrics = OptimizationScore;

// ---------------------------------------------------------------------------
// User & Auth types
// ---------------------------------------------------------------------------

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  defaultUnit: 'ft' | 'm';
  favoriteStyles: string[];
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string | null;
  tier: 'Free' | 'Pro' | 'Enterprise';
  isActive: boolean;
  createdAt: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ---------------------------------------------------------------------------
// Comparison types
// ---------------------------------------------------------------------------

export interface CompareRoomData {
  id: number;
  name: string;
  scores: Record<string, number>;
}

export interface ComparisonResult {
  roomA: CompareRoomData;
  roomB: CompareRoomData;
  deltas: Record<string, number>;
}

// ===========================================================================
// RAW BACKEND RESPONSE SHAPES (snake_case)
// These are used by mappers.ts and should NOT be used directly in components.
// ===========================================================================

export interface BackendBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BackendFurnitureDetection {
  id?: number;
  label: string;
  confidence: number;
  boundingBox: BackendBoundingBox;   // backend sends camelCase here already
  dim_width?: number;
  dim_depth?: number;
  dim_height?: number;
}

export interface BackendAnalysisScore {
  overall: number;
  flow: number;
  symmetry: number;
  clutter: number;
  accessibility: number;
  lighting: number;
}

export interface BackendReasoningItem {
  id?: string;
  title: string;
  description: string;
  type: string;
  associatedFurnitureId?: string;
}

export interface BackendAnalysis {
  id: number;
  room_id: number;
  clutter_level: string;
  symmetry_score: number;
  accessibility_score: number;
  scores: BackendAnalysisScore;
  detections: BackendFurnitureDetection[];
  reasoning: BackendReasoningItem[];
  occupancy_grid: {
    grid: OccupancyCell[][];
    rows: number;
    cols: number;
  };
  graph_data?: any;
}

export interface BackendRoom {
  id: number;
  name: string;
  image_url: string;
  space_type: string;
  style_preference: string;
  length?: number;
  width?: number;
  unit: string;
  created_at: string;
  user_id: number;
}

export interface BackendRedesign {
  id: number;
  room_id: number;
  status: string;
  prompt: string;
  selected_style: string;
  original_image_url: string;
  redesigned_image_url?: string;
  suggestions?: string[];
  created_at: string;
}

export interface BackendOptimization {
  id: number;
  room_id: number;
  status: string;
  original_scores?: Record<string, number>;
  optimized_scores?: Record<string, number>;
  suggestions?: Array<{ id: string; title: string; description: string }>;
  created_at: string;
}

export interface BackendUser {
  id: number;
  email: string;
  full_name?: string;
  tier: string;
  is_active: boolean;
  created_at: string;
}
