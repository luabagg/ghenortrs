const STORE_HOST = 'store.ghenortrs.com.br';

interface OutboundClickPayload {
  section: string;
  destination: string;
}

type FormEventName =
  | 'b2b_form_submit_attempt'
  | 'b2b_form_validation_error'
  | 'b2b_form_submit_success'
  | 'b2b_form_submit_error';

interface FormEventPayload {
  form: 'b2b_lead' | 'b2b_seller_register';
  error_count?: number;
}

function fireEvent(eventName: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const w = window as unknown as Record<string, unknown>;

  if (Array.isArray(w['dataLayer'])) {
    (w['dataLayer'] as unknown[]).push({ event: eventName, ...payload });
  }

  if (typeof w['gtag'] === 'function') {
    (w['gtag'] as (...args: unknown[]) => void)('event', eventName, payload);
  }

  const isDev =
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
    (typeof import.meta !== 'undefined' &&
      Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV));
  if (isDev) {
    console.info(`[GHENO rotors tracking] ${eventName}`, payload);
  }
}

function fireOutboundEvent(payload: OutboundClickPayload) {
  fireEvent(
    'outbound_commerce_click',
    payload as unknown as Record<string, unknown>,
  );
}

export function trackFormEvent(
  eventName: FormEventName,
  payload: FormEventPayload,
) {
  fireEvent(eventName, payload as unknown as Record<string, unknown>);
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
