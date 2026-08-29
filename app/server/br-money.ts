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

/** Formats integer cents as Brazilian reais, e.g. `6149` → `R$ 61,49`. */
export function formatCentsToBRL(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(cents));
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}R$ ${grouped},${String(frac).padStart(2, '0')}`;
}
