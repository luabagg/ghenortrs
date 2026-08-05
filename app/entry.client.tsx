/**
 * Remix client entry — hydrates the document.
 */
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { captureAuthRedirectError } from '~/b2b/auth-redirect-error';
import { initOutboundTracking } from '~/lib/tracking';

// Must run before any Supabase client is created (its own URL detection
// would otherwise race with this read) — see app/b2b/auth-redirect-error.ts.
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
