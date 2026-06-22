'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Loader2, CheckCircle2, Circle, Activity, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadProgress() {
  const { uploadStatus, uploadProgress } = useRoomStore();

  if (uploadStatus === 'idle' || uploadStatus === 'done' || uploadStatus === 'error') return null;

  // Describe the pipeline steps
  const steps = [
    { id: 1, name: 'Secure File Sync', status: uploadStatus === 'uploading' ? 'active' : 'complete' },
    { id: 2, name: 'Spatial Object Mapping (CV)', status: uploadStatus === 'uploading' ? 'pending' : 'active' },
    { id: 3, name: 'Occupancy Grid Solver', status: uploadStatus === 'uploading' ? 'pending' : 'active' },
    { id: 4, name: 'Symmetry & Flow Diagnostics', status: uploadStatus === 'uploading' ? 'pending' : 'active' }
  ];

  return (
    <div className="w-full glass-panel border rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <span className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center">
            <Activity className="h-4 w-4 mr-2 text-cyan-400 animate-pulse" />
            {uploadStatus === 'uploading' 
              ? 'Transmitting Spatial Assets...' 
              : 'Executing Neural Layout Maps...'}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {uploadStatus === 'uploading' 
              ? `Uploading raw room scan image` 
              : 'Calibrating furniture boundaries and flow corridors'}
          </p>
        </div>
        <span className="text-sm font-black text-cyan-400 glow-cyan">
          {uploadStatus === 'uploading' ? `${uploadProgress}%` : 'Processing'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative">
        {uploadStatus === 'uploading' ? (
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-secondary to-primary w-1/2 rounded-full animate-bounce absolute left-0 right-0 mx-auto" />
        )}
      </div>

      {/* Checklist Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={cn(
              "p-3 rounded-xl border flex items-center space-x-2.5 transition-all duration-300",
              step.status === 'complete' && "border-green-500/20 bg-green-500/5 text-green-500",
              step.status === 'active' && "border-cyan-500/20 bg-cyan-500/5 text-cyan-400 font-bold",
              step.status === 'pending' && "border-border bg-card text-muted-foreground opacity-60"
            )}
          >
            {step.status === 'complete' && <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />}
            {step.status === 'active' && <Loader2 className="h-4.5 w-4.5 animate-spin shrink-0" />}
            {step.status === 'pending' && <Circle className="h-4.5 w-4.5 shrink-0" />}
            
            <span className="text-[11px] truncate">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
