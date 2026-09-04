// POST /api/b2b-quote
// Approved sellers submit a quote request. The server derives pricing from the order.

import {
  calculateOrderPricing,
  type B2BTierPrices,
  unitPriceForTier,
} from '../b2b/order-pricing';
import { parseB2BQuoteRequest } from '../b2b/schemas';
import { insertQuoteRequest, listActiveProductsByIds } from './db/queries';
import { getServerEnv } from './env';
import { deliverEmail } from './email-delivery';
import { json, methodNotAllowed, readJson } from './http';
import { buildQuoteRequestHtml, buildSellerQuoteReceiptHtml } from './resend';
import { requireApprovedSeller } from './supabase';

function productPrices(product: {
  priceStartCents: number | null;
  priceProCents: number | null;
  priceMaxCents: number | null;
}): B2BTierPrices | null {
  if (
    product.priceStartCents === null ||
    product.priceProCents === null ||
    product.priceMaxCents === null
  ) {
    return null;
  }
  return {
    startCents: product.priceStartCents,
    proCents: product.priceProCents,
    maxCents: product.priceMaxCents,
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST']);

  const auth = await requireApprovedSeller(req);
  if (auth instanceof Response) return auth;

  const body = await readJson<unknown>(req);
  const parsed = parseB2BQuoteRequest(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const { items: requested, notes } = parsed;

  try {
    const env = getServerEnv();
    const quantitiesById = new Map<number, number>();
    for (const item of requested) {
      quantitiesById.set(
        item.productId,
        (quantitiesById.get(item.productId) ?? 0) + item.quantity,
      );
    }

    const ids = [...quantitiesById.keys()];
    const products = await listActiveProductsByIds(ids);
    const byId = new Map(products.map((product) => [product.id, product]));
    const pricedItems: Array<{
      product: (typeof products)[number];
      quantity: number;
      prices: B2BTierPrices;
    }> = [];

    for (const [productId, quantity] of quantitiesById) {
      const product = byId.get(productId);
      const prices = product ? productPrices(product) : null;
      if (!product || !prices) {
        return json({ error: 'product_not_found', productId }, 400);
      }
      pricedItems.push({ product, quantity, prices });
    }

    const pricing = calculateOrderPricing(pricedItems);
    if (pricing.totalQuantity < env.minimumOrderQuantity) {
      return json(
        {
          error: 'minimum_order_quantity_not_met',
          message: `Selecione pelo menos ${env.minimumOrderQuantity} unidades no total.`,
          minimumOrderQuantity: env.minimumOrderQuantity,
          totalQuantity: pricing.totalQuantity,
        },
        400,
      );
    }

    const lineItems = pricedItems.map(({ product, quantity, prices }) => {
      const unitPriceCents = unitPriceForTier(prices, pricing.tier);
      return {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity,
        unit: product.unit,
        unitPriceCents,
        lineTotalCents: unitPriceCents * quantity,
      };
    });

    const quoteSummary = {
      tier: pricing.tier,
      totalQuantity: pricing.totalQuantity,
      qualifyingSubtotalCents: pricing.startSubtotalCents,
      totalCents: pricing.totalCents,
      lines: lineItems,
    };
    const saved = await insertQuoteRequest({
      sellerId: auth.seller.id,
      items: quoteSummary,
      notes,
    });

    // The quote is already saved, so a mail problem must not fail the request.
    // Both outcomes are reported so a missing email is never silent.
    const [teamEmail, sellerEmail] = await Promise.all([
      deliverEmail({
        label: 'b2b-quote team alert',
        to: env.resendToEmails,
        subject: `[B2B orçamento] ${auth.seller.companyName}`,
        replyTo: auth.seller.email,
        html: buildQuoteRequestHtml({
          companyName: auth.seller.companyName,
          email: auth.seller.email,
          phone: auth.seller.phone,
          tier: pricing.tier,
          totalQuantity: pricing.totalQuantity,
          qualifyingSubtotalCents: pricing.startSubtotalCents,
          totalCents: pricing.totalCents,
          notes,
          items: lineItems,
        }),
      }),
      deliverEmail({
        label: 'b2b-quote seller receipt',
        to: auth.seller.email,
        subject: 'Recebemos sua solicitação de orçamento',
        replyTo: env.resendToEmails[0],
        html: buildSellerQuoteReceiptHtml({
          companyName: auth.seller.companyName,
          tier: pricing.tier,
          totalQuantity: pricing.totalQuantity,
          totalCents: pricing.totalCents,
          notes,
          items: lineItems,
        }),
      }),
    ]);

    return json({
      success: true,
      id: saved.id,
      createdAt: saved.createdAt,
      itemCount: lineItems.length,
      tier: pricing.tier,
      totalQuantity: pricing.totalQuantity,
      qualifyingSubtotalCents: pricing.startSubtotalCents,
      totalCents: pricing.totalCents,
      teamEmail,
      sellerEmail,
      message: 'Iremos retornar com as condições assim que possível.',
    });
  } catch (error) {
    console.error('b2b-quote failed', error);
    return json({ error: 'quote_failed' }, 500);
  }
}
