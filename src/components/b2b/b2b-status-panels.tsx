import { Link } from 'react-router-dom';

import type { SellerSummary } from '@/b2b/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function B2BUnconfiguredPanel() {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>B2B em configuração</CardTitle>
        <CardDescription>
          O pré-cadastro continua disponível. Login e catálogo liberam após
          conectar Supabase, Resend e Bling (veja docs/integrations).
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function B2BPendingPanel({
  seller,
  onSignOut,
}: {
  seller: SellerSummary | null;
  onSignOut: () => void;
}) {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Cadastro em análise</CardTitle>
        <CardDescription>
          {seller
            ? `Recebemos o pré-cadastro de ${seller.companyName}. A equipe GHENO libera o catálogo após aprovação.`
            : 'Recebemos seu pré-cadastro. A equipe GHENO libera o catálogo após aprovação.'}
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
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Cadastro não liberado</CardTitle>
        <CardDescription>
          {seller
            ? `O e-mail ${seller.email} não está autorizado no momento. Fale com a GHENO se precisar reavaliar.`
            : 'Este e-mail não está autorizado no momento.'}
        </CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button asChild>
          <Link to="/contato">Falar com a GHENO</Link>
        </Button>
        <Button type="button" variant="secondary" onClick={onSignOut}>
          Sair
        </Button>
      </div>
    </Card>
  );
}
