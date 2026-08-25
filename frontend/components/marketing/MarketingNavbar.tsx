"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sparkles } from "lucide-react";

export default function MarketingNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="sticky top-4 z-50 px-4 w-full flex justify-center font-sans">
      <header className="w-full max-w-7xl bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl px-6 py-3.5 flex items-center justify-between text-white relative overflow-hidden">
        {/* Subtle glowing violet/cyan top highlight edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent pointer-events-none" />

        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2.5 group cursor-pointer"
        >
          <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <Flame className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-black tracking-wider text-white">
            MATTER AI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors cursor-pointer ${
                  isActive ? "text-cyan-400 font-bold" : "hover:text-cyan-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center space-x-3">
          <Link
            href="/studio"
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
            <span>Launch Console</span>
          </Link>
        </div>
      </header>
    </div>
  );
}
