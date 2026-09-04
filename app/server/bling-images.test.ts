import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cacheBlingProductImages } from './bling';
import {
  listStoredImageKeys,
  readStoredBlingTokens,
  upsertProductImage,
} from './db/queries';
import { getServerEnv } from './env';

vi.mock('./db/queries', () => ({
  listStoredImageKeys: vi.fn(),
  upsertProductImage: vi.fn(),
  readStoredBlingTokens: vi.fn(),
  saveBlingTokens: vi.fn(),
  upsertBlingProducts: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
// Echoes the requested width, so a test can prove which sizes were produced.
vi.mock('sharp', () => ({
  default: () => ({
    resize: ({ width }: { width: number }) => ({
      webp: () => ({ toBuffer: async () => Buffer.from(`webp-${width}`) }),
    }),
  }),
}));

/** Bling signs the same object key with a fresh signature on every sync. */
function signed(key: string, signature: string) {
  return `https://orgbling.s3.amazonaws.com/org/t/${key}?Expires=1788111125&Signature=${signature}`;
}

/** The detail endpoint answer that carries the original, not the thumbnail. */
function detailWithFullSize(key: string) {
  return {
    data: {
      midia: {
        imagens: {
          internas: [
            { link: `https://orgbling.s3.amazonaws.com/org/${key}?sig` },
          ],
        },
      },
    },
  };
}

const JPEG_BYTES = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  Buffer.alloc(12),
]);

/** Bling's S3 labels every photo application/octet-stream. */
function jpeg() {
  return new Response(JPEG_BYTES, {
    status: 200,
    headers: { 'content-type': 'application/octet-stream' },
  });
}

/** Answers the Bling detail call, then the S3 download. */
function stubBlingAndS3(detailKey: string | null) {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.includes('/produtos/')) {
      return detailKey
        ? new Response(JSON.stringify(detailWithFullSize(detailKey)), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        : new Response('nope', { status: 500 });
    }
    return jpeg();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(listStoredImageKeys).mockResolvedValue(new Map());
  vi.mocked(getServerEnv).mockReturnValue({
    blingApiBase: 'https://api.bling.test/Api/v3',
  } as ReturnType<typeof getServerEnv>);
  vi.mocked(readStoredBlingTokens).mockResolvedValue({
    accessToken: 'token',
    refreshToken: 'refresh',
    expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  } as never);
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
      // Normalised at sync time: the original is a multi-megapixel PNG. The
      // catalog size keeps a page of rows cheap; the full size feeds the
      // expanded viewer in the product drawer.
      contentType: 'image/webp',
      bytes: Buffer.from('webp-400'),
      fullBytes: Buffer.from('webp-1400'),
      sourceKey: 'abc123',
    });
  });

  // listStoredImageKeys only reports rows that already hold every variant,
  // so an incomplete row reaches the download path even on the same key.
  it('skips a product whose object key has not changed', async () => {
    vi.mocked(listStoredImageKeys).mockResolvedValue(new Map([[7, 'abc123']]));
    const fetchMock = stubBlingAndS3('abc123');

    // Same key, new signature: Bling re-signs every sync.
    const result = await cacheBlingProductImages([
      { id: 7, imageUrl: signed('abc123', 'sig-two') },
    ]);

    expect(result).toEqual({ stored: 0, skipped: 1, failed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('re-downloads when the object key changes', async () => {
    vi.mocked(listStoredImageKeys).mockResolvedValue(new Map([[7, 'old-key']]));
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
    const fetchMock = stubBlingAndS3('abc123');

    const result = await cacheBlingProductImages([{ id: 7, imageUrl: null }]);

    expect(result).toEqual({ stored: 0, skipped: 1, failed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps syncing when one photo fails or is not an image', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        // Every detail call fails, so each product falls back to its thumbnail.
        if (url.includes('/produtos/')) {
          return new Response('nope', { status: 500 });
        }
        if (url.includes('gone'))
          return new Response('expired', { status: 403 });
        if (url.includes('html')) {
          return new Response('<html>an error page, not a photo</html>', {
            status: 200,
            headers: { 'content-type': 'application/octet-stream' },
          });
        }
        return jpeg();
      }),
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
