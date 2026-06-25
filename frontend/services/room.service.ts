import { apiClient } from './api';
import {
  Room,
  BackendRoom,
  BackendAnalysis,
  UploadResponse,
} from '../types';
import { mapBackendRoom, mapBackendAnalysis } from '../lib/mappers';

// ===========================================================================
// ROOM SERVICE — Connects to real FastAPI /api/upload + /api/analyze/* endpoints
// Upload flow: POST /api/upload (multipart) → {url} → POST /api/analyze/room (JSON)
// ===========================================================================

export type RoomType = 'living_room' | 'bedroom' | 'office' | 'kitchen' | 'dining';

export interface CreateRoomPayload {
  name: string;
  space_type: RoomType;
  style_preference: string;
  length?: number;
  width?: number;
  unit?: 'ft' | 'm';
}

export const roomService = {
  /**
   * STEP 1: Upload the room image to Cloudinary via /api/upload
   * Returns the hosted image URL.
   */
  async uploadImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const pct = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(pct);
        }
      },
    });

    return response.data.url;
  },

  /**
   * STEP 2: Register the room in the database and trigger Celery analysis
   * Returns the new Room (analysis will be pending — use polling hook).
   */
  async createRoom(
    imageUrl: string,
    payload: CreateRoomPayload
  ): Promise<Room> {
    const response = await apiClient.post<BackendRoom>(
      `/analyze/room?image_url=${encodeURIComponent(imageUrl)}`,
      payload
    );
    return mapBackendRoom(response.data);
  },

  /**
   * Full upload pipeline — combines uploadImage + createRoom.
   * Progress callback covers the upload phase (0-100%).
   */
  async uploadRoom(
    file: File,
    name: string,
    type: RoomType,
    stylePreference: string,
    _prompt: string,
    onProgress?: (progress: number) => void
  ): Promise<Room> {
    // Phase 1: upload the file
    const imageUrl = await this.uploadImage(file, onProgress);

    // Phase 2: register room + trigger analysis task
    return this.createRoom(imageUrl, {
      name: name || `${type.replace('_', ' ')} Space`,
      space_type: type,
      style_preference: stylePreference,
    });
  },

  /**
   * GET /api/analyze/rooms — fetch all rooms for the authenticated user
   */
  async getRooms(): Promise<Room[]> {
    const response = await apiClient.get<BackendRoom[]>('/analyze/rooms');
    return response.data.map(mapBackendRoom);
  },

  /**
   * GET /api/analyze/room/{id} — fetch a single room by ID
   */
  async getRoomById(id: string): Promise<Room> {
    const response = await apiClient.get<BackendRoom>(`/analyze/room/${id}`);
    return mapBackendRoom(response.data);
  },

  /**
   * GET /api/analyze/room/{id}/result — fetch analysis result
   * Returns null if still processing (backend responds with 202).
   */
  async getAnalysisResult(roomId: string): Promise<ReturnType<typeof mapBackendAnalysis> | null> {
    try {
      const response = await apiClient.get<BackendAnalysis | { detail: string }>(
        `/analyze/room/${roomId}/result`
      );
      
      if (response.status === 202 || (response.data && 'detail' in response.data)) {
        return null;
      }
      
      return mapBackendAnalysis(response.data as BackendAnalysis);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status || (err as { response?: { status: number } })?.response?.status;
      if (status === 202) return null;
      throw err;
    }
  },
};
