import { useQuery } from '@tanstack/react-query';
import { redesignService } from '@/services/redesign.service';
import { useRoomStore } from '@/store/roomStore';
import { useToastStore } from '@/store/toastStore';
import { AIJobStatus, RedesignResult } from '@/types';

// ===========================================================================
// useRedesignPolling — React Query-based polling for Celery redesign generation
//
// Polls GET /api/redesign/{job_id} every 3 seconds until status = 'completed'
// or 'failed'. On completion, syncs into the Zustand room store.
// ===========================================================================

interface UseRedesignPollingOptions {
  jobId: string | null;
  roomId: string | null;
  enabled?: boolean;
  onComplete?: (result: RedesignResult) => void;
  onError?: (message: string) => void;
}

interface UseRedesignPollingReturn {
  status: AIJobStatus | null;
  redesignResult: RedesignResult | null;
  isPolling: boolean;
  error: string | null;
}

const TERMINAL_STATES: AIJobStatus[] = ['completed', 'failed'];

export function useRedesignPolling({
  jobId,
  roomId,
  enabled = true,
  onComplete,
  onError,
}: UseRedesignPollingOptions): UseRedesignPollingReturn {
  const { addRoomRedesign } = useRoomStore();
  const toast = useToastStore();

  const {
    data: jobData,
    isLoading,
    error,
  } = useQuery<RedesignResult>({
    queryKey: ['redesign-job', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('No job ID provided');
      return redesignService.getRedesignStatus(jobId);
    },
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const currentStatus = query.state.data?.status as AIJobStatus | undefined;
      if (currentStatus && TERMINAL_STATES.includes(currentStatus)) {
        return false; // Stop polling
      }
      return 3000; // Poll every 3s
    },
    retry: false,
  });

  // Handle completed state
  if (jobData?.status === 'completed' && roomId) {
    addRoomRedesign(roomId, jobData);
    onComplete?.(jobData);
    toast.success('AI redesign generation complete!');
  }

  // Handle failed state
  if (jobData?.status === 'failed') {
    const msg = 'Redesign generation failed. Please try again.';
    onError?.(msg);
    toast.error(msg);
  }

  const status = (jobData?.status as AIJobStatus) ?? null;
  const isPolling =
    isLoading ||
    (!!jobId && !!status && !TERMINAL_STATES.includes(status));

  return {
    status,
    redesignResult: jobData ?? null,
    isPolling,
    error: error ? (error as Error).message : null,
  };
}
