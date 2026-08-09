import { useEffect, useId } from 'react';

type ScrollLockSnapshot = {
  htmlOverflow: string;
  bodyOverflow: string;
  htmlOverscroll: string;
  bodyOverscroll: string;
};

let ownerCount = 0;
let baseStyles: ScrollLockSnapshot | null = null;
const touchOwners = new Set<string>();

function applyDocumentLock(snapshot: ScrollLockSnapshot) {
  const html = document.documentElement;
  const { body } = document;
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
  body.style.overscrollBehavior = 'none';
  void snapshot;
}

function restoreDocumentLock(snapshot: ScrollLockSnapshot) {
  const html = document.documentElement;
  const { body } = document;
  html.style.overflow = snapshot.htmlOverflow;
  body.style.overflow = snapshot.bodyOverflow;
  html.style.overscrollBehavior = snapshot.htmlOverscroll;
  body.style.overscrollBehavior = snapshot.bodyOverscroll;
}

function onTouchMove(event: TouchEvent) {
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
}

function onTouchStart(event: TouchEvent) {
  const target = event.target;
  if (!(target instanceof Element) || !event.touches[0]) return;
  const scrollRoot = target.closest('[data-scroll-lock-scrollable]');
  if (scrollRoot instanceof HTMLElement) {
    scrollRoot.dataset.touchY = String(event.touches[0].clientY);
  }
}

function acquireTouchHandlers(ownerId: string) {
  const wasEmpty = touchOwners.size === 0;
  touchOwners.add(ownerId);
  if (!wasEmpty) return;
  document.addEventListener('touchstart', onTouchStart, {
    passive: true,
    capture: true,
  });
  document.addEventListener('touchmove', onTouchMove, {
    passive: false,
    capture: true,
  });
}

function releaseTouchHandlers(ownerId: string) {
  if (!touchOwners.delete(ownerId)) return;
  if (touchOwners.size > 0) return;
  document.removeEventListener('touchstart', onTouchStart, true);
  document.removeEventListener('touchmove', onTouchMove, true);
}

/** Lock document scroll while `locked` is true. Multi-owner safe. */
export function useBodyScrollLock(locked: boolean) {
  const ownerId = useId();

  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const { body } = document;

    if (ownerCount === 0) {
      baseStyles = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        htmlOverscroll: html.style.overscrollBehavior,
        bodyOverscroll: body.style.overscrollBehavior,
      };
      applyDocumentLock(baseStyles);
    }
    ownerCount += 1;
    acquireTouchHandlers(ownerId);

    return () => {
      releaseTouchHandlers(ownerId);
      ownerCount = Math.max(0, ownerCount - 1);
      if (ownerCount === 0 && baseStyles) {
        restoreDocumentLock(baseStyles);
        baseStyles = null;
      }
    };
  }, [locked, ownerId]);
}

/** Test helper: reset module owners between cases. */
export function __resetBodyScrollLockForTests() {
  ownerCount = 0;
  baseStyles = null;
  touchOwners.clear();
}
