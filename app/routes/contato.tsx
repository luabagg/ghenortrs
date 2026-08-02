import type { MetaFunction } from '@remix-run/node';

import { ContactPage } from '~/components/pages/contact-page';
import { buildSeoMetaForPath } from '~/lib/seo';

export const meta: MetaFunction = () => buildSeoMetaForPath('/contato');

export default function ContatoRoute() {
  return <ContactPage />;
}
