import type { LabelHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'text-sm font-bold uppercase tracking-[0.12em] text-secondary',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
