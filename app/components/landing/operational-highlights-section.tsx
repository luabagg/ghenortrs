import { motion, useReducedMotion } from 'motion/react';

const OPERATIONAL_HIGHLIGHTS = [
  {
    title: 'Compre online',
    description: 'Compra segura e totalmente online',
  },
  {
    title: 'Encontre o modelo',
    description: 'Escolha por medida, sistema e encaixe',
  },
  {
    title: 'Consulte a equipe',
    description: 'Fale com quem desenvolve o produto',
  },
  {
    title: 'Revenda B2B',
    description: 'Condições para oficinas e lojas',
  },
] as const;

export function OperationalHighlightsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Destaques operacionais"
      className="border-b border-border bg-background"
      data-section="operational-highlights"
    >
      <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {OPERATIONAL_HIGHLIGHTS.map((item, index) => (
          <motion.div
            key={item.title}
            className="border-border px-6 py-7 sm:border-r sm:px-8 sm:py-8 lg:px-10 [&:nth-child(2)]:sm:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0 sm:[&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 max-sm:border-b max-sm:last:border-b-0"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            transition={{
              delay: index * 0.05,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ amount: 0.4, once: true }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <p className="text-sm font-bold leading-tight text-primary">
              {item.title}
            </p>
            <p className="mt-2 max-w-[16rem] font-body text-[12px] leading-5 text-secondary">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
