import type { MetaFunction } from '@remix-run/node';

import { AboutPage } from '~/components/pages/about-page';
import { buildSeoMetaForPath } from '~/lib/seo';

export const meta: MetaFunction = () => buildSeoMetaForPath('/sobre');

export default function SobreRoute() {
  return <AboutPage />;
}
