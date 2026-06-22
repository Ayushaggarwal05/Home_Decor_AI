'use client';

import React, { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { redesignService } from '@/services/redesign.service';
import { retrievalService } from '@/services/retrieval.service';
import { useRedesignPolling } from '@/hooks/useRedesignPolling';
import { useToastStore } from '@/store/toastStore';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import BeforeAfterSlider from '@/components/comparison/BeforeAfterSlider';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  Compass,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { RedesignResult } from '@/types';

const DESIGN_CHIPS = [
  { name: 'Japandi Harmony', label: 'Japandi' },
  { name: 'Scandinavian Crisp', label: 'Nordic Scandinavian' },
  { name: 'Industrial Loft', label: 'Industrial Raw' },
  { name: 'Modern Biophilic', label: 'Biophilic Planted' },
  { name: 'Mid-Century Chic', label: 'Mid-Century Modern' },
  { name: 'Neo-Classical Luxury', label: 'Classical French' },
];

// Status badge map
const STATUS_CONFIG = {
  pending:    { label: 'Queued',     color: 'text-amber-400  border-amber-400/20  bg-amber-400/10'   },
  generating: { label: 'Generating', color: 'text-violet-400 border-violet-400/20 bg-violet-400/10' },
  running:    { label: 'Running',    color: 'text-cyan-400   border-cyan-400/20   bg-cyan-400/10'   },
  completed:  { label: 'Complete',   color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' },
  failed:     { label: 'Failed',     color: 'text-rose-400   border-rose-400/20   bg-rose-400/10'   },
};

export default function RedesignPage() {
  const queryClient = useQueryClient();
  const { rooms, activeRoomId, addRoomRedesign } = useRoomStore();
  const toast = useToastStore();

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const [selectedStyle, setSelectedStyle] = useState('Japandi Harmony');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeRedesign, setActiveRedesign] = useState<RedesignResult | null>(null);
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);

  // Load the most recent completed redesign if history exists
  useEffect(() => {
    if (activeRoom?.redesigns && activeRoom.redesigns.length > 0) {
      const completed = activeRoom.redesigns.filter(
        (r) => r.status === 'completed'
      );
      setActiveRedesign(completed[completed.length - 1] ?? null);
    } else {
      setActiveRedesign(null);
    }
  }, [activeRoom]);

  // ── Celery job polling ─────────────────────────────────────────────────
  const { status: jobStatus, isPolling } = useRedesignPolling({
    jobId: pendingJobId,
    roomId: activeRoom?.id ?? null,
    enabled: !!pendingJobId,
    onComplete: (result) => {
      setActiveRedesign(result);
      setPendingJobId(null);
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => {
      setPendingJobId(null);
    },
  });

  // ── Inspiration retrieval ──────────────────────────────────────────────
  const { data: inspirations } = useQuery({
    queryKey: ['inspirations', selectedStyle],
    queryFn: () =>
      retrievalService.getInspirations(
        `${selectedStyle} interior design`,
        selectedStyle
      ),
    // Fallback to static images if backend unavailable
    placeholderData: [],
    staleTime: 10 * 60 * 1000,
  });

  // Curated fallback inspirations (shown when backend returns empty)
  const fallbackInspirations = [
    { name: 'Japandi Wood',     img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80' },
    { name: 'Minimalist Cozy', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
    { name: 'Biophilic Office', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80' },
  ];

  const displayInspirations =
    inspirations && inspirations.length > 0
      ? inspirations.slice(0, 3).map((url, i) => ({
          name: DESIGN_CHIPS[i]?.label ?? `Style ${i + 1}`,
          img: url,
        }))
      : fallbackInspirations;

  // ── Redesign generation mutation ───────────────────────────────────────
  const redesignMutation = useMutation({
    mutationFn: async () => {
      if (!activeRoom) throw new Error('No room selected.');
      return redesignService.generateRedesign(
        activeRoom.id,
        selectedStyle,
        customPrompt || `Redesign space using ${selectedStyle} elements`,
        activeRoom.imageUrl
      );
    },
    onSuccess: (pendingJob) => {
      setPendingJobId(pendingJob.id);
      // Optimistically add pending redesign to store
      if (activeRoom) {
        addRoomRedesign(activeRoom.id, pendingJob);
      }
      toast.info('Redesign queued — AI pipeline is warming up…');
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { message?: string })?.message ||
          'Failed to start redesign. Please try again.'
      );
    },
  });

  if (!activeRoom) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="glass-panel border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                No Active Environment Found
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Please upload a room image to trigger generative redesign.
              </p>
            </div>
            <Link
              href="/upload"
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center space-x-1 shadow-md cursor-pointer"
            >
              <span>Upload Room Photo</span>
            </Link>
          </div>
        </PageContainer>
      </DashboardShell>
    );
  }

  const isGenerating =
    redesignMutation.isPending ||
    isPolling ||
    ['pending', 'generating', 'running'].includes(jobStatus ?? '');

  return (
    <DashboardShell>
      <PageContainer>
        {/* Top navigation bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 border border-border bg-card hover:bg-muted/40 text-foreground rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">
                  {activeRoom.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] font-bold text-violet-400 uppercase">
                  Generative Redesign Workstation
                </span>
                {/* Live job status badge */}
                {jobStatus && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded border text-[9px] font-bold uppercase',
                      STATUS_CONFIG[jobStatus]?.color
                    )}
                  >
                    {STATUS_CONFIG[jobStatus]?.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Apply structural themes using prompt instruction nodes
              </p>
            </div>
          </div>

          <Link
            href="/research"
            className="px-4 py-2 border border-border bg-card hover:bg-muted/40 text-foreground text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>View Spatial Diagnostics</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Before/After Slider */}
          <div className="lg:col-span-7 space-y-6">
            {isGenerating ? (
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-dashed border-primary/40 bg-slate-950 flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent animate-pulse pointer-events-none" />

                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                  <Sparkles className="h-8 w-8 text-primary animate-spin" />
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">
                  {jobStatus === 'pending'
                    ? 'Job Queued — Waiting for GPU…'
                    : 'Executing Diffusion Model Pipelines…'}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Rendering 4K textures, matching depth geometry values, and
                  structuring room layout.
                </p>

                <div className="mt-6 flex items-center space-x-2 text-[10px] text-muted-foreground font-semibold px-3 py-1 bg-muted/30 border border-border rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Est. Time remaining: 5–15 seconds</span>
                </div>
              </div>
            ) : activeRedesign?.status === 'failed' ? (
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-dashed border-rose-500/40 bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-rose-500/10 rounded-2xl mb-4 text-rose-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  Generation Failed
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  The AI pipeline encountered an error. Please try again with a
                  different style or prompt.
                </p>
                <button
                  onClick={() => redesignMutation.mutate()}
                  className="mt-4 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/20 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry Generation</span>
                </button>
              </div>
            ) : activeRedesign?.redesignedImageUrl ? (
              <div className="space-y-4">
                <BeforeAfterSlider
                  beforeImage={activeRedesign.originalImageUrl}
                  afterImage={activeRedesign.redesignedImageUrl}
                  afterLabel={activeRedesign.style}
                />

                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    Generated:{' '}
                    {new Date(activeRedesign.createdAt).toLocaleTimeString()}
                  </span>

                  <a
                    href={activeRedesign.redesignedImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all text-slate-300 hover:text-white cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Draft</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-dashed border-border bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-muted/40 rounded-2xl mb-4 text-muted-foreground">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  Redesign Preview Screen
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Select a style preset and add prompt directives to generate
                  redesigned room concepts.
                </p>
              </div>
            )}

            {/* Inspiration gallery */}
            <div className="glass-panel border rounded-3xl p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Aesthetic Style Inspirations
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Curated render grids from leading design houses
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {displayInspirations.map((insp) => (
                  <div
                    key={insp.name}
                    className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/5 bg-slate-950"
                  >
                    <img
                      src={insp.img}
                      alt={insp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-[9px] font-bold text-white text-center truncate">
                      {insp.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Config panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel border rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Style Directives
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Inject style parameters to the generative canvas
                </p>
              </div>

              {/* Style chips */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Aesthetic Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DESIGN_CHIPS.map((chip) => (
                    <button
                      key={chip.name}
                      type="button"
                      onClick={() => setSelectedStyle(chip.name)}
                      disabled={isGenerating}
                      className={cn(
                        'p-2.5 rounded-xl border text-[11px] font-bold transition-all text-left truncate cursor-pointer',
                        selectedStyle === chip.name
                          ? 'border-primary/40 bg-primary/10 text-primary font-extrabold shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      )}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom prompt */}
              <div className="space-y-2">
                <label
                  htmlFor="redesign-prompt-input"
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
                >
                  Additional Style Prompt Instructions
                </label>
                <textarea
                  id="redesign-prompt-input"
                  value={customPrompt}
                  onChange={(e) =>
                    setCustomPrompt(e.target.value.slice(0, 300))
                  }
                  placeholder="e.g., Replace the sofa fabric with textured beige linen, add wood ceiling slats..."
                  disabled={isGenerating}
                  className="w-full min-h-[90px] p-3 rounded-xl bg-input border border-border text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Generate button */}
              <button
                id="redesign-generate-btn"
                onClick={() => redesignMutation.mutate()}
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isGenerating
                    ? 'Generating Design…'
                    : 'Compose AI Redesign Draft'}
                </span>
              </button>
            </div>

            {/* Suggestions panel */}
            {activeRedesign?.suggestions && activeRedesign.suggestions.length > 0 && (
              <div className="glass-panel border rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Suggestions for Implementation
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Action items computed from the redesigned concepts
                  </p>
                </div>

                <ul className="space-y-3">
                  {activeRedesign.suggestions.map(
                    (suggestion: string, idx: number) => (
                      <li
                        key={idx}
                        className="p-3 bg-muted/20 border border-border rounded-xl flex items-start space-x-2.5 text-xs text-muted-foreground"
                      >
                        <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="leading-normal">{suggestion}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
