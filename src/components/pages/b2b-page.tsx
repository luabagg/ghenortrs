import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useB2BSession } from '@/b2b/use-b2b-session';
import { B2BLoginCard } from '@/components/b2b/b2b-login-card';
import {
  B2BPendingPanel,
  B2BRejectedPanel,
  B2BUnconfiguredPanel,
} from '@/components/b2b/b2b-status-panels';
import { B2BForm } from '@/components/pages/b2b-form';
import {
  B2BAccessHeroSection,
  B2BLeadIntroSection,
  B2BSuccessSection,
} from '@/components/pages/b2b-page-sections';
import { useB2BLeadForm } from '@/components/pages/use-b2b-lead-form';
import { Button } from '@/components/ui/button';

type GateMode = 'login' | 'register';

export function B2BPage() {
  const { configured, gate, session, signOut, refresh } = useB2BSession();
  const [mode, setMode] = useState<GateMode>('register');
  const {
    errors,
    fields,
    handleFieldChange,
    handleSubmit,
    honeypot,
    setHoneypot,
    status,
  } = useB2BLeadForm({
    onRegistered: () => {
      void refresh();
    },
  });

  if (gate === 'loading') {
    return (
      <div className="grid gap-8">
        <B2BAccessHeroSection
          description="Verificando sessão comercial…"
          title="B2B GHENO."
        />
        <p className="text-secondary">Carregando…</p>
      </div>
    );
  }

  if (status === 'success' && gate !== 'approved') {
    return <B2BSuccessSection />;
  }

  if (gate === 'approved') {
    return (
      <div className="grid gap-8">
        <B2BAccessHeroSection
          description={`${session.seller?.companyName ?? 'Sua empresa'} já possui acesso ao catálogo comercial Bling.`}
          title="Catálogo B2B liberado."
        />
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/b2b/catalogo">Abrir catálogo B2B</Link>
          </Button>
          <Button type="button" variant="secondary" onClick={() => void signOut()}>
            Sair
          </Button>
        </div>
      </div>
    );
  }

  if (gate === 'pending') {
    return (
      <div className="grid gap-8">
        <B2BAccessHeroSection
          description="Recebemos seus dados. O catálogo libera após aprovação manual da GHENO."
          title="Cadastro em análise."
        />
        <B2BPendingPanel seller={session.seller} onSignOut={() => void signOut()} />
      </div>
    );
  }

  if (gate === 'rejected' || gate === 'suspended') {
    return (
      <div className="grid gap-8">
        <B2BAccessHeroSection
          description="Este e-mail não está autorizado a acessar o catálogo no momento."
          title="Acesso não liberado."
        />
        <B2BRejectedPanel
          seller={session.seller}
          onSignOut={() => void signOut()}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-12">
      <B2BAccessHeroSection />

      <section
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
        id="cadastro"
      >
        <div className="grid gap-6 content-start">
          <B2BLeadIntroSection />
          {!configured ? <B2BUnconfiguredPanel /> : null}
          {configured ? (
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={mode === 'register' ? 'primary' : 'secondary'}
                onClick={() => setMode('register')}
              >
                Solicitar cadastro
              </Button>
              <Button
                type="button"
                variant={mode === 'login' ? 'primary' : 'secondary'}
                onClick={() => setMode('login')}
              >
                Já tenho cadastro
              </Button>
            </div>
          ) : null}
        </div>

        {mode === 'login' && configured ? (
          <B2BLoginCard
            initialEmail={fields.email}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : (
          <B2BForm
            errors={errors}
            fields={fields}
            honeypot={honeypot}
            status={status}
            onFieldChange={handleFieldChange}
            onHoneypotChange={setHoneypot}
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </div>
  );
}
