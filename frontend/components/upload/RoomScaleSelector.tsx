'use client';

import React, { useState } from 'react';
import { Ruler, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomScaleSelectorProps {
  length: number;
  width: number;
  unit: 'ft' | 'm';
  onDimensionsChange: (length: number, width: number, unit: 'ft' | 'm') => void;
  disabled?: boolean;
}

const SCALE_PRESETS = [
  {
    label: 'Compact / Studio',
    length: 12,
    width: 14,
    desc: '168 sq ft (Apartments & Offices)'
  },
  {
    label: 'Standard / Primary',
    length: 16,
    width: 20,
    desc: '320 sq ft (Primary Bedrooms & Living Rooms)'
  },
  {
    label: 'Spacious / Open Hall',
    length: 24,
    width: 28,
    desc: '672 sq ft (Great Halls & Open Spaces)'
  }
];

export function RoomScaleSelector({
  length,
  width,
  unit,
  onDimensionsChange,
  disabled
}: RoomScaleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sqft = length * width;

  return (
    <div className="rounded-2xl bg-white border border-[#E8E2D8] overflow-hidden transition-all shadow-sm">
      {/* Optional Header Toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#FDFBF7] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8860B]">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1F1A17] uppercase tracking-wider">
                Room Physical Scale
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#F4F0EA] border border-[#E8E2D8] text-[10px] font-semibold text-[#6E655F]">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-[#6E655F] mt-0.5">
              Default: Standard Scale ({length} × {width} {unit})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#B8860B] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 hidden sm:inline-block">
            {sqft} sq {unit}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#6E655F]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6E655F]" />
          )}
        </div>
      </button>

      {/* Collapsible Custom Scale Controls */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-white/5 space-y-3 animate-fade-in">
          {/* Preset Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SCALE_PRESETS.map((preset) => {
              const isSelected = length === preset.length && width === preset.width;

              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDimensionsChange(preset.length, preset.width, unit)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer disabled:opacity-50",
                    isSelected
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200 font-bold"
                      : "border-white/5 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <div className="font-semibold text-[11px] text-slate-200">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Custom Sliders */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Length</span>
                <span className="text-cyan-400">{length} {unit}</span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                step="1"
                value={length}
                disabled={disabled}
                onChange={(e) => onDimensionsChange(Number(e.target.value), width, unit)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Width</span>
                <span className="text-cyan-400">{width} {unit}</span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                step="1"
                value={width}
                disabled={disabled}
                onChange={(e) => onDimensionsChange(length, Number(e.target.value), unit)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
