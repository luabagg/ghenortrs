import type {
  CommerceFamilyId,
  CommerceMode,
} from '@/catalog/commerce';

export type SearchEntryKind = 'product' | 'category' | 'page';

export type SearchEntry = {
  id: string;
  kind: SearchEntryKind;
  title: string;
  href: string;
  image: string | null;
  family: CommerceFamilyId | null;
  commerce: CommerceMode | 'site';
  terms: readonly string[];
  featured: boolean;
  description?: string;
};

export type SearchResult = SearchEntry & {
  score: number;
};

export type StoreSearchIndex = {
  source: string;
  generatedAt: string;
  entries: SearchEntry[];
};
