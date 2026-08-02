import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type DotMatrixLoaderProps = HTMLAttributes<HTMLDivElement> & {
  caption?: string;
};

const matrixCells = Array.from({ length: 9 }, (_, index) => index);
const motionOffsets = [0, 0.12, 0.24, 0.12, 0.36, 0.12, 0.24, 0.12, 0.48];

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
            CARREGANDO
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
              className="block h-3 w-3 rounded-pill bg-accent [animation:gnhf-dot-matrix-pulse_1.2s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-100"
              data-testid="dot-matrix-cell"
              key={cell}
              style={{ animationDelay: `${motionOffsets[cell]}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { DotMatrixLoader };
