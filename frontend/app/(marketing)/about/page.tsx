'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Flame,
  Sparkles,
  Building2,
  Target,
  ShieldCheck,
  Layers,
  Cpu,
  Mail,
  Users,
  CheckCircle2,
  ArrowRight,
  Compass,
  Ruler,
  BrainCircuit,
  Award,
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

const METRICS = [
  {
    value: '5M+',
    label: 'Sq Ft Scanned',
    description: 'Room floor plans & blueprints analyzed with spatial grids',
    gradient: 'from-violet-500/15 via-purple-500/10 to-transparent',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
  },
  {
    value: '99.4%',
    label: 'Clearance Accuracy',
    description: 'Mathematical clearance & pathway safety verification',
    gradient: 'from-cyan-500/15 via-teal-500/10 to-transparent',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
  },
  {
    value: '< 1.2s',
    label: 'Solver Latency',
    description: 'Multi-objective layout optimization calculation time',
    gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    value: '5,000+',
    label: 'Active Studios',
    description: 'Interior architects, decorators, & real estate teams',
    gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Research-Grade Physics',
    description:
      'Calculations backed by international architectural codes for pathway clearances, door swing radius, and accessibility standards.',
    accentColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    badge: 'Code Verified',
  },
  {
    icon: Layers,
    title: 'YOLOv8 + SAM Segmentation',
    description:
      'Deep vision pipeline isolating structural walls, windows, doors, and furniture bounding boxes down to sub-centimeter accuracy.',
    accentColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    badge: 'Computer Vision',
  },
  {
    icon: Cpu,
    title: 'NSGA-II Layout Solver',
    description:
      'Evolutionary layout algorithms balancing visual symmetry, natural light distribution, and ergonomic movement paths.',
    accentColor: 'bg-violet-500/10 text-violet-600 border-violet-200',
    badge: 'Spatial Optimization',
  },
  {
    icon: Sparkles,
    title: 'Zero-Hallucination Diffusion',
    description:
      'Conditioned AI style rendering that preserves physical room dimensions while transforming aesthetics in photorealistic detail.',
    accentColor: 'bg-amber-500/10 text-amber-600 border-amber-200',
    badge: 'AI Rendering',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden font-sans selection:bg-violet-600 selection:text-white">
      {/* Light Theme Blend Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Vibrant Violet/Cyan/Emerald Glow */}
        <span className="absolute -top-32 left-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-violet-300/40 via-cyan-200/30 to-emerald-200/30 blur-[150px]" />
        {/* Middle Cyan/Indigo Ambient Soft Glow */}
        <span className="absolute top-[600px] -right-32 h-[750px] w-[750px] rounded-full bg-gradient-to-bl from-cyan-200/40 via-indigo-200/30 to-violet-200/30 blur-[160px]" />
        {/* Lower Warm Amber/Emerald Blend */}
        <span className="absolute bottom-[400px] left-1/6 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-amber-200/30 via-emerald-200/30 to-cyan-200/30 blur-[150px]" />
      </div>

      {/* Light Grid Overlay Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Unified Dark Glass Navbar */}
      <MarketingNavbar />

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-20 space-y-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-100/80 border border-violet-200 text-xs font-bold text-violet-800 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600 animate-pulse" />
            <span>Spatial Intelligence & Interior Architecture Lab</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Re-Imagining Living Spaces Through{' '}
            <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Computational Geometry
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            Matter AI bridges high-dimensional computer vision with architectural physics. We ensure generative room designs are not just visually stunning, but physically exact and ergonomically functional.
          </motion.p>
        </section>

        {/* METRICS SHOWCASE GRID */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {METRICS.map((metric, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white/80 backdrop-blur-xl border ${metric.borderColor} shadow-lg shadow-slate-200/50 bg-gradient-to-b ${metric.gradient} flex flex-col justify-between space-y-4 hover:shadow-xl transition-all transform hover:-translate-y-1`}
            >
              <div className="space-y-1">
                <div className={`text-3xl sm:text-4xl font-black tracking-tight ${metric.textColor}`}>
                  {metric.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {metric.label}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </motion.section>

        {/* MISSION & VISION DUAL SPLIT CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OUR MISSION CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-violet-50/30 to-cyan-50/40 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/60 space-y-6 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Our Mission
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Founded by a cross-disciplinary team of spatial architects and computer vision engineers, Matter AI was built to solve a critical flaw in generative design: <strong className="text-slate-900 font-semibold">the lack of physical dimension verification.</strong>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                While AI image generators produce inspiring visuals, they often ignore door clearances, window obstructions, and human movement pathways. We built Matter to compute exact spatial coordinates, occupancy heatmaps, and symmetry metrics alongside neural restyling.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3 text-xs font-bold text-violet-700">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
              <span>100% Mathematically Verified Layouts</span>
            </div>
          </motion.div>

          {/* OUR VISION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-cyan-50/30 to-emerald-50/40 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/60 space-y-6 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Target className="h-6 w-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Our Vision
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We envision a future where interior designers, architects, and homeowners collaborate effortlessly with intelligent spatial agents.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By turning static 2D blueprints or smartphone room scans into dynamic multi-objective layout solvers, Matter AI compresses hours of manual drafting and physical clearance checks into real-time interactive insights.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3 text-xs font-bold text-cyan-700">
              <CheckCircle2 className="h-4 w-4 text-cyan-600" />
              <span>Real-Time Spatial Reasoning Engine</span>
            </div>
          </motion.div>
        </section>

        {/* CORE TECHNOLOGICAL PILLARS */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-200/70 border border-slate-300 text-xs font-bold text-slate-700">
              <BrainCircuit className="h-3.5 w-3.5 text-violet-600" />
              <span>Engine Architecture</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Core Technological Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              How our computer vision stack combines deep neural segmentation with spatial optimization solvers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl border ${pillar.accentColor}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-semibold text-violet-700 flex items-center space-x-1 cursor-pointer hover:translate-x-1 transition-transform">
                    <span>Learn standard specs</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TEAM & RESEARCH PHILOSOPHY */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-900 via-slate-900 to-indigo-950 text-white shadow-2xl space-y-8 relative overflow-hidden"
        >
          {/* Subtle Ambient Light Accents inside dark card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-cyan-300">
                <Award className="h-3.5 w-3.5 text-cyan-400" />
                <span>Built for Professionals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Designed By Spatial Architects, Fueled By Computer Vision
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe that artificial intelligence should augment spatial human intuition—not replace it. Our tools are tuned to respect professional workflows, providing raw CAD/JSON exports, precise distance heatmaps, and customizable design style presets.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3">
                <Ruler className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Sub-Centimeter Spatial Resolution</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Calculates wall boundaries, furniture dimensions, and clearance zones.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3">
                <Compass className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Objective Layout Optimization</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Evaluates lighting exposure, sightlines, and movement ergonomics simultaneously.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start space-x-3">
                <Users className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Studio Collaboration Standard</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Export high-resolution renders and raw coordinate JSON reports for team audits.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CONTACT & GET IN TOUCH */}
        <section className="text-center space-y-6 max-w-2xl mx-auto py-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Have Questions or Custom Research Inquiries?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Our spatial computational lab collaborates with enterprise architectural studios and real-estate developers worldwide.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:architects@matter-spatial.ai"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Contact architects@matter-spatial.ai</span>
              </a>
              <Link
                href="/studio"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
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
