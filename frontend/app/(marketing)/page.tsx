'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Flame, Columns, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col relative grid-overlay">
      {/* Background radial glows */}
      <span className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <span className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#07090e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg">
            <Flame className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AURA AI
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-300">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </nav>

        <div>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-xs font-bold bg-white text-black hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto space-y-8 z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs text-purple-400 font-bold animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen Computer Vision Engine v2.4</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-500">
          Spatial Intelligence For Modern Interior Design
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Upload any room scan photo to map occupancy grids, calculate clearances, trace symmetry alignment pathways, and generate stunning AI redesigns instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/upload"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer group"
          >
            <span>Scan Your Space</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            Interactive Sandbox
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 w-full z-10 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Two Architectures. One Platform.</h2>
          <p className="text-sm text-slate-400">Tailored modules for research diagnostics and startup generative assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Research Diagnostic */}
          <div className="glass-panel border rounded-3xl p-8 space-y-6 hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">1. Research Diagnostic Mode</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Execute deep spatial math checks. Analyze occupancy matrices, symmetry margins, walkway clearance scores, and bounding box furniture coordinates.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-cyan-400" /> Occupancy Heatmaps</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-cyan-400" /> Bounding Box Detection overlays</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-cyan-400" /> Spatial Clearance Math</li>
            </ul>
          </div>

          {/* Card 2: Generative Design */}
          <div className="glass-panel border rounded-3xl p-8 space-y-6 hover:border-violet-500/20 transition-all duration-300 group">
            <div className="p-3 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-2xl w-fit">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">2. Smart SaaS Mode</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Generate stunning high-fidelity room redesign drafts. Style chips (Japandi, Scandinavian, Industrial) and custom prompt injections.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-violet-400" /> Before/After sliding split checks</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-violet-400" /> Prompt-controlled Stable Diffusion</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-violet-400" /> Custom Concept Inspiration grids</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-slate-500 mt-auto">
        &copy; {new Date().getFullYear()} Aura Spatial Intelligence Inc. All rights reserved. Designed for professional interior decorators.
      </footer>
    </div>
  );
}
