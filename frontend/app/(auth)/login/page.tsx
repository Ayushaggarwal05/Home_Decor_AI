'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, LogIn, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const toast = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      toast.success('Welcome back! Redirecting to studio…');
      router.push('/studio');
    } catch {
      // error is already set in store and displayed inline
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

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Sign in to Matter AI
        </h1>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your spatial intelligence workspace.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="login-email"
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded bg-slate-950 border-white/10 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
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

        {/* Submit Button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating…</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Social OAuth Buttons */}
      <SocialAuthButtons />

      {/* Sign up prompt footer */}
      <p className="text-center text-xs text-slate-500 pt-2 border-t border-white/5">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
        >
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
