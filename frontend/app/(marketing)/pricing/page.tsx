'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Flame,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const VALUE_PROPS = [
    {
      icon: Zap,
      title: 'Dedicated GPU Priority',
      desc: 'Process 4K room renders & multi-objective layout solver passes in under 1.2 seconds.',
      color: 'text-violet-600 bg-violet-100 border-violet-200',
    },
    {
      icon: ShieldCheck,
      title: 'Research-Grade Accuracy',
      desc: 'Every layout clearance check is verified against international architectural safety codes.',
      color: 'text-emerald-600 bg-emerald-100 border-emerald-200',
    },
    {
      icon: Layers,
      title: 'Full Export Autonomy',
      desc: 'Export raw JSON floorplan schemas, SVG vector overlays, and high-res DXF CAD files anytime.',
      color: 'text-cyan-600 bg-cyan-100 border-cyan-200',
    },
  ];

  const FAQS = [
    {
      q: 'Can I upgrade, downgrade, or cancel anytime?',
      a: 'Yes! You have full flexibility. Upgrades take effect instantly, and downgrades/cancellations apply at the end of your active billing cycle without lock-ins or hidden fees.',
    },
    {
      q: 'What formats are supported for room scan uploads?',
      a: 'Matter AI accepts PNG, JPEG, WEBP photos, architectural PDF schematics, and LiDAR point-cloud image exports from smartphone scanners.',
    },
    {
      q: 'How does annual billing work?',
      a: 'When you select Annual Billing, you get an immediate 20% discount on all plans, billed as a single annual charge ($288/yr for Pro Studio).',
    },
    {
      q: 'Are room renders guaranteed to be zero-hallucination?',
      a: 'Yes. Unlike consumer generative image tools, Matter AI conditions all diffusion output passes on exact physical bounding box coordinates computed by YOLOv8.',
    },
    {
      q: 'Do you offer team seats or workspace sharing?',
      a: 'Our Business & Enterprise plans include multi-user team workspaces, shared project folders, and role-based access control.',
    },
    {
      q: 'What is included in the REST API access?',
      a: 'Business plan accounts receive FastAPI REST keys and webhook subscriptions to trigger layout solver pipelines directly from external apps or CAD software.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden font-sans selection:bg-violet-600 selection:text-white">
      {/* Light Theme Blend Backdrop Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top Vibrant Violet Glow */}
        <span className="absolute -top-32 left-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-violet-300/40 via-cyan-200/30 to-emerald-200/30 blur-[150px]" />
        {/* Middle Cyan Ambient Soft Glow */}
        <span className="absolute top-[600px] -right-32 h-[750px] w-[750px] rounded-full bg-gradient-to-bl from-cyan-200/40 via-indigo-200/30 to-violet-200/30 blur-[160px]" />
      </div>

      {/* Light Grid Overlay Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Floating Dark Navbar */}
      <div className="sticky top-4 z-50 px-4 w-full flex justify-center">
        <header className="w-full max-w-7xl bg-[#090b11]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-6 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-md shadow-violet-500/20">
              <Flame className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-base font-black tracking-wider text-white">
              MATTER AI
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              <span>Return to Site</span>
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2 text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer inline-block"
            >
              Launch Console
            </Link>
          </div>
        </header>
      </div>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-20 space-y-20 relative z-10">
        
        {/* PROFESSIONAL HERO SECTION & BILLING TOGGLE */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-100/80 border border-violet-200 text-xs font-bold text-violet-800 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600 animate-pulse" />
            <span>Spatial Computing Infrastructure • Commercial Plans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Predictable Spatial Computing For{' '}
            <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Every Design Studio
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            Transparent computational tiers tailored for independent interior architects, active staging agencies, and enterprise spatial platforms. No hidden rendering fees.
          </motion.p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="pt-2 inline-flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 font-semibold rounded-lg transition-all cursor-pointer ${
                !isAnnual ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                isAnnual ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual billing</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">SAVE 20%</span>
            </button>
          </div>
        </section>

        {/* 3-CARD GRID WITH EXACT HOMEPAGE PROPORTIONS */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl mx-auto pt-4">
          
          {/* CARD 1 (LEFT): Starter — Smaller/Shorter Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-[320px] bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ideal for solo decorators & trying out basic room scans.
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 font-medium">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
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
                className="w-full py-3 rounded-xl font-bold text-xs text-center border border-slate-300 hover:bg-slate-50 transition-all text-slate-900 block cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* CARD 2 (MIDDLE): Pro Studio — TALLER, WIDER POPUP CARD WITH OVERHANGING BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full md:w-[360px] relative bg-gradient-to-b from-violet-50/90 via-slate-100/80 to-violet-50/70 border-2 border-violet-600 rounded-3xl p-8 sm:p-9 flex flex-col justify-between space-y-7 shadow-2xl shadow-violet-500/15 z-10 my-4 md:my-0"
          >
            {/* Overhanging Pill Badge on Top Edge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30 whitespace-nowrap">
              Most Popular
            </div>

            <div className="space-y-5 pt-1">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Pro Studio</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  For scaling teams, interior designers & active agencies.
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-black text-slate-900">{isAnnual ? '$24' : '$29'}</span>
                  <span className="text-xs text-slate-500 font-bold">/mo</span>
                </div>
                <div className="text-[11px] text-violet-700 font-semibold mt-1">
                  {isAnnual ? 'Billed annually ($288/yr)' : 'Billed monthly'}
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-800 font-medium pt-4 border-t border-slate-100">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-violet-700 stroke-[3]" />
                  </div>
                  <span><strong>Unlimited</strong> Room Scans & Saves</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-violet-700 stroke-[3]" />
                  </div>
                  <span>NSGA-II Genetic Layout Solver</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-violet-700 stroke-[3]" />
                  </div>
                  <span>A* Walkability & Flow Graph</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-violet-700 stroke-[3]" />
                  </div>
                  <span><strong>Unlimited</strong> AI Restyle Renders</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-violet-700 stroke-[3]" />
                  </div>
                  <span>Priority GPU Worker Execution</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/studio"
                className="w-full py-3.5 rounded-xl font-extrabold text-xs text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all text-white shadow-lg shadow-violet-600/30 block cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* CARD 3 (RIGHT): Business — Smaller/Shorter Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-[320px] bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Full autonomy for enterprise platforms & real-estate teams.
                </p>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-slate-900">{isAnnual ? '$79' : '$99'}</span>
                  <span className="text-xs text-slate-500 font-medium">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-100">
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
                className="w-full py-3 rounded-xl font-bold text-xs text-center border border-slate-300 hover:bg-slate-50 transition-all text-slate-900 block cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

        </section>

        {/* WHY DESIGNERS CHOOSE MATTER AI TIERS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {VALUE_PROPS.map((vp, idx) => {
            const Icon = vp.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm space-y-3"
              >
                <div className={`p-3 rounded-xl w-fit border ${vp.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{vp.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{vp.desc}</p>
              </div>
            );
          })}
        </section>

        {/* ENTERPRISE CUSTOM DEPLOYMENTS BANNER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-cyan-300">
              <Building2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Enterprise Infrastructure</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need Custom AI Checkpoints or On-Premise GPU Nodes?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We partner with global real-estate developers, hotel chains, and architectural studios requiring custom model fine-tuning and dedicated API rate limits.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/about"
              className="px-6 py-3.5 bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <span>Speak With Spatial Architects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-8 bg-white/90 backdrop-blur-xl border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-xs font-bold text-cyan-800">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Everything You Need To Know
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Have a question about billing, API limits, or render formats? We've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Global Dark Footer */}
      <MarketingFooter />
    </div>
  );
}
