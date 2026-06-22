'use client';

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { OptimizationScore } from '../../types';

interface RadarMetricChartProps {
  scores: OptimizationScore;
}

export default function RadarMetricChart({ scores }: RadarMetricChartProps) {
  // Map scores data to Recharts format
  const data = [
    { subject: 'Flow', A: scores.flow, fullMark: 100 },
    { subject: 'Symmetry', A: scores.symmetry, fullMark: 100 },
    { subject: 'Access Paths', A: scores.accessibility, fullMark: 100 },
    { subject: 'Daylight', A: scores.lighting, fullMark: 100 },
    { subject: 'Clutter Space', A: scores.clutter, fullMark: 100 },
  ];

  return (
    <div className="glass-panel border rounded-3xl p-6 flex flex-col h-[280px]">
      <div>
        <h4 className="text-sm font-bold text-foreground">Spatial Signature Map</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Integrity diagnostics mapped on radar boundaries
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 pt-2 text-[9px] font-bold">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#475569', fontSize: 8 }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(9, 11, 17, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#fff'
              }}
            />
            <Radar
              name="Spatial Score"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
