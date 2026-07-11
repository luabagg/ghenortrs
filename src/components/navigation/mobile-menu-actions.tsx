import { Link } from 'react-router-dom';

const QUICK_ACTIONS = [
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Ver componentes',
    description: 'Pastilhas, cubos, aros e rotores',
    to: '/componentes',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Tecnologia',
    description: 'Compatibilidade e linhas disponíveis',
    href: '/#tecnologia',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Cadastro B2B',
    description: 'Solicite atendimento para revenda',
    to: '/b2b',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Falar com a GHENO',
    description: 'Canais oficiais de atendimento',
    to: '/contato',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Sobre a GHENO',
    description: 'Componentes MTB com foco técnico',
    to: '/sobre',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Política de privacidade',
    description: 'Tratamento de dados na loja online',
    href: 'https://store.ghenortrs.com.br/politica-de-privacidade/',
    badge: null as string | null,
  },
] as const;

export function MobileMenuActions({ onClose }: { onClose: () => void }) {
  return (
    <nav
      aria-label="Ações rápidas"
      className="overflow-hidden rounded-xl border border-border-strong bg-background/18"
    >
      {QUICK_ACTIONS.map((action) => {
        const content = (
          <>
            <div
              className={
                action.title === 'Falar com a GHENO'
                  ? 'flex h-10 w-10 shrink-0 items-center justify-center text-[#67d82f] min-[420px]:h-12 min-[420px]:w-12'
                  : 'flex h-10 w-10 shrink-0 items-center justify-center text-primary min-[420px]:h-12 min-[420px]:w-12'
              }
            >
              {action.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold leading-tight text-primary min-[420px]:text-lg">
                  {action.title}
                </span>
                {'badge' in action && action.badge && (
                  <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background">
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-tight text-secondary min-[420px]:text-base">
                {action.description}
              </p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-secondary/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </>
        );
        const className =
          'flex min-h-20 items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-elevated/60 active:bg-surface-elevated min-[420px]:min-h-24 min-[420px]:gap-5 min-[420px]:px-6';
        if ('to' in action && action.to) {
          return (
            <Link
              key={action.title}
              className={className}
              onClick={onClose}
              to={action.to}
            >
              {content}
            </Link>
          );
        }
        return (
          <a
            key={action.title}
            className={className}
            href={'href' in action ? action.href : '#'}
            onClick={onClose}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}
