import { useB2BSession } from '@/b2b/use-b2b-session';
import { Button } from '@/components/ui/button';

/**
 * Sign-out belongs in the menu, not beside a page title. Rendered only while
 * the menu is open, so the session query does not run on every mobile page.
 */
export function MobileMenuSession({ onClose }: { onClose: () => void }) {
  const { gate, session, signOut } = useB2BSession();
  if (gate !== 'approved') return null;

  return (
    <>
      <p className="mb-3 mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary">
        Conta B2B
      </p>
      <div className="grid gap-3 rounded-xl border border-border-strong bg-background/18 px-4 py-4">
        <p className="text-base font-bold leading-tight text-primary">
          {session.seller?.companyName ?? 'Sua empresa'}
        </p>
        <Button
          className="justify-self-start"
          type="button"
          variant="secondary"
          onClick={() => {
            onClose();
            void signOut();
          }}
        >
          Sair
        </Button>
      </div>
    </>
  );
}
