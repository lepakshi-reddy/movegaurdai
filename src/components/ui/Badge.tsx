import React from 'react';
import { cn } from '../../lib/utils';
import { AIStatus } from '../../types/exercises';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'green' | 'amber' | 'rose' | 'slate';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'cyan',
  children,
  ...props
}) => {
  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const AIStatusBadge: React.FC<{ status: AIStatus; isDemo?: boolean }> = ({
  status,
  isDemo,
}) => {
  if (isDemo) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        DEMO MODE — SIMULATED
      </span>
    );
  }

  const configs: Record<AIStatus, { color: string; dot: string; label: string }> = {
    'Loading AI': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dot: 'bg-blue-400 animate-ping', label: 'Loading AI Model...' },
    'AI Ready': { color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400', label: 'AI Ready' },
    'AI Live': { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400 animate-pulse', label: 'AI Live · Tracking' },
    'No Person Detected': { color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400', label: 'No Person Detected' },
    'Low Confidence': { color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', dot: 'bg-orange-400', label: 'Low Confidence' },
    'Camera Error': { color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-400', label: 'Camera Inaccessible' },
    'Demo Active': { color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400', label: 'Demo Active' },
  };

  const cfg = configs[status] || configs['AI Ready'];

  return (
    <span className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md', cfg.color)}>
      <span className={cn('w-2 h-2 rounded-full', cfg.dot)}></span>
      {cfg.label}
    </span>
  );
};
