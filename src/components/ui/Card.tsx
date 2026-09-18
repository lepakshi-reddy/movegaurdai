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
        'bg-white/[0.045] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-glass hover:border-white/25 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
