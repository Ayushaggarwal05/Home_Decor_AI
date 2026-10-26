'use client';

import React, { useState } from 'react';
import { RoomBlueprint } from '@/types';
import BlueprintFloorplan from './BlueprintFloorplan';
import { 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Move, 
  Maximize2, 
  Users, 
  Sun,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlueprintSelectorProps {
  blueprints: RoomBlueprint[];
  selectedBlueprintId: string | null;
  onSelectBlueprint: (blueprint: RoomBlueprint) => void;
  onPreviewBlueprint?: (blueprint: RoomBlueprint) => void;
  isLoading?: boolean;
  onRetry?: () => void;
}

const ARCHETYPE_ICONS = {
  flow: Move,
  symmetry: Compass,
  open: Maximize2,
  conversation: Users,
  lighting: Sun,
  alternative: Layers,
};

const ARCHETYPE_COLORS = {
  flow: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  symmetry: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  open: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  conversation: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  lighting: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  alternative: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

const PAGE_SIZE = 5;

export default function BlueprintSelector({
  blueprints,
  selectedBlueprintId,
  onSelectBlueprint,
  onPreviewBlueprint,
  isLoading = false,
  onRetry,
}: BlueprintSelectorProps) {
  const [page, setPage] = useState(0);

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-4">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <h4 className="text-sm font-bold text-foreground">
          Computing Verified Floorplan Blueprints…
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Genetic Algorithm is auditing pathway clearance, door swings, and symmetry axes to construct collision-free blueprints.
        </p>
      </div>
    );
  }

  if (!blueprints || blueprints.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-4">
        <div className="p-3 bg-muted/40 rounded-2xl w-fit mx-auto text-muted-foreground">
          <Layers className="h-7 w-7" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Generating Blueprints for this Space</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            Click below to calculate collision-free floorplan blueprints for this room environment.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center space-x-2 mx-auto shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Verified Blueprints</span>
          </button>
        )}
      </div>
    );
  }

  const total = blueprints.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentBlueprints = blueprints.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const startIndex = page * PAGE_SIZE + 1;
  const endIndex = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Step 1: Choose 2D Blueprint
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              • {total} Verified Collision-Free Layouts Found
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Select Your Preferred Room Floorplan
          </h3>
          <p className="text-xs text-muted-foreground">
            Review the 2D architectural blueprints below. Pick the layout you like best, then render it in photorealistic 3D.
          </p>
        </div>

        {/* Selected Blueprint Status */}
        {selectedBlueprintId && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1.5">
            <Check className="h-4 w-4" />
            <span>Blueprint Selected ✓</span>
          </div>
        )}
      </div>

      {/* Grid of 5 Blueprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {currentBlueprints.map((bp) => {
          const isSelected = selectedBlueprintId === bp.id;
          const ArchetypeIcon = ARCHETYPE_ICONS[bp.archetype] || Layers;
          const badgeColor = ARCHETYPE_COLORS[bp.archetype] || ARCHETYPE_COLORS.alternative;

          return (
            <div
              key={bp.id}
              onClick={() => onSelectBlueprint(bp)}
              className={cn(
                'group relative rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-card hover:bg-muted/30 shadow-sm',
                isSelected
                  ? 'border-primary ring-2 ring-primary/40 bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border hover:border-border/80'
              )}
            >
              {/* Card Top: Archetype Badge + Selection Indicator */}
              <div className="flex items-center justify-between gap-1">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold truncate',
                    badgeColor
                  )}
                >
                  <ArchetypeIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{bp.badge || bp.title}</span>
                </span>

                <div
                  className={cn(
                    'h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all',
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-border group-hover:border-primary/50 text-transparent'
                  )}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              {/* 2D Floorplan Preview with Quick Fullscreen Button */}
              <div className="relative rounded-xl overflow-hidden border border-border/60 group/preview">
                <BlueprintFloorplan layout={bp.layout} showDimensions={false} />
                {onPreviewBlueprint && (
                  <button
                    type="button"
                    title="Full Screen Blueprint Preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewBlueprint(bp);
                    }}
                    className="absolute top-1.5 right-1.5 z-30 p-1.5 rounded-lg bg-black/75 hover:bg-black border border-white/20 text-cyan-300 hover:text-white transition-all shadow-md opacity-90 group-hover/preview:opacity-100 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                  {bp.title}
                </h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {bp.description}
                </p>
              </div>

              {/* Metric Pills */}
              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-border/50 text-[10px]">
                <div className="px-2 py-1 rounded bg-muted/40 text-muted-foreground flex justify-between">
                  <span>Flow:</span>
                  <span className="font-bold text-cyan-400">
                    {bp.scores?.flow ?? 90}%
                  </span>
                </div>
                <div className="px-2 py-1 rounded bg-muted/40 text-muted-foreground flex justify-between">
                  <span>Clearance:</span>
                  <span className="font-bold text-emerald-400">
                    {bp.scores?.accessibility ?? 88}%
                  </span>
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlueprint(bp);
                }}
                className={cn(
                  'w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer',
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/60 hover:bg-primary/20 text-foreground'
                )}
              >
                <span>{isSelected ? 'Selected' : 'Use Blueprint'}</span>
                {isSelected ? <Check className="h-3.5 w-3.5 ml-1" /> : <ChevronRight className="h-3.5 w-3.5 ml-1" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{startIndex}–{endIndex}</strong> of <strong className="text-foreground">{total}</strong> verified blueprints
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted/40 disabled:opacity-40 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous 5</span>
            </button>

            <span className="text-xs text-muted-foreground px-2">
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-40 text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Load 5 More Layouts</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
