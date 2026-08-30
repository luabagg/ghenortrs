import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { buildNoIndexMeta } from '~/lib/seo';
import { listAdminAuditEvents } from '~/server/db/queries';
import type { Json } from '~/server/json';
import { requireAdmin } from '~/server/require-admin.server';

export const ADMIN_ACTIVITY_LIMIT = 100;

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Atividade | GHENO rotors',
    'Histórico interno das ações administrativas.',
  );

/** Only these metadata fields reach the screen. Everything else is dropped. */
const METADATA_FIELDS = [
  'destinationPath',
  'query',
  'reason',
  'requested',
  'result',
  'status',
  'targetEmail',
  'tier',
  'updated',
  'upserted',
  'visibleB2b',
] as const;

export function formatAuditMetadata(metadata: Json): string {
  if (typeof metadata !== 'object' || metadata === null) return '';
  if (Array.isArray(metadata)) return '';

  return METADATA_FIELDS.filter((field) => field in metadata)
    .map((field) => `${field}: ${String(metadata[field])}`)
    .join(' · ');
}

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers } = await requireAdmin(request);
  const events = await listAdminAuditEvents(ADMIN_ACTIVITY_LIMIT);

  return json(
    {
      events: events.map((event) => ({
        id: event.id,
        at: DATE_TIME_FORMAT.format(new Date(event.createdAt)),
        actor: event.actorEmail ?? 'sistema',
        action: event.action,
        outcome: event.outcome,
        details: formatAuditMetadata(event.metadata),
      })),
    },
    { headers },
  );
};

export default function AdminActivity() {
  const { events } = useLoaderData<typeof loader>();

  return (
    <AdminChrome
      current="activity"
      description="Últimas ações no painel, das mais recentes para as mais antigas. Tokens, links e conteúdo colado não aparecem aqui."
      title="Atividade"
    >
      {events.length === 0 ? (
        <p className="text-sm text-secondary">Nenhuma ação registrada ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-secondary">
              <tr>
                <th className="px-4 py-3 font-bold">Quando</th>
                <th className="px-4 py-3 font-bold">Quem</th>
                <th className="px-4 py-3 font-bold">Ação</th>
                <th className="px-4 py-3 font-bold">Resultado</th>
                <th className="px-4 py-3 font-bold">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-secondary">{event.at}</td>
                  <td className="px-4 py-3 text-secondary">{event.actor}</td>
                  <td className="px-4 py-3 text-primary">{event.action}</td>
                  <td className="px-4 py-3 text-secondary">{event.outcome}</td>
                  <td className="px-4 py-3 text-secondary">
                    {event.details || '—'}
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
