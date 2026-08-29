import { apiUrl } from '@/b2b/config';
import type {
  B2BCatalogProduct,
  B2BSessionResponse,
  QuoteSelectionItem,
} from '@/b2b/types';
import { getBrowserSession } from '@/b2b/supabase-browser';

async function authHeaders(): Promise<HeadersInit> {
  const session = await getBrowserSession();
  if (!session?.access_token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchB2BSession(): Promise<B2BSessionResponse> {
  const headers = await authHeaders();
  const res = await fetch(apiUrl('/api/b2b-session'), { headers });
  if (res.status === 401) {
    return { authenticated: false, seller: null, gate: 'anonymous' };
  }
  if (!res.ok) {
    throw new Error('session_failed');
  }
  return (await res.json()) as B2BSessionResponse;
}

export async function registerSeller(input: {
  empresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  mensagem: string;
  website?: string;
}): Promise<{
  success?: boolean;
  status?: string;
  error?: string;
  message?: string;
}> {
  const headers = await authHeaders();
  const res = await fetch(apiUrl('/api/b2b-register'), {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
  return (await res.json()) as {
    success?: boolean;
    status?: string;
    error?: string;
    message?: string;
  };
}

export async function fetchB2BCatalog(query = ''): Promise<{
  products: B2BCatalogProduct[];
  defaultMinQuantity: number;
}> {
  const headers = await authHeaders();
  const url = new URL(apiUrl('/api/b2b-catalog'));
  if (query.trim()) url.searchParams.set('q', query.trim());
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'catalog_failed');
  }
  const data = (await res.json()) as {
    products: B2BCatalogProduct[];
    defaultMinQuantity: number;
  };
  return data;
}

export async function submitB2BQuote(input: {
  items: QuoteSelectionItem[];
  notes: string;
}): Promise<{ success?: boolean; error?: string; message?: string }> {
  const headers = await authHeaders();
  const res = await fetch(apiUrl('/api/b2b-quote'), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      notes: input.notes,
      items: input.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }),
  });
  return (await res.json()) as {
    success?: boolean;
    error?: string;
    message?: string;
  };
}
