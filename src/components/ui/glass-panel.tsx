import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-panel border border-border bg-surface-glass/80 text-primary shadow-[0_20px_48px_rgba(0,0,0,0.24)] backdrop-blur-xl',
        className,
      )}
      data-slot="glass-panel"
      {...props}
    />
  );
}

export { GlassPanel };
