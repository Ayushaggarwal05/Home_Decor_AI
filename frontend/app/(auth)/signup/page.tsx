'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, UserPlus, Loader2, User, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const toast = useToastStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password.length < 8) {
      useAuthStore.setState({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    if (!agreeTerms) {
      useAuthStore.setState({ error: 'Please accept the Terms of Service to proceed.' });
      return;
    }

    try {
      await signup({ email, password, full_name: fullName });
      toast.success('Account created! Welcome to Matter AI.');
      router.push('/studio');
    } catch {
      // error shown inline from store
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden bg-slate-900/90 backdrop-blur-xl"
    >
      {/* Glow Accent */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Create your account
        </h1>
        <p className="text-xs text-slate-400">
          Join Matter AI to start mapping and optimizing your spaces.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="signup-email"
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
          <label
            htmlFor="signup-password"
            className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          <PasswordStrengthBar password={password} />
        </div>

        {/* Terms of Service Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-slate-400 hover:text-slate-300 text-xs">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded bg-slate-950 border-white/10 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer mt-0.5"
            />
            <span className="leading-tight">
              I agree to the{' '}
              <a href="#" className="text-violet-400 underline hover:text-violet-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-violet-400 underline hover:text-violet-300">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Error message */}
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
          id="signup-submit-btn"
          type="submit"
          disabled={isLoading || !email || !password || !fullName || !agreeTerms}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Free Account</span>
            </>
          )}
        </button>
      </form>

      {/* Social OAuth Buttons */}
      <SocialAuthButtons />

      {/* Footer Navigation */}
      <p className="text-center text-xs text-slate-500 pt-2 border-t border-white/5">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
