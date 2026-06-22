'use client';

import React from 'react';
import { Eye, MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original",
  afterLabel = "AI Redesign",
  className = ""
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left click held
      handleMove(e.clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-3xl border border-border aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 cursor-ew-resize ${className}`}
    >
      {/* Before Image (Background Layer) */}
      <img
        src={beforeImage}
        alt="Original Room Layout"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute bottom-4 left-4 z-20 inline-flex items-center px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
        {beforeLabel}
      </div>

      {/* After Image (Clipped Foreground Layer) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={afterImage}
          alt="AI Redesigned Room Layout"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 z-20 inline-flex items-center px-2 py-1 rounded-lg bg-primary/70 backdrop-blur-md text-[10px] font-bold text-white border border-primary/20">
          {afterLabel}
        </div>
      </div>

      {/* Slide Bar Divider & Thumb Handler */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white text-slate-900 border border-slate-300 shadow-xl flex items-center justify-center pointer-events-auto">
          <MoveHorizontal className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Floating Instructions */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-xs text-[9px] text-white/70">
        <Eye className="h-3 w-3" />
        <span>Drag center handle to split view</span>
      </div>
    </div>
  );
}
