'use client';

import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

import HeroSection from '@/components/marketing/HeroSection';
import InteractiveDemo from '@/components/marketing/InteractiveDemo';
import FeatureDualMode from '@/components/marketing/FeatureDualMode';
import MetricsShowcase from '@/components/marketing/MetricsShowcase';
import WorkflowSteps from '@/components/marketing/WorkflowSteps';
import PricingSection from '@/components/marketing/PricingSection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col relative grid-overlay overflow-x-hidden">
      {/* Background ambient radial glows */}
      <span className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />
      <span className="absolute top-[800px] right-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <span className="absolute bottom-[600px] left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[140px] pointer-events-none" />

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#07090e]/85 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-600/20">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            MATTER AI
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/research" className="hover:text-cyan-400 transition-colors">Spatial Lab</Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/upload"
            className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all"
          >
            Scan Space
          </Link>
          <Link 
            href="/studio" 
            className="px-4.5 py-2 text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white rounded-xl transition-all shadow-md cursor-pointer"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* Page Content Sections */}
      <main className="flex-1 space-y-4">
        <HeroSection />
        <InteractiveDemo />
        <FeatureDualMode />
        <MetricsShowcase />
        <WorkflowSteps />
        <PricingSection />
      </main>

      {/* Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
