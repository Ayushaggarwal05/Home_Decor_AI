'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, ShieldCheck } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#05070a] pt-16 pb-12 px-6 w-full z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MATTER AI
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Deterministic spatial intelligence, layout optimization, and generative interior restyling for professional interior designers & architects.
          </p>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Inference Grid: Operational</span>
          </div>
        </div>

        {/* Links Col 1: Platform */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/studio" className="hover:text-cyan-400 transition-colors">Interactive Studio</Link></li>
            <li><Link href="/upload" className="hover:text-cyan-400 transition-colors">Scan Room Blueprint</Link></li>
            <li><Link href="/research" className="hover:text-cyan-400 transition-colors">Research Lab</Link></li>
            <li><Link href="/redesign" className="hover:text-cyan-400 transition-colors">AI Redesign Mode</Link></li>
            <li><Link href="/compare" className="hover:text-cyan-400 transition-colors">Compare Studio</Link></li>
          </ul>
        </div>

        {/* Links Col 2: Technology */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Engine Specs</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center space-x-1"><Sparkles className="h-3 w-3 text-violet-400" /><span>YOLOv8 Detection</span></li>
            <li className="flex items-center space-x-1"><Sparkles className="h-3 w-3 text-violet-400" /><span>SAM Segmentation</span></li>
            <li className="flex items-center space-x-1"><Sparkles className="h-3 w-3 text-violet-400" /><span>NSGA-II Genetic Solver</span></li>
            <li className="flex items-center space-x-1"><Sparkles className="h-3 w-3 text-violet-400" /><span>A* Pathfinding</span></li>
            <li className="flex items-center space-x-1"><Sparkles className="h-3 w-3 text-violet-400" /><span>Stable Diffusion</span></li>
          </ul>
        </div>

        {/* Links Col 3: Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/features" className="hover:text-white transition-colors">Feature Overview</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Matter AI</Link></li>
            <li><Link href="/settings" className="hover:text-white transition-colors">Environment Setup</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-10 mt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Matter AI Spatial Intelligence Inc. All rights reserved.
        </div>
        <div className="flex items-center space-x-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Compliance</span>
        </div>
      </div>
    </footer>
  );
}
