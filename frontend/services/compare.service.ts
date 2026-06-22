import { apiClient } from './api';
import { ComparisonResult } from '../types';

// ===========================================================================
// COMPARE SERVICE — Connects to FastAPI /api/compare endpoint
// ===========================================================================

export const compareService = {
  /**
   * GET /api/compare?room_a_id={a}&room_b_id={b}
   * Returns side-by-side scores and delta calculations for two rooms.
   */
  async compareRooms(
    roomAId: string,
    roomBId: string
  ): Promise<ComparisonResult> {
    const response = await apiClient.get<{
      room_a: { id: number; name: string; scores: Record<string, number> };
      room_b: { id: number; name: string; scores: Record<string, number> };
      deltas: Record<string, number>;
    }>('/compare', {
      params: {
        room_a_id: parseInt(roomAId, 10),
        room_b_id: parseInt(roomBId, 10),
      },
    });

    const { room_a, room_b, deltas } = response.data;

    return {
      roomA: { id: room_a.id, name: room_a.name, scores: room_a.scores },
      roomB: { id: room_b.id, name: room_b.name, scores: room_b.scores },
      deltas,
    };
  },
};
