'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const toast = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      toast.success('Welcome back! Redirecting to studio…');
      router.push('/studio');
    } catch {
      // error is already set in the store; shown inline
    }
  };

  return (
    <div className="glass-panel border border-white/8 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-100">Sign in to Aura AI</h1>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your spatial intelligence workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              disabled={isLoading}
              className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs"
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
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

      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
