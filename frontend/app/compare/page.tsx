'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import ComparisonGrid from '@/components/comparison/ComparisonGrid';
import Link from 'next/link';
import { 
  Columns, 
  ArrowLeft, 
  Layers, 
  Plus, 
  Check, 
  Info,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { rooms, compareRoomIds, toggleCompareRoom, clearComparison } = useRoomStore();

  const roomA = rooms.find(r => r.id === compareRoomIds[0]);
  const roomB = rooms.find(r => r.id === compareRoomIds[1]);

  return (
    <DashboardShell>
      <PageContainer>
        {/* Navigation title bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard" 
              className="p-2 border border-border bg-card hover:bg-muted/40 text-foreground rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">Layout Compare Model</h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 uppercase">
                  Delta Analytics
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Evaluate spatial layout clearance indexes side-by-side
              </p>
            </div>
          </div>
          
          {compareRoomIds.length > 0 && (
            <button
              onClick={clearComparison}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold underline cursor-pointer"
            >
              Clear Comparison Slots
            </button>
          )}
        </div>

        {/* Workspace content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Room Selector Sidebar (4 Columns) */}
          <div className="lg:col-span-4 glass-panel border rounded-3xl p-6 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Select Spaces to Compare</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Check exactly two rooms to load delta scores
              </p>
            </div>

            {rooms.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground space-y-3">
                <p>No room scan history available.</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/95 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Upload Scan
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {rooms.map((room) => {
                  const isChecked = compareRoomIds.includes(room.id);
                  const isSelectedAsFirst = compareRoomIds[0] === room.id;
                  
                  return (
                    <button
                      key={room.id}
                      onClick={() => toggleCompareRoom(room.id)}
                      className={cn(
                        "w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer",
                        isChecked 
                          ? isSelectedAsFirst 
                            ? "border-cyan-500/30 bg-cyan-500/5 text-slate-200 shadow-md"
                            : "border-violet-500/30 bg-violet-500/5 text-slate-200 shadow-md"
                          : "border-border bg-card/50 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {/* Tiny Thumbnail */}
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/5">
                          <img
                            src={room.imageUrl}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="font-bold text-xs text-foreground truncate">{room.name}</h5>
                          <p className="text-[9px] text-slate-400 capitalize">{room.type.replace('_', ' ')}</p>
                        </div>
                      </div>

                      {/* Status checkbox indicators */}
                      <div className={cn(
                        "h-5 w-5 rounded-lg border flex items-center justify-center transition-colors shrink-0",
                        isChecked 
                          ? isSelectedAsFirst 
                            ? "bg-cyan-500 border-cyan-400 text-white" 
                            : "bg-violet-500 border-violet-400 text-white"
                          : "border-border bg-card"
                      )}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Stats grids comparisons (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {roomA && roomB ? (
              <div className="space-y-6">
                {/* Images side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Image A */}
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-cyan-500/20 bg-slate-950">
                      <img
                        src={roomA.imageUrl}
                        alt={roomA.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-cyan-500/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase">
                        {roomA.name}
                      </span>
                    </div>
                  </div>

                  {/* Image B */}
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-violet-500/20 bg-slate-950">
                      <img
                        src={roomB.imageUrl}
                        alt={roomB.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-violet-500/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase">
                        {roomB.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown metrics table */}
                <ComparisonGrid roomA={roomA} roomB={roomB} />
              </div>
            ) : (
              <div className="glass-panel border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-muted/40 rounded-full text-muted-foreground">
                  <Columns className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">Select Comparative Rooms</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Select exactly two scanned spaces from the left sidebar to overlay and compare their spatial scores.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
