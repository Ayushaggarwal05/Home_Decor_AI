'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Sparkles, MessageSquareCode } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Japandi style with natural wood tones and minimalist lighting',
  'Industrial loft with red brick accent walls and exposed conduits',
  'Maximise floor space and remove high-volume clutters',
  'Scandinavian living room with cozy bouclé fabrics and pastel cues',
  'Biophilic home office with organic shelving and hanging plants'
];

export default function PromptInput() {
  const { prompt, setPrompt } = useRoomStore();

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label htmlFor="redesign-prompt" className="text-sm font-bold text-foreground flex items-center space-x-1.5">
          <MessageSquareCode className="h-4.5 w-4.5 text-primary" />
          <span>Generative Redesign Prompt (Optional)</span>
        </label>
        <span className="text-[10px] text-muted-foreground font-medium">
          {prompt.length}/500 chars
        </span>
      </div>

      <textarea
        id="redesign-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
        placeholder="e.g., Add low-profile oak furniture, maximize natural light from the left windows, and replace the dark bookshelf with floating wood racks..."
        className="w-full min-h-[100px] p-4 rounded-2xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none glass-panel"
      />

      {/* Suggested Quick Prompt Chips */}
      <div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-2">
          Suggested Style Directives
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="px-2.5 py-1 rounded-lg bg-muted/40 border border-border text-[11px] font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-left"
            >
              + {suggestion.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
