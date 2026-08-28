"use client";

import { Camera, X, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface CameraGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraGuidanceModal({
  isOpen,
  onClose,
}: CameraGuidanceModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

        {/* Header (Fixed at top) */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <Camera className="h-3.5 w-3.5 text-cyan-400" />
              <span>AI Spatial Precision Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              How to Take Photos for 99%+ AI Accuracy
            </h2>
            <p className="text-xs text-slate-400">
              Follow these 3 simple camera habits for instant, highly accurate 3D spatial mapping.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
          {/* 3 Core Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="h-8 w-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-200">
                Chest Height Level
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hold phone straight at chest height (4ft–4.5ft). Keep camera parallel to walls without tilting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-200">
                Diagonal Corner View
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Stand near a doorway or corner looking diagonally across so 2 to 3 walls are visible.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-200">
                Clear Side Lighting
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Light room evenly from lamps/windows beside you. Avoid obstacle lens blockages.
              </p>
            </div>
          </div>

          {/* Visual Do's & Don'ts Comparison */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Visual Angle Comparison
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* DO */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Check className="h-4 w-4 bg-emerald-500/20 rounded-full p-0.5" />
                  <span>RECOMMENDED (Optimal AI Perception)</span>
                </div>

                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-emerald-500/30 shadow-md">
                  <Image
                    src="/images/guidance/recommended_room.jpg"
                    alt="Recommended Camera Angle"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    ✓ Chest-Height Corner View
                  </div>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>Chest-height straight view showing floor depth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>2 to 3 walls visible to calculate room dimensions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span>Foreground and background furniture distinct</span>
                  </li>
                </ul>
              </div>

              {/* DON'T */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <AlertTriangle className="h-4 w-4 bg-rose-500/20 rounded-full p-0.5" />
                  <span>AVOID (Reduces AI Accuracy)</span>
                </div>

                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-rose-500/30 shadow-md">
                  <Image
                    src="/images/guidance/avoid_bad_angle.jpg"
                    alt="Avoid Bad Camera Angle"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-rose-950/90 border border-rose-500/40 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    ✗ Steep Downward Tilt
                  </div>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <span>Steep downward tilt looking only at carpet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <span>Extreme close-up of a single chair or table</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <span>Direct glare or lens blocked by objects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Fixed at bottom of modal card, outside scroll container) */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>99.4% Multi-Model Spatial Perception Accuracy</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-95 transition-all cursor-pointer"
          >
            Got it, Let&apos;s Upload
          </button>
        </div>
      </div>
    </div>
  );
}
