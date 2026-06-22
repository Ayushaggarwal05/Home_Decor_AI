import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  description?: string;
  trendText?: string;
  color?: 'violet' | 'cyan' | 'emerald' | 'amber' | 'destructive';
}

export default function ScoreCard({
  title,
  value,
  previousValue,
  icon: Icon,
  description,
  trendText,
  color = 'violet'
}: ScoreCardProps) {
  const delta = previousValue ? value - previousValue : 0;
  const isPositive = delta >= 0;

  const colorStyles = {
    violet: "from-violet-500/20 to-purple-500/5 text-purple-400 border-purple-500/20 hover:border-purple-500/40",
    cyan: "from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40",
    emerald: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40",
    amber: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20 hover:border-amber-500/40",
    destructive: "from-destructive/20 to-red-500/5 text-destructive border-destructive/20 hover:border-destructive/40"
  };

  return (
    <div className={cn(
      "glass-panel border p-5 rounded-3xl relative overflow-hidden transition-all duration-300 group",
      "hover:translate-y-[-2px] hover:shadow-xl"
    )}>
      {/* Dynamic Background Glow */}
      <span className={cn(
        "absolute -right-8 -bottom-8 h-24 w-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none bg-gradient-to-br",
        color === 'violet' && "from-purple-500 to-indigo-600",
        color === 'cyan' && "from-cyan-500 to-blue-600",
        color === 'emerald' && "from-emerald-500 to-teal-600",
        color === 'amber' && "from-amber-500 to-orange-600",
        color === 'destructive' && "from-destructive to-red-600"
      )} />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-foreground block">
            {value}%
          </span>
        </div>

        <div className={cn(
          "p-3 rounded-2xl bg-gradient-to-tr border",
          colorStyles[color]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        {previousValue !== undefined && (
          <div className={cn(
            "flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg border",
            isPositive 
              ? "bg-green-500/10 border-green-500/25 text-green-500" 
              : "bg-red-500/10 border-red-500/25 text-red-500"
          )}>
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            <span>{isPositive ? '+' : ''}{delta}%</span>
          </div>
        )}
        <span className="text-[11px] text-muted-foreground font-medium truncate">
          {trendText || description || 'Current rating score'}
        </span>
      </div>
    </div>
  );
}
