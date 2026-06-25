'use client';

import React from 'react';
import { Bell, Sun, Moon, Sparkles, Compass, Flame, LogOut, ChevronDown } from 'lucide-react';
import { useRoomStore } from '@/store/roomStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
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

  // Visually renamed routes as per user request
  const getPageTitle = () => {
    const segment = pathname?.split('/').pop() || 'studio';
    switch (segment) {
      case 'studio': return 'Studio';
      case 'upload': return 'Create Space';
      case 'research': return 'Spatial Lab';
      case 'redesign': return 'AI Redesign';
      case 'compare': return 'Compare Studio';
      case 'settings': return 'Environment';
      default: return 'Aura Workspace';
    }
  };

  const getPageSubtitle = () => {
    const segment = pathname?.split('/').pop() || 'studio';
    switch (segment) {
      case 'studio': return 'Spatial interior intelligence overview';
      case 'research': return 'Occupancy grids, object detections, and accessibility heatmap vectors';
      case 'redesign': return 'Diffusion redesign grids, before/after layers, and inspirations';
      case 'upload': return 'Upload room blueprints or images to trigger neural layout mapping';
      case 'compare': return 'Side-by-side delta checks on layout optimization variables';
      case 'settings': return 'Configure spatial analytics and environment configurations';
      default: return 'Spatial Interior Intelligence Studio';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between bg-slate-950/20 backdrop-blur-md">
      {/* Brand & Page Header */}
      <div className="flex items-center space-x-5">
        {/* Logo Brand area */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-500/20">
            <Flame className="h-4.5 w-4.5 text-white animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-widest text-slate-100 uppercase">
              Aura AI
            </h1>
            <p className="text-[8px] text-cyan-400 tracking-widest uppercase font-semibold leading-none mt-0.5">
              Spatial OS
            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

        {/* Active Title */}
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-100 flex items-center gap-1.5">
            {getPageTitle()}
          </h2>
          <p className="text-[10px] text-slate-400 hidden md:block mt-0.5 max-w-md truncate">
            {getPageSubtitle()}
          </p>
        </div>
      </div>

      {/* Action Controllers */}
      <div className="flex items-center space-x-3.5">
        {/* Active Mode indicator badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/40 border border-white/5 text-[10px] font-bold text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Active Layer:</span>
          <span className="text-cyan-400 font-extrabold uppercase tracking-wider">
            {pathname?.includes('research') ? 'Spatial Lab' : 'Studio Engine'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-white/10 transition-all cursor-pointer shrink-0"
          title="Toggle Light/Dark Theme"
          aria-label="Toggle Light/Dark Theme"
        >
          {uiPreferences.theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-yellow-400" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-indigo-400" />
          )}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2.5 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-white/10 transition-all cursor-pointer relative"
            aria-label="Open Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifDropdown && (
              <>
                <div 
                  onClick={() => setShowNotifDropdown(false)} 
                  className="fixed inset-0 z-30" 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-80 rounded-2xl glass-panel border border-white/10 shadow-2xl p-4 z-40 bg-slate-950/90 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Notifications</h4>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-violet-400 hover:text-violet-300 hover:underline font-semibold"
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
                            ? "bg-slate-900/20 text-slate-400 border-transparent" 
                            : "bg-violet-950/15 text-slate-200 border-violet-500/20"
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

        {/* User profile dropdown - Refactored from Sidebar */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/40 transition-all cursor-pointer"
            aria-label="User account menu"
          >
            <div className="h-7.5 w-7.5 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
              {initials}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <div 
                  onClick={() => setShowProfileDropdown(false)} 
                  className="fixed inset-0 z-30" 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-60 rounded-2xl glass-panel border border-white/10 shadow-2xl p-4 z-40 bg-slate-950/90 backdrop-blur-xl"
                >
                  <div className="space-y-1 pb-3 border-b border-white/5">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {user?.fullName || 'Aura User'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {user?.email || 'user@aurastudio.ai'}
                    </p>
                    <div className="pt-1">
                      <span className="px-2 py-0.5 text-[8px] bg-violet-500/20 text-violet-300 rounded font-bold border border-violet-500/20 uppercase tracking-widest">
                        {user?.tier || 'Free'} Tier
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
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
    </header>
  );
}
