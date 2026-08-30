import { describe, expect, it } from 'vitest';

import { publicOriginFromRequest } from './public-origin';

function requestWith(
  url: string,
  headers: Record<string, string> = {},
): Request {
  return new Request(url, { headers });
}

describe('publicOriginFromRequest', () => {
  it('prefers a public x-forwarded-host over a loopback request URL', () => {
    const origin = publicOriginFromRequest(
      requestWith('http://localhost:3000/admin/login', {
        'x-forwarded-host': 'www.ghenortrs.com.br',
        'x-forwarded-proto': 'https',
      }),
      'https://www.ghenortrs.com.br',
    );
    expect(origin).toBe('https://www.ghenortrs.com.br');
  });

  it('uses the local Host when the browser is really on localhost', () => {
    const origin = publicOriginFromRequest(
      requestWith('http://localhost:5173/admin/login', {
        host: 'localhost:5173',
      }),
      'https://www.ghenortrs.com.br',
    );
    expect(origin).toBe('http://localhost:5173');
  });

  it('does not send magic links to localhost when Vercel rewrites the request URL', () => {
    const origin = publicOriginFromRequest(
      requestWith('http://localhost:3000/admin/login', {
        host: 'localhost:3000',
        'x-forwarded-proto': 'https',
      }),
      'https://www.ghenortrs.com.br',
      { hosted: true },
    );
    expect(origin).toBe('https://www.ghenortrs.com.br');
  });

  it('falls back to the configured public site URL when no host is usable', () => {
    const origin = publicOriginFromRequest(
      requestWith('http://127.0.0.1/admin/login'),
      'https://www.ghenortrs.com.br/',
      { hosted: true },
    );
    expect(origin).toBe('https://www.ghenortrs.com.br');
  });
});
