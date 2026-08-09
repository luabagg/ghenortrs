/**
 * Remix client entry. Hydrates the document.
 */
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { captureAuthRedirectError } from '~/b2b/auth-redirect-error';
import { initOutboundTracking } from '~/lib/tracking';

// Run before any Supabase client is created (URL detect race).
// See app/b2b/auth-redirect-error.ts.
captureAuthRedirectError();

startTransition(() => {
  initOutboundTracking();
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
