const OPERATIONAL_HIGHLIGHTS = [
  {
    title: 'Controle extremo',
    description: 'Freios afinados para qualquer trilha',
    iconPath:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Materiais premium',
    description: 'Qualidade e consistência que você vai notar',
    iconPath:
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    title: 'Testado em condições reais',
    description: 'Nas pistas mais exigentes do Brasil',
    iconPath:
      'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    title: 'Performance que dá confiança',
    description: 'Para você e para o seu negócio',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
] as const;

export function OperationalHighlightsSection() {
  return (
    <section
      aria-label="Destaques operacionais"
      className="grid grid-cols-2 gap-4 rounded-panel border border-border bg-surface-elevated px-6 py-6 sm:gap-5 sm:px-8 lg:grid-cols-4"
    >
      {OPERATIONAL_HIGHLIGHTS.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d={item.iconPath}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
