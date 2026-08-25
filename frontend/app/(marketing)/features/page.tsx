'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Flame,
  Sparkles,
  Compass,
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Box,
  FileJson,
  Sliders,
  Maximize2,
  Zap,
  Eye,
  Check,
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

const FEATURE_CARDS = [
  {
    id: 'object-mapping',
    badge: 'Computer Vision',
    name: 'Spatial Object & Bounding Box Mapping',
    desc: 'Leverages YOLOv8 and SAM segmentation models to isolate structural walls, doors, windows, and individual furniture clusters down to sub-centimeter accuracy.',
    icon: Compass,
    gradient: 'from-cyan-500/15 via-teal-500/10 to-transparent',
    borderColor: 'border-cyan-200 hover:border-cyan-400',
    iconColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    badgeStyle: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    highlights: ['3D Bounding Boxes', 'Sub-Centimeter Depth Isolation', 'Wall Clearance Metrics'],
  },
  {
    id: 'occupancy-heatmaps',
    badge: 'Spatial Ergonomics',
    name: 'Occupancy & Walkway Friction Heatmaps',
    desc: 'Calculates high-activity pathway vectors to trace hallway bottlenecks, door swing interference, and recommend optimal walkways according to international building codes.',
    icon: Activity,
    gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    iconColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    highlights: ['Pathway Clearance Auditing', 'Ergonomic Friction Scoring', 'Door Swing Safety Check'],
  },
  {
    id: 'generative-redesign',
    badge: 'AI Rendering',
    name: 'Zero-Hallucination Restyling Engine',
    desc: 'Bridges depth-conditioned diffusion pipelines to transform aesthetic styles (Japandi, Mid-Century Modern, Industrial, Minimalist) while preserving exact physical dimensions.',
    icon: Sparkles,
    gradient: 'from-violet-500/15 via-purple-500/10 to-transparent',
    borderColor: 'border-violet-200 hover:border-violet-400',
    iconColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
    badgeStyle: 'bg-violet-100 text-violet-800 border-violet-200',
    highlights: ['Depth Map Conditioning', 'Photorealistic Renders', '8+ Architectural Presets'],
  },
  {
    id: 'delta-comparison',
    badge: 'Spatial Auditing',
    name: 'Multi-Room Delta & Symmetry Diagnostics',
    desc: 'Review side-by-side room layouts with interactive slider overlays, calculate visual balance scores, and track furniture rearrangement metrics in real time.',
    icon: Layers,
    gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    borderColor: 'border-amber-200 hover:border-amber-400',
    iconColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
    highlights: ['Side-by-Side Comparison', 'Focal Line Symmetry', 'Variance Tracking'],
  },
  {
    id: 'nsga-solver',
    badge: 'Optimization Algorithm',
    name: 'NSGA-II Multi-Objective Layout Solver',
    desc: 'Evolutionary layout engine solving trade-offs between natural sunlight exposure, visual symmetry, pathway flow, and conversational furniture grouping.',
    icon: Cpu,
    gradient: 'from-indigo-500/15 via-violet-500/10 to-transparent',
    borderColor: 'border-indigo-200 hover:border-indigo-400',
    iconColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    highlights: ['Pareto-Optimal Layouts', 'Sunlight & Sightline Balancing', 'Automated Solving'],
  },
  {
    id: 'export-pipeline',
    badge: 'Developer & CAD',
    name: 'Raw Coordinates & Blueprint Export',
    desc: 'Instantly generate high-resolution presentation blueprints, bounding box SVG vectors, and raw coordinate JSON schemas for CAD or web application integration.',
    icon: FileJson,
    gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
    borderColor: 'border-rose-200 hover:border-rose-400',
    iconColor: 'bg-rose-500/10 text-rose-700 border-rose-200',
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
    highlights: ['JSON Data Schema', 'SVG Vector Blueprint Export', 'API Webhook Support'],
  },
];

const COMPARISON_SPECS = [
  { feature: 'YOLOv8 Object Bounding Boxes', free: true, pro: true, enterprise: true },
  { feature: 'Occupancy Grid Clearance Check', free: true, pro: true, enterprise: true },
  { feature: 'Architectural Style Renders', free: '720p', pro: '4K Ultra', enterprise: 'Custom Models' },
  { feature: 'Multi-Objective NSGA-II Solver', free: false, pro: true, enterprise: true },
  { feature: 'Before/After Comparison Slider', free: false, pro: true, enterprise: true },
  { feature: 'Raw JSON & SVG Coordinate Export', free: false, pro: true, enterprise: true },
  { feature: 'Custom Fine-Tuned Checkpoints', free: false, pro: false, enterprise: true },
  { feature: 'Dedicated GPU Rendering Priority', free: false, pro: false, enterprise: true },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'vision' | 'ai' | 'export'>('all');

  const filteredFeatures = FEATURE_CARDS.filter((card) => {
    if (activeTab === 'vision') return card.id === 'object-mapping' || card.id === 'occupancy-heatmaps';
    if (activeTab === 'ai') return card.id === 'generative-redesign' || card.id === 'nsga-solver';
    if (activeTab === 'export') return card.id === 'delta-comparison' || card.id === 'export-pipeline';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden font-sans selection:bg-violet-600 selection:text-white">
      {/* Light Theme Blend Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Vibrant Cyan/Violet Ambient Glow */}
        <span className="absolute -top-32 left-1/3 h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-cyan-200/40 via-violet-200/30 to-emerald-200/30 blur-[150px]" />
        {/* Middle Soft Indigo/Emerald Ambient Glow */}
        <span className="absolute top-[650px] -right-32 h-[750px] w-[750px] rounded-full bg-gradient-to-bl from-violet-200/40 via-indigo-200/30 to-cyan-200/30 blur-[160px]" />
        {/* Lower Warm Amber/Teal Glow */}
        <span className="absolute bottom-[400px] left-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-amber-200/30 via-emerald-200/30 to-violet-200/30 blur-[150px]" />
      </div>

      {/* Light Grid Overlay Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Unified Dark Glass Navbar */}
      <MarketingNavbar />

      {/* Page Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-20 space-y-20 relative z-10">
        
        {/* HERO HEADER */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-xs font-bold text-cyan-800 shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
            <span>Next-Gen Computer Vision & Spatial AI Suite</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Architectural Precision Meets{' '}
            <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Generative Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            Explore our deep vision algorithms, multi-objective spatial layout solvers, occupancy heatmaps, and zero-hallucination style restyling tools built for modern interior architecture studios.
          </motion.p>

          {/* FILTER TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Features' },
              { id: 'vision', label: 'Computer Vision' },
              { id: 'ai', label: 'AI Optimization' },
              { id: 'export', label: 'Auditing & CAD' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* FEATURE CARDS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-8 rounded-3xl bg-white/85 backdrop-blur-xl border ${feat.borderColor} shadow-lg shadow-slate-200/50 bg-gradient-to-b ${feat.gradient} flex flex-col justify-between space-y-6 transition-all transform hover:-translate-y-1.5`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl border ${feat.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feat.badgeStyle}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {feat.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200/60">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* SPECIFICATION MATRIX & CAPABILITIES COMPARISON */}
        <section className="space-y-8 bg-white/90 backdrop-blur-xl border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-xs font-bold text-violet-800">
              <Sliders className="h-3.5 w-3.5 text-violet-600" />
              <span>Technical Matrix</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Spatial Intelligence Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Compare engine features across Free Sandbox, Professional Studio, and Enterprise tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Feature Capability</th>
                  <th className="py-4 px-4 text-center">Free Sandbox</th>
                  <th className="py-4 px-4 text-center text-violet-700 bg-violet-50/50 rounded-t-xl">
                    Professional Studio
                  </th>
                  <th className="py-4 px-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {COMPARISON_SPECS.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                      <Box className="h-3.5 w-3.5 text-violet-500" />
                      <span>{spec.feature}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof spec.free === 'boolean' ? (
                        spec.free ? (
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )
                      ) : (
                        <span className="font-bold text-slate-700">{spec.free}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-violet-50/30">
                      {typeof spec.pro === 'boolean' ? (
                        spec.pro ? (
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )
                      ) : (
                        <span className="font-bold text-violet-700">{spec.pro}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof spec.enterprise === 'boolean' ? (
                        spec.enterprise ? (
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )
                      ) : (
                        <span className="font-bold text-cyan-700">{spec.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready To Upgrade Your Interior Design Workflow?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Upload any room blueprint or photo scan to calculate clearance heatmaps, solve layouts, and render AI redesigns in seconds.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Maximize2 className="h-4 w-4" />
                <span>Scan Room Blueprint</span>
              </Link>
              <Link
                href="/studio"
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Interactive Studio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Global Dark Footer */}
      <MarketingFooter />
    </div>
  );
}
