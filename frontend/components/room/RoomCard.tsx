'use client';

import React from 'react';
import { Room } from '../../types';
import { useRoomStore } from '@/store/roomStore';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';
import FadeIn from '../animations/FadeIn';

interface RoomCardProps {
  room: Room;
  delay?: number;
}

export default function RoomCard({ room, delay = 0 }: RoomCardProps) {
  const { setActiveRoom } = useRoomStore();

  return (
    <FadeIn delay={delay} direction="up" className="h-full">
      <div className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden group hover:border-[#D4AF37]/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full shadow-sm relative">
        {/* Card Image Thumbnail */}
        <div className="h-48 w-full relative overflow-hidden bg-slate-100">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overall score overlay tag */}
          {room.analysis?.scores?.overall && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black border border-[#E8E2D8] text-[#B8860B] shadow-md">
              {Math.round(room.analysis.scores.overall)}% Score
            </span>
          )}

          {/* Room Type overlay tag */}
          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[9px] font-bold text-white border border-white/10 uppercase tracking-wide">
            {room.type?.replace('_', ' ')}
          </span>
        </div>

        {/* Card Body content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
          <div>
            <h4 className="text-sm font-bold text-[#1F1A17] group-hover:text-[#B8860B] transition-colors truncate">{room.name}</h4>
            <p className="text-[10px] text-[#6E655F] mt-0.5">
              Style Target: <strong className="text-[#1F1A17] font-semibold">{room.stylePreference}</strong>
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 border-t border-[#E8E2D8] pt-4">
            <Link
              href="/research"
              onClick={() => setActiveRoom(room.id)}
              className="py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F4F0EA] hover:bg-[#EAE4DC] text-[#1F1A17] transition-colors flex items-center justify-center space-x-1.5 text-xs font-bold cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>Spatial Lab</span>
            </Link>
            
            <Link
              href="/redesign"
              onClick={() => setActiveRoom(room.id)}
              className="py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C86D51] hover:opacity-95 text-white transition-all flex items-center justify-center space-x-1.5 text-xs font-bold shadow-md shadow-[#D4AF37]/20 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Redesign</span>
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
