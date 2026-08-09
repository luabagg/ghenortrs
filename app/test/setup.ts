import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Remix hooks that need a full data router.
// Client validation runs before useSubmit.
vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual<typeof import('@remix-run/react')>(
    '@remix-run/react',
  );
  return {
    ...actual,
    useSubmit: () => vi.fn(),
    useNavigation: () => ({ state: 'idle', formData: undefined }),
    useActionData: () => undefined,
    useFetcher: () => ({
      state: 'idle',
      submit: vi.fn(),
      data: undefined,
      Form: actual.Form,
    }),
  };
});

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  disconnect() {}

  observe(target: Element) {
    this.callback(
      [
        {
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          isIntersecting: true,
          rootBounds: null,
          target,
          time: 0,
        },
      ],
      this,
    );
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

globalThis.IntersectionObserver = TestIntersectionObserver;
