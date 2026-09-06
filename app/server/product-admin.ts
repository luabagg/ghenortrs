// Admin edits on cached products. Every change records who made it.

import {
  insertAdminAuditEvent,
  updateProductsVisibleB2b,
  updateTierPrices,
} from './db/queries';
import type { SellerTier } from './seller-tier';

type Actor = {
  id: string;
  email?: string | null;
};

export async function setProductTierPrice(input: {
  actor: Actor;
  sku: string;
  tier: SellerTier;
  priceCents: number;
  productId: number;
}): Promise<{ updated: number }> {
  const updated = await updateTierPrices(input.tier, [
    { sku: input.sku, priceCents: input.priceCents },
  ]);
  try {
    await insertAdminAuditEvent({
      actorUserId: input.actor.id,
      actorEmail: input.actor.email ?? null,
      action: 'product.tier_price',
      targetProductId: input.productId,
      metadata: { tier: input.tier, updated },
      outcome: updated === 1 ? 'success' : 'failure',
    });
  } catch (error) {
    console.error('product tier price audit failed', error);
  }
  return { updated };
}

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
