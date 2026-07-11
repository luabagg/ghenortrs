import { GlassPanel } from '@/components/ui/glass-panel';

const OPERATIONAL_HIGHLIGHTS = [
  {
    title: 'Catálogo de pastilhas ativo',
    description: 'Compra online com checkout Nuvemshop',
    iconPath:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Compatibilidade identificada',
    description: 'Modelos organizados por sistema de freio',
    iconPath:
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    title: 'Outras linhas sob consulta',
    description: 'Cubos, aros e rotores via atendimento',
    iconPath:
      'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    title: 'Atendimento B2B',
    description: 'Cadastro para oficinas e revendas',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
] as const;

export function OperationalHighlightsSection() {
  return (
    <section
      aria-label="Destaques operacionais"
      className="absolute inset-x-0 bottom-8 z-10 mx-auto w-[calc(100%-3rem)] max-w-[84rem] sm:bottom-10 sm:w-[calc(100%-5rem)] lg:bottom-12"
      data-section="operational-highlights"
    >
      <GlassPanel className="grid min-h-36 grid-cols-2 place-items-center gap-4 overflow-hidden rounded-lg px-4 py-5 sm:px-8 sm:py-7 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
        {OPERATIONAL_HIGHLIGHTS.map((item) => (
          <div
            key={item.title}
            className="flex min-w-0 flex-col items-center justify-center gap-3 text-center lg:min-h-24 lg:flex-row lg:px-8 lg:text-left first:lg:pl-0 last:lg:pr-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-transparent text-accent lg:text-primary">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
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
              <p className="text-sm font-extrabold leading-tight text-primary sm:text-base lg:text-xs lg:uppercase lg:tracking-[0.14em]">
                {item.title}
              </p>
              <p className="mt-1 hidden text-xs leading-5 text-secondary lg:block">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </GlassPanel>
    </section>
  );
}
