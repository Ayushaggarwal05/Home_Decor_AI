'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MetricGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
}

export default function MetricGauge({
  score,
  size = 180,
  strokeWidth = 14,
  title = "Optimization",
  subtitle = "Overall Score"
}: MetricGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine primary colors based on the value tier
  const getScoreColor = () => {
    if (score >= 80) return { stroke: 'url(#gauge-gradient-green)', text: 'text-cyan-400 glow-cyan' };
    if (score >= 60) return { stroke: 'url(#gauge-gradient-violet)', text: 'text-violet-400 glow-violet' };
    return { stroke: 'url(#gauge-gradient-red)', text: 'text-destructive' };
  };

  const colorConfig = getScoreColor();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Gradients definition for beautiful glows */}
          <defs>
            <linearGradient id="gauge-gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="gauge-gradient-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gauge-gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Underlay Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-muted"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Overlay Indicator */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text Panel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-0.5">
            {title}
          </span>
          <span className={`text-4xl font-black tracking-tight ${colorConfig.text}`}>
            {score}%
          </span>
          <span className="text-[9px] text-muted-foreground font-semibold mt-1 max-w-[80px]">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
