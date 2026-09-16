import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-navy-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-glass hover:border-slate-700/80 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
