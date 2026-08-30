// Admin edits on cached products. Every change records who made it.

import { MIN_QUANTITY_LIMIT } from '../lib/product-rules';
import {
  insertAdminAuditEvent,
  updateProductMinQuantity,
  updateProductsVisibleB2b,
} from './db/queries';

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

export type MinQuantityResult =
  | { ok: true }
  | { ok: false; error: 'invalid_min_quantity' | 'product_not_found' };

export async function setProductMinQuantity(input: {
  actor: Actor;
  productId: number;
  minQuantity: number;
}): Promise<MinQuantityResult> {
  const { minQuantity } = input;
  if (
    !Number.isInteger(minQuantity) ||
    minQuantity < 1 ||
    minQuantity > MIN_QUANTITY_LIMIT
  ) {
    return { ok: false, error: 'invalid_min_quantity' };
  }

  const updated = await updateProductMinQuantity(input.productId, minQuantity);
  if (!updated) return { ok: false, error: 'product_not_found' };

  try {
    await insertAdminAuditEvent({
      actorUserId: input.actor.id,
      actorEmail: input.actor.email ?? null,
      action: 'product.min_quantity',
      targetProductId: input.productId,
      metadata: { minQuantity },
    });
  } catch (error) {
    console.error('product min quantity audit failed', error);
  }

  return { ok: true };
}
