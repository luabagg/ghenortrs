import { cva } from 'class-variance-authority';

/**
 * Marketing CTAs: outline (red), secondary (white outline), ghost (text).
 * Keep `primary` filled for form submits only.
 */
export const buttonVariants = cva(
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-button border text-sm font-bold uppercase tracking-[0.08em] transition-colors active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-accent bg-accent text-on-accent hover:border-accent-dark hover:bg-accent-dark',
        outline:
          'border border-accent bg-transparent text-primary hover:bg-accent hover:text-on-accent',
        secondary:
          'border border-primary/55 bg-transparent text-primary hover:border-primary hover:bg-primary/8',
        ghost:
          'min-h-0 border-transparent bg-transparent px-0 text-secondary hover:text-primary',
        nav: 'min-h-0 rounded-none border-transparent bg-transparent p-0 text-primary/88 hover:text-primary',
        'nav-active':
          'min-h-0 rounded-none border-transparent bg-transparent p-0 text-primary',
      },
      size: {
        default: 'px-5',
        nav: 'px-0 py-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);
