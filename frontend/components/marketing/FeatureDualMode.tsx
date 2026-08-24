'use client';

import React from 'react';
import { Compass, Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeatureDualMode() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 w-full z-10 space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Two Architectures. One Unified Engine.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Choose between research-grade spatial diagnostics or generative aesthetic studio restyling depending on your workflow needs.
        </p>
      </div>

      {/* Dual Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Research Lab Mode */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 hover:border-cyan-500/50 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-slate-200/50"
        >
          <div className="flex items-center justify-between">
            <div className="p-3.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-2xl">
              <Compass className="h-7 w-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-bold text-cyan-700">
              Deterministic Math Engine
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">1. Research Spatial Lab</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Perform rigorous computer vision space checks. Analyze 2D occupancy matrices, bounding box geometry, symmetry margins, and A* walkability pathing before making visual changes.
            </p>
          </div>

          {/* Feature Bullets */}
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-cyan-100 text-cyan-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>YOLOv8 & SAM Parsing:</strong> Instant furniture bounding box & floor mask detection.</span>
            </li>
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-cyan-100 text-cyan-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>A* Walkability Graph:</strong> Simulates entry-to-focal human movement vectors.</span>
            </li>
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-cyan-100 text-cyan-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>Exclusion Envelope Compliance:</strong> Doorway 0.9m & window light buffers.</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">FastAPI + OpenCV Engine</span>
            <Link
              href="/research"
              className="inline-flex items-center text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors space-x-1 group/link"
            >
              <span>Explore Spatial Lab</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Smart Design Studio Mode */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 hover:border-violet-500/50 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-slate-200/50"
        >
          <div className="flex items-center justify-between">
            <div className="p-3.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-2xl">
              <Sparkles className="h-7 w-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-[11px] font-bold text-violet-700">
              Genetic & Diffusion Studio
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">2. Smart Design Studio</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Auto-optimize layout positioning via NSGA-II Genetic Solvers and render photorealistic restyled room concepts driven by custom CLIP style prompts.
            </p>
          </div>

          {/* Feature Bullets */}
          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-violet-100 text-violet-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>NSGA-II Layout Solver:</strong> Multi-objective furniture coordinate optimization.</span>
            </li>
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-violet-100 text-violet-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>Stable Diffusion Renders:</strong> High-fidelity style generation (Japandi, Nordic, Industrial).</span>
            </li>
            <li className="flex items-center">
              <div className="p-1 rounded-md bg-violet-100 text-violet-700 mr-2.5 shrink-0">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span><strong>Interactive Split Comparison:</strong> Pixel-accurate delta checks on room renders.</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Celery + Stable Diffusion</span>
            <Link
              href="/redesign"
              className="inline-flex items-center text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors space-x-1 group/link"
            >
              <span>Launch Design Studio</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
