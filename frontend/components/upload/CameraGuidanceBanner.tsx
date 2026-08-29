'use client';

import React, { useState } from 'react';
import { Camera, ChevronRight, Sparkles, Eye } from 'lucide-react';
import { CameraGuidanceModal } from './CameraGuidanceModal';

export function CameraGuidanceBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-sm relative overflow-hidden transition-all hover:border-[#D4AF37]/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B] shrink-0">
              <Camera className="h-4 w-4 text-[#B8860B]" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1F1A17]">
                  📸 Photo Angle Guide
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-semibold text-[#B8860B]">
                  <Sparkles className="h-3 w-3" /> 99%+ AI Accuracy
                </span>
              </div>
              <p className="text-[11px] text-[#6E655F]">
                Hold phone at chest height (4ft–4.5ft) facing diagonally across the room for perfect 3D detection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4F0EA] hover:bg-[#EAE4DC] border border-[#E8E2D8] text-[#1F1A17] text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-[#B8860B]" />
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
