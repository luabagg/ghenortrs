import { Link, Route, Routes } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { AppShell } from '@/components/navigation/app-shell';
import { B2BCatalogPage } from '@/components/b2b/b2b-catalog-page';
import { AboutPage } from '@/components/pages/about-page';
import { B2BPage } from '@/components/pages/b2b-page';
import { ComponentsPage } from '@/components/pages/components-page';
import { ContactPage } from '@/components/pages/contact-page';
import { HomePage } from '@/components/pages/home-page';

function NotFoundPage() {
  return (
    <div className="grid gap-6">
      <PageIntro
        description="O endereço informado não corresponde a uma página disponível."
        eyebrow="404"
        title="Página não encontrada"
      />
      <nav aria-label="Recuperação de página" className="flex flex-wrap gap-4">
        <Link className="font-bold text-primary underline" to="/">
          Voltar ao início
        </Link>
        <Link className="font-bold text-primary underline" to="/componentes">
          Ver componentes MTB
        </Link>
      </nav>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="componentes" element={<ComponentsPage />} />
        <Route path="b2b" element={<B2BPage />} />
        <Route path="b2b/catalogo" element={<B2BCatalogPage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
