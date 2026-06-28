import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/room.service';
import { useRoomStore } from '@/store/roomStore';
import { useToastStore } from '@/store/toastStore';
import { AnalysisResult } from '@/types';

// ===========================================================================
// useRoomPolling — React Query-based polling for Celery spatial analysis
//
// Polls GET /api/analyze/room/{id}/result every 2 seconds until the analysis
// is ready. On success, syncs the result into the Zustand room store.
// ===========================================================================

interface UseRoomPollingOptions {
  roomId: string | null;
  enabled?: boolean;
}

interface UseRoomPollingReturn {
  isPolling: boolean;
  analysisReady: boolean;
  analysis: AnalysisResult | null;
  error: string | null;
}

export function useRoomPolling({
  roomId,
  enabled = true,
}: UseRoomPollingOptions): UseRoomPollingReturn {
  const { updateRoomAnalysis, rooms } = useRoomStore();
  const toast = useToastStore();

  const activeRoom = rooms.find((r) => r.id === roomId);
  const alreadyHasAnalysis = !!activeRoom?.analysis;

  const {
    data: analysis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['room-analysis', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('No room ID provided');
      const result = await roomService.getAnalysisResult(roomId);
      return result;
    },
    enabled: !!roomId && enabled && !alreadyHasAnalysis,
    refetchInterval: (query) => {
      // Stop polling once we have analysis data
      if (query.state.data !== null && query.state.data !== undefined) {
        return false;
      }
      // Poll every 2 seconds while pending
      return 2000;
    },
    retry: false, // Don't retry on 202 — the refetchInterval handles that
  });

  // Sync completed analysis into the store
  useEffect(() => {
    if (analysis && roomId && !alreadyHasAnalysis) {
      updateRoomAnalysis(roomId, analysis);
      toast.success('Spatial analysis complete! Studio updated.');
    }
  }, [analysis, roomId, alreadyHasAnalysis, updateRoomAnalysis, toast]);

  const analysisReady = alreadyHasAnalysis || (analysis !== null && analysis !== undefined);

  return {
    isPolling: isLoading || (!alreadyHasAnalysis && !analysis && !!roomId),
    analysisReady,
    analysis: analysis ?? activeRoom?.analysis ?? null,
    error: error ? (error as Error).message : null,
  };
}
