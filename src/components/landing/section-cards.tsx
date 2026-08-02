import { Link } from 'react-router-dom';

import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { ScrollImage } from '@/components/motion/scroll-image';
import { MetaLabel } from '@/components/ui/meta-label';

export function PageIntro({
  eyebrow,
  title,
  description,
  headingLevel = 1,
}: {
  eyebrow: string;
  title: string;
  description: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <Card className="rounded-md bg-surface px-0 py-0">
      <CardHeader className="px-6 py-8 sm:px-8 sm:py-10">
        <MetaLabel className="mb-1">{eyebrow}</MetaLabel>
        <Heading className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
          {title}
        </Heading>
        <CardDescription className="max-w-2xl text-base leading-7 sm:text-lg">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ProductFamilyCard({
  title,
  description,
  imageAlt,
  imageSrc,
  href = '/componentes',
}: {
  title: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  href?: string;
}) {
  return (
    <Link
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      to={href}
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-md border-border bg-surface transition-colors group-hover:border-primary/35">
        <div className="relative h-36 shrink-0 overflow-hidden bg-background-soft sm:h-48 lg:h-44">
          <ScrollImage
            alt={imageAlt}
            className="h-full w-full object-cover opacity-90 saturate-[0.8] will-change-transform"
            effect="zoom"
            loading="lazy"
            src={imageSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />
        </div>
        <CardHeader className="flex flex-1 flex-col gap-2 px-3 py-4 sm:px-5 sm:py-5">
          <h3 className="font-heading text-lg leading-tight tracking-[-0.04em] text-primary sm:text-xl">
            {title}
          </h3>
          <CardDescription className="hidden text-justify sm:block">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
