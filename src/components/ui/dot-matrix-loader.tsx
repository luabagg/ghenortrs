import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type DotMatrixLoaderProps = HTMLAttributes<HTMLDivElement> & {
  caption?: string;
};

const matrixCells = Array.from({ length: 9 }, (_, index) => index);

function DotMatrixLoader({
  'aria-label': ariaLabel,
  caption = 'Carregando.',
  className,
  ...props
}: DotMatrixLoaderProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'rounded-panel border border-border bg-surface p-6 text-primary',
        className,
      )}
      role="status"
      {...props}
    >
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Loading state
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-secondary">
            {caption}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="gnhf-dot-matrix grid grid-cols-3 gap-2"
        >
          {matrixCells.map((cell) => (
            <span
              className="gnhf-dot-matrix__cell block h-3 w-3 rounded-pill bg-accent"
              data-testid="dot-matrix-cell"
              key={cell}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { DotMatrixLoader };
