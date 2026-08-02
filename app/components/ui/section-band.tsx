import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function SectionBand({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        'rounded-none bg-success px-6 py-8 text-on-primary sm:px-8 sm:py-10',
        className,
      )}
      data-slot="section-band"
      {...props}
    />
  );
}

export { SectionBand };
