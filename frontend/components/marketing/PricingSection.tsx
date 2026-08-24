'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free Architect',
      price: '$0',
      period: 'Forever free',
      description: 'Ideal for trying out room scans and basic spatial geometry diagnostics.',
      features: [
        '5 Room Scans per month',
        'YOLOv8 Bounding Box Detection',
        'Basic Occupancy Heatmap overlay',
        'Standard Japandi style preview',
        'Community Support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro Decorator',
      price: isAnnual ? '$24' : '$29',
      period: isAnnual ? 'per month, billed annually' : 'per month, billed monthly',
      description: 'Full spatial intelligence toolkit for professional interior decorators & designers.',
      features: [
        'Unlimited Room Scans & Saves',
        'NSGA-II Genetic Layout Solver',
        'A* Walkability & Flow Graph Diagnostics',
        'Unlimited Stable Diffusion AI Restyles',
        'High-Resolution Image Exports',
        'Priority Worker Queue Execution',
      ],
      cta: 'Launch Pro Studio',
      popular: true,
    },
    {
      name: 'Enterprise Studio',
      price: isAnnual ? '$79' : '$99',
      period: isAnnual ? 'per month, billed annually' : 'per month, billed monthly',
      description: 'For architecture firms & real-estate staging platforms requiring high throughput API access.',
      features: [
        'Everything in Pro Decorator',
        'FastAPI REST API Access Key',
        'DXF / CAD Floorplan Export',
        'Dedicated Celery Worker Queues',
        'Multi-User Team Workspaces',
        '24/7 Dedicated SLA Support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 w-full z-10 space-y-12">
      {/* Header & Toggle */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Choose the spatial intelligence plan that fits your interior design or architectural workflow.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center space-x-3 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 pt-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isAnnual ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              isAnnual ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 20%)</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-black text-[10px] font-black">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel border rounded-3xl p-8 flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
              plan.popular
                ? 'border-violet-500/50 shadow-2xl shadow-violet-500/10 scale-105 bg-slate-900/90'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-medium">/mo</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{plan.period}</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className={`h-4 w-4 mr-2.5 shrink-0 ${plan.popular ? 'text-cyan-400' : 'text-violet-400'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/studio"
                className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-violet-600/25'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
