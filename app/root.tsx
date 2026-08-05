import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';

import { PageIntro } from '~/components/landing/section-cards';
import { AppShell } from '~/components/navigation/app-shell';
import { Button } from '~/components/ui/button';
import { buildSeoMetaForPath } from '~/lib/seo';

import styles from '~/styles.css?url';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Sora:wght@650;700&display=swap',
  },
  { rel: 'stylesheet', href: styles },
  { rel: 'icon', href: '/brand/favicon.png', type: 'image/png' },
  { rel: 'apple-touch-icon', href: '/brand/favicon.png' },
  {
    rel: 'alternate',
    href: '/llms.txt',
    type: 'text/plain',
    title: 'Informações sobre GHENO rotors para agentes de IA',
  },
];

export const meta: MetaFunction = () => buildSeoMetaForPath('/');

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const isNotFound = status === 404;

  return (
    <AppShell>
      <div className="grid gap-8" data-section="error-page">
        <PageIntro
          description={
            isNotFound
              ? 'O endereço informado não corresponde a uma página disponível.'
              : 'Ocorreu um erro inesperado ao carregar esta página.'
          }
          title={isNotFound ? 'Página não encontrada' : 'Erro no servidor'}
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
    </AppShell>
  );
}
