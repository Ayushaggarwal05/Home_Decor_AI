'use client';

import React from 'react';
import { OccupancyMap } from '../../types';
import { useRoomStore } from '@/store/roomStore';
import { cn } from '@/lib/utils';

interface OccupancyGridProps {
  map: OccupancyMap;
}

export default function OccupancyGrid({ map }: OccupancyGridProps) {
  const { uiPreferences } = useRoomStore();

  if (!uiPreferences.showGridOverlay) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none grid grid-cols-10 grid-rows-10 border border-white/5">
      {map.grid.map((row, rIdx) => (
        <React.Fragment key={rIdx}>
          {row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={cn(
                "border-[0.5px] border-white/10 transition-colors duration-500",
                cell.status === 'occupied' && "bg-rose-500/15 border-rose-500/30",
                cell.status === 'buffer' && "bg-cyan-500/5 border-cyan-500/20"
              )}
            >
              {/* Optional cell indicator for advanced dashboard feel */}
              {cell.status === 'occupied' && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-rose-400 animate-ping opacity-60" />
                </div>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
