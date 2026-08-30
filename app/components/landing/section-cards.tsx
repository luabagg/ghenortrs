import { Link } from '@remix-run/react';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { MetaLabel } from '@/components/ui/meta-label';
import { cn } from '@/lib/utils';

export function PageIntro({
  eyebrow,
  title,
  description,
  headingLevel = 1,
  framed = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  headingLevel?: 1 | 2;
  /** Keep the surface card frame (B2B form intros). */
  framed?: boolean;
  className?: string;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  const body = (
    <>
      {eyebrow ? <MetaLabel className="mb-1">{eyebrow}</MetaLabel> : null}
      <Heading className="max-w-4xl text-balance font-heading text-[50px] leading-none tracking-[-0.05em]">
        {title}
      </Heading>
      <p className="max-w-2xl font-body text-[14px] leading-5 text-secondary">
        {description}
      </p>
    </>
  );

  if (!framed) {
    return (
      <header className={cn('grid gap-4', className)} data-slot="page-intro">
        {body}
      </header>
    );
  }

  return (
    <Card
      className={cn('rounded-md border-border bg-surface px-0 py-0', className)}
      data-slot="page-intro"
    >
      <CardHeader className="gap-4 px-6 py-8 sm:px-8 sm:py-10">
        {body}
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
          <img
            alt={imageAlt}
            className="h-full w-full object-cover opacity-90 saturate-[0.8]"
            loading="lazy"
            src={imageSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />
        </div>
        <CardHeader className="flex flex-1 flex-col gap-2 px-3 py-4 sm:px-5 sm:py-5">
          <h3 className="font-heading text-lg leading-tight tracking-[-0.04em] text-primary sm:text-xl">
            {title}
          </h3>
          <CardDescription className="hidden sm:block">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
