import React from 'react';
import { Layers, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClutterMeterProps {
  clutterLevel: 'Low' | 'Medium' | 'High';
  rawScore: number; // 0 to 100 representing clean score (high score = less clutter)
}

export default function ClutterMeter({ clutterLevel, rawScore }: ClutterMeterProps) {
  // Determine text details based on tier
  const getMeterConfig = () => {
    switch (clutterLevel) {
      case 'Low':
        return {
          color: 'text-green-400 bg-green-500/10 border-green-500/20',
          indicatorPos: 'left-[15%]',
          barColor: 'bg-green-500',
          icon: CheckCircle,
          desc: 'Spacious layout. Visual clutter calculations indicate comfortable clearing ratios, promoting calm flow dynamics.'
        };
      case 'Medium':
        return {
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          indicatorPos: 'left-[50%]',
          barColor: 'bg-amber-500',
          icon: Info,
          desc: 'Moderate layout volume. Some overlapping furniture groups detected. A few minor accessories can be removed to boost aesthetics.'
        };
      case 'High':
        return {
          color: 'text-destructive bg-destructive/10 border-destructive/20',
          indicatorPos: 'left-[85%]',
          barColor: 'bg-destructive',
          icon: AlertTriangle,
          desc: 'Critical density detected! Overlapping furniture items obstruct pathways. Swapping out bulky cabinets for vertical organizers is highly advised.'
        };
    }
  };

  const config = getMeterConfig();
  const Icon = config.icon;

  return (
    <div className="glass-panel border rounded-3xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-foreground">Visual Clutter Index</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Volumetric density checking for physical obstacles
          </p>
        </div>
        <span className={cn(
          "px-2.5 py-1 text-[10px] font-bold rounded-lg border flex items-center space-x-1",
          config.color
        )}>
          <Icon className="h-3 w-3" />
          <span>{clutterLevel} Clutter</span>
        </span>
      </div>

      {/* Slide bar */}
      <div className="space-y-1.5 pt-2">
        <div className="w-full h-2.5 bg-muted rounded-full relative overflow-hidden">
          {/* Gradient backdrop: Green to Amber to Red */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 opacity-80" />
          {/* Mask representing clean space percentage (high rawScore = less clutter, so mask hides more of the bar) */}
          <div 
            className="h-full bg-muted absolute right-0 transition-all duration-1000"
            style={{ width: `${Math.max(0, 100 - rawScore)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase px-0.5">
          <span>Spacious</span>
          <span>Moderate</span>
          <span>Crowded</span>
        </div>
      </div>

      {/* Advisory Text */}
      <div className="p-3 bg-muted/30 border border-border rounded-2xl flex items-start space-x-2.5 text-xs text-muted-foreground">
        <Info className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-normal">{config.desc}</p>
      </div>
    </div>
  );
}
