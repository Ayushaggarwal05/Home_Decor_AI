'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Sparkles, 
  Compass, 
  Columns, 
  Settings, 
  Menu, 
  X,
  Flame,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

// Setup routing map for links
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Room', href: '/upload', icon: UploadCloud },
  { name: 'Research AI', href: '/research', icon: Compass },
  { name: 'Smart Redesign', href: '/redesign', icon: Sparkles },
  { name: 'Compare Layouts', href: '/compare', icon: Columns },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuthStore();

  // Derive initials for avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'AU';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-panel text-foreground md:hidden hover:bg-muted transition-colors cursor-pointer"
        aria-label="Toggle Navigation Sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 w-64 glass-panel border-r flex flex-col justify-between py-6 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo Brand area */}
          <div className="px-6 mb-8 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg animate-glow">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                AURA AI
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">
                Spatial Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-3">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary shadow-[inset_4px_0_12px_rgba(139,92,246,0.15)]"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.name}

                  {isActive && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary shadow-glow animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile brief */}
        <div className="px-4 border-t border-border pt-4 mt-auto">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/30 transition-all duration-200">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.fullName || user?.email || 'Aura User'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email ?? ''}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="px-1.5 py-0.5 text-[8px] bg-primary/20 text-primary rounded font-bold border border-primary/20 uppercase">
                {user?.tier ?? 'Free'}
              </span>
              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
