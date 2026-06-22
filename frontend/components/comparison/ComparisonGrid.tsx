import React from 'react';
import { Room } from '../../types';
import { cn } from '@/lib/utils';
import { Award, Compass, Move, Accessibility, Layers, Eye } from 'lucide-react';

interface ComparisonGridProps {
  roomA: Room;
  roomB: Room;
}

export default function ComparisonGrid({ roomA, roomB }: ComparisonGridProps) {
  const scoreA = roomA.analysis?.scores;
  const scoreB = roomB.analysis?.scores;

  if (!scoreA || !scoreB) return null;

  const compareRows = [
    { name: 'Overall Optimization', valA: scoreA.overall, valB: scoreB.overall, icon: Award },
    { name: 'Flow & Clearance', valA: scoreA.flow, valB: scoreB.flow, icon: Move },
    { name: 'Symmetry & Balance', valA: scoreA.symmetry, valB: scoreB.symmetry, icon: Compass },
    { name: 'Path Accessibility', valA: scoreA.accessibility, valB: scoreB.accessibility, icon: Accessibility },
    { name: 'Lighting Index', valA: scoreA.lighting, valB: scoreB.lighting, icon: Eye },
    { name: 'Clutter Clearance', valA: scoreA.clutter, valB: scoreB.clutter, icon: Layers }
  ];

  return (
    <div className="glass-panel border rounded-3xl p-6 space-y-6">
      <div className="grid grid-cols-3 text-center border-b border-border pb-4 font-bold text-sm">
        <span className="text-left text-muted-foreground text-xs uppercase tracking-wider">Metrics</span>
        <span className="text-cyan-400 truncate px-2">{roomA.name}</span>
        <span className="text-violet-400 truncate px-2">{roomB.name}</span>
      </div>

      <div className="space-y-4">
        {compareRows.map((row) => {
          const Icon = row.icon;
          const diff = row.valA - row.valB;
          const isWinnerA = diff > 0;
          const isWinnerB = diff < 0;

          return (
            <div key={row.name} className="grid grid-cols-3 items-center text-xs">
              {/* Metric Title */}
              <span className="font-semibold text-muted-foreground flex items-center space-x-2 text-left">
                <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{row.name}</span>
              </span>

              {/* Room A Column */}
              <div className="flex flex-col items-center px-4">
                <span className={cn(
                  "font-black text-sm",
                  isWinnerA ? "text-cyan-400 font-extrabold" : "text-foreground"
                )}>
                  {row.valA}%
                </span>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1 max-w-[80px]">
                  <div 
                    className={cn("h-full rounded-full", isWinnerA ? "bg-cyan-400" : "bg-slate-600")}
                    style={{ width: `${row.valA}%` }}
                  />
                </div>
              </div>

              {/* Room B Column */}
              <div className="flex flex-col items-center px-4">
                <span className={cn(
                  "font-black text-sm",
                  isWinnerB ? "text-violet-400 font-extrabold" : "text-foreground"
                )}>
                  {row.valB}%
                </span>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1 max-w-[80px]">
                  <div 
                    className={cn("h-full rounded-full", isWinnerB ? "bg-violet-400" : "bg-slate-600")}
                    style={{ width: `${row.valB}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="p-4 bg-muted/20 border border-border rounded-2xl text-xs text-muted-foreground leading-normal">
        <p className="font-bold text-foreground mb-1">Comparative Insights:</p>
        {scoreA.overall > scoreB.overall ? (
          <span>
            <strong>{roomA.name}</strong> scores <strong>{scoreA.overall - scoreB.overall}% higher</strong> overall. 
            This is primary due to better flow clearances (+{scoreA.flow - scoreB.flow}%) and more spacious furniture distribution.
          </span>
        ) : scoreB.overall > scoreA.overall ? (
          <span>
            <strong>{roomB.name}</strong> scores <strong>{scoreB.overall - scoreA.overall}% higher</strong> overall. 
            This is primary due to higher symmetry balance (+{scoreB.symmetry - scoreA.symmetry}%) and reduced clutter.
          </span>
        ) : (
          <span>Both rooms score identically on overall layout. They feature matching spatial metrics and clearance attributes.</span>
        )}
      </div>
    </div>
  );
}
