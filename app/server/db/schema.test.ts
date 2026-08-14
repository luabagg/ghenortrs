import { getTableName } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import {
  b2bQuoteRequests,
  blingOauthTokens,
  blingProducts,
  sellerStatus,
  sellers,
} from './schema';

describe('drizzle schema', () => {
  it('mirrors the public tables from supabase migrations', () => {
    expect(getTableName(sellers)).toBe('sellers');
    expect(getTableName(blingProducts)).toBe('bling_products');
    expect(getTableName(blingOauthTokens)).toBe('bling_oauth_tokens');
    expect(getTableName(b2bQuoteRequests)).toBe('b2b_quote_requests');
    expect(sellerStatus.enumValues).toEqual([
      'pending',
      'approved',
      'rejected',
      'suspended',
    ]);
  });
});
