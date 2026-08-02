import { Link } from 'react-router-dom';

import {
  footerLinkGroups,
  type FooterLink,
  type FooterLinkGroupData,
  socialLinks,
} from './app-footer-data';

const footerLinkClassName =
  'font-body text-[12px] leading-5 text-secondary transition-colors hover:text-primary';

const socialLinkClassName =
  'flex h-8 w-8 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-primary/40 hover:text-primary';

export function AppFooter() {
  return (
    <footer
      aria-label="Rodapé"
      className="border-t border-border bg-background-soft"
      data-section="footer"
    >
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <FooterBrand />
          <FooterNavigation />
        </div>
        <FooterLegal />
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div className="flex flex-col gap-4">
      <img
        alt="GHENO rotors"
        className="h-8 w-[8rem] rounded-sm object-contain object-left"
        height={250}
        loading="lazy"
        src="/brand/logo-wide.png"
        width={500}
      />
      <p className="max-w-xs font-body text-[12px] leading-5 text-secondary">
        Confira pastilhas, cubos, aros e discos no catálogo e na loja online
        GHENO rotors.
      </p>
      <FooterSocialLinks />
    </div>
  );
}

function FooterSocialLinks() {
  return (
    <div className="flex gap-3">
      {socialLinks.map((link) => (
        <a
          aria-label={link.ariaLabel}
          className={socialLinkClassName}
          href={link.href}
          key={link.ariaLabel}
        >
          {link.variant === 'stroke' ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d={link.path}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d={link.path} />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}

function FooterNavigation() {
  return (
    <>
      {footerLinkGroups.map((group) => (
        <FooterLinkGroup group={group} key={group.title} />
      ))}
    </>
  );
}

function FooterLinkGroup({ group }: { group: FooterLinkGroupData }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
        {group.title}
      </p>
      <nav aria-label={group.ariaLabel} className="flex flex-col gap-2.5">
        {group.links.map((link) => (
          <FooterLinkItem key={link.label} link={link} />
        ))}
      </nav>
    </div>
  );
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.to) {
    return (
      <Link className={footerLinkClassName} to={link.to}>
        {link.label}
      </Link>
    );
  }

  return (
    <a className={footerLinkClassName} href={link.href}>
      {link.label}
    </a>
  );
}

function FooterLegal() {
  return (
    <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-body text-[12px] leading-5 text-secondary/60">
        © 2025 GHENO rotors. Todos os direitos reservados.
      </p>
    </div>
  );
}
