'use client';

import React from 'react';
import { DetectionResult } from '../../types';
import { useRoomStore } from '@/store/roomStore';
import { motion, AnimatePresence } from 'framer-motion';

interface DetectionOverlayProps {
  detections: DetectionResult[];
}

export default function DetectionOverlay({ detections }: DetectionOverlayProps) {
  const { uiPreferences } = useRoomStore();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  if (!uiPreferences.showDetections) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      <AnimatePresence>
        {detections.map((det) => {
          const isHeavy = ['bed', 'desk', 'sofa', 'sideboard', 'bookshelf'].includes(det.label.toLowerCase());
          const isCloseToWall = 
            det.boundingBox.x < 6.5 || 
            (100 - det.boundingBox.x - det.boundingBox.width) < 6.5 || 
            det.boundingBox.y < 6.5 || 
            (100 - det.boundingBox.y - det.boundingBox.height) < 6.5;
          const isAnchoredWarning = isHeavy && !isCloseToWall;

          return (
            <motion.div
              key={det.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onMouseEnter={() => setHoveredId(det.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute border border-cyan-400/60 bg-cyan-400/5 rounded-lg flex flex-col justify-between pointer-events-auto cursor-help"
              style={{
                left: `${det.boundingBox.x}%`,
                top: `${det.boundingBox.y}%`,
                width: `${det.boundingBox.width}%`,
                height: `${det.boundingBox.height}%`,
                boxShadow: isAnchoredWarning 
                  ? '0 0 16px rgba(244, 63, 94, 0.25)' 
                  : '0 0 12px rgba(6, 182, 212, 0.15)',
                borderColor: isAnchoredWarning ? 'rgba(244, 63, 94, 0.6)' : 'rgba(6, 182, 212, 0.6)',
              }}
            >
              {/* Tag Badge */}
              <div className="self-start pointer-events-none">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-white font-bold text-[9px] uppercase tracking-wider translate-x-[-1px] translate-y-[-18px] shadow-md border whitespace-nowrap ${
                  isAnchoredWarning 
                    ? 'bg-rose-500/90 border-rose-300/30' 
                    : 'bg-cyan-500/90 border-cyan-300/30'
                }`}>
                  {det.label} <span className="ml-1 opacity-70">{(det.confidence * 100).toFixed(0)}%</span>
                </span>
              </div>
              
              {/* Floating Glassmorphic Tooltip */}
              <AnimatePresence>
                {hoveredId === det.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 w-52 z-30 pointer-events-none select-none"
                  >
                    <div className="glass-panel border border-white/10 rounded-2xl p-3 bg-slate-950/90 text-white shadow-2xl flex flex-col gap-1.5 backdrop-blur-md">
                      <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                        <span className="font-bold text-cyan-400 capitalize">{det.label}</span>
                        <span className="font-semibold text-slate-400">{(det.confidence * 100).toFixed(0)}% Confidence</span>
                      </div>
                      
                      {det.dimWidth && (
                        <div className="flex flex-col gap-0.5 text-[9px] text-slate-300">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Metric Volume</span>
                          <span className="font-mono">{det.dimWidth} × {det.dimDepth} × {det.dimHeight} {uiPreferences.defaultUnit === 'ft' ? 'ft' : 'm'}</span>
                        </div>
                      )}
                      
                      {isAnchoredWarning && (
                        <div className="text-[8px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-xl font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 justify-center mt-1">
                          <span>⚠️ Not Anchored to Wall</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Frame corners styling for premium computer vision look */}
              <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl-md ${isAnchoredWarning ? 'border-rose-400' : 'border-cyan-400'}`} />
              <div className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr-md ${isAnchoredWarning ? 'border-rose-400' : 'border-cyan-400'}`} />
              <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 rounded-bl-md ${isAnchoredWarning ? 'border-rose-400' : 'border-cyan-400'}`} />
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 rounded-br-md ${isAnchoredWarning ? 'border-rose-400' : 'border-cyan-400'}`} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
