'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen w-full bg-[#090b11] text-foreground flex flex-col items-center justify-center space-y-4">
      {/* Background radial glows */}
      <span className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />
      <span className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/5 blur-[80px] pointer-events-none" />

      <div className="p-4 bg-muted/40 rounded-2xl border border-border shadow-2xl relative animate-glow flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-20" />
      </div>

      <div className="text-center space-y-1 z-10">
        <h4 className="text-sm font-bold text-foreground">Syncing Aura Workspace</h4>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
          Loading layout states
        </p>
      </div>
    </div>
  );
}
