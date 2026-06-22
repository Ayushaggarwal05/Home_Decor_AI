'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const toast = useToastStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password.length < 6) {
      useAuthStore.setState({ error: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      await signup({ email, password, full_name: fullName });
      toast.success('Account created! Welcome to Aura AI.');
      router.push('/studio');
    } catch {
      // error shown inline from store
    }
  };

  return (
    <div className="glass-panel border border-white/8 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-100">Create your account</h1>
        <p className="text-xs text-slate-400">
          Join Aura AI to start mapping and optimising your spaces.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Email Address
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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
          {password && password.length < 6 && (
            <p className="text-[11px] text-amber-400">
              Password must be at least 6 characters.
            </p>
          )}
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
          id="signup-submit-btn"
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
