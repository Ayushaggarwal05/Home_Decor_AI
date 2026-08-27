'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 grid-overlay opacity-20" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-black text-lg tracking-wider">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-100 font-extrabold text-lg tracking-tight flex items-center gap-1">
              Matter AI
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 opacity-80" />
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Spatial Intelligence
            </span>
          </div>
        </Link>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-white/10 transition-all duration-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Centered Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        {children}
      </div>

      {/* Bottom Footer Credits */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto py-2 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Matter AI Platform Inc. All rights reserved.
      </footer>
    </main>
  );
}
