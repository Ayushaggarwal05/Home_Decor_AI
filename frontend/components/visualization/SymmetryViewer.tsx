'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Compass } from 'lucide-react';

interface SymmetryViewerProps {
  score: number;
}

export default function SymmetryViewer({ score }: SymmetryViewerProps) {
  const { uiPreferences } = useRoomStore();

  if (!uiPreferences.showSymmetryAxes) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none border-2 border-violet-500/20">
      {/* Center Vertical Axis */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dashed border-violet-500/40">
        <span className="absolute top-4 left-2 px-1.5 py-0.5 rounded bg-violet-600/90 text-white font-bold text-[8px] uppercase tracking-widest whitespace-nowrap">
          V-Axis Center
        </span>
      </div>

      {/* Center Horizontal Axis */}
      <div className="absolute left-0 right-0 top-1/2 h-px border-t-2 border-dashed border-violet-500/40">
        <span className="absolute left-4 top-2 px-1.5 py-0.5 rounded bg-violet-600/90 text-white font-bold text-[8px] uppercase tracking-widest whitespace-nowrap">
          H-Axis Center
        </span>
      </div>

      {/* Quarter Alignment Reference Lines */}
      <div className="absolute top-0 bottom-0 left-1/4 w-px border-l border-dotted border-violet-500/20" />
      <div className="absolute top-0 bottom-0 right-1/4 w-px border-l border-dotted border-violet-500/20" />

      {/* Center Balance Focal Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-violet-400/40 flex items-center justify-center bg-violet-950/20 backdrop-blur-xs">
        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
      </div>

      {/* Spatial Balance Readout Badge */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/10 text-[9px] font-bold uppercase tracking-wider">
        <Compass className="h-3.5 w-3.5 text-violet-400" />
        <span>Balance Index: <strong className="text-violet-400">{score}%</strong></span>
      </div>
    </div>
  );
}
