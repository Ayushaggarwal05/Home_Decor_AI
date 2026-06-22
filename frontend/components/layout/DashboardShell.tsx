'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FloatingDock from './FloatingDock';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  // Determine active background configuration based on active page route
  const getBgConfig = () => {
    if (pathname.includes('/research')) {
      // Spatial Lab: neural blue + cyan
      return {
        ambient: 'from-cyan-950/20 via-slate-950 to-blue-950/20',
        glow1: 'bg-cyan-500/10 shadow-[0_0_120px_rgba(6,182,212,0.15)]',
        glow2: 'bg-blue-500/8 shadow-[0_0_120px_rgba(37,99,235,0.1)]',
      };
    } else if (pathname.includes('/redesign')) {
      // AI Redesign: warm cinematic orange
      return {
        ambient: 'from-amber-950/15 via-slate-950 to-rose-950/15',
        glow1: 'bg-amber-600/8 shadow-[0_0_120px_rgba(217,119,6,0.12)]',
        glow2: 'bg-rose-500/6 shadow-[0_0_120px_rgba(244,63,94,0.08)]',
      };
    } else if (pathname.includes('/compare')) {
      // Compare Studio: monochrome premium contrast
      return {
        ambient: 'from-slate-900/40 via-slate-950 to-zinc-900/40',
        glow1: 'bg-slate-400/5 shadow-[0_0_120px_rgba(148,163,184,0.08)]',
        glow2: 'bg-slate-600/5 shadow-[0_0_120px_rgba(71,85,105,0.06)]',
      };
    } else if (pathname.includes('/studio')) {
      // Studio: deep graphite + purple glow
      return {
        ambient: 'from-violet-950/20 via-slate-950 to-fuchsia-950/10',
        glow1: 'bg-violet-600/10 shadow-[0_0_120px_rgba(139,92,246,0.15)]',
        glow2: 'bg-cyan-500/6 shadow-[0_0_120px_rgba(6,182,212,0.08)]',
      };
    } else {
      // Default / Environment / Settings / Create Space
      return {
        ambient: 'from-indigo-950/15 via-slate-950 to-slate-950',
        glow1: 'bg-indigo-600/8 shadow-[0_0_120px_rgba(99,102,241,0.12)]',
        glow2: 'bg-violet-500/6 shadow-[0_0_120px_rgba(139,92,246,0.08)]',
      };
    }
  };

  const bg = getBgConfig();

  return (
    <div className="min-h-screen relative flex flex-col text-foreground overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200 bg-slate-950">
      {/* Cinematic flowing ambient background layer */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${bg.ambient} transition-all duration-1000 -z-30`} />

      {/* Atmospheric glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <motion.div 
          key={`glow1-${pathname}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className={`absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] ${bg.glow1} transition-all duration-1000`} 
        />
        <motion.div 
          key={`glow2-${pathname}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8 }}
          className={`absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] ${bg.glow2} transition-all duration-1000`} 
        />
      </div>

      {/* Tech grid overlay to feel like a spatial layout workspace */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none -z-10" />

      {/* Top Header Navbar */}
      <Navbar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative pb-28">
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Pill Dock Navigation at bottom center */}
      <FloatingDock />
    </div>
  );
}
