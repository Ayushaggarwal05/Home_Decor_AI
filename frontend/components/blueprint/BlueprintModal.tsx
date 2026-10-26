'use client';

import React, { useEffect } from 'react';
import { RoomBlueprint } from '@/types';
import BlueprintFloorplan from './BlueprintFloorplan';
import { 
  X, 
  Check, 
  Sparkles, 
  Move, 
  Compass, 
  Maximize2, 
  Users, 
  Sun, 
  Layers, 
  ShieldCheck, 
  Activity, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlueprintModalProps {
  blueprint: RoomBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (blueprint: RoomBlueprint) => void;
  isSelected?: boolean;
  roomLength?: number;
  roomWidth?: number;
}

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

export default function BlueprintModal({
  blueprint,
  isOpen,
  onClose,
  onSelect,
  isSelected = false,
  roomLength = 16,
  roomWidth = 20,
}: BlueprintModalProps) {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !blueprint) return null;

  const ArchetypeIcon = ARCHETYPE_ICONS[blueprint.archetype] || Layers;
  const badgeColor = ARCHETYPE_COLORS[blueprint.archetype] || ARCHETYPE_COLORS.alternative;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <span className={cn('inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs font-bold', badgeColor)}>
              <ArchetypeIcon className="h-4 w-4" />
              <span>{blueprint.badge || blueprint.title}</span>
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {blueprint.title}
                {isSelected && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Active Target
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Architectural 2D Layout Plan • {roomLength}′ × {roomWidth}′ Room Geometry
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onSelect && !isSelected && (
              <button
                type="button"
                onClick={() => {
                  onSelect(blueprint);
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Select this Blueprint</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split 2-Column Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Full Architectural Blueprint Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative w-full rounded-2xl border border-cyan-500/30 bg-[#060911] p-3 shadow-inner overflow-hidden">
              <BlueprintFloorplan
                layout={blueprint.layout}
                roomLength={roomLength}
                roomWidth={roomWidth}
                showDimensions={true}
                className="aspect-[4/3] w-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                Collision-free verified layout (NSGA-II Genetic Solver)
              </span>
              <span className="font-mono text-cyan-400/80">
                {blueprint.layout.length} Spatial Elements Positioned
              </span>
            </div>
          </div>

          {/* RIGHT: Spatial Metrics, Furniture Placements & Explainable Directives (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Layout Concept & Intent
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {blueprint.description}
              </p>
            </div>

            {/* Spatial Performance Scores */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-violet-400" />
                  Spatial Performance Scores
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {blueprint.scores?.overall ?? 90}% Match
                </span>
              </h4>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Walkway & Corridor Flow</span>
                    <span className="font-bold text-cyan-400">{blueprint.scores?.flow ?? 90}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
                      style={{ width: `${blueprint.scores?.flow ?? 90}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Door & Pathway Accessibility</span>
                    <span className="font-bold text-emerald-400">{blueprint.scores?.accessibility ?? 88}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${blueprint.scores?.accessibility ?? 88}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Visual Symmetry Balance</span>
                    <span className="font-bold text-violet-400">{blueprint.scores?.symmetry ?? 85}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-400 rounded-full transition-all duration-500" 
                      style={{ width: `${blueprint.scores?.symmetry ?? 85}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Window Daylight Preservation</span>
                    <span className="font-bold text-amber-400">{blueprint.scores?.lighting ?? 92}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${blueprint.scores?.lighting ?? 92}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Furniture Coordinate Placements */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Positioned Furniture Elements ({blueprint.layout.length})
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {blueprint.layout.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                  >
                    <span className="font-semibold text-slate-200">{item.label}</span>
                    <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-mono">
                      <span>Pos: ({Math.round(item.boundingBox.x)}%, {Math.round(item.boundingBox.y)}%)</span>
                      <span>Dim: {Math.round(item.boundingBox.width)}×{Math.round(item.boundingBox.height)}</span>
                      {item.rotation ? <span className="text-cyan-400">{item.rotation}°</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable Changes Directives */}
            {blueprint.suggestions && blueprint.suggestions.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Algorithm Rationale
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs text-slate-300 pr-1">
                  {blueprint.suggestions.map((sug) => (
                    <div key={sug.id} className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] leading-relaxed">
                      <strong className="text-cyan-300 block">{sug.title}</strong>
                      {sug.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground flex items-center space-x-1.5">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">ESC</kbd>
            <span>to close preview</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
            >
              Close
            </button>
            {onSelect && (
              <button
                type="button"
                onClick={() => {
                  onSelect(blueprint);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isSelected ? 'Proceed with this Blueprint' : 'Apply & Select Blueprint'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
