import { Link } from '@remix-run/react';

import type { SellerSummary } from '@/b2b/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function B2BPendingPanel({
  seller,
  onSignOut,
}: {
  seller: SellerSummary | null;
  onSignOut: () => void;
}) {
  return (
    <Card className="rounded-md border-border bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Cadastro em análise</CardTitle>
        <CardDescription>
          {seller
            ? `Recebemos o cadastro de ${seller.companyName}. A equipe GHENO rotors libera o catálogo após aprovação.`
            : 'Recebemos seu cadastro. A equipe GHENO rotors libera o catálogo após aprovação.'}
        </CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button asChild variant="secondary">
          <Link to="/contato">Ver canais de contato</Link>
        </Button>
        <Button type="button" variant="secondary" onClick={onSignOut}>
          Sair
        </Button>
      </div>
    </Card>
  );
}

export function B2BRejectedPanel({
  seller,
  onSignOut,
}: {
  seller: SellerSummary | null;
  onSignOut: () => void;
}) {
  return (
    <Card className="rounded-md border-border bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Cadastro não liberado</CardTitle>
        <CardDescription>
          {seller
            ? `O e-mail ${seller.email} não está autorizado no momento. Fale com a GHENO rotors se precisar reavaliar.`
            : 'Este e-mail não está autorizado no momento.'}
        </CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button asChild variant="outline">
          <Link to="/contato">Falar com a GHENO rotors</Link>
        </Button>
        <Button type="button" variant="secondary" onClick={onSignOut}>
          Sair
        </Button>
      </div>
    </Card>
  );
}
