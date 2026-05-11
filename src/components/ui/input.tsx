import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function Input({
  className,
  type = 'text',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-13 w-full rounded-button border border-strong bg-background-soft px-4 text-base text-primary transition-colors placeholder:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
