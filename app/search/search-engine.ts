import type { SearchEntry, SearchResult } from './search-types';

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9.]+/g, ' ')
    .trim();
}

function scoreEntry(
  entry: SearchEntry,
  normalizedQuery: string,
  tokens: readonly string[],
): number {
  const title = normalizeSearchText(entry.title);
  const searchable = normalizeSearchText(
    `${entry.title} ${entry.terms.join(' ')}`,
  );
  if (!tokens.every((token) => searchable.includes(token))) return 0;

  const titleWords = title.split(' ');
  let score =
    entry.kind === 'product' ? 30 : entry.kind === 'category' ? 20 : 10;
  if (title === normalizedQuery) score += 1_000;
  else if (title.includes(normalizedQuery)) score += 600;
  else if (tokens.every((token) => title.includes(token))) score += 300;
  else score += 120;

  score += tokens.reduce(
    (total, token) =>
      total + (titleWords.some((word) => word.startsWith(token)) ? 20 : 0),
    0,
  );
  return score;
}

export function searchCatalog(
  query: string,
  entries: readonly SearchEntry[],
  limit = 8,
): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return entries
      .filter(({ featured }) => featured)
      .slice(0, limit)
      .map((entry) => ({ ...entry, score: 0 }));
  }

  const tokens = normalizedQuery.split(/\s+/);
  return entries
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery, tokens),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.entry.title.localeCompare(right.entry.title, 'pt-BR'),
    )
    .slice(0, limit)
    .map(({ entry, score }) => ({ ...entry, score }));
}
