import { apiClient } from './api';

// ===========================================================================
// RETRIEVAL SERVICE — Connects to FastAPI /api/retrieval/* endpoints
// ===========================================================================

export const retrievalService = {
  /**
   * GET /api/retrieval/inspirations?prompt={p}&style={s}
   * Returns a list of curated inspiration image URLs from the vector database.
   */
  async getInspirations(prompt: string, style: string): Promise<string[]> {
    const response = await apiClient.get<string[]>('/retrieval/inspirations', {
      params: { prompt, style },
    });
    return response.data;
  },
};
