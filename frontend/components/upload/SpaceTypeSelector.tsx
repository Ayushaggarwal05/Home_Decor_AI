'use client';

import React from 'react';
import { Sofa, Bed, Briefcase, Utensils, Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SpaceTypeKey = 'living_room' | 'bedroom' | 'office' | 'kitchen' | 'dining';

interface SpaceTypeSelectorProps {
  value: SpaceTypeKey;
  onChange: (value: SpaceTypeKey) => void;
  disabled?: boolean;
}

const SPACE_OPTIONS = [
  {
    id: 'living_room' as SpaceTypeKey,
    label: 'Living Room',
    desc: 'Sofas & TV consoles',
    icon: Sofa,
  },
  {
    id: 'bedroom' as SpaceTypeKey,
    label: 'Bedroom',
    desc: 'Beds & wardrobes',
    icon: Bed,
  },
  {
    id: 'office' as SpaceTypeKey,
    label: 'Home Office',
    desc: 'Desks & bookshelves',
    icon: Briefcase,
  },
  {
    id: 'kitchen' as SpaceTypeKey,
    label: 'Kitchen',
    desc: 'Counters & cabinets',
    icon: Utensils,
  },
  {
    id: 'dining' as SpaceTypeKey,
    label: 'Dining Room',
    desc: 'Tables & sideboards',
    icon: Armchair,
  }
];

export function SpaceTypeSelector({ value, onChange, disabled }: SpaceTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#6E655F] uppercase tracking-wider block">
        Space Category
      </label>

      <div className="grid grid-cols-2 gap-2.5">
        {SPACE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
                isSelected
                  ? "border-[#D4AF37] bg-[#FBF7EE] ring-1 ring-[#D4AF37]/50 text-[#1F1A17]"
                  : "border-[#E8E2D8] bg-white hover:bg-[#FDFBF7] text-[#6E655F] hover:text-[#1F1A17]"
              )}
            >
              <div className={cn("p-2 rounded-xl shrink-0", isSelected ? "bg-[#D4AF37]/15 text-[#B8860B] border border-[#D4AF37]/30" : "bg-[#F4F0EA] text-[#6E655F]")}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="space-y-0.5 min-w-0">
                <h4 className={cn("text-xs font-bold truncate", isSelected ? "text-[#1F1A17]" : "text-[#2B2522]")}>
                  {option.label}
                </h4>
                <p className="text-[10px] text-[#6E655F] leading-tight truncate">
                  {option.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
