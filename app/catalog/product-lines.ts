import type { SearchEntry } from '@/search/search-types';

export type PadLine = 'Elite' | 'Ultra';

export type PadSystem = {
  system: string;
  products: Partial<Record<PadLine, SearchEntry>>;
};

// Store pad names follow "<brake system> - Pastilha de Freio GHENO <line>".
const PAD_NAME = /^(.+?) - Pastilha de Freio GHENO (Elite|Ultra)$/;

/**
 * Groups pads by brake system so one row shows every line for that system.
 * A name outside the store pattern goes to `other` and still gets listed.
 */
export function groupPadsBySystem(pads: readonly SearchEntry[]): {
  systems: PadSystem[];
  other: SearchEntry[];
} {
  const systems = new Map<string, PadSystem>();
  const other: SearchEntry[] = [];

  for (const pad of pads) {
    const match = PAD_NAME.exec(pad.title);
    if (!match) {
      other.push(pad);
      continue;
    }
    const [, system, line] = match;
    const row = systems.get(system) ?? { system, products: {} };
    row.products[line as PadLine] = pad;
    systems.set(system, row);
  }

  return { systems: [...systems.values()], other };
}

/** The page already names the brand and the sport, so drop both suffixes. */
export function shortProductName(title: string): string {
  return title.replace(/ - GHENO rotors$/, '').replace(/ para MTB$/, '');
}
