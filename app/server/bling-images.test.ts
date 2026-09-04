import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cacheBlingProductImages } from './bling';
import { listStoredImageKeys, upsertProductImage } from './db/queries';

vi.mock('./db/queries', () => ({
  listStoredImageKeys: vi.fn(),
  upsertProductImage: vi.fn(),
  readStoredBlingTokens: vi.fn(),
  saveBlingTokens: vi.fn(),
  upsertBlingProducts: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));

/** Bling signs the same object key with a fresh signature on every sync. */
function signed(key: string, signature: string) {
  return `https://orgbling.s3.amazonaws.com/org/t/${key}?Expires=1788111125&Signature=${signature}`;
}

function jpeg() {
  return new Response(Buffer.from([1, 2, 3]), {
    status: 200,
    headers: { 'content-type': 'image/jpeg' },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(listStoredImageKeys).mockResolvedValue(new Map());
});

describe('cacheBlingProductImages', () => {
  it('copies the bytes while the signed link is still valid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jpeg()),
    );

    const result = await cacheBlingProductImages([
      { id: 7, imageUrl: signed('abc123', 'sig-one') },
    ]);

    expect(result).toEqual({ stored: 1, skipped: 0, failed: 0 });
    expect(upsertProductImage).toHaveBeenCalledWith({
      productId: 7,
      contentType: 'image/jpeg',
      bytes: Buffer.from([1, 2, 3]),
      sourceKey: '/org/t/abc123',
    });
  });

  it('skips a product whose object key has not changed', async () => {
    vi.mocked(listStoredImageKeys).mockResolvedValue(
      new Map([[7, '/org/t/abc123']]),
    );
    const fetchMock = vi.fn(async () => jpeg());
    vi.stubGlobal('fetch', fetchMock);

    // Same key, new signature: Bling re-signs every sync.
    const result = await cacheBlingProductImages([
      { id: 7, imageUrl: signed('abc123', 'sig-two') },
    ]);

    expect(result).toEqual({ stored: 0, skipped: 1, failed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('re-downloads when the object key changes', async () => {
    vi.mocked(listStoredImageKeys).mockResolvedValue(
      new Map([[7, '/org/t/old-key']]),
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jpeg()),
    );

    const result = await cacheBlingProductImages([
      { id: 7, imageUrl: signed('new-key', 'sig') },
    ]);

    expect(result.stored).toBe(1);
  });

  it('skips a product with no photo', async () => {
    const fetchMock = vi.fn(async () => jpeg());
    vi.stubGlobal('fetch', fetchMock);

    const result = await cacheBlingProductImages([{ id: 7, imageUrl: null }]);

    expect(result).toEqual({ stored: 0, skipped: 1, failed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps syncing when one photo fails or is not an image', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.includes('gone')
          ? new Response('expired', { status: 403 })
          : url.includes('html')
            ? new Response('<html>', {
                status: 200,
                headers: { 'content-type': 'text/html' },
              })
            : jpeg(),
      ),
    );

    const result = await cacheBlingProductImages([
      { id: 1, imageUrl: signed('gone', 'sig') },
      { id: 2, imageUrl: signed('html', 'sig') },
      { id: 3, imageUrl: signed('good', 'sig') },
    ]);

    expect(result).toEqual({ stored: 1, skipped: 0, failed: 2 });
    expect(upsertProductImage).toHaveBeenCalledTimes(1);
  });
});
