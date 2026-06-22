import { apiClient } from './api';
import { OptimizationScore } from '../types';

// ===========================================================================
// SCORING SERVICE — Connects to FastAPI /api/scoring/* endpoints
// ===========================================================================

export interface FurnitureLayoutItem {
  label: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const scoringService = {
  /**
   * POST /api/scoring/recalculate
   * Re-scores a custom furniture layout array.
   */
  async recalculateScores(
    _roomId: string,
    furnitureLayout: FurnitureLayoutItem[]
  ): Promise<OptimizationScore> {
    const response = await apiClient.post<OptimizationScore>(
      '/scoring/recalculate',
      furnitureLayout
    );
    return response.data;
  },
};
