/**
 * Remix client entry — hydrates the document.
 */
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { initOutboundTracking } from '~/lib/tracking';

startTransition(() => {
  initOutboundTracking();
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
