import { useEffect } from 'react';

/**
 * Locks document scroll while `locked` is true without jumping the page.
 * Overflow hide for desktop; touchmove block for iOS rubber-band behind overlays.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';

    const onTouchMove = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        event.preventDefault();
        return;
      }

      const scrollRoot = target.closest('[data-scroll-lock-scrollable]');
      if (!(scrollRoot instanceof HTMLElement)) {
        event.preventDefault();
        return;
      }

      const touch = event.touches[0];
      if (!touch) return;

      const previousY = Number(scrollRoot.dataset.touchY ?? touch.clientY);
      const deltaY = touch.clientY - previousY;
      scrollRoot.dataset.touchY = String(touch.clientY);

      const atTop = scrollRoot.scrollTop <= 0;
      const atBottom =
        scrollRoot.scrollTop + scrollRoot.clientHeight >=
        scrollRoot.scrollHeight - 1;

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !event.touches[0]) return;
      const scrollRoot = target.closest('[data-scroll-lock-scrollable]');
      if (scrollRoot instanceof HTMLElement) {
        scrollRoot.dataset.touchY = String(event.touches[0].clientY);
      }
    };

    document.addEventListener('touchstart', onTouchStart, {
      passive: true,
      capture: true,
    });
    document.addEventListener('touchmove', onTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      document.removeEventListener('touchstart', onTouchStart, true);
      document.removeEventListener('touchmove', onTouchMove, true);
    };
  }, [locked]);
}
