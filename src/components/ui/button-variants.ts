import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex min-h-13 items-center justify-center gap-2 rounded-button border text-sm font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-accent bg-accent text-on-accent hover:border-accent-dark hover:bg-accent-dark',
        secondary:
          'border-strong bg-background-soft text-primary hover:border-accent hover:text-accent',
        nav: 'border-transparent bg-transparent text-secondary hover:border-border hover:text-primary',
        'nav-active': 'border-accent bg-accent text-on-accent',
      },
      size: {
        default: 'px-5',
        nav: 'px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);
