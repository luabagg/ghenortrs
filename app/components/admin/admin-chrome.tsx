import type { ReactNode } from 'react';
import { Form, Link } from '@remix-run/react';

import { Button } from '~/components/ui/button';

type AdminSection = 'sellers' | 'products';

export function AdminChrome({
  title,
  description,
  current,
  children,
}: {
  title: string;
  description: string;
  current: AdminSection;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
            Admin
          </p>
          <nav
            aria-label="Seções administrativas"
            className="flex flex-wrap gap-5"
          >
            <AdminNavLink active={current === 'sellers'} href="/admin">
              Lojistas
            </AdminNavLink>
            <AdminNavLink
              active={current === 'products'}
              href="/admin/produtos"
            >
              Produtos
            </AdminNavLink>
          </nav>
          <h1 className="font-heading text-[30px] font-semibold tracking-[-0.03em]">
            {title}
          </h1>
          <p className="text-sm text-secondary">{description}</p>
        </div>
        <Form action="/admin/logout" method="post">
          <Button type="submit" variant="secondary">
            Sair
          </Button>
        </Form>
      </div>
      {children}
    </div>
  );
}

function AdminNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'border-b border-primary pb-1 text-sm font-bold uppercase tracking-[0.08em] text-primary'
          : 'border-b border-transparent pb-1 text-sm font-bold uppercase tracking-[0.08em] text-secondary hover:text-primary'
      }
      to={href}
    >
      {children}
    </Link>
  );
}
