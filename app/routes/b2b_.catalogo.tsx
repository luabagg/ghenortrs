import type { MetaFunction } from '@remix-run/node';

import { B2BCatalogPage } from '~/components/b2b/b2b-catalog-page';
import { buildNoIndexMeta } from '~/lib/seo';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Catálogo B2B | GHENO rotors',
    'Catálogo comercial GHENO rotors para lojistas aprovados.',
  );

export default function B2BCatalogRoute() {
  return <B2BCatalogPage />;
}
