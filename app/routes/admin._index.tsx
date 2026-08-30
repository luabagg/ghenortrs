import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { Button } from '~/components/ui/button';
import { buildNoIndexMeta } from '~/lib/seo';
import { listSellers, updateSellerStatus } from '~/server/db/queries';
import type { SellerStatus } from '~/server/db/schema';
import { requireAdmin } from '~/server/require-admin.server';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Lojistas | GHENO rotors',
    'Painel interno para aprovar e suspender lojistas B2B.',
  );

const STATUSES: SellerStatus[] = [
  'approved',
  'suspended',
  'rejected',
  'pending',
];

function isSellerStatus(value: string): value is SellerStatus {
  return STATUSES.includes(value as SellerStatus);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers } = await requireAdmin(request);
  const sellers = await listSellers();
  return json(
    {
      sellers: sellers.map((seller) => ({
        id: seller.id,
        email: seller.email,
        companyName: seller.companyName,
        status: seller.status,
        createdAt: seller.createdAt,
      })),
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user, headers } = await requireAdmin(request);
  const formData = await request.formData();
  const sellerId = String(formData.get('sellerId') ?? '');
  const statusRaw = String(formData.get('status') ?? '');
  if (!sellerId || !isSellerStatus(statusRaw)) {
    return json(
      { ok: false, error: 'invalid_status' },
      { status: 400, headers },
    );
  }

  const patch =
    statusRaw === 'approved'
      ? {
          status: 'approved' as const,
          approvedAt: new Date().toISOString(),
          approvedBy: user.email ?? 'admin',
          rejectedReason: null,
        }
      : {
          status: statusRaw,
          approvedAt: null,
          approvedBy: null,
          rejectedReason: null,
        };

  const updated = await updateSellerStatus(sellerId, patch);
  if (!updated) {
    return json(
      { ok: false, error: 'update_failed' },
      { status: 404, headers },
    );
  }
  return redirect('/admin', { headers });
};

export default function AdminIndex() {
  const { sellers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AdminChrome
      current="sellers"
      description="Aprove, suspenda ou recuse cadastros. A tabela de preços (Start / Pro / Max) o lojista escolhe no catálogo."
      title="Lojistas B2B"
    >
      {actionData && 'ok' in actionData && actionData.ok === false ? (
        <p className="text-sm text-accent" role="alert">
          Não foi possível atualizar o lojista.
        </p>
      ) : null}

      {sellers.length === 0 ? (
        <p className="text-sm text-secondary">Nenhum cadastro ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-secondary">
              <tr>
                <th className="px-4 py-3 font-bold">Empresa</th>
                <th className="px-4 py-3 font-bold">E-mail</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-primary">
                    {seller.companyName}
                  </td>
                  <td className="px-4 py-3 text-secondary">{seller.email}</td>
                  <td className="px-4 py-3 text-primary">{seller.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {seller.status !== 'approved' ? (
                        <StatusButton sellerId={seller.id} status="approved">
                          Aprovar
                        </StatusButton>
                      ) : null}
                      {seller.status !== 'suspended' ? (
                        <StatusButton sellerId={seller.id} status="suspended">
                          Suspender
                        </StatusButton>
                      ) : null}
                      {seller.status !== 'rejected' ? (
                        <StatusButton sellerId={seller.id} status="rejected">
                          Recusar
                        </StatusButton>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminChrome>
  );
}

function StatusButton({
  sellerId,
  status,
  children,
}: {
  sellerId: string;
  status: SellerStatus;
  children: string;
}) {
  return (
    <Form method="post">
      <input type="hidden" name="sellerId" value={sellerId} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" variant="secondary">
        {children}
      </Button>
    </Form>
  );
}
