import { describe, expect, it } from 'vitest';

import { buildCatalogSearchSql, sanitizeCatalogQuery } from './queries';
import { blingProducts, sellerStatusEnum, sellers } from './schema';

describe('drizzle catalog query builder', () => {
  it('strips like metacharacters from seller search input', () => {
    expect(sanitizeCatalogQuery(`elite_%,"(pad)'`)).toBe('elite     pad');
  });

  it('builds a parameterized ilike search against cached Bling columns', () => {
    const { sql, params } = buildCatalogSearchSql('elite', 24);

    expect(sql).toContain('from "bling_products"');
    expect(sql).toContain('"bling_products"."active"');
    expect(sql).toContain('ilike');
    expect(sql).toContain('"name"');
    expect(sql).toContain('"sku"');
    expect(sql).toContain('"search_terms"');
    expect(sql).toContain('"category"');
    expect(sql).toMatch(/limit/i);
    expect(params).toEqual([
      true,
      '%elite%',
      '%elite%',
      '%elite%',
      '%elite%',
      24,
    ]);
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
