'use client';

import React, { useState } from 'react';
import { ShieldCheck, BarChart3, ArrowUpRight, Zap, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const METRICS_DATA = {
  unoptimized: {
    label: 'Raw Layout Scan',
    compositeScore: 62,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    metrics: [
      { name: 'Clutter Index', score: 48, status: 'High Density', delta: 'Requires +0.6m floor clearance', color: 'bg-amber-500' },
      { name: 'Symmetry Rating', score: 58, status: 'Asymmetric', delta: 'Midline offset 0.82m', color: 'bg-amber-500' },
      { name: 'Accessibility Margin', score: 64, status: 'Restricted', delta: 'Doorway pathway 0.55m', color: 'bg-amber-500' },
      { name: 'Traffic Flow Index', score: 65, status: 'Obstructed', delta: 'A* walkability bottleneck', color: 'bg-amber-500' },
      { name: 'Natural Lighting Vector', score: 75, status: 'Moderate', delta: 'Window light glare on desk', color: 'bg-emerald-500' },
    ],
  },
  optimized: {
    label: 'Genetic Solved Layout',
    compositeScore: 94,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    metrics: [
      { name: 'Clutter Index', score: 92, status: 'Optimal', delta: 'Expanded open floor plane', color: 'bg-emerald-400' },
      { name: 'Symmetry Rating', score: 96, status: 'Balanced', delta: 'Centered on focal wall', color: 'bg-emerald-400' },
      { name: 'Accessibility Margin', score: 95, status: 'Compliant', delta: '0.92m door clearance verified', color: 'bg-emerald-400' },
      { name: 'Traffic Flow Index', score: 94, status: 'Unobstructed', delta: 'A* graph index 98/100', color: 'bg-emerald-400' },
      { name: 'Natural Lighting Vector', score: 93, status: 'Harmonious', delta: 'Indirect light optimization', color: 'bg-emerald-400' },
    ],
  },
};

export default function MetricsShowcase() {
  const [isOptimized, setIsOptimized] = useState(true);

  const currentData = isOptimized ? METRICS_DATA.optimized : METRICS_DATA.unoptimized;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full z-10 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Explainable Spatial Analytics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            5 Core Quality Metrics. Zero Guesswork.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Every room evaluation is broken down into 5 deterministic mathematical scores backed by geometric rules.
          </p>
        </div>

        {/* State Switch Toggle */}
        <div className="glass-panel p-1.5 rounded-2xl border border-white/10 flex items-center space-x-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setIsOptimized(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isOptimized
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw Unoptimized Layout
          </button>
          <button
            onClick={() => setIsOptimized(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              isOptimized
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Genetic AI Solved (94%)</span>
          </button>
        </div>
      </div>

      {/* Main Score & Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Composite Score Card */}
        <div className="lg:col-span-5 glass-panel border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <span className={`px-3 py-1 rounded-full border text-xs font-bold inline-block ${currentData.badgeColor}`}>
              {currentData.label}
            </span>
            <div className="text-6xl font-black tracking-tight text-white flex items-baseline space-x-2">
              <span>{currentData.compositeScore}</span>
              <span className="text-2xl font-bold text-slate-500">/ 100</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isOptimized
                ? 'Multi-objective genetic algorithm solver maximized furniture symmetry while preserving minimum clearance vectors across doorways and focal windows.'
                : 'Original room layout exhibits tight doorway clearance bottlenecks and midline alignment offsets.'}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Optimization Algorithm:</span>
              <span className="font-mono text-white">NSGA-II (Pop=40, Gen=60)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Walkway Clearance Buffer:</span>
              <span className="font-mono text-emerald-400">0.92m Min Safe Vector</span>
            </div>
          </div>
        </div>

        {/* 5 Metrics List */}
        <div className="lg:col-span-7 space-y-4">
          {currentData.metrics.map((metric, idx) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/15 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{metric.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                    {metric.status}
                  </span>
                </div>
                <span className="text-sm font-black text-white font-mono">{metric.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${metric.color}`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span>{metric.delta}</span>
                <span className="text-slate-500 font-mono">Weight: 0.20</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
