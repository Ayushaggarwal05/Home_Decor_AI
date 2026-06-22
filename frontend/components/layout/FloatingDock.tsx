'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Compass, 
  Sparkles, 
  Columns, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Visually renamed items matching user request
const navigationItems = [
  { name: 'Studio', href: '/studio', icon: LayoutDashboard },
  { name: 'Create Space', href: '/upload', icon: UploadCloud },
  { name: 'Spatial Lab', href: '/research', icon: Compass },
  { name: 'AI Redesign', href: '/redesign', icon: Sparkles },
  { name: 'Compare Studio', href: '/compare', icon: Columns },
  { name: 'Environment', href: '/settings', icon: Settings },
];

export default function FloatingDock() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit">
      <nav 
        className={cn(
          "relative flex items-center justify-center gap-1.5 md:gap-3 px-4 py-3 rounded-3xl",
          "glass-panel shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/8 backdrop-blur-2xl",
          "bg-slate-950/70 select-none transition-all duration-300"
        )}
      >
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-colors duration-300",
                isActive 
                  ? "text-primary-foreground font-bold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Sliding Active Background (Framer Motion layoutId) */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-cyan-500/90 rounded-2xl -z-10 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover highlight background */}
              {hoveredIndex === index && !isActive && (
                <motion.div
                  layoutId="hover-nav-pill"
                  className="absolute inset-0 bg-white/5 rounded-2xl -z-10 border border-white/5"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {/* Icon with magnetic scale */}
              <motion.div
                animate={{
                  scale: hoveredIndex === index ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Icon className={cn("h-4.5 w-4.5", isActive ? "text-white" : "text-inherit")} />
              </motion.div>

              {/* Label - visible on larger screens or during active/hover state */}
              <span className="hidden md:inline relative">
                {item.name}
              </span>

              {/* Tiny glow indicator for active tab */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
