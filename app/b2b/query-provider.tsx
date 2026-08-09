import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * One QueryClient per render tree.
 * Fresh instance per SSR request. One stable instance on the client.
 * Wrap the route tree in `root.tsx` for both `entry.server.tsx` and
 * `entry.client.tsx`. B2B hooks call `useQuery`/`useMutation` during SSR.
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
