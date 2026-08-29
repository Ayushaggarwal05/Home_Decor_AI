'use client';

import React from 'react';
import { useToastStore } from '@/store/toastStore';

export function SocialAuthButtons() {
  const toast = useToastStore();

  const handleSocialAuth = (provider: string) => {
    toast.info(`${provider} sign-in initiated. Redirecting to provider...`);
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-slate-900 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest absolute">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialAuth('Google')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-violet-500/40 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocialAuth('GitHub')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-violet-500/40 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-current text-slate-100" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => handleSocialAuth('Apple')}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-violet-500/40 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-current text-slate-100" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.95c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.15 1.86-.99 2.96 1.07.08 2.14-.56 2.8-1.36z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
}
