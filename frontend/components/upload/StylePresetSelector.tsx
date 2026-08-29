'use client';

import React from 'react';
import { Sparkles, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StylePresetSelectorProps {
  value: string;
  onChange: (style: string) => void;
  disabled?: boolean;
}

const STYLE_PRESETS = [
  {
    name: 'Modern Minimalist',
    desc: 'Clean lines & uncluttered harmony',
  },
  {
    name: 'Japandi Harmony',
    desc: 'Wabi-sabi & warm woods',
  },
  {
    name: 'Scandinavian Crisp',
    desc: 'Hygge & light oak tones',
  },
  {
    name: 'Industrial Loft',
    desc: 'Exposed brick & matte steel',
  },
  {
    name: 'Mid-Century Chic',
    desc: 'Retro geometry & walnut',
  },
  {
    name: 'Neo-Classical Luxury',
    desc: 'Ornate moldings & velvet',
  }
];

export function StylePresetSelector({ value, onChange, disabled }: StylePresetSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#6E655F] uppercase tracking-wider block">
          Design Aesthetic Target
        </label>
        <span className="text-[10px] text-[#B8860B] font-semibold flex items-center gap-1">
          <Palette className="h-3 w-3" /> Visual Guide
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = value === preset.name;

          return (
            <button
              key={preset.name}
              type="button"
              disabled={disabled}
              onClick={() => onChange(preset.name)}
              className={cn(
                "p-2.5 rounded-xl border text-left transition-all duration-150 relative overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
                isSelected
                  ? "border-[#D4AF37] bg-[#FBF7EE] ring-1 ring-[#D4AF37]/50 text-[#1F1A17]"
                  : "border-[#E8E2D8] bg-white hover:bg-[#FDFBF7] text-[#6E655F] hover:text-[#1F1A17]"
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={cn("text-xs font-bold truncate", isSelected ? "text-[#1F1A17]" : "text-[#2B2522]")}>
                  {preset.name}
                </span>
                {isSelected && (
                  <Sparkles className="h-3.5 w-3.5 text-[#B8860B] shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-[#6E655F] leading-tight mt-0.5 truncate">
                {preset.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
