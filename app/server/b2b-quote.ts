// POST /api/b2b-quote
// Approved sellers submit a quote request (no checkout). Enforces min quantities.

import { parseB2BQuoteRequest } from '../b2b/schemas';
import { insertQuoteRequest, listActiveProductsByIds } from './db/queries';
import { getServerEnv } from './env';
import { json, methodNotAllowed, readJson } from './http';
import { buildQuoteRequestHtml, sendResendEmail } from './resend';
import { resolveSellerTier } from './seller-tier';
import { requireApprovedSeller } from './supabase';

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
    const ids = requested.map((item) => item.productId);
    const products = await listActiveProductsByIds(
      ids,
      resolveSellerTier(auth.seller.volume),
    );
    const byId = new Map(products.map((product) => [product.id, product]));

    const lineItems: Array<{
      productId: number;
      name: string;
      sku: string | null;
      quantity: number;
      minQuantity: number;
      unit: string | null;
    }> = [];
    const violations: Array<{
      productId: number;
      name: string;
      quantity: number;
      minQuantity: number;
    }> = [];

    for (const item of requested) {
      const product = byId.get(item.productId);
      if (!product) {
        return json(
          { error: 'product_not_found', productId: item.productId },
          400,
        );
      }
      const minQuantity = product.minQuantity || env.defaultMinQuantity;
      if (item.quantity < minQuantity) {
        violations.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          minQuantity,
        });
        continue;
      }
      lineItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: Math.floor(item.quantity),
        minQuantity,
        unit: product.unit,
      });
    }

    if (violations.length > 0) {
      return json(
        {
          error: 'min_quantity_not_met',
          message: 'Um ou mais itens estão abaixo da quantidade mínima B2B.',
          violations,
        },
        400,
      );
    }

    const saved = await insertQuoteRequest({
      sellerId: auth.seller.id,
      items: lineItems,
      notes,
    });

    if (env.resendApiKey && env.resendToEmail) {
      await sendResendEmail({
        to: env.resendToEmail,
        subject: `[B2B orçamento] ${auth.seller.companyName}`,
        replyTo: auth.seller.email,
        html: buildQuoteRequestHtml({
          companyName: auth.seller.companyName,
          email: auth.seller.email,
          phone: auth.seller.phone,
          notes,
          items: lineItems.map((item) => ({
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            minQuantity: item.minQuantity,
          })),
        }),
      });
    }

    return json({
      success: true,
      id: saved.id,
      createdAt: saved.createdAt,
      itemCount: lineItems.length,
      message:
        'Solicitação enviada. A equipe GHENO retorna com condições comerciais.',
    });
  } catch (error) {
    console.error('b2b-quote failed', error);
    return json({ error: 'quote_failed' }, 500);
  }
}
