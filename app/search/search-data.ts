import type { CommerceFamilyId, CommerceMode } from '@/catalog/commerce';

import storeIndexJson from './store-search-index.json';
import type { SearchEntry } from './search-types';

const FAMILY_IDS = new Set<CommerceFamilyId>([
  'pastilhas',
  'cubos',
  'aros',
  'discos',
  'mass-dampers',
]);

function isCommerce(value: unknown): value is CommerceMode {
  return value === 'store' || value === 'contact';
}

function parseStoreEntry(value: unknown): SearchEntry {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid store search entry');
  }

  const entry = value as Record<string, unknown>;
  const family = entry.family;
  if (
    typeof entry.id !== 'string' ||
    (entry.kind !== 'product' && entry.kind !== 'category') ||
    typeof entry.title !== 'string' ||
    typeof entry.href !== 'string' ||
    (entry.image !== null && typeof entry.image !== 'string') ||
    typeof family !== 'string' ||
    !FAMILY_IDS.has(family as CommerceFamilyId) ||
    !isCommerce(entry.commerce) ||
    !Array.isArray(entry.terms) ||
    !entry.terms.every((term) => typeof term === 'string') ||
    typeof entry.featured !== 'boolean'
  ) {
    throw new Error(`Invalid store search entry: ${String(entry.id)}`);
  }

  return {
    id: entry.id,
    kind: entry.kind,
    title: entry.title,
    href: entry.href,
    image: entry.image,
    family: family as CommerceFamilyId,
    commerce: entry.commerce,
    terms: entry.terms,
    featured: entry.featured,
  };
}

const LOCAL_ENTRIES: readonly SearchEntry[] = [
  {
    id: 'page:componentes',
    kind: 'page',
    title: 'Componentes GHENO rotors',
    href: '/componentes',
    image: null,
    family: null,
    commerce: 'site',
    terms: ['pastilhas', 'cubos', 'aros', 'discos', 'rotores', 'catálogo'],
    featured: false,
    description: 'Visão geral das famílias de componentes',
  },
  {
    id: 'page:b2b',
    kind: 'page',
    title: 'Cadastro B2B',
    href: '/b2b',
    image: null,
    family: null,
    commerce: 'site',
    terms: ['oficina', 'revenda', 'lojista', 'comercial'],
    featured: false,
    description: 'Atendimento para oficinas e revendas',
  },
  {
    id: 'page:sobre',
    kind: 'page',
    title: 'Sobre a GHENO rotors',
    href: '/sobre',
    image: null,
    family: null,
    commerce: 'site',
    terms: ['marca', 'empresa', 'gheno'],
    featured: false,
    description: 'Marca e foco técnico',
  },
  {
    id: 'page:contato',
    kind: 'page',
    title: 'Contato',
    href: '/contato',
    image: null,
    family: null,
    commerce: 'site',
    terms: ['atendimento', 'falar', 'instagram', 'comercial'],
    featured: false,
    description: 'Canais oficiais de atendimento',
  },
];

if (!Array.isArray(storeIndexJson.entries)) {
  throw new Error('Invalid store search index');
}

export const SEARCH_ENTRIES: readonly SearchEntry[] = [
  ...storeIndexJson.entries
    .map(parseStoreEntry)
    .filter((entry) => entry.family !== 'mass-dampers'),
  ...LOCAL_ENTRIES,
];
