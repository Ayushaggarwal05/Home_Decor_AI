'use client';

import React from 'react';
import { Room } from '../../types';
import { useRoomStore } from '@/store/roomStore';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, ChevronRight, Calendar, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentScansProps {
  rooms: Room[];
}

export default function RecentScans({ rooms }: RecentScansProps) {
  const { setActiveRoom } = useRoomStore();
  const router = useRouter();

  const handleAction = (roomId: string, targetPath: '/research' | '/redesign') => {
    setActiveRoom(roomId);
    router.push(targetPath);
  };

  return (
    <div className="glass-panel border rounded-3xl p-6 space-y-4 shadow-md">
      <div>
        <h4 className="text-sm font-bold text-foreground">Recent Scan Directory</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          History log of mapped room bounds and neural redesign assets
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px] text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-3">
              <th className="pb-3.5 pl-2">Environment</th>
              <th className="pb-3.5">Category</th>
              <th className="pb-3.5">Upload Date</th>
              <th className="pb-3.5 text-center">Diagnostics</th>
              <th className="pb-3.5 text-right pr-2">Workspace Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rooms.slice(0, 5).map((room) => (
              <tr key={room.id} className="hover:bg-muted/10 transition-colors group">
                {/* Room Info */}
                <td className="py-3.5 pl-2 flex items-center space-x-3">
                  <div className="h-10 w-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/5">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block group-hover:text-primary transition-colors">
                      {room.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      Unit Mappings: {room.dimensions?.length}x{room.dimensions?.width} {room.dimensions?.unit}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 capitalize text-slate-300">
                  {room.type.replace('_', ' ')}
                </td>

                {/* Date */}
                <td className="py-3.5 text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>

                {/* Scores */}
                <td className="py-3.5 text-center">
                  {room.analysis?.scores.overall ? (
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400">
                      <span>{room.analysis.scores.overall}% Optimization</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No diagnostics calculated</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 text-right pr-2">
                  <div className="inline-flex space-x-2">
                    <button
                      onClick={() => handleAction(room.id, '/research')}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground transition-all cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Compass className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Audit</span>
                    </button>
                    <button
                      onClick={() => handleAction(room.id, '/redesign')}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white transition-all cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Redesign</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
