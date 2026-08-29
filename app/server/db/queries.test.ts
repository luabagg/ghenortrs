import { describe, expect, it } from 'vitest';

import { buildCatalogSearchSql, sanitizeCatalogQuery } from './queries';
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
    expect(sellers.volume.name).toBe('volume');
    expect(blingProducts.searchTerms.name).toBe('search_terms');
  });

  it('declares B2B tier price and visibility columns on bling_products', () => {
    expect(blingProducts.visibleB2b.name).toBe('visible_b2b');
    expect(blingProducts.priceStartCents.name).toBe('price_start_cents');
    expect(blingProducts.priceProCents.name).toBe('price_pro_cents');
    expect(blingProducts.priceMaxCents.name).toBe('price_max_cents');
  });
});
