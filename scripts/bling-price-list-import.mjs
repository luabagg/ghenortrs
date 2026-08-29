#!/usr/bin/env node
/**
 * Import one Bling price-list CSV into a single tier column on bling_products.
 *
 *   pnpm prices:import --tier=start --file=./exports/start.csv
 *   pnpm prices:import --tier=pro --file=./exports/pro.csv [--apply-name-hints]
 *
 * Requires DATABASE_URL or POSTGRES_* (same fallbacks as drizzle.config.ts).
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import postgres from 'postgres';

/** @typedef {'start' | 'pro' | 'max'} SellerTier */

/** @type {Record<SellerTier, string>} */
export const TIER_PRICE_COLUMNS = {
  start: 'price_start_cents',
  pro: 'price_pro_cents',
  max: 'price_max_cents',
};

const NAME_HIDE_PREFIXES = ['[INATIVO]', '[INTERNO]'];

/**
 * Same rules as app/server/br-money.ts (inlined: no tsx in this package).
 * @param {string} raw
 * @returns {number | null}
 */
export function parseBrMoneyToCents(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withoutCurrency = trimmed.replace(/R\$\s*/gi, '').trim();
  const withoutThousands = withoutCurrency.replace(/\./g, '');
  const normalized = withoutThousands.replace(',', '.');

  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * 100);
}

/**
 * @param {string} header
 * @returns {string}
 */
export function foldHeader(header) {
  return header
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase();
}

/**
 * @param {string[]} headers
 * @returns {{ skuIndex: number, listPriceIndex: number, nameIndex: number }}
 */
export function detectColumns(headers) {
  let skuIndex = -1;
  let listPriceIndex = -1;
  let nameIndex = -1;

  for (let i = 0; i < headers.length; i++) {
    const raw = String(headers[i] ?? '').replace(/^\uFEFF/, '').trim();
    const folded = foldHeader(raw);

    if (/^sku$/i.test(raw)) {
      skuIndex = i;
    }
    if (folded.includes('preco da lista') || folded === 'price_lista') {
      listPriceIndex = i;
    }
    if (folded === 'produto' || folded === 'name') {
      nameIndex = i;
    }
  }

  if (skuIndex === -1) {
    throw new Error('Missing SKU column (header must match /^sku$/i)');
  }
  if (listPriceIndex === -1) {
    throw new Error(
      'Missing list price column (expected header containing "preço da lista" / "preco da lista", or alias price_lista)',
    );
  }

  return { skuIndex, listPriceIndex, nameIndex };
}

/**
 * @param {string} headerLine
 * @returns {string}
 */
export function detectDelimiter(headerLine) {
  const tab = (headerLine.match(/\t/g) || []).length;
  const semi = (headerLine.match(/;/g) || []).length;
  const comma = (headerLine.match(/,/g) || []).length;
  if (tab > 0 && tab >= semi && tab >= comma) return '\t';
  if (semi > comma) return ';';
  return ',';
}

/**
 * @param {string} line
 * @param {string} delimiter
 * @returns {string[]}
 */
export function parseDelimitedLine(line, delimiter) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

/**
 * @param {string} text
 * @returns {{ headers: string[], records: string[][], delimiter: string }}
 */
export function parseCsvText(text) {
  const stripped = text.replace(/^\uFEFF/, '');
  const lines = stripped.split(/\r?\n/);
  const nonempty = lines.filter((line) => line.trim().length > 0);
  if (nonempty.length === 0) {
    throw new Error('CSV file is empty');
  }

  const delimiter = detectDelimiter(nonempty[0]);
  const headers = parseDelimitedLine(nonempty[0], delimiter).map((cell) =>
    cell.replace(/^\uFEFF/, '').trim(),
  );
  const records = nonempty
    .slice(1)
    .map((line) => parseDelimitedLine(line, delimiter));

  return { headers, records, delimiter };
}

/**
 * @param {string[]} record
 * @param {{ skuIndex: number, listPriceIndex: number, nameIndex: number }} columns
 * @returns {{ sku: string, priceCents: number | null, name: string, rawPrice: string }}
 */
export function parseRow(record, columns) {
  const sku = String(record[columns.skuIndex] ?? '').trim();
  const rawPrice = String(record[columns.listPriceIndex] ?? '').trim();
  const name =
    columns.nameIndex >= 0 ? String(record[columns.nameIndex] ?? '').trim() : '';
  return {
    sku,
    priceCents: parseBrMoneyToCents(rawPrice),
    name,
    rawPrice,
  };
}

/**
 * @param {string} csvText
 * @returns {{
 *   columns: { skuIndex: number, listPriceIndex: number, nameIndex: number },
 *   dataRowCount: number,
 *   rows: { sku: string, priceCents: number, name: string }[],
 *   skipped: { sku: string, reason: string }[],
 * }}
 */
export function parsePriceList(csvText) {
  const { headers, records } = parseCsvText(csvText);
  const columns = detectColumns(headers);
  const rows = [];
  const skipped = [];

  for (const record of records) {
    const parsed = parseRow(record, columns);
    if (!parsed.sku) {
      skipped.push({ sku: '', reason: 'empty SKU' });
      continue;
    }
    if (parsed.priceCents === null) {
      skipped.push({
        sku: parsed.sku,
        reason: `invalid list price "${parsed.rawPrice}"`,
      });
      continue;
    }
    rows.push({
      sku: parsed.sku,
      priceCents: parsed.priceCents,
      name: parsed.name,
    });
  }

  return { columns, dataRowCount: records.length, rows, skipped };
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function nameHintHides(name) {
  return NAME_HIDE_PREFIXES.some((prefix) => name.startsWith(prefix));
}

/**
 * @param {string} tier
 * @returns {string}
 */
export function tierPriceSqlColumn(tier) {
  const column = TIER_PRICE_COLUMNS[/** @type {SellerTier} */ (tier)];
  if (!column) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  return column;
}

/**
 * @param {string[]} argv
 * @returns {{ tier: SellerTier, file: string, applyNameHints: boolean }}
 */
export function parseCliArgs(argv) {
  /** @type {{ tier: string | null, file: string | null, applyNameHints: boolean }} */
  const args = { tier: null, file: null, applyNameHints: false };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--') continue;
    if (token === '--apply-name-hints') {
      args.applyNameHints = true;
      continue;
    }

    let key = token;
    /** @type {string | undefined} */
    let value;
    if (token.startsWith('--')) {
      const eq = token.indexOf('=');
      if (eq !== -1) {
        key = token.slice(0, eq);
        value = token.slice(eq + 1);
      }
    }

    if (key === '--tier') {
      args.tier = value ?? argv[++i] ?? null;
      continue;
    }
    if (key === '--file') {
      args.file = value ?? argv[++i] ?? null;
      continue;
    }
    if (token.startsWith('-')) {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.tier || !(args.tier in TIER_PRICE_COLUMNS)) {
    throw new Error('Required --tier=start|pro|max');
  }
  if (!args.file) {
    throw new Error('Required --file=path');
  }

  return {
    tier: /** @type {SellerTier} */ (args.tier),
    file: args.file,
    applyNameHints: args.applyNameHints,
  };
}

/**
 * @returns {string}
 */
export function resolveDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  throw new Error(
    'Missing DATABASE_URL (or POSTGRES_URL_NON_POOLING / POSTGRES_PRISMA_URL / POSTGRES_URL)',
  );
}

/**
 * @param {{ dataRowCount: number, updateCount: number }} summary
 * @returns {number}
 */
export function importExitCode({ dataRowCount, updateCount }) {
  if (dataRowCount > 0 && updateCount === 0) return 1;
  return 0;
}

/**
 * @param {object} options
 * @param {string} options.csvText
 * @param {SellerTier} options.tier
 * @param {boolean} options.applyNameHints
 * @param {(input: { sku: string, priceCents: number, column: string, applyNameHints: boolean }) => Promise<{ found: boolean, name?: string, hidden?: boolean }>} options.updateBySku
 * @param {(message: string) => void} [options.warn]
 * @returns {Promise<{ dataRowCount: number, updateCount: number, missingSkus: string[], hiddenCount: number, skipped: { sku: string, reason: string }[] }>}
 */
export async function importPriceList({
  csvText,
  tier,
  applyNameHints,
  updateBySku,
  warn = console.warn,
}) {
  const column = tierPriceSqlColumn(tier);
  const parsed = parsePriceList(csvText);

  for (const skip of parsed.skipped) {
    warn(
      skip.sku
        ? `Skipping SKU ${skip.sku}: ${skip.reason}`
        : `Skipping row: ${skip.reason}`,
    );
  }

  let updateCount = 0;
  let hiddenCount = 0;
  /** @type {string[]} */
  const missingSkus = [];

  for (const row of parsed.rows) {
    const result = await updateBySku({
      sku: row.sku,
      priceCents: row.priceCents,
      column,
      applyNameHints,
    });
    if (!result.found) {
      missingSkus.push(row.sku);
      warn(`SKU not found: ${row.sku}`);
      continue;
    }
    updateCount += 1;
    if (result.hidden) hiddenCount += 1;
  }

  return {
    dataRowCount: parsed.dataRowCount,
    updateCount,
    missingSkus,
    hiddenCount,
    skipped: parsed.skipped,
  };
}

/**
 * @param {import('postgres').Sql} sql
 * @param {{ column: string, sku: string, cents: number, applyNameHints: boolean }} input
 */
export async function updateProductPrice(sql, input) {
  const { column, sku, cents, applyNameHints } = input;
  if (!Object.values(TIER_PRICE_COLUMNS).includes(column)) {
    throw new Error(`Refusing unknown price column: ${column}`);
  }

  const rows = applyNameHints
    ? await sql`
        UPDATE bling_products
        SET
          ${sql(column)} = ${cents},
          visible_b2b = CASE
            WHEN name LIKE '[INATIVO]%' OR name LIKE '[INTERNO]%' THEN false
            ELSE visible_b2b
          END
        WHERE sku = ${sku}
        RETURNING name, visible_b2b
      `
    : await sql`
        UPDATE bling_products
        SET ${sql(column)} = ${cents}
        WHERE sku = ${sku}
        RETURNING name, visible_b2b
      `;

  if (rows.length === 0) {
    return { found: false };
  }

  const row = rows[0];
  return {
    found: true,
    name: row.name,
    hidden: applyNameHints && nameHintHides(String(row.name ?? '')),
  };
}

function loadEnvFile() {
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile('.env');
    } catch {
      // Optional when vars are already exported.
    }
  }
}

function printUsage() {
  console.error(`
bling-price-list-import

Usage:
  pnpm prices:import --tier=start|pro|max --file=path [--apply-name-hints]

Updates only price_<tier>_cents on bling_products WHERE sku matches (trimmed).
Missing SKUs are skipped with a warning. Exits 1 when the file had data rows
but no rows were updated.

--apply-name-hints  set visible_b2b = false when name starts with [INATIVO]
                    or [INTERNO]; never sets visible_b2b back to true
`);
}

export async function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseCliArgs(argv);
  } catch (error) {
    printUsage();
    throw error;
  }

  loadEnvFile();
  const databaseUrl = resolveDatabaseUrl();
  const csvText = await readFile(resolve(options.file), 'utf8');

  const sql = postgres(databaseUrl, { prepare: false, max: 1 });
  try {
    const result = await importPriceList({
      csvText,
      tier: options.tier,
      applyNameHints: options.applyNameHints,
      updateBySku: ({ sku, priceCents, column, applyNameHints }) =>
        updateProductPrice(sql, {
          column,
          sku,
          cents: priceCents,
          applyNameHints,
        }),
    });

    console.log(
      JSON.stringify(
        {
          tier: options.tier,
          column: tierPriceSqlColumn(options.tier),
          file: options.file,
          dataRows: result.dataRowCount,
          updated: result.updateCount,
          missingSkus: result.missingSkus.length,
          skippedRows: result.skipped.length,
          hiddenByNameHint: result.hiddenCount,
        },
        null,
        2,
      ),
    );

    const code = importExitCode(result);
    if (code !== 0) {
      throw Object.assign(
        new Error(
          'No rows updated; check SKU match and that product sync ran first',
        ),
        { exitCode: code },
      );
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const isCli =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isCli) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = error?.exitCode ?? 1;
  });
}
