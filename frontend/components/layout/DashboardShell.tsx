'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FloatingDock from './FloatingDock';
import StudioFooter from './StudioFooter';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  // Determine active background configuration based on active page route
  const getBgConfig = () => {
    return {
      ambient: 'from-[#F7F3EC] via-[#FAF8F5] to-[#F4EFE6]',
      glow1: 'bg-amber-500/5 shadow-[0_0_120px_rgba(212,175,55,0.08)]',
      glow2: 'bg-emerald-500/5 shadow-[0_0_120px_rgba(118,138,117,0.08)]',
    };
  };

  const bg = getBgConfig();

  return (
    <div className="min-h-screen relative flex flex-col text-[#1F1A17] overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-900 bg-[#FAF8F5]">
      {/* Organic warm ambient background layer */}
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
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
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

        {/* Studio Workspace Footer */}
        <StudioFooter />
      </div>

      {/* Floating Pill Dock Navigation at bottom center */}
      <FloatingDock />
    </div>
  );
}
