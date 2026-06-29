'use client';

import React from 'react';
import { GraphData, BoundingBox } from '../../types';
import { useRoomStore } from '@/store/roomStore';
import { motion } from 'framer-motion';

interface SpacingConnectorsProps {
  graphData?: GraphData;
  roomLength?: number;
  roomWidth?: number;
  unit?: 'ft' | 'm';
}

export default function SpacingConnectors({
  graphData,
  roomLength = 16.0,
  roomWidth = 12.0,
  unit = 'ft',
}: SpacingConnectorsProps) {
  const { uiPreferences } = useRoomStore();

  // Only display if both detections and grid are toggled to keep visual layers clean
  if (!uiPreferences.showDetections || !graphData || !graphData.edges.length) {
    return null;
  }

  // Helper to fetch node parameters
  const getNodeCenter = (nodeId: string) => {
    const node = graphData.nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    let cx = node.center_x;
    let cy = node.center_y;

    // Fallback to boundingBox calculations if center coordinates are undefined
    if ((cx === undefined || cy === undefined) && node.boundingBox) {
      cx = node.boundingBox.x + node.boundingBox.width / 2.0;
      cy = node.boundingBox.y + node.boundingBox.height / 2.0;
    }

    if (cx === undefined || cy === undefined) return null;

    return {
      x: cx,
      y: cy,
      label: node.label,
      isWall: node.id.startsWith('Wall_'),
    };
  };

  return (
    <svg className="absolute inset-0 z-20 pointer-events-none w-full h-full select-none">
      {graphData.edges.map((edge, idx) => {
        // Exclude generic pathway connections to prevent cluttering the canvas
        if (edge.relationship === 'pathway_connected') return null;

        const start = getNodeCenter(edge.source);
        const end = getNodeCenter(edge.target);

        if (!start || !end) return null;

        // Calculate physical distance in feet/meters based on room width and length percentage
        const x1Phys = start.x * (roomLength / 100.0);
        const y1Phys = start.y * (roomWidth / 100.0);
        const x2Phys = end.x * (roomLength / 100.0);
        const y2Phys = end.y * (roomWidth / 100.0);

        const distance = Math.sqrt(Math.pow(x1Phys - x2Phys, 2) + Math.pow(y1Phys - y2Phys, 2));

        // SVG midpoints for badge positioning
        const midX = (start.x + end.x) / 2.0;
        const midY = (start.y + end.y) / 2.0;

        // Custom stroke colors representing relationship themes
        let strokeColor = 'rgba(6, 182, 212, 0.45)'; // cyan (default)
        if (edge.relationship === 'faces') strokeColor = 'rgba(139, 92, 246, 0.45)'; // violet
        if (edge.relationship === 'grouped_with') strokeColor = 'rgba(16, 185, 129, 0.45)'; // emerald
        if (edge.relationship === 'attached_to_wall') strokeColor = 'rgba(245, 158, 11, 0.35)'; // amber

        return (
          <g key={`${edge.source}-${edge.target}-${idx}`}>
            {/* Dotted path connector */}
            <motion.line
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
            />

            {/* Start point anchor glow */}
            {!start.isWall && (
              <circle
                cx={`${start.x}%`}
                cy={`${start.y}%`}
                r="3"
                className={edge.relationship === 'faces' ? 'fill-violet-400' : 'fill-cyan-400'}
              />
            )}

            {/* End point anchor glow */}
            {!end.isWall && (
              <circle
                cx={`${end.x}%`}
                cy={`${end.y}%`}
                r="3"
                className={edge.relationship === 'faces' ? 'fill-violet-400' : 'fill-cyan-400'}
              />
            )}

            {/* Distance badge pill */}
            <foreignObject
              x={`${midX}%`}
              y={`${midY}%`}
              width="60"
              height="20"
              className="overflow-visible"
              style={{
                transform: 'translate(-30px, -10px)',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/80 border border-white/10 text-[8px] font-mono font-bold text-white shadow-md backdrop-blur-xs whitespace-nowrap">
                  {distance.toFixed(1)} {unit}
                </span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
