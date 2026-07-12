import { GlassPanel } from '@/components/ui/glass-panel';
import { motion, useReducedMotion } from 'motion/react';

const OPERATIONAL_HIGHLIGHTS = [
  {
    title: 'Compre online',
    description: 'Pastilhas, cubos e aros na Nuvemshop',
    iconPath:
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Encontre o modelo',
    description: 'Busca por sistema, medida e compatibilidade',
    iconPath:
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    title: 'Consulte a equipe',
    description: 'Rotores e mass dampers sob consulta',
    iconPath:
      'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    title: 'Venda profissional',
    description: 'Cadastro para oficinas e revendas',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
] as const;

export function OperationalHighlightsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Destaques operacionais"
      className="absolute inset-x-0 bottom-7 z-10 mx-auto w-[calc(100%-3rem)] max-w-[60rem] sm:bottom-9 sm:w-[calc(100%-5rem)] lg:bottom-10"
      data-section="operational-highlights"
    >
      <GlassPanel className="grid grid-cols-2 overflow-hidden rounded-lg border-border-strong p-0 lg:grid-cols-4">
        {OPERATIONAL_HIGHLIGHTS.map((item, index) => (
          <motion.div
            key={item.title}
            className="flex min-w-0 flex-col justify-between gap-3 border-white/10 px-3 py-4 text-left odd:border-r [&:nth-child(-n+2)]:border-b sm:aspect-[1.65/1] sm:px-4 lg:border-r lg:px-5 lg:py-5 lg:[&:nth-child(-n+2)]:border-b-0 lg:last:border-r-0"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            transition={{
              delay: index * 0.06,
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ amount: 0.5, once: true }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-transparent text-accent">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
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
              <p className="text-sm font-bold leading-tight text-primary sm:text-base">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-secondary sm:text-xs sm:leading-5">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </GlassPanel>
    </section>
  );
}
