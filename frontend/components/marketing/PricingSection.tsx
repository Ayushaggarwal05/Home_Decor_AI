'use client';

import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full z-10 space-y-14">
      {/* Header & Toggle */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-400 text-sm">
          Choose the spatial intelligence tier built for your interior design workflow.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="pt-2 inline-flex items-center p-1 bg-slate-900/90 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              !isAnnual ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              isAnnual ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual billing</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">20% OFF</span>
          </button>
        </div>
      </div>

      {/* 3-Card Grid Matching the Reference Image Proportions */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl mx-auto pt-6">
        
        {/* CARD 1 (LEFT): Starter / Free Architect — Smaller/Shorter Box */}
        <div className="w-full md:w-[320px] bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ideal for solo decorators & trying out basic room scans.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs text-slate-400 font-medium">/mo</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/5">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>5 Room Scans per month</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>YOLOv8 Bounding Box Detection</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Basic Occupancy Heatmap overlay</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Standard Japandi style preview</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Email Support</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href="/studio"
              className="w-full py-3 rounded-xl font-bold text-xs text-center border border-white/15 hover:bg-white/10 transition-all text-white block cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* CARD 2 (MIDDLE): Growth / Pro Decorator — TALLER, WIDER POPUP CARD WITH OVERHANGING BADGE */}
        <div className="w-full md:w-[360px] relative bg-slate-900 border-2 border-violet-500 rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-7 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] z-10 my-4 md:my-0">
          
          {/* Overhanging Pill Badge on Top Edge (Matching Reference Image) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30 whitespace-nowrap">
            Most Popular
          </div>

          <div className="space-y-5 pt-1">
            <div>
              <h3 className="text-xl font-extrabold text-white">Pro Studio</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                For scaling teams, interior designers & active agencies.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black text-white">{isAnnual ? '$24' : '$29'}</span>
                <span className="text-xs text-slate-400 font-bold">/mo</span>
              </div>
              <div className="text-[11px] text-violet-300 font-medium mt-1">
                {isAnnual ? 'Billed annually ($288/yr)' : 'Billed monthly'}
              </div>
            </div>

            {/* Filled Circle Checkmarks matching reference image */}
            <ul className="space-y-3.5 text-xs text-slate-100 font-medium pt-4 border-t border-white/10">
              <li className="flex items-center space-x-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-violet-300 stroke-[3]" />
                </div>
                <span><strong>Unlimited</strong> Room Scans & Saves</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-violet-300 stroke-[3]" />
                </div>
                <span>NSGA-II Genetic Layout Solver</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-violet-300 stroke-[3]" />
                </div>
                <span>A* Walkability & Flow Graph</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-violet-300 stroke-[3]" />
                </div>
                <span><strong>Unlimited</strong> AI Restyle Renders</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-violet-300 stroke-[3]" />
                </div>
                <span>Priority GPU Worker Execution</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href="/studio"
              className="w-full py-3.5 rounded-xl font-extrabold text-xs text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-white shadow-lg shadow-violet-600/30 block cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* CARD 3 (RIGHT): Business / Enterprise — Smaller/Shorter Box */}
        <div className="w-full md:w-[320px] bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Business</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full autonomy for enterprise platforms & real-estate teams.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white">{isAnnual ? '$79' : '$99'}</span>
                <span className="text-xs text-slate-400 font-medium">/mo</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/5">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Everything in Pro Studio</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>FastAPI REST API Access Key</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>DXF / CAD Floorplan Export</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Dedicated Worker Queues</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Multi-User Team Workspaces</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="w-full py-3 rounded-xl font-bold text-xs text-center border border-white/15 hover:bg-white/10 transition-all text-white block cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
