'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto space-y-8 z-10">
      {/* Version & Tech Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-700 shadow-sm"
      >
        <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
        <span>Next-Gen Computer Vision Engine v2.4</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
      </motion.div>

      {/* Hero Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900"
      >
        Spatial Intelligence For{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600">
          Modern Interior Design
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base sm:text-xl text-slate-600 max-w-3xl leading-relaxed font-normal"
      >
        Upload any room scan photo to map occupancy grids, calculate clearances, trace symmetry alignment pathways, and generate stunning AI redesigns instantly.
      </motion.p>

      {/* CTA Button Group */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2"
      >
        <Link
          href="/upload"
          className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2.5 shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
        >
          <span>Scan Your Space</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/studio"
          className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold rounded-2xl flex items-center justify-center space-x-2 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Cpu className="h-4 w-4 text-violet-600" />
          <span>Interactive Sandbox</span>
        </Link>
      </motion.div>

      {/* Feature Micro-Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200 w-full max-w-2xl"
      >
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Zero Hallucinations</span>
        </div>
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-violet-600" />
          <span>YOLOv8 + SAM Parsing</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-cyan-600" />
          <span>NSGA-II Layout Solver</span>
        </div>
      </motion.div>
    </section>
  );
}
