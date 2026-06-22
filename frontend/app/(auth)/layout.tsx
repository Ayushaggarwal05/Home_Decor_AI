import React from 'react';
import Link from 'next/link';

// Minimal layout wrapper for auth pages — keeps them outside DashboardShell
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base">A</span>
            </div>
            <span className="text-slate-100 font-bold text-lg tracking-tight">
              Aura AI
            </span>
          </Link>
        </div>

        {children}
      </div>
    </main>
  );
}
