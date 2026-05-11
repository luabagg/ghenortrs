import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button };
