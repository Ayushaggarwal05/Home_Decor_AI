'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ options, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1.5 p-1 bg-muted/65 rounded-xl border border-border w-fit", className)}>
      {options.map((tab) => {
        const isActive = activeId === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all relative flex items-center space-x-1.5 cursor-pointer",
              isActive ? "text-foreground font-extrabold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Slide active bubble underlay */}
            {isActive && (
              <motion.span
                layoutId="active-tabs-bubble"
                className="absolute inset-0 rounded-lg bg-card shadow-sm border border-border/20 z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <span className="relative z-10 flex items-center space-x-1.5">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
