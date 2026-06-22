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

  if (!uiPreferences.showDetections) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      <AnimatePresence>
        {detections.map((det) => (
          <motion.div
            key={det.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute border border-cyan-400/60 bg-cyan-400/5 rounded-lg flex flex-col justify-between"
            style={{
              left: `${det.boundingBox.x}%`,
              top: `${det.boundingBox.y}%`,
              width: `${det.boundingBox.width}%`,
              height: `${det.boundingBox.height}%`,
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)',
            }}
          >
            {/* Tag Badge */}
            <div className="self-start pointer-events-auto">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-cyan-500/90 text-white font-bold text-[9px] uppercase tracking-wider translate-x-[-1px] translate-y-[-18px] shadow-md border border-cyan-300/30 whitespace-nowrap">
                {det.label} <span className="ml-1 opacity-70">{(det.confidence * 100).toFixed(0)}%</span>
              </span>
            </div>
            
            {/* Frame corners styling for premium computer vision look */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
