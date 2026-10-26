import { apiClient } from './api';
import { RedesignResult, BackendRedesign } from '../types';
import { mapBackendRedesign } from '../lib/mappers';

// ===========================================================================
// REDESIGN SERVICE — Connects to FastAPI /api/redesign/* endpoints
// Flow: POST /api/redesign → {id, status:'pending'} → poll GET /api/redesign/{id}
// ===========================================================================

export interface RedesignPayload {
  room_id: number;
  selected_style: string;
  prompt?: string;
  blueprint_id?: string;
  blueprint_layout?: any[];
}

export const redesignService = {
  /**
   * POST /api/redesign
   * Queues a Celery generative redesign task.
   * Returns immediately with status='pending'.
   */
  async generateRedesign(
    roomId: string,
    style: string,
    prompt: string,
    _originalImageUrl: string,
    blueprintId?: string,
    blueprintLayout?: any[]
  ): Promise<RedesignResult> {
    const response = await apiClient.post<BackendRedesign>('/redesign', {
      room_id: parseInt(roomId, 10),
      selected_style: style,
      prompt: prompt || `Redesign space using ${style} style`,
      blueprint_id: blueprintId,
      blueprint_layout: blueprintLayout,
    } satisfies RedesignPayload);

    return mapBackendRedesign(response.data);
  },

  /**
   * GET /api/redesign/{job_id}
   * Poll for task status. Returns current state of the redesign job.
   */
  async getRedesignStatus(jobId: string): Promise<RedesignResult> {
    const response = await apiClient.get<BackendRedesign>(
      `/redesign/${jobId}`
    );
    return mapBackendRedesign(response.data);
  },

  /**
   * GET /api/redesign/room/{room_id}
   * Fetch all previous redesign attempts for a room.
   */
  async getRedesignsByRoom(roomId: string): Promise<RedesignResult[]> {
    const response = await apiClient.get<BackendRedesign[]>(
      `/redesign/room/${roomId}`
    );
    return response.data.map(mapBackendRedesign);
  },
};
