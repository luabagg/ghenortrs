import { useB2BSession } from '@/b2b/use-b2b-session';
import { Button } from '@/components/ui/button';

/**
 * Sign-out belongs in the menu, not beside a page title. Rendered only while
 * the menu is open, so the session query does not run on every mobile page.
 */
export function MobileMenuSession({ onClose }: { onClose: () => void }) {
  const { gate, signOut } = useB2BSession();
  if (gate !== 'approved') return null;

  return (
    <Button
      className="mt-8 w-full"
      type="button"
      variant="secondary"
      onClick={() => {
        onClose();
        void signOut();
      }}
    >
      Sair
    </Button>
  );
}
