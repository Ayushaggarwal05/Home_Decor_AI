'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToastStore } from '@/store/toastStore';
import { authService } from '@/services/auth.service';
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Password reset token is missing or invalid. Please request a new link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      toast.success('Password updated successfully!');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as { message?: string })?.message ||
        'Failed to reset password. The link may have expired.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="py-6 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100">Invalid Reset Link</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            This password reset link is missing a valid security token or has expired.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer mt-2"
        >
          <span>Request New Reset Link</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {!isSuccess ? (
        <>
          {/* Header */}
          <div className="space-y-1.5 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Create new password
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your new password must be at least 8 characters long and different from previous passwords.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="new-password"
                className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Strength Meter */}
              <PasswordStrengthBar password={password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-amber-400">Passwords do not match.</p>
              )}
            </div>

            {/* Error alert */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Password…</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
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
        /* Success State */
        <div className="py-6 text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-100">Password Reset Complete</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Sign In with New Password
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden bg-slate-900/90 backdrop-blur-xl"
    >
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />
      <Suspense fallback={
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading reset page...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </motion.div>
  );
}
