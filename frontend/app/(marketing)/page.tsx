"use client";

import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

import MarketingNavbar from "@/components/marketing/MarketingNavbar";
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

      {/* Unified Dark Glass Navbar */}
      <MarketingNavbar />

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
