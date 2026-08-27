'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToastStore } from '@/store/toastStore';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      if (res?.reset_url) {
        setResetUrl(res.reset_url);
      }
      setIsSubmitted(true);
      toast.success('Password reset link generated!');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as { message?: string })?.message ||
        'Failed to send reset link. Please verify your email and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden bg-slate-900/80 backdrop-blur-xl"
    >
      {/* Glow Accent */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

      {!isSubmitted ? (
        <>
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Reset your password
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="forgot-email"
                className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending reset link…</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Back */}
          <div className="pt-2 border-t border-white/5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </>
      ) : (
        /* Confirmation State */
        <div className="py-4 text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-100">Check your inbox</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              We&apos;ve sent password reset instructions to{' '}
              <span className="text-violet-400 font-semibold">{email}</span>.
            </p>
          </div>

          {/* Direct link for local environment testing */}
          {resetUrl && (
            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-left space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Local Testing Reset Shortcut
              </span>
              <Link
                href={resetUrl}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 underline break-all"
              >
                <span>Click here to test Reset Password page</span>
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              </Link>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all cursor-pointer block text-center"
            >
              Return to Sign In
            </Link>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors underline cursor-pointer"
            >
              Didn&apos;t receive email? Try again
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
