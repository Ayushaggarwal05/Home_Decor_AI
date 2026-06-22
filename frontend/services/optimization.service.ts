import { apiClient } from './api';
import { OptimizationResult, BackendOptimization } from '../types';
import { mapBackendOptimization } from '../lib/mappers';

// ===========================================================================
// OPTIMIZATION SERVICE — Connects to FastAPI /api/optimize/* endpoints
// ===========================================================================

export const optimizationService = {
  /**
   * POST /api/optimize
   * Queues a Celery layout optimization task for the given room.
   * Returns immediately with status='pending'.
   */
  async requestOptimization(roomId: string): Promise<OptimizationResult> {
    const response = await apiClient.post<BackendOptimization>('/optimize', {
      room_id: parseInt(roomId, 10),
    });
    return mapBackendOptimization(response.data);
  },

  /**
   * GET /api/optimize/{job_id}
   * Poll for optimization task status and results.
   */
  async getOptimizationStatus(jobId: string): Promise<OptimizationResult> {
    const response = await apiClient.get<BackendOptimization>(
      `/optimize/${jobId}`
    );
    return mapBackendOptimization(response.data);
  },
};
