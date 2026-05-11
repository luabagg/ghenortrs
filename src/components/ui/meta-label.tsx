import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type MetaLabelProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

function MetaLabel({ asChild = false, className, ...props }: MetaLabelProps) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      className={cn(
        'inline-flex w-fit rounded-pill bg-accent-dark px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-on-accent',
        className,
      )}
      data-slot="meta-label"
      {...props}
    />
  );
}

export { MetaLabel };
