import { describe, expect, it } from 'vitest';

import { parseBrMoneyToCents as parseBrMoneyFromTs } from '../app/server/br-money.ts';
import {
  detectColumns,
  detectDelimiter,
  foldHeader,
  importExitCode,
  importPriceList,
  nameHintHides,
  parseBrMoneyToCents,
  parseCliArgs,
  parseCsvText,
  parsePriceList,
  parseRow,
  resolveDatabaseUrl,
  tierPriceSqlColumn,
} from './bling-price-list-import.mjs';

const BLING_HEADER =
  'Produto;Sku;GTIN/EAN;R$ Preço no Bling;R$ Preço da lista';

describe('parseBrMoneyToCents', () => {
  it('matches Task 2 BR money vectors', () => {
    expect(parseBrMoneyToCents('61,49')).toBe(6149);
    expect(parseBrMoneyToCents('R$ 1.234,56')).toBe(123456);
    expect(parseBrMoneyToCents('')).toBeNull();
    expect(parseBrMoneyToCents('61,49')).toBe(parseBrMoneyFromTs('61,49'));
    expect(parseBrMoneyToCents('R$ 1.234,56')).toBe(
      parseBrMoneyFromTs('R$ 1.234,56'),
    );
    expect(parseBrMoneyToCents('')).toBe(parseBrMoneyFromTs(''));
  });
});

describe('detectColumns', () => {
  it('finds Sku and R$ Preço da lista (Bling export)', () => {
    const columns = detectColumns(BLING_HEADER.split(';'));
    expect(columns.skuIndex).toBe(1);
    expect(columns.listPriceIndex).toBe(4);
    expect(columns.nameIndex).toBe(0);
  });

  it('matches accent-insensitive "preco da lista"', () => {
    const columns = detectColumns(['sku', 'Preco da lista']);
    expect(columns.skuIndex).toBe(0);
    expect(columns.listPriceIndex).toBe(1);
  });

  it('accepts price_lista alias', () => {
    const columns = detectColumns(['SKU', 'price_lista']);
    expect(columns.skuIndex).toBe(0);
    expect(columns.listPriceIndex).toBe(1);
  });

  it('does not treat Preço no Bling as the list price', () => {
    expect(() => detectColumns(['Sku', 'R$ Preço no Bling'])).toThrow(
      /Missing list price column/,
    );
  });

  it('requires a SKU header', () => {
    expect(() => detectColumns(['Produto', 'R$ Preço da lista'])).toThrow(
      /Missing SKU column/,
    );
  });

  it('does not treat sku-like names as SKU', () => {
    expect(() => detectColumns(['sku_fornecedor', 'price_lista'])).toThrow(
      /Missing SKU column/,
    );
  });
});

describe('foldHeader', () => {
  it('strips accents and case', () => {
    expect(foldHeader('  R$ Preço da lista ')).toBe('r$ preco da lista');
  });
});

describe('parseCsvText / parseRow', () => {
  it('parses a semicolon Bling export row to start-tier cents', () => {
    const text = `${BLING_HEADER}\nCubo dianteiro;GO-HUB-01;789;50,00;61,49\n`;
    const { headers, records, delimiter } = parseCsvText(text);
    expect(delimiter).toBe(';');
    const columns = detectColumns(headers);
    expect(parseRow(records[0], columns)).toEqual({
      sku: 'GO-HUB-01',
      priceCents: 6149,
      name: 'Cubo dianteiro',
      rawPrice: '61,49',
    });
  });

  it('parses comma CSV and TSV', () => {
    expect(detectDelimiter('sku,price_lista')).toBe(',');
    expect(detectDelimiter('sku\tprice_lista')).toBe('\t');

    const csv = parseCsvText('sku,price_lista\nABC,"1.234,56"\n');
    const columns = detectColumns(csv.headers);
    expect(parseRow(csv.records[0], columns).priceCents).toBe(123456);

    const tsv = parseCsvText('sku\tprice_lista\nABC\t61,49\n');
    expect(parseRow(tsv.records[0], detectColumns(tsv.headers)).priceCents).toBe(
      6149,
    );
  });

  it('maps import rows and skips empty/invalid prices', () => {
    const parsed = parsePriceList(
      `${BLING_HEADER}\nKeep;SKU-1;1;1,00;10,00\nSkip;;2;1,00;10,00\nBad;SKU-2;3;1,00;n/a\n`,
    );
    expect(parsed.dataRowCount).toBe(3);
    expect(parsed.rows).toEqual([
      { sku: 'SKU-1', priceCents: 1000, name: 'Keep' },
    ]);
    expect(parsed.skipped).toEqual([
      { sku: '', reason: 'empty SKU' },
      { sku: 'SKU-2', reason: 'invalid list price "n/a"' },
    ]);
  });
});

describe('parseCliArgs / tier column', () => {
  it('parses equals and space forms plus name-hint flag', () => {
    expect(
      parseCliArgs([
        '--tier=start',
        '--file=./exports/start.csv',
        '--apply-name-hints',
      ]),
    ).toEqual({
      tier: 'start',
      file: './exports/start.csv',
      applyNameHints: true,
    });
    expect(
      parseCliArgs(['--', '--tier', 'max', '--file', 'pro.csv']),
    ).toEqual({
      tier: 'max',
      file: 'pro.csv',
      applyNameHints: false,
    });
  });

  it('rejects missing or invalid args', () => {
    expect(() => parseCliArgs(['--file=x.csv'])).toThrow(/--tier=/);
    expect(() => parseCliArgs(['--tier=gold', '--file=x.csv'])).toThrow(
      /--tier=/,
    );
    expect(() => parseCliArgs(['--tier=pro'])).toThrow(/--file=/);
    expect(() =>
      parseCliArgs(['--tier=pro', '--file=x.csv', '--dry-run']),
    ).toThrow(/Unknown argument/);
  });

  it('maps each tier to its SQL column only', () => {
    expect(tierPriceSqlColumn('start')).toBe('price_start_cents');
    expect(tierPriceSqlColumn('pro')).toBe('price_pro_cents');
    expect(tierPriceSqlColumn('max')).toBe('price_max_cents');
    expect(() => tierPriceSqlColumn('gold')).toThrow(/Invalid tier/);
  });
});

describe('nameHintHides', () => {
  it('hides only [INATIVO]/[INTERNO] prefixes and never implies re-enable', () => {
    expect(nameHintHides('[INATIVO] Cubo')).toBe(true);
    expect(nameHintHides('[INTERNO] Disco')).toBe(true);
    expect(nameHintHides('[inativo] Cubo')).toBe(false);
    expect(nameHintHides('Cubo [INATIVO]')).toBe(false);
    expect(nameHintHides('Cubo')).toBe(false);
  });
});

describe('importPriceList', () => {
  it('updates only matching SKUs, warns on missing, exits 1 when zero updates', async () => {
    const warnings = [];
    const calls = [];
    const csv = `${BLING_HEADER}\nA;KNOWN;1;1,00;61,49\nB;MISSING;2;1,00;10,00\n`;

    const result = await importPriceList({
      csvText: csv,
      tier: 'pro',
      applyNameHints: false,
      warn: (message) => warnings.push(message),
      updateBySku: async (input) => {
        calls.push(input);
        return { found: input.sku === 'KNOWN' };
      },
    });

    expect(calls).toEqual([
      {
        sku: 'KNOWN',
        priceCents: 6149,
        column: 'price_pro_cents',
        applyNameHints: false,
      },
      {
        sku: 'MISSING',
        priceCents: 1000,
        column: 'price_pro_cents',
        applyNameHints: false,
      },
    ]);
    expect(result.updateCount).toBe(1);
    expect(result.missingSkus).toEqual(['MISSING']);
    expect(warnings.some((line) => line.includes('SKU not found: MISSING'))).toBe(
      true,
    );
    expect(importExitCode(result)).toBe(0);
    expect(importExitCode({ dataRowCount: 2, updateCount: 0 })).toBe(1);
    expect(importExitCode({ dataRowCount: 0, updateCount: 0 })).toBe(0);
  });

  it('records hidden rows from name hints without setting visible true', async () => {
    const result = await importPriceList({
      csvText: 'sku,price_lista\nHID,"10,00"\nVIS,"20,00"\n',
      tier: 'max',
      applyNameHints: true,
      updateBySku: async ({ sku }) => {
        if (sku === 'HID') {
          return { found: true, name: '[INTERNO] Spare', hidden: true };
        }
        return { found: true, name: 'Visible', hidden: false };
      },
    });
    expect(result.updateCount).toBe(2);
    expect(result.hiddenCount).toBe(1);
  });
});

describe('resolveDatabaseUrl', () => {
  it('prefers DATABASE_URL then POSTGRES_URL_NON_POOLING', () => {
    const previous = {
      DATABASE_URL: process.env.DATABASE_URL,
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL: process.env.POSTGRES_URL,
    };
    try {
      delete process.env.DATABASE_URL;
      delete process.env.POSTGRES_URL_NON_POOLING;
      delete process.env.POSTGRES_PRISMA_URL;
      delete process.env.POSTGRES_URL;
      expect(() => resolveDatabaseUrl()).toThrow(/Missing DATABASE_URL/);

      process.env.POSTGRES_URL = 'postgres://last';
      process.env.POSTGRES_PRISMA_URL = 'postgres://prisma';
      process.env.POSTGRES_URL_NON_POOLING = 'postgres://nonpool';
      expect(resolveDatabaseUrl()).toBe('postgres://nonpool');

      process.env.DATABASE_URL = 'postgres://first';
      expect(resolveDatabaseUrl()).toBe('postgres://first');
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
