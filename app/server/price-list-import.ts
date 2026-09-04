// Pasted Bling price lists (TSV) for one seller tier.
// The admin previews the result, then confirms the exact preview.

import { createHash } from 'node:crypto';

import { parseBrMoneyToCents } from '../lib/br-money';
import {
  insertAdminAuditEvent,
  listProductsBySkus,
  updateTierPrices,
} from './db/queries';
import type { SellerTier } from './seller-tier';

type Actor = {
  id: string;
  email?: string | null;
};

export const MAX_PRICE_LIST_CHARS = 200_000;
export const MAX_PRICE_LIST_ROWS = 5_000;

export type PriceListErrorCode =
  | 'empty'
  | 'not_tab_separated'
  | 'missing_sku_column'
  | 'missing_price_column'
  | 'row_column_mismatch'
  | 'conflicting_duplicate_sku'
  | 'too_large'
  | 'too_many_rows';

export class PriceListError extends Error {
  constructor(
    readonly code: PriceListErrorCode,
    /** 1-based data row, when the problem belongs to one row. */
    readonly row?: number,
  ) {
    super(code);
    this.name = 'PriceListError';
  }
}

export type SkippedRow = {
  sku: string;
  reason: 'empty_sku' | 'invalid_price';
};

export type ParsedPriceList = {
  inputRowCount: number;
  rows: { sku: string; priceCents: number }[];
  duplicates: string[];
  skipped: SkippedRow[];
};

function foldHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase();
}

function findColumns(header: string): { sku: number; price: number } {
  const cells = header.split('\t').map(foldHeader);
  const sku = cells.indexOf('sku');
  if (sku === -1) throw new PriceListError('missing_sku_column');

  const price = cells.findIndex((cell) => cell.includes('preco da lista'));
  if (price === -1) throw new PriceListError('missing_price_column');

  return { sku, price };
}

/** Parses the table copied from Bling. Tabs are required: names contain spaces. */
export function parsePastedPriceList(text: string): ParsedPriceList {
  if (text.length > MAX_PRICE_LIST_CHARS) throw new PriceListError('too_large');

  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length === 0) throw new PriceListError('empty');
  if (!lines[0].includes('\t')) throw new PriceListError('not_tab_separated');
  if (lines.length - 1 > MAX_PRICE_LIST_ROWS) {
    throw new PriceListError('too_many_rows');
  }

  const headerCells = lines[0].split('\t');
  const columns = findColumns(lines[0]);
  const centsBySku = new Map<string, number>();
  const duplicates: string[] = [];
  const skipped: SkippedRow[] = [];

  for (const [index, line] of lines.slice(1).entries()) {
    const cells = line.split('\t');
    // Misaligned rows would read a neighbouring column, so never guess.
    if (cells.length !== headerCells.length) {
      throw new PriceListError('row_column_mismatch', index + 1);
    }

    const sku = (cells[columns.sku] ?? '').trim();
    if (!sku) {
      skipped.push({ sku: '', reason: 'empty_sku' });
      continue;
    }

    const priceCents = parseBrMoneyToCents(cells[columns.price] ?? '');
    if (priceCents === null) {
      skipped.push({ sku, reason: 'invalid_price' });
      continue;
    }

    const seen = centsBySku.get(sku);
    if (seen === undefined) {
      centsBySku.set(sku, priceCents);
      continue;
    }
    if (seen !== priceCents)
      throw new PriceListError('conflicting_duplicate_sku');
    if (!duplicates.includes(sku)) duplicates.push(sku);
  }

  return {
    inputRowCount: lines.length - 1,
    rows: [...centsBySku].map(([sku, priceCents]) => ({ sku, priceCents })),
    duplicates,
    skipped,
  };
}

export type PriceImportUpdate = {
  sku: string;
  name: string;
  currentCents: number | null;
  nextCents: number;
  active: boolean;
};

export type PriceImportPreview = {
  tier: SellerTier;
  inputRowCount: number;
  updates: PriceImportUpdate[];
  unchanged: { sku: string; priceCents: number }[];
  missingSkus: string[];
  duplicates: string[];
  skipped: SkippedRow[];
  digest: string;
};

/** Binds a confirmation to the exact rows and current values shown. */
function priceImportDigest(
  tier: SellerTier,
  updates: PriceImportUpdate[],
): string {
  const canonical = JSON.stringify({
    tier,
    updates: [...updates]
      .sort((left, right) => left.sku.localeCompare(right.sku))
      .map((update) => [update.sku, update.currentCents, update.nextCents]),
  });
  return createHash('sha256').update(canonical).digest('hex');
}

export async function buildPriceImportPreview(
  tier: SellerTier,
  text: string,
): Promise<PriceImportPreview> {
  const parsed = parsePastedPriceList(text);
  const cached = await listProductsBySkus(
    tier,
    parsed.rows.map((row) => row.sku),
  );
  const bySku = new Map(cached.map((product) => [product.sku, product]));

  const updates: PriceImportUpdate[] = [];
  const unchanged: { sku: string; priceCents: number }[] = [];
  const missingSkus: string[] = [];

  for (const row of parsed.rows) {
    const product = bySku.get(row.sku);
    if (!product) {
      missingSkus.push(row.sku);
      continue;
    }
    if (product.priceCents === row.priceCents) {
      unchanged.push({ sku: row.sku, priceCents: row.priceCents });
      continue;
    }
    updates.push({
      sku: row.sku,
      name: product.name,
      currentCents: product.priceCents,
      nextCents: row.priceCents,
      active: product.active,
    });
  }

  return {
    tier,
    inputRowCount: parsed.inputRowCount,
    updates,
    unchanged,
    missingSkus,
    duplicates: parsed.duplicates,
    skipped: parsed.skipped,
    digest: priceImportDigest(tier, updates),
  };
}

export type PriceImportCommitResult =
  | { ok: true; updated: number }
  | { ok: false; error: 'preview_stale' };

async function recordImportAudit(
  actor: Actor,
  metadata: { tier: SellerTier; updated?: number; reason?: string },
  outcome: 'success' | 'failure',
): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: actor.id,
      actorEmail: actor.email ?? null,
      action: 'price_list.import',
      metadata,
      outcome,
    });
  } catch (error) {
    console.error('price import audit failed', error);
  }
}

/** Rebuilds the preview and writes only when it still matches the confirmed one. */
export async function commitPriceImport(input: {
  tier: SellerTier;
  text: string;
  digest: string;
  actor: Actor;
}): Promise<PriceImportCommitResult> {
  const preview = await buildPriceImportPreview(input.tier, input.text);
  if (preview.digest !== input.digest) {
    await recordImportAudit(
      input.actor,
      { tier: input.tier, reason: 'preview_stale' },
      'failure',
    );
    return { ok: false, error: 'preview_stale' };
  }

  const updated =
    preview.updates.length === 0
      ? 0
      : await updateTierPrices(
          input.tier,
          preview.updates.map((update) => ({
            sku: update.sku,
            priceCents: update.nextCents,
          })),
        );

  await recordImportAudit(
    input.actor,
    { tier: input.tier, updated },
    'success',
  );
  return { ok: true, updated };
}
