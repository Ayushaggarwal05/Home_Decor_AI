'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles, Activity, Layers, Play } from 'lucide-react';

const FEATURES = [
  {
    name: 'Spatial Object Mapping',
    desc: 'Uses custom pre-trained computer vision classifiers to isolate furniture clusters and compute their bounding box percentages.',
    icon: Compass,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
  },
  {
    name: 'Occupancy Heatmaps',
    desc: 'Calculates high-activity path friction variables to trace hallway blockages and suggest comfortable walkway routes.',
    icon: Activity,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
  },
  {
    name: 'Generative Redesign Engine',
    desc: 'Bridges stable diffusion architecture to compose architectural style modifications based on customized user prompt parameters.',
    icon: Sparkles,
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/5'
  },
  {
    name: 'Multi-Room Delat Comparisons',
    desc: 'Evaluate side-by-side room layouts, score alignments, and review spatial efficiency differences immediately.',
    icon: Layers,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white py-16 px-6 relative grid-overlay flex flex-col items-center">
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        <span>Return to Site</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Core Spatial Features
        </h1>
        <p className="text-sm text-slate-400">
          Discover how our computer vision pipelines and generative diffusion scripts optimize spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.name} className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4 hover:border-white/10 transition-colors">
              <div className={`p-3 rounded-2xl w-fit border ${feat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{feat.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
