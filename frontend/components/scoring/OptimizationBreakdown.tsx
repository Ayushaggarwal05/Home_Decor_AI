import React from 'react';
import { Move, Compass, Eye, Accessibility, HelpCircle, Layers } from 'lucide-react';
import { OptimizationScore } from '../../types';
import { cn } from '@/lib/utils';

interface OptimizationBreakdownProps {
  scores: OptimizationScore;
}

export default function OptimizationBreakdown({ scores }: OptimizationBreakdownProps) {
  const breakdownItems = [
    { name: 'Flow Circulation', score: scores.flow, icon: Move, color: 'bg-cyan-500 text-cyan-400' },
    { name: 'Symmetry Alignment', score: scores.symmetry, icon: Compass, color: 'bg-violet-500 text-violet-400' },
    { name: 'Accessibility Paths', score: scores.accessibility, icon: Accessibility, color: 'bg-emerald-500 text-emerald-400' },
    { name: 'Daylight Optimization', score: scores.lighting, icon: Eye, color: 'bg-yellow-500 text-yellow-400' },
    { name: 'Volume Density (Declutter)', score: scores.clutter, icon: Layers, color: 'bg-rose-500 text-rose-400' }
  ];

  return (
    <div className="glass-panel border rounded-3xl p-6 space-y-5">
      <div>
        <h4 className="text-sm font-bold text-foreground">Spatial Integrity Metrics</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Algorithmic breakdown of spatial optimization rulesets
        </p>
      </div>

      <div className="space-y-4">
        {breakdownItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon className={cn("h-4 w-4", item.color.split(' ')[1])} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-foreground">{item.score}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color.split(' ')[0])}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
