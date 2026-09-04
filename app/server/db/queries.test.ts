import { beforeEach, describe, expect, it, vi } from 'vitest';

import { and, eq } from 'drizzle-orm';
import { PgDialect, QueryBuilder } from 'drizzle-orm/pg-core';

import {
  blingProductSyncConflictSet,
  buildAdminProductListSql,
  buildCatalogSearchSql,
  catalogVisibilityConditions,
  consumeEmailActionToken,
  createEmailActionToken,
  insertAdminAuditEvent,
  sanitizeCatalogQuery,
  updateProductsVisibleB2b,
  updateTierPrices,
} from './queries';
import { getDb } from './client';
import { blingProducts, sellerStatusEnum, sellers } from './schema';

vi.mock('./client', () => ({ getDb: vi.fn() }));

const getDbMock = vi.mocked(getDb);

beforeEach(() => {
  getDbMock.mockReset();
});

describe('drizzle catalog query builder', () => {
  it('strips like metacharacters from seller search input', () => {
    expect(sanitizeCatalogQuery(`elite_%,"(pad)'`)).toBe('elite     pad');
  });

  it('builds a parameterized search with all automatic tier prices', () => {
    const { sql, params } = buildCatalogSearchSql('elite', 24);

    expect(sql).toContain('from "bling_products"');
    expect(sql).toContain('"bling_products"."active"');
    expect(sql).toContain('"visible_b2b"');
    expect(sql).toContain('"price_start_cents"');
    expect(sql).toContain('"price_pro_cents"');
    expect(sql).toContain('"price_max_cents"');
    expect(sql).toContain('ilike');
    expect(sql).toContain('"name"');
    expect(sql).toContain('"sku"');
    expect(sql).toContain('"search_terms"');
    expect(sql).toContain('"category"');
    expect(sql).toMatch(/limit/i);
    expect(params).toEqual([
      true,
      true,
      '%elite%',
      '%elite%',
      '%elite%',
      '%elite%',
      24,
    ]);
  });

  it('requires every automatic tier price for visible catalog products', () => {
    const { sql } = buildCatalogSearchSql('pad', 12);

    expect(sql).toMatch(/"price_start_cents" is not null/i);
    expect(sql).toMatch(/"price_pro_cents" is not null/i);
    expect(sql).toMatch(/"price_max_cents" is not null/i);
  });

  it('lists admin products without catalog visibility filters', () => {
    const empty = buildAdminProductListSql('', 200);
    expect(empty.sql).toContain('from "bling_products"');
    expect(empty.sql).toContain('"visible_b2b"');
    expect(empty.sql).toContain('"active"');
    expect(empty.sql).not.toMatch(/"visible_b2b"\s*=/i);
    expect(empty.sql).not.toMatch(/"active"\s*=/i);
    expect(empty.sql).not.toMatch(/ilike/i);
    expect(empty.sql).not.toMatch(
      /price_start_cents|price_pro_cents|price_max_cents/,
    );
    expect(empty.params).toEqual([200]);

    const searched = buildAdminProductListSql('elite', 50);
    expect(searched.sql).toContain('ilike');
    expect(searched.sql).toContain('"sku"');
    expect(searched.sql).toContain('"name"');
    expect(searched.params).toEqual(['%elite%', '%elite%', 50]);
  });

  it('uses the same complete-price visibility rule for quote lookups', () => {
    const qb = new QueryBuilder();
    const { sql } = qb
      .select({ id: blingProducts.id })
      .from(blingProducts)
      .where(and(...catalogVisibilityConditions()))
      .toSQL();

    expect(sql).toContain('"active"');
    expect(sql).toContain('"visible_b2b"');
    expect(sql).toMatch(/"price_start_cents" is not null/i);
    expect(sql).toMatch(/"price_pro_cents" is not null/i);
    expect(sql).toMatch(/"price_max_cents" is not null/i);
  });
});

describe('upsertBlingProducts sync-safe conflict set', () => {
  it('does not overwrite visible_b2b or tier price columns', () => {
    const setKeys = Object.keys(blingProductSyncConflictSet);

    expect(setKeys).not.toContain('visibleB2b');
    expect(setKeys).not.toContain('priceStartCents');
    expect(setKeys).not.toContain('priceProCents');
    expect(setKeys).not.toContain('priceMaxCents');

    const excludedSql = Object.values(blingProductSyncConflictSet)
      .map((fragment) => String(fragment.queryChunks ?? fragment))
      .join(' ');
    expect(excludedSql).not.toMatch(/visible_b2b/);
    expect(excludedSql).not.toMatch(/price_start_cents/);
    expect(excludedSql).not.toMatch(/price_pro_cents/);
    expect(excludedSql).not.toMatch(/price_max_cents/);
  });
});

describe('admin operations queries', () => {
  it('consumes an approval token once', async () => {
    const token = {
      jtiHash: 'hash',
      purpose: 'approve-seller',
      sellerId: 'seller',
      expiresAt: '2026-08-30T12:00:00.000Z',
      consumedAt: null,
    };
    const updateResults = [[token], []];
    const insert = vi.fn(() => ({
      values: vi.fn().mockResolvedValue(undefined),
    }));
    const update = vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi
            .fn()
            .mockImplementation(async () => updateResults.shift()),
        })),
      })),
    }));
    getDbMock.mockReturnValue({ insert, update } as never);

    await createEmailActionToken({
      jtiHash: token.jtiHash,
      purpose: token.purpose,
      sellerId: token.sellerId,
      expiresAt: token.expiresAt,
    });

    expect(
      await consumeEmailActionToken(token.jtiHash, '2026-08-30T11:00:00.000Z'),
    ).toMatchObject({ sellerId: token.sellerId });
    expect(
      await consumeEmailActionToken(token.jtiHash, '2026-08-30T11:00:00.000Z'),
    ).toBeNull();
  });

  it('updates exactly the selected product IDs to an explicit value', async () => {
    const returning = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    getDbMock.mockReturnValue({ update: vi.fn(() => ({ set })) } as never);

    await expect(updateProductsVisibleB2b([1, 2], false)).resolves.toBe(2);

    expect(set).toHaveBeenCalledWith({ visibleB2b: false });
    const rendered = new PgDialect().sqlToQuery(where.mock.calls[0][0]);
    expect(rendered.sql).toContain('"id" in');
    expect(rendered.params).toEqual([1, 2]);
  });

  it('never issues a visibility update without IDs', async () => {
    const update = vi.fn();
    getDbMock.mockReturnValue({ update } as never);

    await expect(updateProductsVisibleB2b([], true)).resolves.toBe(0);
    expect(update).not.toHaveBeenCalled();
  });

  it('writes only the chosen tier price column for the pasted SKUs', async () => {
    const returning = vi.fn().mockResolvedValue([{ sku: 'SKU-1' }]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));
    getDbMock.mockReturnValue({
      transaction: (run: (tx: unknown) => unknown) => run({ update }),
    } as never);

    await expect(
      updateTierPrices('pro', [{ sku: 'SKU-1', priceCents: 990 }]),
    ).resolves.toBe(1);

    expect(update).toHaveBeenCalledWith(blingProducts);
    expect(set).toHaveBeenCalledWith({ priceProCents: 990 });
  });

  it('groups SKUs that share a price into one statement', async () => {
    const returning = vi.fn().mockResolvedValue([{ sku: 'a' }, { sku: 'b' }]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));
    getDbMock.mockReturnValue({
      transaction: (run: (tx: unknown) => unknown) => run({ update }),
    } as never);

    await updateTierPrices('max', [
      { sku: 'a', priceCents: 990 },
      { sku: 'b', priceCents: 990 },
    ]);

    expect(update).toHaveBeenCalledOnce();
    expect(set).toHaveBeenCalledWith({ priceMaxCents: 990 });
  });

  it('rejects sensitive audit metadata before insertion', async () => {
    await expect(
      insertAdminAuditEvent({
        action: 'seller.access_link.sent',
        metadata: { actionLink: 'secret' },
      }),
    ).rejects.toThrow('sensitive audit metadata');
  });
});

describe('drizzle schema contract', () => {
  it('mirrors the existing seller_status enum and sellers table', () => {
    expect(sellerStatusEnum.enumValues).toEqual([
      'pending',
      'approved',
      'rejected',
      'suspended',
    ]);
    expect(sellers.companyName.name).toBe('company_name');
    expect(sellers.volume).toBeUndefined();
    expect(blingProducts.searchTerms.name).toBe('search_terms');

    const { sql } = new QueryBuilder()
      .select()
      .from(sellers)
      .where(eq(sellers.email, 'x@y.z'))
      .limit(1)
      .toSQL();
    expect(sql).toContain('from "sellers"');
    expect(sql).not.toMatch(/"volume"/);
  });

  it('declares B2B tier price and visibility columns on bling_products', () => {
    expect(blingProducts.visibleB2b.name).toBe('visible_b2b');
    expect(blingProducts.priceStartCents.name).toBe('price_start_cents');
    expect(blingProducts.priceProCents.name).toBe('price_pro_cents');
    expect(blingProducts.priceMaxCents.name).toBe('price_max_cents');
  });
});
