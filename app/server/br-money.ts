export function parseBrMoneyToCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withoutCurrency = trimmed.replace(/R\$\s*/gi, '').trim();
  const withoutThousands = withoutCurrency.replace(/\./g, '');
  const normalized = withoutThousands.replace(',', '.');

  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * 100);
}
