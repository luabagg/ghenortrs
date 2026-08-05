import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * One QueryClient per render tree: a fresh instance per SSR request, a
 * single stable instance for the lifetime of the app on the client. This
 * must wrap the route tree used by both `entry.server.tsx` and
 * `entry.client.tsx` (i.e. `root.tsx`), not just the client hydration call —
 * B2B hooks call `useQuery`/`useMutation` from components that Remix
 * server-renders, and those throw without a `QueryClientProvider` ancestor.
 */
export function B2BQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
