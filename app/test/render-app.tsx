import { render } from '@testing-library/react';
import {
  createMemoryRouter,
  Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { B2BCatalogPage } from '~/components/b2b/b2b-catalog-page';
import { PageIntro } from '~/components/landing/section-cards';
import { AppShell } from '~/components/navigation/app-shell';
import { AboutPage } from '~/components/pages/about-page';
import { B2BPage } from '~/components/pages/b2b-page';
import { ComponentsPage } from '~/components/pages/components-page';
import { ContactPage } from '~/components/pages/contact-page';
import { HomePage } from '~/components/pages/home-page';
import { Button } from '~/components/ui/button';

function NotFoundPage() {
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

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <ShellLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'componentes', element: <ComponentsPage /> },
          { path: 'b2b', element: <B2BPage /> },
          { path: 'b2b/catalogo', element: <B2BCatalogPage /> },
          { path: 'sobre', element: <AboutPage /> },
          { path: 'contato', element: <ContactPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
}
