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
        'inline-flex w-fit text-xs font-bold uppercase tracking-[0.14em] text-secondary',
        className,
      )}
      data-slot="meta-label"
      {...props}
    />
  );
}

export { MetaLabel };
