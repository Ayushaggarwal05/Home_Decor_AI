'use client';

import React from 'react';
import { useToastStore, Toast, ToastType } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Icon map per toast type
// ---------------------------------------------------------------------------
const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
  error:   <XCircle      className="h-4 w-4 text-rose-400 shrink-0"    />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0"  />,
  info:    <Info          className="h-4 w-4 text-sky-400 shrink-0"     />,
};

const COLOR_MAP: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error:   'border-rose-500/30    bg-rose-500/10',
  warning: 'border-amber-500/30   bg-amber-500/10',
  info:    'border-sky-500/30     bg-sky-500/10',
};

// ---------------------------------------------------------------------------
// Single Toast item
// ---------------------------------------------------------------------------
function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-80 px-4 py-3 rounded-2xl border shadow-lg',
        'backdrop-blur-md bg-slate-900/80',
        'animate-in slide-in-from-bottom-4 fade-in-0 duration-300',
        COLOR_MAP[toast.type]
      )}
    >
      {ICON_MAP[toast.type]}

      <p className="flex-1 text-xs text-slate-200 leading-relaxed">
        {toast.message}
      </p>

      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast Container — mounted globally in layout.tsx
// ---------------------------------------------------------------------------
export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
