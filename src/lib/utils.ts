import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function getFormScoreCategory(score: number): {
  label: string;
  color: string;
  badgeBg: string;
} {
  if (score >= 90) {
    return { label: 'Excellent', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  }
  if (score >= 75) {
    return { label: 'Good', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
  }
  if (score >= 60) {
    return { label: 'Needs improvement', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  }
  return { label: 'Needs correction', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
}
