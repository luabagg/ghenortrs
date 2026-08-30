import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  insertAdminAuditEvent,
  listProductsBySkus,
  updateTierPrices,
} from './db/queries';
import {
  MAX_PRICE_LIST_CHARS,
  PriceListError,
  buildPriceImportPreview,
  commitPriceImport,
  parsePastedPriceList,
} from './price-list-import';

vi.mock('./db/queries', () => ({
  insertAdminAuditEvent: vi.fn(),
  listProductsBySkus: vi.fn(),
  updateTierPrices: vi.fn(),
}));

const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const listProductsBySkusMock = vi.mocked(listProductsBySkus);
const updateTierPricesMock = vi.mocked(updateTierPrices);

const HEADER = 'Produto\tSku\tGTIN/EAN\tR$ Preço no Bling\tR$ Preço da lista';
const PASTE = [
  HEADER,
  'Pastilha Hayes Dominion\tPADS-ULTR-HAYE-DOMI\t\t183,61\t61,49',
  'Pastilha Shimano XT\tPADS-ULTR-SHIM-XT\t7890000000001\tR$ 240,00\tR$ 1.234,56',
].join('\n');

const actor = { id: 'admin-1', email: 'admin@example.com' };

const cached = [
  {
    id: 1,
    sku: 'PADS-ULTR-HAYE-DOMI',
    name: 'Pastilha Hayes Dominion',
    active: true,
    priceCents: 6149,
  },
  {
    id: 2,
    sku: 'PADS-ULTR-SHIM-XT',
    name: 'Pastilha Shimano XT',
    active: false,
    priceCents: null,
  },
];

beforeEach(() => {
  vi.resetAllMocks();
  listProductsBySkusMock.mockResolvedValue(cached);
  updateTierPricesMock.mockResolvedValue(1);
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('parsePastedPriceList', () => {
  it('reads SKU and list price from the pasted Bling table', () => {
    expect(parsePastedPriceList(PASTE)).toMatchObject({
      inputRowCount: 2,
      rows: [
        { sku: 'PADS-ULTR-HAYE-DOMI', priceCents: 6149 },
        { sku: 'PADS-ULTR-SHIM-XT', priceCents: 123456 },
      ],
    });
  });

  it('rejects a paste without tabs', () => {
    expect(() =>
      parsePastedPriceList('Produto Sku Preço da lista\nHayes SKU 61,49'),
    ).toThrow(new PriceListError('not_tab_separated'));
  });

  it('rejects a table without the required columns', () => {
    expect(() => parsePastedPriceList('Produto\tGTIN/EAN\n a\t b')).toThrow(
      new PriceListError('missing_sku_column'),
    );
    expect(() => parsePastedPriceList('Produto\tSku\nHayes\tABC')).toThrow(
      new PriceListError('missing_price_column'),
    );
  });

  it('rejects oversized pastes', () => {
    expect(() =>
      parsePastedPriceList('x'.repeat(MAX_PRICE_LIST_CHARS + 1)),
    ).toThrow(new PriceListError('too_large'));
  });

  it('collapses duplicate rows that agree and rejects ones that disagree', () => {
    const agreeing = [
      HEADER,
      'A\tSKU-1\t\t10,00\t9,90',
      'A\tSKU-1\t\t10,00\tR$ 9,90',
    ].join('\n');
    expect(parsePastedPriceList(agreeing)).toMatchObject({
      duplicates: ['SKU-1'],
      rows: [{ sku: 'SKU-1', priceCents: 990 }],
    });

    const conflicting = [
      HEADER,
      'A\tSKU-1\t\t10,00\t9,90',
      'A\tSKU-1\t\t10,00\t8,90',
    ].join('\n');
    expect(() => parsePastedPriceList(conflicting)).toThrow(
      new PriceListError('conflicting_duplicate_sku'),
    );
  });

  it('refuses a row that lost a column, instead of reading the wrong one', () => {
    const missingGtinCell = [
      HEADER,
      'Hayes Dominion A4\tPADS-ULTR-HAYE-DOMI\t183,61\t70,68',
    ].join('\n');

    expect(() => parsePastedPriceList(missingGtinCell)).toThrow(
      new PriceListError('row_column_mismatch'),
    );
    try {
      parsePastedPriceList(missingGtinCell);
    } catch (error) {
      expect((error as PriceListError).row).toBe(1);
    }
  });

  it('accepts a table that carries only the two columns it needs', () => {
    const trimmed = [
      'Sku\tR$ Preço da lista',
      'PADS-ULTR-HAYE-DOMI\t70,68',
    ].join('\n');

    expect(parsePastedPriceList(trimmed)).toMatchObject({
      rows: [{ sku: 'PADS-ULTR-HAYE-DOMI', priceCents: 7068 }],
    });
  });

  it('skips rows without a SKU or with an unreadable price', () => {
    const text = [
      HEADER,
      'A\t\t\t10,00\t9,90',
      'B\tSKU-2\t\t10,00\tgrátis',
    ].join('\n');
    expect(parsePastedPriceList(text)).toMatchObject({
      rows: [],
      skipped: [
        { sku: '', reason: 'empty_sku' },
        { sku: 'SKU-2', reason: 'invalid_price' },
      ],
    });
  });
});

describe('buildPriceImportPreview', () => {
  it('separates changed, unchanged, and missing SKUs', async () => {
    listProductsBySkusMock.mockResolvedValue([
      { ...cached[0], priceCents: 6149 },
      { ...cached[1], priceCents: 123456 },
    ]);

    const preview = await buildPriceImportPreview('pro', PASTE);

    expect(listProductsBySkusMock).toHaveBeenCalledWith('pro', [
      'PADS-ULTR-HAYE-DOMI',
      'PADS-ULTR-SHIM-XT',
    ]);
    expect(preview.updates).toEqual([]);
    expect(preview.unchanged).toHaveLength(2);
    expect(preview.missingSkus).toEqual([]);
  });

  it('reports the new value, inactive SKUs, and missing SKUs', async () => {
    listProductsBySkusMock.mockResolvedValue([cached[1]]);

    const preview = await buildPriceImportPreview('max', PASTE);

    expect(preview.updates).toEqual([
      {
        sku: 'PADS-ULTR-SHIM-XT',
        name: 'Pastilha Shimano XT',
        currentCents: null,
        nextCents: 123456,
        active: false,
      },
    ]);
    expect(preview.missingSkus).toEqual(['PADS-ULTR-HAYE-DOMI']);
    expect(preview.digest).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('commitPriceImport', () => {
  it('writes only the chosen tier after the previewed digest matches', async () => {
    listProductsBySkusMock.mockResolvedValue([cached[1]]);
    const preview = await buildPriceImportPreview('pro', PASTE);

    await expect(
      commitPriceImport({
        actor,
        tier: 'pro',
        text: PASTE,
        digest: preview.digest,
      }),
    ).resolves.toEqual({ ok: true, updated: 1 });
    expect(updateTierPricesMock).toHaveBeenCalledWith('pro', [
      { sku: 'PADS-ULTR-SHIM-XT', priceCents: 123456 },
    ]);
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'price_list.import',
        metadata: { tier: 'pro', updated: 1 },
        outcome: 'success',
      }),
    );
  });

  it('refuses a digest that no longer matches the cached catalog', async () => {
    listProductsBySkusMock.mockResolvedValue([cached[1]]);
    const preview = await buildPriceImportPreview('pro', PASTE);
    listProductsBySkusMock.mockResolvedValue([
      { ...cached[1], priceCents: 999 },
    ]);

    await expect(
      commitPriceImport({
        actor,
        tier: 'pro',
        text: PASTE,
        digest: preview.digest,
      }),
    ).resolves.toEqual({ ok: false, error: 'preview_stale' });
    expect(updateTierPricesMock).not.toHaveBeenCalled();
  });

  it('refuses a digest built for another tier', async () => {
    listProductsBySkusMock.mockResolvedValue([cached[1]]);
    const preview = await buildPriceImportPreview('pro', PASTE);

    await expect(
      commitPriceImport({
        actor,
        tier: 'max',
        text: PASTE,
        digest: preview.digest,
      }),
    ).resolves.toEqual({ ok: false, error: 'preview_stale' });
    expect(updateTierPricesMock).not.toHaveBeenCalled();
  });
});
