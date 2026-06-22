'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Mail, Building, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white py-16 px-6 relative grid-overlay flex flex-col items-center">
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        <span>Return to Site</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          About Aura AI
        </h1>
        <p className="text-sm text-slate-400">
          Pioneering spatial intelligence algorithms to re-imagine the way we live and structure layouts.
        </p>
      </div>

      <div className="max-w-3xl w-full glass-panel border border-white/5 rounded-3xl p-8 space-y-8">
        <div className="space-y-4 leading-relaxed text-slate-300 text-sm">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" /> Our Mission
          </h2>
          <p>
            Aura AI was founded by a combined team of computer vision engineers and professional spatial planners. We noticed that while generative AI was transforming digital images, it lacked the spatial math checking required to build realistic, functional interior environments.
          </p>
          <p>
            We built Aura to provide real spatial coordinates, occupancy heatmaps, and symmetry measurements alongside beautiful redesign prompts. This guarantees that your redesigned rooms don't just look pretty on screens, but actually work in practice.
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5 leading-relaxed text-slate-300 text-sm">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-cyan-400" /> Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-muted/20 rounded-2xl border border-border">
              <h3 className="font-semibold text-white text-xs">Research-Grade Math</h3>
              <p className="text-[11px] text-slate-400 mt-1">Calculations are backed by architectural standards for pathway clearances and safety factors.</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-2xl border border-border">
              <h3 className="font-semibold text-white text-xs">Modular Flexibility</h3>
              <p className="text-[11px] text-slate-400 mt-1">Easily swap model checkpoints and styles depending on the user environment.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5 text-center flex flex-col items-center">
          <h2 className="text-sm font-bold text-white flex items-center">
            <Mail className="h-4 w-4 mr-1.5 text-yellow-400" /> Got questions or feedback?
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Reach out to our spatial architects team at <strong className="text-white hover:underline cursor-pointer">architects@aura-spatial.ai</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
