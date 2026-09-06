import { useEffect, type RefObject } from 'react';

/**
 * Closes a popover on Escape or on a pointer press outside it. The ref must
 * wrap the trigger as well as the panel, so pressing the trigger to close
 * does not also count as an outside press.
 */
export function useDismissOnOutside(
  open: boolean,
  onDismiss: () => void,
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onDismiss, open, ref]);
}
