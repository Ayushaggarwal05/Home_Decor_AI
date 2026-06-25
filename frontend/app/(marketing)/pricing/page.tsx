'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Flame } from 'lucide-react';

const TIERS = [
  {
    name: 'Free Sandbox',
    price: '$0',
    description: 'Explore the basics of spatial intelligence and bounding box overlays.',
    features: ['3 Room Uploads per month', 'Standard Occupancy Grid check', '2 Design styles', '720p Redesign drafts'],
    cta: 'Get Started',
    href: '/studio',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$39',
    period: '/mo',
    description: 'For interior designers and freelancers running constant client audits.',
    features: ['Unlimited uploads', 'Full Heatmap & Symmetry diagnostics', 'Access all 8+ Design styles', 'High-res 4K renders', 'Before/After Comparison sliders', 'Exportable raw JSON reports'],
    cta: 'Start Pro Trial',
    href: '/studio',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For real-estate teams and large design groups requiring API orchestration.',
    features: ['Custom AI fine-tuning', 'Dedicated GPU rendering priority', 'Webhook integrations', 'SLA guarantees', 'Team access controls'],
    cta: 'Contact Sales',
    href: '/about',
    highlighted: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white py-16 px-6 relative grid-overlay flex flex-col items-center">
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        <span>Return to Site</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Flexible Pricing Models
        </h1>
        <p className="text-sm text-slate-400">
          Choose the right spatial computational tier for your home projects or professional design studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`glass-panel border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden transition-transform hover:scale-[1.01] ${
              tier.highlighted ? 'border-primary/45 shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-slate-950/80' : 'border-white/5'
            }`}
          >
            {tier.highlighted && (
              <span className="absolute top-3 right-3 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-primary text-white rounded">
                Recommended
              </span>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tier.description}</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-black">{tier.price}</span>
                {tier.period && <span className="text-xs text-slate-400 ml-1">{tier.period}</span>}
              </div>

              <ul className="space-y-3.5 pt-4 border-t border-white/5 text-xs text-slate-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className={`h-4 w-4 mr-2 shrink-0 ${tier.highlighted ? 'text-primary' : 'text-cyan-400'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={tier.href}
              className={`w-full mt-8 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer block ${
                tier.highlighted
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
