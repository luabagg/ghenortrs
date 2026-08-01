import commerceMap from './commerce-map.json';

export type CommerceMode = 'store' | 'contact';
export type CommerceFamilyId =
  | 'pastilhas'
  | 'cubos'
  | 'aros'
  | 'rotores'
  | 'mass-dampers';

export type CommerceFamily = {
  id: CommerceFamilyId;
  label: string;
  commerce: CommerceMode;
  href: string;
  categoryPaths: readonly string[];
  productPathPatterns: readonly string[];
  terms: readonly string[];
};

const FAMILY_IDS: readonly CommerceFamilyId[] = [
  'pastilhas',
  'cubos',
  'aros',
  'rotores',
  'mass-dampers',
];

function isFamilyId(value: string): value is CommerceFamilyId {
  return FAMILY_IDS.includes(value as CommerceFamilyId);
}

function isCommerceMode(value: string): value is CommerceMode {
  return value === 'store' || value === 'contact';
}

export const COMMERCE_FAMILIES: readonly CommerceFamily[] =
  commerceMap.families.map((family) => {
    if (!isFamilyId(family.id) || !isCommerceMode(family.commerce)) {
      throw new Error(`Invalid commerce family configuration: ${family.id}`);
    }

    return family as CommerceFamily;
  });

export const STORE_ORIGIN = commerceMap.storeOrigin;
export const STORE_SEARCH_URL = commerceMap.searchUrl;

export function getCommerceFamily(id: CommerceFamilyId): CommerceFamily {
  const family = COMMERCE_FAMILIES.find((candidate) => candidate.id === id);
  if (!family) throw new Error(`Unknown commerce family: ${id}`);
  return family;
}
