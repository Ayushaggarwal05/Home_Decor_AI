"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  Box,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full z-10 overflow-hidden font-sans pt-4 sm:pt-6 pb-4 mt-0 pl-4 sm:pl-16 pr-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center w-full max-w-full">
        {/* LEFT COLUMN: Top Badge + Stacked Giant Typography + CTAs + Micro Badges */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6 text-left z-20"
        >
          {/* Top Pill Badge */}
          <div className="w-full flex">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-600 animate-pulse" />
              <span>Next-Gen Computer Vision Engine v2.4</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>

          {/* Stacked Giant Typography */}
          <div className="space-y-1">
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight text-slate-900 leading-[0.92]">
              Spatial
            </h1>
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight text-slate-900 leading-[0.92]">
              Intelligence
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-cyan-600 to-violet-600 tracking-tight pt-2">
              For Modern Interior Design
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
            Upload any room scan to map occupancy grids, calculate clearances,
            analyze symmetry and generate stunning AI-powered interior
            redesigns.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
            <Link
              href="/upload"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-600 hover:opacity-95 text-white font-bold rounded-2xl flex items-center justify-center space-x-2.5 shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer group text-sm"
            >
              <Box className="h-4 w-4" />
              <span>Scan Your Space</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/studio"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold rounded-2xl flex items-center justify-center space-x-2 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <Cpu className="h-4 w-4 text-violet-600" />
              <span>Interactive Sandbox</span>
            </Link>
          </div>

          {/* Micro Feature Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-start gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Zero Hallucinations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>YOLOv8 + SAM Parsing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span>NSGA-II Layout Solver</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Inverted Teal Sofa + 800px Halo Disc + Floating Spatial AI Measurements */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-6 relative flex items-end justify-end self-end pt-6 pr-16 lg:pt-0 w-full"
        >
          {/* 800px Circular Halo Backdrop Disc Element */}
          <div className="absolute -bottom-20 -right-12 w-[800px] h-[800px] bg-gradient-to-tr from-violet-200/50 via-cyan-100/40 to-transparent rounded-full pointer-events-none blur-sm" />
          <div className="absolute -bottom-20 -right-12 w-[800px] h-[800px] border border-violet-200/40 rounded-full pointer-events-none" />

          {/* Sofa Image Frame Container */}
          <div className="relative flex items-center justify-end z-10">
            {/* Inverted Sofa PNG Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/teal_sofa.png"
              alt="Teal Velvet Sofa"
              className="w-full max-w-[640px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(13,148,136,0.18)] scale-x-[-1] z-10 relative"
            />

            {/* SVG OVERLAY DIMENSION MEASUREMENT LINES */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
              {/* Top Horizontal Length Line: 2.4 m */}
              <line
                x1="8%"
                y1="30%"
                x2="94%"
                y2="30%"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx="8%" cy="30%" r="3.5" fill="#0284c7" />
              <circle cx="94%" cy="30%" r="3.5" fill="#0284c7" />

              {/* Right Vertical Height Line: 0.85 m */}
              <line
                x1="95%"
                y1="35%"
                x2="95%"
                y2="75%"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx="95%" cy="35%" r="3.5" fill="#0284c7" />
              <circle cx="95%" cy="75%" r="3.5" fill="#0284c7" />

              {/* Pointer line to Cushion: Sofa 99.4% confidence */}
              <polyline
                points="30%,38% 24%,24% 18%,24%"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              <circle cx="30%" cy="38%" r="3" fill="#0284c7" />
            </svg>

            {/* FLOATING SPATIAL AI BADGES */}

            {/* Top Length Label Pill: 2.4 m */}
            <div className="absolute top-[25%] left-[50%] -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900 shadow-sm text-[11px] font-bold z-20">
              2.4 m
            </div>

            {/* Right Height Label Pill: 0.85 m */}
            <div className="absolute top-[50%] right-[-2%] translate-x-1/2 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900 shadow-sm text-[11px] font-bold z-20">
              0.85 m
            </div>

            {/* Cushion Object Detection Badge: Sofa [99.4% confidence] */}
            <div className="absolute top-[14%] left-[60%] px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-lg flex items-center space-x-2 text-xs font-semibold z-20">
              <div className="p-1 rounded bg-blue-100 text-blue-600">
                <Box className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-bold text-[11px] text-slate-900">Sofa</div>
                <div className="text-[9px] text-slate-500 font-mono">
                  99.4% confidence
                </div>
              </div>
            </div>

            {/* Floor Badge: Optimal Placement (Placed directly under sofa base) */}

            <div className="absolute top-[78%] right-[60%] flex items-center z-20">
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white shadow-md text-xs font-bold flex items-center space-x-1.5">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span className="text-[11px]">Optimal Placement</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
