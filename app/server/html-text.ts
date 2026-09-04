// Flattens seller-authored or template HTML into readable text.
//
// Two callers: the catalog, which must never hand markup to the client, and
// the email sender, which needs a plain-text alternative beside every HTML
// body. It lives here rather than in bling.ts so neither pulls sharp in.

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
};

/**
 * Flattens HTML to text: <br> and block closes become newlines, tags are
 * dropped, and the handful of entities that appear in this content decode.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(
      /&(amp|lt|gt|quot|#39|nbsp);/g,
      (_match, entity: string) => HTML_ENTITIES[entity] ?? ' ',
    )
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
