'use client';

import React, { useState } from 'react';
import { Camera, ChevronRight, Sparkles, Eye } from 'lucide-react';
import { CameraGuidanceModal } from './CameraGuidanceModal';

export function CameraGuidanceBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-cyan-950/40 border border-violet-500/20 backdrop-blur-md relative overflow-hidden transition-all hover:border-violet-500/40">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Camera className="h-4 w-4 text-cyan-400" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">
                  📸 Photo Angle Guide
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-300">
                  <Sparkles className="h-3 w-3" /> 99%+ AI Accuracy
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hold phone at chest height (4ft–4.5ft) facing diagonally across the room for perfect 3D detection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>View Guide</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Guidance Modal */}
      <CameraGuidanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
