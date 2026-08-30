import { describe, expect, it } from 'vitest';

import { and, eq } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';

import {
  blingProductSyncConflictSet,
  buildAdminProductListSql,
  buildCatalogSearchSql,
  catalogVisibilityConditions,
  sanitizeCatalogQuery,
} from './queries';
import { blingProducts, sellerStatusEnum, sellers } from './schema';

describe('drizzle catalog query builder', () => {
  it('strips like metacharacters from seller search input', () => {
    expect(sanitizeCatalogQuery(`elite_%,"(pad)'`)).toBe('elite     pad');
  });

  it('builds a parameterized ilike search against cached Bling columns', () => {
    const { sql, params } = buildCatalogSearchSql('elite', 24, 'start');

    expect(sql).toContain('from "bling_products"');
    expect(sql).toContain('"bling_products"."active"');
    expect(sql).toContain('"visible_b2b"');
    expect(sql).toMatch(/"price_start_cents" is not null/i);
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

  it('selects the seller tier price as priceCents and requires that column', () => {
    const start = buildCatalogSearchSql('pad', 12, 'start');
    const pro = buildCatalogSearchSql('pad', 12, 'pro');
    const max = buildCatalogSearchSql('pad', 12, 'max');

    expect(start.sql).toMatch(/"price_start_cents".*as "priceCents"/i);
    expect(start.sql).toMatch(/"price_start_cents" is not null/i);
    expect(start.sql).not.toContain('price_cents');

    expect(pro.sql).toMatch(/"price_pro_cents".*as "priceCents"/i);
    expect(pro.sql).toMatch(/"price_pro_cents" is not null/i);

    expect(max.sql).toMatch(/"price_max_cents".*as "priceCents"/i);
    expect(max.sql).toMatch(/"price_max_cents" is not null/i);
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

  it('requires a non-null tier price on catalog and quote lookups', () => {
    const qb = new QueryBuilder();
    const { sql } = qb
      .select({ id: blingProducts.id })
      .from(blingProducts)
      .where(and(...catalogVisibilityConditions('pro')))
      .toSQL();

    expect(sql).toContain('"active"');
    expect(sql).toContain('"visible_b2b"');
    expect(sql).toMatch(/"price_pro_cents" is not null/i);
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
