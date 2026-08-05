import type { MetaFunction } from '@remix-run/node';

import { HomePage } from '~/components/pages/home-page';
import { buildSeoMetaForPath } from '~/lib/seo';

export const meta: MetaFunction = () => buildSeoMetaForPath('/');

export default function IndexRoute() {
  return <HomePage />;
}
