/**
 * Fluid heading scales. DESIGN.md states the desktop size; these clamp down to
 * a readable mobile size instead of forcing 50px onto a 360px screen.
 * The hero sets the ceiling, so every page title scales the same way.
 */
export const HEADING_DISPLAY =
  'font-heading text-[clamp(2.05rem,7.2vw,4.75rem)] leading-[0.92] tracking-[-0.05em] sm:text-[clamp(2.75rem,8.5vw,4.75rem)]';

/** Page titles: same curve as the hero, capped at the 50px design token. */
export const HEADING_PAGE =
  'font-heading text-[clamp(1.75rem,6vw,3.125rem)] leading-[0.96] tracking-[-0.05em]';

/** Section titles inside a page. */
export const HEADING_SECTION =
  'font-heading text-[clamp(1.6rem,5.4vw,3.125rem)] leading-[0.98] tracking-[-0.04em]';
