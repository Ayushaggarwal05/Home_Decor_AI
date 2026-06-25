'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { useRoomPolling } from '@/hooks/useRoomPolling';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import MetricGauge from '@/components/scoring/MetricGauge';
import OptimizationBreakdown from '@/components/scoring/OptimizationBreakdown';
import ClutterMeter from '@/components/scoring/ClutterMeter';
import DetectionOverlay from '@/components/visualization/DetectionOverlay';
import SymmetryViewer from '@/components/visualization/SymmetryViewer';
import OccupancyGrid from '@/components/visualization/OccupancyGrid';
import HeatmapViewer from '@/components/visualization/HeatmapViewer';
import RadarMetricChart from '@/components/charts/RadarMetricChart';
import RoomDetails from '@/components/room/RoomDetails';
import FadeIn from '@/components/animations/FadeIn';
import Link from 'next/link';
import { 
  Compass, 
  Settings2, 
  Sparkles, 
  ArrowLeft,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResearchStudioPage() {
  const { 
    rooms, 
    activeRoomId, 
    uiPreferences, 
    toggleUIPreference 
  } = useRoomStore();

  // Retrieve active room or fallback to first
  const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  // Poll for spatial analysis updates from Redis/Celery backend
  const { isPolling } = useRoomPolling({
    roomId: activeRoom?.id || null,
    enabled: !!activeRoom,
  });

  if (isPolling) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="glass-panel border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 bg-slate-950/40 min-h-[400px]">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-t-2 border-cyan-400 border-r-2 border-r-transparent animate-spin" />
              <Compass className="h-6 w-6 text-cyan-400 absolute animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-foreground">Computing Spatial Analytics</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Our neural engine is analyzing spatial coordinates, tracing symmetry axes, and generating occupancy grids. This should take just a moment...
              </p>
            </div>
          </div>
        </PageContainer>
      </DashboardShell>
    );
  }

  if (!activeRoom || !activeRoom.analysis) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="glass-panel border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
              <Compass className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">No Active Spatial Scan Found</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Please upload a room image to compute spatial analytics and view occupancy details.
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

  const { analysis } = activeRoom;

  return (
    <DashboardShell>
      <PageContainer>
        {/* Navigation Info Bar */}
        <FadeIn delay={0.05} direction="down">
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
                  <h3 className="text-base font-bold text-slate-100">{activeRoom.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-400 uppercase">
                    Research Studio
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Indexed layout dimensions: <strong>{activeRoom.dimensions?.length}x{activeRoom.dimensions?.width} {activeRoom.dimensions?.unit}</strong>
                </p>
              </div>
            </div>

            {/* Quick toggle to Redesign Page */}
            <Link
              href="/redesign"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Generative Redesign</span>
            </Link>
          </div>
        </FadeIn>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT AREA: Canvas / Image overlays (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <FadeIn delay={0.1} direction="up">
              <div className="relative rounded-3xl overflow-hidden glass-panel border aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950">
                {/* Ground Image Layer */}
                <img
                  src={activeRoom.imageUrl}
                  alt="Original Room Environment Scan"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Dim filter */}
                <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

                {/* Occupancy Grid Blocks */}
                <OccupancyGrid map={analysis.occupancyMap} />

                {/* Heatmap overlay glow */}
                <HeatmapViewer map={analysis.occupancyMap} />

                {/* Object Detection boxes */}
                <DetectionOverlay detections={analysis.detections} />

                {/* Symmetry grid alignment line axes */}
                <SymmetryViewer score={analysis.symmetryScore} />
              </div>
            </FadeIn>

            {/* Interactive Overlay Toggles Toolbar */}
            <FadeIn delay={0.15} direction="up">
              <div className="glass-panel border rounded-3xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
                  <Settings2 className="h-4 w-4 text-cyan-400" />
                  <span>Overlay Diagnostic Filters:</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { key: 'showDetections', label: 'Bounding Boxes', color: 'bg-cyan-500' },
                    { key: 'showGridOverlay', label: 'Occupancy Grid', color: 'bg-rose-500' },
                    { key: 'showHeatmap', label: 'Flow Path Heatmap', color: 'bg-pink-500' },
                    { key: 'showSymmetryAxes', label: 'Symmetry Guides', color: 'bg-violet-500' }
                  ].map((toggle) => {
                    const isActive = uiPreferences[toggle.key as keyof typeof uiPreferences];
                    return (
                      <button
                        key={toggle.key}
                        onClick={() => toggleUIPreference(toggle.key as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1.5",
                          isActive 
                            ? "border-primary/30 bg-primary/10 text-primary shadow-[0_2px_12px_-3px_rgba(139,92,246,0.25)]" 
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isActive ? toggle.color : "bg-muted-foreground")} />
                        <span>{toggle.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {/* Diagnostic reasoning details */}
            <FadeIn delay={0.2} direction="up">
              <div className="glass-panel border rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Layout Reasoning & Observation Diagnostics</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Computer vision spatial logic recommendations
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysis.reasoning.map((item) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "p-4 border rounded-2xl flex items-start space-x-3 text-xs leading-normal transition-colors",
                        item.type === 'positive' && "border-green-500/10 bg-green-500/5 text-slate-300",
                        item.type === 'warning' && "border-amber-500/15 bg-amber-500/5 text-slate-300",
                        item.type === 'improvement' && "border-cyan-500/10 bg-cyan-500/5 text-slate-300"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'positive' && <CheckCircle className="h-4.5 w-4.5 text-green-500" />}
                        {item.type === 'warning' && <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />}
                        {item.type === 'improvement' && <Info className="h-4.5 w-4.5 text-cyan-400" />}
                      </div>
                      <div>
                        <h5 className="font-bold text-foreground">{item.title}</h5>
                        <p className="text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT AREA: Score statistics cards (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overall Score Circle Gauge */}
            <FadeIn delay={0.25} direction="up">
              <div className="glass-panel border rounded-3xl p-6 flex flex-col items-center">
                <MetricGauge score={analysis.scores.overall} />
              </div>
            </FadeIn>

            {/* Room metadata details */}
            <FadeIn delay={0.3} direction="up">
              <RoomDetails room={activeRoom} />
            </FadeIn>

            {/* Metric progress bars */}
            <FadeIn delay={0.35} direction="up">
              <OptimizationBreakdown scores={analysis.scores} />
            </FadeIn>

            {/* Pentagon Radar Chart visualization */}
            <FadeIn delay={0.4} direction="up">
              <RadarMetricChart scores={analysis.scores} />
            </FadeIn>

            {/* Clutter level checks */}
            <FadeIn delay={0.45} direction="up">
              <ClutterMeter clutterLevel={analysis.clutterLevel} rawScore={analysis.scores.clutter} />
            </FadeIn>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
