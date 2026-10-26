'use client';

import React from 'react';
import { BoundingBox } from '@/types';
import { Sofa, Bed, Tv, Coffee, Utensils, Laptop, BookOpen, DoorClosed, Grid } from 'lucide-react';

interface BlueprintFurnitureItem {
  label: string;
  rotation?: number;
  boundingBox: BoundingBox;
}

interface BlueprintFloorplanProps {
  layout: BlueprintFurnitureItem[];
  className?: string;
  roomLength?: number;
  roomWidth?: number;
  showDimensions?: boolean;
}

export default function BlueprintFloorplan({
  layout,
  className = '',
  roomLength = 16,
  roomWidth = 20,
  showDimensions = true,
}: BlueprintFloorplanProps) {
  // Color palette for architectural blueprints
  const getFurnitureColor = (label: string) => {
    const l = (label || '').toLowerCase();
    if (l.includes('sofa') || l.includes('couch')) return { fill: 'rgba(99, 102, 241, 0.25)', stroke: '#6366f1', text: '#a5b4fc' };
    if (l.includes('table') || l.includes('coffee')) return { fill: 'rgba(234, 179, 8, 0.25)', stroke: '#eab308', text: '#fde047' };
    if (l.includes('bed')) return { fill: 'rgba(168, 85, 247, 0.25)', stroke: '#a855f7', text: '#d8b4fe' };
    if (l.includes('desk') || l.includes('office')) return { fill: 'rgba(59, 130, 246, 0.25)', stroke: '#3b82f6', text: '#93c5fd' };
    if (l.includes('chair') || l.includes('armchair')) return { fill: 'rgba(14, 165, 233, 0.25)', stroke: '#0ea5e9', text: '#7dd3fc' };
    if (l.includes('door')) return { fill: 'rgba(239, 68, 68, 0.20)', stroke: '#ef4444', text: '#fca5a5' };
    if (l.includes('window')) return { fill: 'rgba(34, 197, 94, 0.20)', stroke: '#22c55e', text: '#86efac' };
    return { fill: 'rgba(148, 163, 184, 0.25)', stroke: '#94a3b8', text: '#cbd5e1' };
  };

  const doors = layout.filter(item => item.label.toLowerCase().includes('door'));
  const windows = layout.filter(item => item.label.toLowerCase().includes('window'));
  const furniture = layout.filter(item => !item.label.toLowerCase().includes('door') && !item.label.toLowerCase().includes('window'));

  return (
    <div className={`relative w-full aspect-[4/3] rounded-2xl bg-[#090d16] border border-cyan-900/40 p-2 overflow-hidden shadow-inner select-none ${className}`}>
      {/* Blueprint Grid Background Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      {/* Main Architectural Floorplan Layer */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        {/* Exterior Room Boundary Wall */}
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          fill="none"
          stroke="#0284c7"
          strokeWidth="1.6"
          strokeDasharray="none"
          rx="1"
        />

        {/* Central Circulation Walkway Corridor Guide (Dashed Cyan) */}
        <path
          d="M 50 15 L 50 85 M 20 50 L 80 50"
          stroke="#06b6d4"
          strokeWidth="0.8"
          strokeDasharray="2,3"
          opacity="0.4"
        />

        {/* Door Egress Swings */}
        {doors.map((door, i) => {
          const { x, y, width, height } = door.boundingBox;
          const radius = Math.max(width, height);
          return (
            <g key={`door-${i}`}>
              {/* Door Opening Rect */}
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#ef4444"
                stroke="#f87171"
                strokeWidth="0.6"
              />
              {/* Architectural Arc Swing */}
              <path
                d={`M ${x} ${y} A ${radius} ${radius} 0 0 1 ${x + radius} ${y + radius}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.6"
                strokeDasharray="1,1"
                opacity="0.7"
              />
              <text x={x + 1} y={y - 1.5} fontSize="2.8" fill="#fca5a5" fontWeight="bold">
                DOOR
              </text>
            </g>
          );
        })}

        {/* Windows (Architectural Double-glass line) */}
        {windows.map((win, i) => {
          const { x, y, width, height } = win.boundingBox;
          return (
            <g key={`win-${i}`}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#22c55e"
                stroke="#4ade80"
                strokeWidth="0.8"
              />
              <line
                x1={x}
                y1={y + height / 2}
                x2={x + width}
                y2={y + height / 2}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.8"
              />
              <text x={x + 1} y={y - 1.5} fontSize="2.8" fill="#86efac" fontWeight="bold">
                WINDOW
              </text>
            </g>
          );
        })}

        {/* Furniture Layout Silhouettes */}
        {furniture.map((item, idx) => {
          const { x, y, width, height } = item.boundingBox;
          const colors = getFurnitureColor(item.label);
          const rotation = item.rotation || 0;
          const cx = x + width / 2;
          const cy = y + height / 2;

          return (
            <g key={`furn-${idx}`} transform={`rotate(${rotation} ${cx} ${cy})`}>
              {/* Furniture Footprint Rect */}
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="0.9"
                rx="1"
              />
              {/* Inner architectural cushion/accent border */}
              <rect
                x={x + 0.8}
                y={y + 0.8}
                width={Math.max(0, width - 1.6)}
                height={Math.max(0, height - 1.6)}
                fill="none"
                stroke={colors.stroke}
                strokeWidth="0.3"
                opacity="0.5"
                rx="0.5"
              />
              {/* Label & Dimensions */}
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.max(2.2, Math.min(3.5, width / 4))}
                fontWeight="700"
                fill={colors.text}
                className="pointer-events-none"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Dimensions Callout Tag */}
      {showDimensions && (
        <div className="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-semibold shadow-sm">
          {roomLength}′ × {roomWidth}′ PLAN
        </div>
      )}

      {/* Blueprint Watermark */}
      <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-bold tracking-widest text-cyan-400 uppercase">
        2D SCHEMATIC
      </div>
    </div>
  );
}
