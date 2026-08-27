'use client';

import React, { useState } from 'react';
import { Mail, X, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultEmail = '',
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const toast = useToastStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate reset email request dispatch
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSent(true);
    toast.success('Password reset instructions sent to your email.');
  };

  const handleResetState = () => {
    setIsSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-600/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetState}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-2 rounded-full hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        {!isSent ? (
          <>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Reset Password</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter the email address linked with your Matter AI account, and we will send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetState}
                  className="flex-1 py-3 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Link</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Check your inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                We sent a password reset link to <span className="text-violet-400 font-semibold">{email}</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetState}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all cursor-pointer mt-4"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
