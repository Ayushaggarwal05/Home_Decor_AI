"use client";

import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

import HeroSection from "@/components/marketing/HeroSection";
import InteractiveDemo from "@/components/marketing/InteractiveDemo";
import FeatureDualMode from "@/components/marketing/FeatureDualMode";
import MetricsShowcase from "@/components/marketing/MetricsShowcase";
import WorkflowSteps from "@/components/marketing/WorkflowSteps";
import PricingSection from "@/components/marketing/PricingSection";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative overflow-x-hidden font-sans selection:bg-violet-600 selection:text-white">
      {/* Subtle ambient light glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <span className="absolute -top-32 left-1/4 h-[650px] w-[650px] rounded-full bg-violet-500/8 blur-[150px]" />
        <span className="absolute top-[600px] -right-32 h-[700px] w-[700px] rounded-full bg-cyan-500/8 blur-[160px]" />
        <span className="absolute bottom-[400px] left-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/8 blur-[150px]" />
      </div>

      {/* Light grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Floating Rounded Dark Navbar Container */}
      <div className="sticky top-4 z-50 px-4 w-full flex justify-center">
        <header className="w-full max-w-6xl bg-[#090b11]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-6 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-md shadow-violet-500/20">
              <Flame className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-base font-black tracking-wider text-white">
              MATTER AI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <Link
              href="/features"
              className="hover:text-cyan-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="hover:text-cyan-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="hover:text-cyan-400 transition-colors"
            >
              About
            </Link>
          </nav>

          <div>
            <Link
              href="/studio"
              className="px-4.5 py-2 text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer inline-block"
            >
              Launch Console
            </Link>
          </div>
        </header>
      </div>

      {/* Page Sections */}
      <main className="flex-1 space-y-4 relative z-10 pt-2">
        <HeroSection />
        <InteractiveDemo />
        <FeatureDualMode />
        <MetricsShowcase />
        <WorkflowSteps />
        <PricingSection />
      </main>

      {/* Global Dark Footer */}
      <MarketingFooter />
    </div>
  );
}
