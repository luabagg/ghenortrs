import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Remix hooks that need a full Remix data router are mocked for unit tests.
// Client validation runs before useSubmit is invoked.
vi.mock('@remix-run/react', async () => {
  const actual =
    await vi.importActual<typeof import('@remix-run/react')>(
      '@remix-run/react',
    );
  return {
    ...actual,
    useSubmit: () => vi.fn(),
    // Real navigation cannot run here (see the note at the bottom of this
    // file), and letting it try throws an unhandled error. Tests that care
    // about a redirect mock this hook themselves and assert the call.
    useNavigate: () => vi.fn(),
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

// Known harness limit: a programmatic navigation inside a test throws
// "RequestInit: Expected signal to be an instance of AbortSignal" from
// @remix-run/router, because jsdom and Node's fetch disagree on which realm
// owns AbortSignal. Assert the navigate call itself instead of the landing
// route, the way b2b-page.test.tsx does.
