import { useEffect, useRef } from 'react';

import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

/**
 * Expanded product photo. Sits above the drawer rather than inside it, so the
 * drawer stays open behind and Escape closes only the viewer.
 */
export function B2BImageViewer({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      // Distinct from the drawer's own label, which is the product name.
      aria-label={`Foto ampliada: ${alt}`}
      aria-modal="true"
      className="fixed inset-0 z-[60] grid place-items-center bg-overlay/88 p-4"
      role="dialog"
    >
      <button
        aria-label="Fechar imagem"
        className="absolute inset-0 cursor-zoom-out"
        tabIndex={-1}
        type="button"
        onClick={onClose}
      />

      <button
        ref={closeRef}
        aria-label="Fechar imagem"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-sm border border-border-strong bg-surface/90 text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        type="button"
        onClick={onClose}
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            strokeLinecap="round"
            strokeWidth={1.6}
          />
        </svg>
      </button>

      <img
        alt={alt}
        className="pointer-events-none relative max-h-[88dvh] max-w-full rounded-sm object-contain"
        src={src}
      />
    </div>
  );
}
