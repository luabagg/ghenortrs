// POST /api/b2b-quote
// Approved sellers submit a quote request (no checkout). Enforces min quantities.

import { getServerEnv } from './env';
import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import { buildQuoteRequestHtml, sendResendEmail } from './resend';
import {
  createServiceClient,
  requireApprovedSeller,
  type BlingProductRow,
} from './supabase';


type QuoteItemInput = {
  productId?: number;
  quantity?: number;
};

type QuoteBody = {
  items?: QuoteItemInput[];
  notes?: string;
};

export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return methodNotAllowed(['POST', 'OPTIONS']);

  const auth = await requireApprovedSeller(req);
  if (auth instanceof Response) return auth;

  const body = await readJson<QuoteBody>(req);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return json({ error: 'items_required' }, 400);
  }

  const notes = (body.notes ?? '').trim();
  const requested = body.items
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.productId) &&
        item.productId > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );

  if (requested.length === 0) {
    return json({ error: 'items_invalid' }, 400);
  }

  try {
    const env = getServerEnv();
    const service = createServiceClient();
    const ids = requested.map((item) => item.productId);

    const { data, error } = await service
      .from('bling_products')
      .select(
        'id, sku, name, description, image_url, price_cents, stock, unit, min_quantity, active, category, search_terms, synced_at',
      )
      .in('id', ids)
      .eq('active', true);

    if (error) throw error;
    const products = (data ?? []) as BlingProductRow[];
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
      const minQuantity = product.min_quantity || env.defaultMinQuantity;
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
          message:
            'Um ou mais itens estão abaixo da quantidade mínima B2B.',
          violations,
        },
        400,
      );
    }

    const { data: saved, error: saveError } = await service
      .from('b2b_quote_requests')
      .insert({
        seller_id: auth.seller.id,
        items: lineItems,
        notes,
        status: 'submitted',
      })
      .select('id, created_at')
      .single();

    if (saveError || !saved) throw saveError;

    if (env.resendApiKey && env.resendToEmail) {
      await sendResendEmail({
        to: env.resendToEmail,
        subject: `[B2B orçamento] ${auth.seller.company_name}`,
        replyTo: auth.seller.email,
        html: buildQuoteRequestHtml({
          companyName: auth.seller.company_name,
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
      createdAt: saved.created_at,
      itemCount: lineItems.length,
      message:
        'Solicitação enviada. A equipe GHENO retorna com condições comerciais.',
    });
  } catch (error) {
    console.error('b2b-quote failed', error);
    return json({ error: 'quote_failed' }, 500);
  }
}
