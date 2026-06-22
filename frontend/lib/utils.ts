import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format scores
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

// Helper to convert units
export function formatDimension(value: number, unit: 'ft' | 'm'): string {
  return `${value}${unit}`;
}
