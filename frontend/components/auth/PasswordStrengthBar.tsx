'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  const score = [hasMinLength, hasNumber, hasSpecial, hasUpper].filter(Boolean).length;

  let label = 'Weak';
  let barColor = 'bg-rose-500';
  let textColor = 'text-rose-400';

  if (score === 2) {
    label = 'Fair';
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (score === 3) {
    label = 'Good';
    barColor = 'bg-cyan-500';
    textColor = 'text-cyan-400';
  } else if (score === 4) {
    label = 'Strong';
    barColor = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  }

  const criteria = [
    { label: '8+ characters', met: hasMinLength },
    { label: 'At least 1 number', met: hasNumber },
    { label: '1 uppercase letter', met: hasUpper },
    { label: '1 special character', met: hasSpecial },
  ];

  return (
    <div className="space-y-2 mt-2 pt-1 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">Password strength</span>
        <span className={`text-[11px] font-bold ${textColor}`}>{label}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              step <= score ? barColor : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {item.met ? (
              <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 text-slate-600 flex-shrink-0" />
            )}
            <span className={item.met ? 'text-slate-300' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
