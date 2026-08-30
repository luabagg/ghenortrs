// Catalog visibility changes. Every change records who made it.

import { insertAdminAuditEvent, updateProductsVisibleB2b } from './db/queries';

type Actor = {
  id: string;
  email?: string | null;
};

export async function setProductsVisibility(input: {
  actor: Actor;
  ids: number[];
  query: string;
  visibleB2b: boolean;
}): Promise<{ updated: number }> {
  const updated = await updateProductsVisibleB2b(input.ids, input.visibleB2b);

  try {
    await insertAdminAuditEvent({
      actorUserId: input.actor.id,
      actorEmail: input.actor.email ?? null,
      action: 'product.visibility',
      targetProductId: input.ids.length === 1 ? input.ids[0] : null,
      metadata: {
        query: input.query,
        requested: input.ids.length,
        updated,
        visibleB2b: input.visibleB2b,
      },
      outcome: updated === input.ids.length ? 'success' : 'failure',
    });
  } catch (error) {
    console.error('product visibility audit failed', error);
  }

  return { updated };
}
