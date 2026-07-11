import { Route, Routes } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { AppShell } from '@/components/navigation/app-shell';
import { AboutPage } from '@/components/pages/about-page';
import { B2BPage } from '@/components/pages/b2b-page';
import { ComponentsPage } from '@/components/pages/components-page';
import { ContactPage } from '@/components/pages/contact-page';
import { HomePage } from '@/components/pages/home-page';

function NotFoundPage() {
  return (
    <PageIntro
      description="Acesse o catálogo, conheça os componentes ou fale com a GHENO pelos links de navegação."
      eyebrow="404"
      title="Página não encontrada"
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="componentes" element={<ComponentsPage />} />
        <Route path="b2b" element={<B2BPage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
