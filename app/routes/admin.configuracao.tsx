import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { buildNoIndexMeta } from '~/lib/seo';
import type { AdminRoleError } from '~/server/admin-users';
import { addAdmin, removeAdmin } from '~/server/admin-users';
import { listAdminUsers } from '~/server/db/queries';
import { requireAdmin } from '~/server/require-admin.server';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Configuração | GHENO rotors',
    'Painel interno para gerenciar administradores.',
  );

const ROLE_MESSAGES: Record<AdminRoleError, string> = {
  invalid_email: 'Informe um e-mail válido.',
  user_not_found:
    'Esse e-mail ainda não entrou pelo /admin. Peça um acesso primeiro.',
  already_admin: 'Esse e-mail já é administrador.',
  last_admin: 'O último administrador não pode ser removido.',
  not_admin: 'Esse usuário não é administrador.',
};

function roleMessage(error: string): string {
  return ROLE_MESSAGES[error as AdminRoleError] ?? 'Não foi possível concluir.';
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, user } = await requireAdmin(request);
  const admins = await listAdminUsers();

  return json(
    {
      currentUserId: user.id,
      admins: admins.map((admin) => ({
        userId: admin.userId,
        email: admin.email,
        createdAt: admin.createdAt,
      })),
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { headers, user } = await requireAdmin(request);
  const formData = await request.formData();
  const actor = { id: user.id, email: user.email };
  const intent = String(formData.get('intent') ?? '');

  const result =
    intent === 'add-admin'
      ? await addAdmin({ actor, email: String(formData.get('email') ?? '') })
      : intent === 'remove-admin'
        ? await removeAdmin({
            actor,
            userId: String(formData.get('userId') ?? ''),
          })
        : ({ ok: false, error: 'invalid_intent' } as const);

  return json(result, { headers, status: result.ok ? 200 : 400 });
};

export default function AdminSettings() {
  const { admins, currentUserId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AdminChrome
      current="settings"
      description="Quem entra no /admin. O acesso usa o mesmo login por e-mail do Supabase."
      title="Configuração"
    >
      {actionData?.ok === false ? (
        <p className="text-sm text-accent" role="alert">
          {roleMessage(actionData.error)}
        </p>
      ) : null}
      {actionData?.ok === true ? (
        <p className="text-sm text-primary" role="status">
          Lista de administradores atualizada.
        </p>
      ) : null}

      <Form
        className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
        method="post"
      >
        <input name="intent" type="hidden" value="add-admin" />
        <div className="grid gap-2">
          <Label htmlFor="admin-email">Novo administrador</Label>
          <Input
            id="admin-email"
            name="email"
            placeholder="pessoa@ghenortrs.com.br"
            type="email"
          />
        </div>
        <Button type="submit" variant="secondary">
          Adicionar
        </Button>
      </Form>

      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-border text-secondary">
            <tr>
              <th className="px-4 py-3 font-bold">E-mail</th>
              <th className="px-4 py-3 font-bold">Desde</th>
              <th className="px-4 py-3 font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.userId}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-primary">{admin.email}</td>
                <td className="px-4 py-3 text-secondary">
                  {admin.createdAt.slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  {admin.userId === currentUserId ? (
                    <span className="text-sm text-secondary">Você</span>
                  ) : (
                    <Form method="post">
                      <input name="intent" type="hidden" value="remove-admin" />
                      <input name="userId" type="hidden" value={admin.userId} />
                      <Button type="submit" variant="secondary">
                        Remover
                      </Button>
                    </Form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminChrome>
  );
}
