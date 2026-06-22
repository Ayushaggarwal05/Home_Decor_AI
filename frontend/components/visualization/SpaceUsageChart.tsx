'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SpaceUsageChartProps {
  furniturePercent?: number;
  clearancePercent?: number;
  deadSpacePercent?: number;
}

export default function SpaceUsageChart({
  furniturePercent = 38,
  clearancePercent = 42,
  deadSpacePercent = 20
}: SpaceUsageChartProps) {
  const data = [
    { name: 'Furniture Footprint', value: furniturePercent, color: '#8b5cf6' }, // primary (violet)
    { name: 'Walkway Clearances', value: clearancePercent, color: '#06b6d4' }, // secondary (cyan)
    { name: 'Dead Space Buffers', value: deadSpacePercent, color: '#1e293b' }  // muted (slate)
  ];

  return (
    <div className="glass-panel border rounded-3xl p-6 flex flex-col h-[280px]">
      <div>
        <h4 className="text-sm font-bold text-foreground">Spatial Allocation</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Percent breakdown of total room area utilization
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(9, 11, 17, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#fff'
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
              formatter={(value, entry) => (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
