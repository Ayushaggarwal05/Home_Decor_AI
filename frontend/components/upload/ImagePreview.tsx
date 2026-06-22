'use client';

import React from 'react';
import { X, Eye } from 'lucide-react';
import { useRoomStore } from '@/store/roomStore';
import Image from 'next/image';

export default function ImagePreview() {
  const { uploadPreview, setUploadFile } = useRoomStore();

  if (!uploadPreview) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
      {/* We can use standard HTML img to avoid domain whitelist configurations in next.config */}
      <img
        src={uploadPreview}
        alt="Room Scan Upload Preview"
        className="w-full h-full object-cover object-center"
      />
      
      {/* Dim Overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Floating Utilities */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={() => setUploadFile(null)}
          className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-black/75 transition-colors cursor-pointer"
          title="Remove Room Image"
          aria-label="Remove Room Image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Upload Badge overlay */}
      <div className="absolute bottom-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/10 text-[10px] font-bold tracking-wide uppercase">
        <Eye className="h-3 w-3 text-cyan-400" />
        <span>Image Mounted</span>
      </div>
    </div>
  );
}
