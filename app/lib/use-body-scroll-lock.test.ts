import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  __resetBodyScrollLockForTests,
  useBodyScrollLock,
} from './use-body-scroll-lock';

afterEach(() => {
  cleanup();
  __resetBodyScrollLockForTests();
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.documentElement.style.overscrollBehavior = '';
  document.body.style.overscrollBehavior = '';
});

describe('useBodyScrollLock', () => {
  it('keeps the document locked while any owner remains active', () => {
    const first = renderHook(
      ({ locked }: { locked: boolean }) => useBodyScrollLock(locked),
      { initialProps: { locked: true } },
    );
    const second = renderHook(
      ({ locked }: { locked: boolean }) => useBodyScrollLock(locked),
      { initialProps: { locked: true } },
    );

    expect(document.body.style.overflow).toBe('hidden');

    first.rerender({ locked: false });
    expect(document.body.style.overflow).toBe('hidden');

    second.rerender({ locked: false });
    expect(document.body.style.overflow).toBe('');
  });
});
