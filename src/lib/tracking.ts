const STORE_HOST = 'store.ghenortrs.com.br';

interface OutboundClickPayload {
  section: string;
  destination: string;
}

function fireOutboundEvent(payload: OutboundClickPayload) {
  if (typeof window === 'undefined') return;

  const w = window as unknown as Record<string, unknown>;

  if (Array.isArray(w['dataLayer'])) {
    (w['dataLayer'] as unknown[]).push({
      event: 'outbound_commerce_click',
      ...payload,
    });
  }

  if (typeof w['gtag'] === 'function') {
    (w['gtag'] as (...args: unknown[]) => void)(
      'event',
      'outbound_commerce_click',
      payload,
    );
  }

  if (import.meta.env.DEV) {
    console.info('[GHENO tracking] outbound_commerce_click', payload);
  }
}

export function initOutboundTracking() {
  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href') ?? '';
    if (!href.includes(STORE_HOST)) return;

    const section =
      anchor.closest('[data-section]')?.getAttribute('data-section') ??
      'unknown';

    fireOutboundEvent({ section, destination: href });
  });
}
