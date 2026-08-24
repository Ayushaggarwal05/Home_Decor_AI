'use client';

import React from 'react';
import { Upload, Eye, Cpu, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Upload Blueprint or Photo',
    description: 'Import any room scan, floorplan, or smartphone photo into the studio workspace.',
    icon: Upload,
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    step: '02',
    title: 'Computer Vision Parsing',
    description: 'YOLOv8 detects furniture boundaries while SAM isolates floor plane masks and doorway zones.',
    icon: Eye,
    accent: 'from-violet-500 to-purple-500',
  },
  {
    step: '03',
    title: 'Genetic Layout Optimization',
    description: 'NSGA-II solver runs multi-objective balance, clearance, and A* walkability path calculations.',
    icon: Cpu,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    step: '04',
    title: 'Generative AI Restyle',
    description: 'Stable Diffusion renders high-resolution restyled room concepts based on your style prompts.',
    icon: Sparkles,
    accent: 'from-cyan-400 to-violet-500',
  },
];

export default function WorkflowSteps() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full z-10 space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          From Raw Scan to Deterministic Restyle in 4 Steps
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          How Matter AI combines computer vision, spatial mathematics, and generative rendering into a unified workflow.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((stepItem) => {
          const Icon = stepItem.icon;
          return (
            <div
              key={stepItem.step}
              className="glass-panel border border-white/10 rounded-3xl p-6 space-y-5 hover:border-white/25 transition-all relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-slate-500 tracking-wider">
                  STEP {stepItem.step}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stepItem.accent} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {stepItem.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
