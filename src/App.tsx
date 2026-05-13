import { Route, Routes } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { AppShell } from '@/components/navigation/app-shell';
import { B2BPage } from '@/components/pages/b2b-page';
import { ComponentsPage } from '@/components/pages/components-page';
import { HomePage } from '@/components/pages/home-page';

function NotFoundPage() {
  return (
    <PageIntro
      description="Use a navegação principal para voltar às rotas existentes enquanto a arquitetura do MVP continua sendo construída."
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
