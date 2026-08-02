import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  density?: 'default' | 'strong';
};

const baseGlassClassName = 'gheno-glass relative rounded-panel text-primary';

function GlassPanel({
  children,
  className,
  density = 'default',
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        baseGlassClassName,
        density === 'strong' ? 'gheno-glass-strong' : '',
        className,
      )}
      data-slot="glass-panel"
      {...props}
    >
      {children}
    </div>
  );
}

export { GlassPanel };
