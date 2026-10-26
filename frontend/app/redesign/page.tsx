'use client';

import React, { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { redesignService } from '@/services/redesign.service';
import { optimizationService } from '@/services/optimization.service';
import { retrievalService } from '@/services/retrieval.service';
import { useRedesignPolling } from '@/hooks/useRedesignPolling';
import { useToastStore } from '@/store/toastStore';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import BeforeAfterSlider from '@/components/comparison/BeforeAfterSlider';
import BlueprintSelector from '@/components/blueprint/BlueprintSelector';
import BlueprintFloorplan from '@/components/blueprint/BlueprintFloorplan';
import BlueprintModal from '@/components/blueprint/BlueprintModal';
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
  Layers,
  Wand2,
  Maximize2,
  Move,
  Users,
  Sun,
  Eye,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { RedesignResult, RoomBlueprint } from '@/types';

const ARCHETYPE_ICONS: Record<string, React.ElementType> = {
  flow: Move,
  symmetry: Compass,
  open: Maximize2,
  conversation: Users,
  lighting: Sun,
  alternative: Layers,
};

const ARCHETYPE_COLORS: Record<string, string> = {
  flow: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  symmetry: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  open: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  conversation: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  lighting: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  alternative: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

const DESIGN_CHIPS = [
  { name: 'Japandi Harmony', label: 'Japandi' },
  { name: 'Scandinavian Crisp', label: 'Nordic Scandinavian' },
  { name: 'Industrial Loft', label: 'Industrial Raw' },
  { name: 'Modern Biophilic', label: 'Biophilic Planted' },
  { name: 'Mid-Century Chic', label: 'Mid-Century Modern' },
  { name: 'Parisian Luxury', label: 'Classical Parisian' },
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
  const [selectedBlueprint, setSelectedBlueprint] = useState<RoomBlueprint | null>(null);
  const [modalBlueprint, setModalBlueprint] = useState<RoomBlueprint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stageViewMode, setStageViewMode] = useState<'render' | 'blueprint'>('blueprint');

  // Load the most recent completed redesign if history exists
  useEffect(() => {
    if (activeRoom?.redesigns && activeRoom.redesigns.length > 0) {
      const completed = activeRoom.redesigns.filter(
        (r) => r.status === 'completed'
      );
      if (completed.length > 0) {
        setActiveRedesign(completed[completed.length - 1] ?? null);
        setStageViewMode('render');
      } else {
        setActiveRedesign(null);
      }
    } else {
      setActiveRedesign(null);
    }
  }, [activeRoom]);

  // ── 1. Fetch Candidate Blueprints for Active Room ──────────────────────
  const { 
    data: optimizationData, 
    isLoading: isLoadingBlueprints,
    refetch: refetchBlueprints 
  } = useQuery({
    queryKey: ['room-blueprints', activeRoom?.id],
    queryFn: () => optimizationService.getRoomBlueprints(activeRoom.id),
    enabled: !!activeRoom?.id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || data.status === 'pending' || data.status === 'running' || !data.blueprints || data.blueprints.length === 0) {
        return 2000;
      }
      return false;
    },
  });

  // Auto-select first blueprint once loaded
  useEffect(() => {
    if (optimizationData?.blueprints && optimizationData.blueprints.length > 0 && !selectedBlueprint) {
      setSelectedBlueprint(optimizationData.blueprints[0]);
    }
  }, [optimizationData, selectedBlueprint]);

  // ── 2. Celery job polling ──────────────────────────────────────────────
  const { status: jobStatus, isPolling } = useRedesignPolling({
    jobId: pendingJobId,
    roomId: activeRoom?.id ?? null,
    enabled: !!pendingJobId,
    onComplete: (result) => {
      setActiveRedesign(result);
      setPendingJobId(null);
      setStageViewMode('render');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room redesign rendered successfully with Gemini!');
    },
    onError: () => {
      setPendingJobId(null);
    },
  });

  // ── 3. Inspiration retrieval ───────────────────────────────────────────
  const { data: inspirations } = useQuery({
    queryKey: ['inspirations', selectedStyle],
    queryFn: () =>
      retrievalService.getInspirations(
        `${selectedStyle} interior design`,
        selectedStyle
      ),
    placeholderData: [],
    staleTime: 10 * 60 * 1000,
  });

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

  // ── 4. Redesign generation mutation ────────────────────────────────────
  const redesignMutation = useMutation({
    mutationFn: async () => {
      if (!activeRoom) throw new Error('No room selected.');
      return redesignService.generateRedesign(
        activeRoom.id,
        selectedStyle,
        customPrompt || `Redesign space using ${selectedStyle} elements`,
        activeRoom.imageUrl,
        selectedBlueprint?.id,
        selectedBlueprint?.layout
      );
    },
    onSuccess: (pendingJob) => {
      setPendingJobId(pendingJob.id);
      if (activeRoom) {
        addRoomRedesign(activeRoom.id, pendingJob);
      }
      toast.info('Redesign queued — Gemini AI rendering engine active…');
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
      <PageContainer className="space-y-8">
        {/* Top navigation bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/studio"
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
                  Blueprint & Redesign Workstation
                </span>
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
                Choose a verified 2D floorplan blueprint, pick an aesthetic style, and render on-demand with Gemini AI
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

        {/* ── STAGE 1: 2D BLUEPRINT SELECTION (5 At A Time With Pagination) ── */}
        <section className="space-y-4">
          <BlueprintSelector
            blueprints={optimizationData?.blueprints || []}
            selectedBlueprintId={selectedBlueprint?.id ?? null}
            onSelectBlueprint={(bp) => {
              setSelectedBlueprint(bp);
              setStageViewMode('blueprint');
            }}
            onPreviewBlueprint={(bp) => {
              setModalBlueprint(bp);
              setIsModalOpen(true);
            }}
            isLoading={isLoadingBlueprints || optimizationData?.status === 'pending' || optimizationData?.status === 'running'}
            onRetry={() => refetchBlueprints()}
          />
        </section>

        {/* ── STAGE 2: GENERATION STUDIO & BEFORE/AFTER CANVAS ─────────────── */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-bold text-violet-400 uppercase tracking-wider">
              Step 2: AI Photographic Render
            </span>
            <span className="text-xs text-muted-foreground">
              • Applied to {selectedBlueprint ? `"${selectedBlueprint.title}"` : 'Selected Blueprint'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Before/After Slider, Blueprint Stage, or Generation Progress */}
            <div className="lg:col-span-7 space-y-4">
              {/* Optional View Switcher Tabs (when activeRedesign exists and not generating) */}
              {activeRedesign?.redesignedImageUrl && !isGenerating && (
                <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setStageViewMode('render')}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer',
                        stageViewMode === 'render'
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-muted-foreground hover:text-white'
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Photorealistic Render</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageViewMode('blueprint')}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer',
                        stageViewMode === 'blueprint'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-white'
                      )}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>2D Blueprint Floorplan</span>
                    </button>
                  </div>

                  {selectedBlueprint && (
                    <button
                      type="button"
                      onClick={() => {
                        setModalBlueprint(selectedBlueprint);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cyan-300 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Full Screen</span>
                    </button>
                  )}
                </div>
              )}

              {isGenerating ? (
                <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-dashed border-primary/40 bg-slate-950 flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent animate-pulse pointer-events-none" />

                  <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                    <Sparkles className="h-8 w-8 text-primary animate-spin" />
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">
                    {jobStatus === 'pending'
                      ? 'Job Queued — Ingesting Blueprint Geometry…'
                      : 'Gemini Rendering Photorealistic Room Redesign…'}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Preserving wall architecture, matching floor surfaces, and applying {selectedStyle} materials.
                  </p>

                  <div className="mt-6 flex items-center space-x-2 text-[10px] text-muted-foreground font-semibold px-3 py-1 bg-muted/30 border border-border rounded-lg">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Est. generation time: 5–15 seconds</span>
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
                    The AI pipeline encountered an issue. Please retry.
                  </p>
                  <button
                    onClick={() => redesignMutation.mutate()}
                    className="mt-4 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/20 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry Generation</span>
                  </button>
                </div>
              ) : activeRedesign?.redesignedImageUrl && stageViewMode === 'render' ? (
                <div className="space-y-4">
                  <BeforeAfterSlider
                    beforeImage={activeRedesign.originalImageUrl}
                    afterImage={activeRedesign.redesignedImageUrl}
                    beforeLabel="Original Room"
                    afterLabel={`${activeRedesign.style} Render`}
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-2">
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                      Generated with Gemini • {new Date(activeRedesign.createdAt).toLocaleTimeString()}
                    </span>

                    <div className="flex items-center space-x-2">
                      {selectedBlueprint && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalBlueprint(selectedBlueprint);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>Full Screen Blueprint</span>
                        </button>
                      )}
                      <a
                        href={activeRedesign.redesignedImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Render</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : selectedBlueprint ? (
                /* ── SELECTED BLUEPRINT VISIBLE DIRECTLY ON STAGE WITH FULLSCREEN BUTTON ── */
                <div className="space-y-4">
                  <div className="rounded-3xl border border-cyan-500/30 bg-[#060911] p-4 sm:p-5 shadow-2xl shadow-cyan-950/30 space-y-4 relative overflow-hidden group">
                    {/* Stage Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        {(() => {
                          const ArchetypeIcon = ARCHETYPE_ICONS[selectedBlueprint.archetype] || Layers;
                          const badgeColor = ARCHETYPE_COLORS[selectedBlueprint.archetype] || ARCHETYPE_COLORS.alternative;
                          return (
                            <span className={cn('px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1.5', badgeColor)}>
                              <ArchetypeIcon className="h-3.5 w-3.5" />
                              <span>{selectedBlueprint.badge || selectedBlueprint.title}</span>
                            </span>
                          );
                        })()}
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                            {selectedBlueprint.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {selectedBlueprint.description}
                          </p>
                        </div>
                      </div>

                      {/* Full Screen Preview Button Requested by User */}
                      <button
                        type="button"
                        onClick={() => {
                          setModalBlueprint(selectedBlueprint);
                          setIsModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md hover:shadow-cyan-900/50"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Full Screen Preview</span>
                      </button>
                    </div>

                    {/* Prominent Architectural Blueprint Canvas */}
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#090d16]">
                      <BlueprintFloorplan
                        layout={selectedBlueprint.layout}
                        roomLength={activeRoom?.dimensions?.length || 16}
                        roomWidth={activeRoom?.dimensions?.width || 20}
                        showDimensions={true}
                        className="w-full aspect-[16/10] sm:aspect-[16/9]"
                      />

                      {/* Floating Fullscreen Trigger on Canvas */}
                      <button
                        type="button"
                        onClick={() => {
                          setModalBlueprint(selectedBlueprint);
                          setIsModalOpen(true);
                        }}
                        className="absolute bottom-3 right-3 z-30 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 text-xs font-semibold text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-lg backdrop-blur-sm cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Expand Blueprint Full View</span>
                      </button>
                    </div>

                    {/* Bottom Blueprint Diagnostic Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                        <span className="text-[10px] text-muted-foreground">Corridor Flow</span>
                        <span className="text-sm font-bold text-cyan-400">{selectedBlueprint.scores?.flow ?? 90}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                        <span className="text-[10px] text-muted-foreground">Clearance</span>
                        <span className="text-sm font-bold text-emerald-400">{selectedBlueprint.scores?.accessibility ?? 88}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                        <span className="text-[10px] text-muted-foreground">Axial Balance</span>
                        <span className="text-sm font-bold text-violet-400">{selectedBlueprint.scores?.symmetry ?? 85}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                        <span className="text-[10px] text-muted-foreground">Daylight Clear</span>
                        <span className="text-sm font-bold text-amber-400">{selectedBlueprint.scores?.lighting ?? 92}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>Blueprint locked into AI pipeline. Configure aesthetic style on the right and click <strong>&quot;Generate AI Redesign with Gemini&quot;</strong>.</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-dashed border-border bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="p-4 bg-muted/40 rounded-2xl text-muted-foreground">
                    <Wand2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Photorealistic Render Stage
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mt-1">
                      Choose your favorite blueprint above and click <strong>&quot;Generate AI Redesign with Gemini&quot;</strong> to see your room transformed.
                    </p>
                  </div>
                </div>
              )}

              {/* Inspiration gallery */}
              <div className="glass-panel border rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Aesthetic Style Moodboards
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Curated reference palettes matching {selectedStyle}
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

            {/* RIGHT: Config panel & Gemini Trigger */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel border rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Styling Directives & Execution
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Configure aesthetic finishes for your chosen blueprint
                  </p>
                </div>

                {/* Selected Blueprint Indicator Banner */}
                {selectedBlueprint ? (
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                      <span>Target Blueprint: {selectedBlueprint.title}</span>
                      <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                        {selectedBlueprint.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {selectedBlueprint.description}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    Select a floorplan blueprint from Step 1 above to anchor furniture placement.
                  </div>
                )}

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
                    Custom Prompt Modifications (Optional)
                  </label>
                  <textarea
                    id="redesign-prompt-input"
                    value={customPrompt}
                    onChange={(e) =>
                      setCustomPrompt(e.target.value.slice(0, 300))
                    }
                    placeholder="e.g., Replace the sofa fabric with beige linen, add light wood slat accents..."
                    disabled={isGenerating}
                    className="w-full min-h-[85px] p-3 rounded-xl bg-input border border-border text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Generate button */}
                <button
                  id="redesign-generate-btn"
                  onClick={() => redesignMutation.mutate()}
                  disabled={isGenerating || !selectedBlueprint}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">
                      {isGenerating
                        ? 'Rendering with Gemini AI…'
                        : 'Generate AI Redesign with Gemini'}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/70 font-normal mt-0.5">
                    {selectedBlueprint ? `Renders layout "${selectedBlueprint.title}"` : 'Select a blueprint first'}
                  </span>
                </button>
              </div>

              {/* Suggestions panel */}
              {activeRedesign?.suggestions && activeRedesign.suggestions.length > 0 && (
                <div className="glass-panel border rounded-3xl p-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Blueprint Implementation Advice
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Actionable decor steps computed from your layout
                    </p>
                  </div>

                  <ul className="space-y-2.5">
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
        </section>

        {/* ── HIGH-RESOLUTION FULL-SCREEN BLUEPRINT PREVIEW MODAL ── */}
        <BlueprintModal
          blueprint={modalBlueprint}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(bp) => {
            setSelectedBlueprint(bp);
            setModalBlueprint(bp);
            setStageViewMode('blueprint');
          }}
          isSelected={selectedBlueprint?.id === modalBlueprint?.id}
          roomLength={activeRoom?.dimensions?.length || 16}
          roomWidth={activeRoom?.dimensions?.width || 20}
        />
      </PageContainer>
    </DashboardShell>
  );
}
