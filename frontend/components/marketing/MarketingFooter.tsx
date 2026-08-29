'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Send, Check } from 'lucide-react';

export default function MarketingFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#090b11] text-white pt-16 pb-12 px-4 sm:px-8 lg:px-12 w-full relative z-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Top Newsletter & Subscription Banner */}
        <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-violet-400" />
              <span>Stay Ahead In Spatial AI & Interior Design</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-lg">
              Join 5,000+ interior architects & designers receiving monthly spatial layout research, design trends, and platform updates.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center space-x-2 w-full md:w-auto">
            {subscribed ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full sm:w-80">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer shrink-0 transition-all"
                >
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Sitemap Grid (4 Columns + Brand) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-md shadow-violet-500/20">
                <Flame className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">
                MATTER AI
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              AI-powered spatial intelligence and room layout optimization for modern interior design studios.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inference Engine: Operational (99.9%)</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/studio" className="hover:text-cyan-400 transition-colors">Interactive Studio</Link></li>
              <li><Link href="/upload" className="hover:text-cyan-400 transition-colors">Scan Room Blueprint</Link></li>
              <li><Link href="/research" className="hover:text-cyan-400 transition-colors">Spatial Planning Lab</Link></li>
              <li><Link href="/redesign" className="hover:text-cyan-400 transition-colors">AI Restyle Studio</Link></li>
              <li><Link href="/compare" className="hover:text-cyan-400 transition-colors">Compare Workspaces</Link></li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Interior Decorators</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Architectural Planning</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Real-Estate Staging</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Commercial Design</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Spatial Auditing</span></li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/features" className="hover:text-cyan-400 transition-colors">Features Overview</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing Plans</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Matter AI</Link></li>
              <li><Link href="/settings" className="hover:text-cyan-400 transition-colors">Studio Preferences</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">API Documentation</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Matter AI Spatial Intelligence Inc. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Standards</span>
          </div>

          {/* Social Inline Icons */}
          <div className="flex items-center space-x-3">
            {/* Twitter / X */}
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" aria-label="X (Twitter)">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" aria-label="GitHub">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            {/* Discord */}
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" aria-label="Discord">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
