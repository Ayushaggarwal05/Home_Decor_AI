'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Box } from 'lucide-react';

export default function StudioFooter() {
  return (
    <footer className="border-t border-white/15 bg-slate-900/95 backdrop-blur-2xl text-white pt-14 pb-32 sm:pb-36 px-4 sm:px-8 lg:px-12 w-full relative z-10 font-sans mt-12 shadow-2xl">
      {/* Glowing top golden accent highlight line matching Navbar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Grid: Brand + 3 Column Links + Quick Action Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/studio" className="flex items-center space-x-2.5 group w-fit">
              <div className="p-2 bg-gradient-to-tr from-[#D4AF37] to-[#C86D51] rounded-xl shadow-md shadow-[#D4AF37]/25 group-hover:scale-105 transition-transform duration-300">
                <Flame className="h-4.5 w-4.5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-base font-black tracking-widest text-white uppercase">
                  Matter AI
                </span>
                <p className="text-[9px] font-semibold text-[#D4AF37] tracking-widest uppercase leading-none mt-1">
                  Spatial OS Studio
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Neural spatial intelligence platform for automated architectural layout optimization, mathematical occupancy mapping, and generative interior design synthesis.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/60 border border-white/10 text-[11px] font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Spatial Engine: Operational</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-slate-950/60 border border-white/10 text-[10px] font-mono text-[#D4AF37]">
                <span>v2.4 Stable</span>
              </div>
            </div>
          </div>

          {/* Column 1: Studio Modules */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Studio Workspace
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/studio" className="hover:text-[#D4AF37] transition-colors">
                  Studio Overview
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-[#D4AF37] transition-colors">
                  Create Space
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-[#D4AF37] transition-colors">
                  Spatial Planning Lab
                </Link>
              </li>
              <li>
                <Link href="/redesign" className="hover:text-[#D4AF37] transition-colors">
                  AI Redesign
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#D4AF37] transition-colors">
                  Compare Workspaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Core Capabilities */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Spatial Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>YOLOv8 & DINO Object Detection</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>Continuous-to-Discrete Occupancy</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>NSGA-II Genetic Layout Solver</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>Clearance & Ergonomic Scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span>Diffusion Style Synthesis</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Action Card */}
          <div className="md:col-span-3">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 shadow-xl space-y-3 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-[#D4AF37]">
                  <Box className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded-md border border-white/10">
                  Quick Launch
                </span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Map A New Room</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Upload an interior scan to index boundary vectors and solve layout clearance.
                </p>
              </div>
              <Link
                href="/upload"
                className="w-full py-2.5 px-3 bg-gradient-to-r from-[#D4AF37] to-[#C86D51] hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer"
              >
                <span>Create Space</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} Matter AI Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline font-mono text-[10px] text-[#D4AF37]">
              Autonomous Spatial Engine v2.4
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
              About
            </Link>
            <Link href="/pricing" className="hover:text-[#D4AF37] transition-colors">
              Pricing
            </Link>
            <Link href="/settings" className="hover:text-[#D4AF37] transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
