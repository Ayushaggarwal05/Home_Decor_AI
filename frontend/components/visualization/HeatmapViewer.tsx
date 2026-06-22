'use client';

import React from 'react';
import { OccupancyMap } from '../../types';
import { useRoomStore } from '@/store/roomStore';

interface HeatmapViewerProps {
  map: OccupancyMap;
}

export default function HeatmapViewer({ map }: HeatmapViewerProps) {
  const { uiPreferences } = useRoomStore();

  if (!uiPreferences.showHeatmap) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none opacity-50 mix-blend-screen transition-opacity duration-300">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="heat-glow-high" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.7)" />
            <stop offset="50%" stopColor="rgba(239, 68, 68, 0.2)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </radialGradient>
          <radialGradient id="heat-glow-medium" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.6)" />
            <stop offset="60%" stopColor="rgba(236, 72, 153, 0.15)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
          </radialGradient>
          <radialGradient id="heat-glow-low" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
            <stop offset="70%" stopColor="rgba(6, 182, 212, 0.1)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </radialGradient>
        </defs>

        {map.grid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            if (cell.weight < 0.2) return null;
            
            // Map 0-10 index to 0-100 percentages
            const cx = (cIdx * 10) + 5;
            const cy = (rIdx * 10) + 5;
            
            // Select radial glow size based on weights
            let gradientId = "heat-glow-low";
            let radius = 12;
            if (cell.weight >= 0.8) {
              gradientId = "heat-glow-high";
              radius = 18;
            } else if (cell.weight >= 0.5) {
              gradientId = "heat-glow-medium";
              radius = 15;
            }

            return (
              <circle
                key={`${rIdx}-${cIdx}`}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r={`${radius}%`}
                fill={`url(#${gradientId})`}
                className="animate-pulse-slow"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
