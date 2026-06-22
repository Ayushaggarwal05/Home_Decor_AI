import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Grid, Award, Layers } from 'lucide-react';
import FadeIn from '../animations/FadeIn';

interface AnalyticsSummaryProps {
  totalRooms: number;
  averageScore: number;
  totalAssets: number;
}

export default function AnalyticsSummary({
  totalRooms,
  averageScore,
  totalAssets
}: AnalyticsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Rooms Mapped */}
      <FadeIn delay={0.05} direction="up">
        <div className="glass-panel border rounded-3xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-center text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
            <span>Spaces Mapped</span>
            <Grid className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black">{totalRooms}</span>
            <span className="text-xs text-muted-foreground">blueprints</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Active models initialized in sandbox</p>
        </div>
      </FadeIn>

      {/* Avg spatial score */}
      <FadeIn delay={0.1} direction="up">
        <div className="glass-panel border rounded-3xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-center text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
            <span>Friction Efficiency</span>
            <Award className="h-4 w-4 text-violet-400 group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black">{averageScore}%</span>
            <span className="text-xs text-muted-foreground">mean score</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Avg clearance paths alignment metric</p>
        </div>
      </FadeIn>

      {/* Labeled items */}
      <FadeIn delay={0.15} direction="up">
        <div className="glass-panel border rounded-3xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-center text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
            <span>Detected Furniture</span>
            <Layers className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black">{totalAssets}</span>
            <span className="text-xs text-slate-400">elements</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Identified objects via computer vision</p>
        </div>
      </FadeIn>
    </div>
  );
}
