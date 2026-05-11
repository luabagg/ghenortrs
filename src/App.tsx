import { NavLink, Outlet, Route, Routes } from 'react-router-dom';

function AppShell() {
  return (
    <div>
      <header>
        <p>GHENO components</p>
        <nav aria-label="Principal">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/componentes">Componentes</NavLink>
          <NavLink to="/b2b">B2B</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <h1>GHENO components</h1>
      <h2>Performance-first MTB components</h2>
      <p>Base Vite + React + TypeScript scaffold for the first milestone.</p>
    </>
  );
}

function ComponentsPage() {
  return (
    <>
      <h1>Componentes GHENO</h1>
      <p>Estrutura inicial para a vitrine de pastilhas, cubos, aros e rotores.</p>
    </>
  );
}

function B2BPage() {
  return (
    <>
      <h1>Atendimento para lojistas e oficinas</h1>
      <p>Base para a futura jornada comercial voltada a distribuidores e revendas.</p>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>Use a navegação principal para voltar às rotas da aplicação.</p>
    </>
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
