import { beforeEach, describe, expect, it, vi } from 'vitest';

import handler from './b2b-product-image';
import { getProductImage } from './db/queries';

vi.mock('./db/queries', () => ({ getProductImage: vi.fn() }));

const bytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);

function get(path: string, headers?: HeadersInit) {
  return new Request(`https://gheno.test${path}`, { headers });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getProductImage).mockResolvedValue({
    contentType: 'image/jpeg',
    bytes,
    sourceKey: '/org/t/c64a2e9f',
  });
});

describe('B2B product image handler', () => {
  it('serves the stored bytes with a long cache and an ETag', async () => {
    const response = await handler(get('/api/b2b-product-image/7'), '7');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('cache-control')).toContain('max-age=31536000');
    expect(response.headers.get('etag')).toBe('"c64a2e9f-catalog"');
    expect(Buffer.from(await response.arrayBuffer())).toEqual(bytes);
    expect(getProductImage).toHaveBeenCalledWith(7, 'catalog');
  });

  it('answers 304 when the client already has that image', async () => {
    const response = await handler(
      get('/api/b2b-product-image/7', {
        'if-none-match': '"c64a2e9f-catalog"',
      }),
      '7',
    );

    expect(response.status).toBe(304);
    expect(await response.text()).toBe('');
  });

  it('answers 404 for an unknown product and for a bad id', async () => {
    vi.mocked(getProductImage).mockResolvedValue(null);
    await expect(
      handler(get('/api/b2b-product-image/7'), '7'),
    ).resolves.toMatchObject({ status: 404 });

    await expect(
      handler(get('/api/b2b-product-image/abc'), 'abc'),
    ).resolves.toMatchObject({ status: 404 });
    expect(getProductImage).toHaveBeenCalledTimes(1);
  });

  it('refuses a write method', async () => {
    const response = await handler(
      new Request('https://gheno.test/api/b2b-product-image/7', {
        method: 'POST',
      }),
      '7',
    );

    expect(response.status).toBe(405);
  });

  it('serves the expanded variant when asked, under its own ETag', async () => {
    const response = await handler(
      get('/api/b2b-product-image/7?size=full'),
      '7',
    );

    expect(getProductImage).toHaveBeenCalledWith(7, 'full');
    // A shared ETag would serve one size out of the other's cache entry.
    expect(response.headers.get('etag')).toBe('"c64a2e9f-full"');
  });

  it('defaults to the catalog variant', async () => {
    await handler(get('/api/b2b-product-image/7?size=whatever'), '7');

    expect(getProductImage).toHaveBeenCalledWith(7, 'catalog');
  });
});
