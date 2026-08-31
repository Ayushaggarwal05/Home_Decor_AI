'use client';

import React from 'react';
import { Bell, Sun, Moon, Flame, LogOut, ChevronDown } from 'lucide-react';
import { useRoomStore } from '@/store/roomStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { uiPreferences, toggleTheme } = useRoomStore();
  const { user, logout } = useAuthStore();
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: 'Room layout analysis complete. Optimization score: 84%', read: false },
    { id: 2, text: 'Your Scandinavian Redesign generation is ready.', read: true },
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = React.useState(false);

  // Derive initials for avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'AU';

  // Visually refined page titles
  const getPageTitle = () => {
    const segment = pathname?.split('/').pop() || 'studio';
    switch (segment) {
      case 'studio': return 'Studio Workspace';
      case 'upload': return 'Create Space';
      case 'research': return 'Spatial Lab';
      case 'redesign': return 'AI Redesign';
      case 'compare': return 'Compare Studio';
      case 'settings': return 'Environment Settings';
      default: return 'Matter Workspace';
    }
  };

  const getPageSubtitle = () => {
    const segment = pathname?.split('/').pop() || 'studio';
    switch (segment) {
      case 'studio': return 'Neural spatial intelligence & layout overview';
      case 'research': return 'Occupancy grids & accessibility heatmap vectors';
      case 'redesign': return 'Diffusion layout redesign & style inspirations';
      case 'upload': return 'Upload room scans to trigger neural 3D indexing';
      case 'compare': return 'Side-by-side delta checks on layout variables';
      case 'settings': return 'Configure spatial analytics & model parameters';
      default: return 'Spatial Interior Intelligence Studio';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-2xl border-b border-white/15 text-white shadow-xl relative font-sans">
      {/* Glowing bottom golden accent edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 py-4.5 sm:py-5 min-h-[74px] sm:min-h-[80px] flex items-center justify-between relative z-10">

        {/* 1️⃣ BRAND & ACTIVE TITLE */}
        <div className="flex items-center space-x-4 relative z-10">
          <Link href="/studio" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="p-2 bg-gradient-to-tr from-[#D4AF37] to-[#C86D51] rounded-xl shadow-md shadow-[#D4AF37]/25 group-hover:scale-105 transition-transform duration-300">
              <Flame className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-black tracking-widest text-white uppercase leading-none">
                Matter AI
              </h1>
              <p className="text-[9px] font-semibold text-[#D4AF37] tracking-widest uppercase leading-none mt-1">
                Spatial OS
              </p>
            </div>
          </Link>

          {/* Separator Line */}
          <div className="h-5 w-[1px] bg-white/15 hidden sm:block" />

          {/* Active Section Title */}
          <div>
            <h2 className="text-sm font-semibold tracking-normal text-slate-100 flex items-center gap-1.5">
              {getPageTitle()}
            </h2>
            <p className="text-[11px] font-normal text-slate-400 hidden md:block mt-0.5 max-w-md truncate">
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* 2️⃣ CONTROLLERS (RIGHT) */}
        <div className="flex items-center space-x-3 relative z-10">
          {/* Active Mode Indicator Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950/60 border border-white/10 text-xs font-normal text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]" />
            <span>Active Layer:</span>
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[11px]">
              {pathname?.includes('research') ? 'Spatial Lab' : 'Studio Engine'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 bg-slate-950/40 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Light/Dark Theme"
          >
            {uiPreferences.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-amber-200" />
            )}
          </button>

          {/* Notifications Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowProfileDropdown(false);
              }}
              className="p-2 rounded-xl border border-white/10 bg-slate-950/40 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
              aria-label="Open Notifications"
            >
              <Bell className="h-4 w-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              )}
            </button>

            {/* Notifications Dropdown Card */}
            <AnimatePresence>
              {showNotifDropdown && (
                <>
                  <div
                    onClick={() => setShowNotifDropdown(false)}
                    className="fixed inset-0 z-40 pointer-events-auto"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-white/15 shadow-2xl p-4 z-50 bg-slate-900 text-white backdrop-blur-2xl pointer-events-auto"
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Notifications
                      </h4>
                      <button
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          )
                        }
                        className="text-[10px] text-[#D4AF37] hover:text-amber-200 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-2.5 rounded-xl text-xs transition-colors border",
                            notif.read
                              ? "bg-slate-950/40 text-slate-400 border-white/5"
                              : "bg-slate-950/80 text-amber-100 border-[#D4AF37]/30"
                          )}
                        >
                          <p className="leading-relaxed">{notif.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border border-white/10 bg-slate-950/40 hover:bg-slate-800/80 transition-all cursor-pointer"
              aria-label="User account menu"
            >
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#C86D51] flex items-center justify-center font-extrabold text-white text-xs shadow-sm shadow-[#D4AF37]/20">
                {initials}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
            </button>

            {/* Profile Dropdown Card */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <div
                    onClick={() => setShowProfileDropdown(false)}
                    className="fixed inset-0 z-40 pointer-events-auto"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-white/15 shadow-2xl p-4 z-50 bg-slate-900 text-white backdrop-blur-2xl pointer-events-auto"
                  >
                    <div className="space-y-1 pb-3 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.fullName || "Matter User"}
                      </p>
                      <p className="text-[10px] text-slate-300 truncate font-mono">
                        {user?.email || "user@matterstudio.ai"}
                      </p>
                      <div className="pt-1">
                        <span className="px-2 py-0.5 text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] rounded font-bold border border-[#D4AF37]/30 uppercase tracking-widest">
                          {user?.tier || "Free"} Tier
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/15 rounded-xl transition-all cursor-pointer"
                      >
                        <span>Sign Out</span>
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
