import type { MetaFunction } from '@remix-run/node';

import { ComponentsPage } from '~/components/pages/components-page';
import { buildSeoMetaForPath } from '~/lib/seo';

export const meta: MetaFunction = () => buildSeoMetaForPath('/componentes');

export default function ComponentesRoute() {
  return <ComponentsPage />;
}
