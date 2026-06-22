import { useQuery } from '@tanstack/react-query';
import { optimizationService } from '@/services/optimization.service';
import { useToastStore } from '@/store/toastStore';
import { AIJobStatus, OptimizationResult } from '@/types';

// ===========================================================================
// useOptimizationPolling — React Query-based polling for Celery layout optimization
//
// Polls GET /api/optimize/{job_id} every 2 seconds until status = 'completed'
// or 'failed'.
// ===========================================================================

interface UseOptimizationPollingOptions {
  jobId: string | null;
  enabled?: boolean;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (message: string) => void;
}

interface UseOptimizationPollingReturn {
  status: AIJobStatus | null;
  optimizationResult: OptimizationResult | null;
  isPolling: boolean;
  error: string | null;
}

const TERMINAL_STATES: AIJobStatus[] = ['completed', 'failed'];

export function useOptimizationPolling({
  jobId,
  enabled = true,
  onComplete,
  onError,
}: UseOptimizationPollingOptions): UseOptimizationPollingReturn {
  const toast = useToastStore();

  const {
    data: jobData,
    isLoading,
    error,
  } = useQuery<OptimizationResult>({
    queryKey: ['optimization-job', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('No job ID provided');
      return optimizationService.getOptimizationStatus(jobId);
    },
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const currentStatus = query.state.data?.status as AIJobStatus | undefined;
      if (currentStatus && TERMINAL_STATES.includes(currentStatus)) {
        return false;
      }
      return 2000;
    },
    retry: false,
  });

  // Handle terminal states
  if (jobData?.status === 'completed') {
    onComplete?.(jobData);
    toast.success('Layout optimization complete! Scores updated.');
  }

  if (jobData?.status === 'failed') {
    const msg = 'Layout optimization failed. Please try again.';
    onError?.(msg);
    toast.error(msg);
  }

  const status = (jobData?.status as AIJobStatus) ?? null;
  const isPolling =
    isLoading ||
    (!!jobId && !!status && !TERMINAL_STATES.includes(status));

  return {
    status,
    optimizationResult: jobData ?? null,
    isPolling,
    error: error ? (error as Error).message : null,
  };
}
