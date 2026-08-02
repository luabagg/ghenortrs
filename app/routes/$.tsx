import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { PageIntro } from '~/components/landing/section-cards';
import { Button } from '~/components/ui/button';
import { buildSeoMetaForPath } from '~/lib/seo';

export const meta: MetaFunction = () => buildSeoMetaForPath('/404');

export async function loader({ request }: LoaderFunctionArgs) {
  throw new Response(null, {
    status: 404,
    statusText: `Not Found: ${new URL(request.url).pathname}`,
  });
}

export default function NotFoundRoute() {
  // loader always throws; this is a fallback for client navigations.
  return (
    <div className="grid gap-8" data-section="not-found-page">
      <PageIntro
        description="O endereço informado não corresponde a uma página disponível."
        title="Página não encontrada"
      />
      <nav aria-label="Recuperação de página" className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/">Voltar ao início</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/componentes">Ver componentes MTB</Link>
        </Button>
      </nav>
    </div>
  );
}
