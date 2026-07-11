import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { MetaLabel } from '@/components/ui/meta-label';
import { cn } from '@/lib/utils';

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-lg bg-surface px-0 py-0">
      <CardHeader className="px-6 py-8 sm:px-8 sm:py-10">
        <MetaLabel className="mb-1">{eyebrow}</MetaLabel>
        <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
          {title}
        </h1>
        <CardDescription className="max-w-2xl text-base leading-7 sm:text-lg">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ProductFamilyCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  isLive,
  imageAlt,
  imageSrc,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  isLive: boolean;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <Card className="group flex flex-col justify-between gap-0 overflow-hidden rounded-lg border-border-strong bg-surface/72">
      <div className="relative h-36 overflow-hidden bg-background-soft sm:h-48 lg:h-44">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover opacity-88 saturate-75 transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
      </div>
      <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
        <MetaLabel
          className={cn(
            'border-0 bg-transparent p-0 text-accent',
            !isLive && 'border-0 bg-transparent text-accent',
          )}
        >
          {eyebrow}
        </MetaLabel>
        <h3 className="font-heading text-lg leading-tight tracking-[-0.04em] text-primary sm:text-2xl">
          {title}
        </h3>
        <CardDescription className="hidden sm:block">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <a
          className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] text-primary transition-colors hover:text-accent"
          href={ctaHref}
        >
          {ctaLabel} <span className="text-lg text-accent">→</span>
        </a>
      </CardContent>
    </Card>
  );
}

export function TechnicalMediaCard({
  title,
  caption,
  imageAlt,
  imageSrc,
}: {
  title: string;
  caption: string;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <figure className="group relative min-h-72 min-w-[17rem] snap-start overflow-hidden rounded-lg border border-border bg-surface sm:min-w-0">
      <img
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-75 saturate-75 transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/54 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 grid gap-2 p-5 sm:p-6">
        <MetaLabel className="w-fit">TESTADO EM USO REAL</MetaLabel>
        <h3 className="font-heading text-2xl leading-tight tracking-[-0.03em] text-primary">
          {title}
        </h3>
        <p className="text-sm leading-6 text-primary/76">{caption}</p>
      </figcaption>
    </figure>
  );
}

export function B2BMediaCard({
  title,
  imageAlt,
  imageSrc,
}: {
  title: string;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <figure className="relative min-h-60 min-w-[15rem] snap-start overflow-hidden rounded-lg border border-on-primary/14 bg-on-primary/8 sm:min-w-0">
      <img
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-88 saturate-75"
        loading="lazy"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-on-primary/78 via-on-primary/16 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="w-fit rounded-sm bg-accent/92 px-2 py-1 font-heading text-lg leading-tight tracking-[-0.03em] text-on-accent shadow-[0_10px_28px_rgba(0,0,0,0.42)]">
          {title}
        </p>
      </figcaption>
    </figure>
  );
}
