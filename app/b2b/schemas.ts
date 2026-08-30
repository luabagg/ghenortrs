// Shared Zod schemas for the B2B lead form and quote requests. Used by the
// Remix `b2b` route action/client validation and by the server handlers
// (b2b-register, b2b-quote) so validation rules stay in one place.

import { z } from 'zod';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type B2BFieldMessages = {
  empresaRequired: string;
  cnpjRequired: string;
  cnpjLength: string;
  telefoneRequired: string;
  telefoneRange: string;
  emailRequired: string;
  emailInvalid: string;
};

function buildB2BFieldsSchema(messages: B2BFieldMessages) {
  return z.object({
    empresa: z.string().trim().min(1, messages.empresaRequired),
    cnpj: z
      .string()
      .transform(digitsOnly)
      .pipe(
        z
          .string()
          .min(1, messages.cnpjRequired)
          .length(14, messages.cnpjLength),
      ),
    telefone: z
      .string()
      .transform(digitsOnly)
      .pipe(
        z
          .string()
          .min(1, messages.telefoneRequired)
          .min(10, messages.telefoneRange)
          .max(11, messages.telefoneRange),
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, messages.emailRequired)
      .regex(EMAIL_PATTERN, messages.emailInvalid),
    mensagem: z.string().trim(),
  });
}

// Portuguese, per-field messages for the lead form UI.
export const b2bRegistrationSchema = buildB2BFieldsSchema({
  empresaRequired: 'Nome da empresa é obrigatório.',
  cnpjRequired: 'CNPJ é obrigatório.',
  cnpjLength: 'CNPJ deve ter 14 dígitos.',
  telefoneRequired: 'Telefone/WhatsApp é obrigatório.',
  telefoneRange: 'Informe um número com DDD (10 ou 11 dígitos).',
  emailRequired: 'E-mail é obrigatório.',
  emailInvalid: 'Informe um e-mail válido.',
});

export type B2BRegistrationFields = z.input<typeof b2bRegistrationSchema>;
export type B2BRegistrationData = z.output<typeof b2bRegistrationSchema>;

/**
 * Validates raw form fields and returns Portuguese, per-field error messages
 * suitable for rendering next to each input.
 */
export function validateB2BFields(
  fields: B2BRegistrationFields,
): Partial<Record<keyof B2BRegistrationFields, string>> {
  const result = b2bRegistrationSchema.safeParse(fields);
  if (result.success) return {};

  const errors: Partial<Record<keyof B2BRegistrationFields, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof B2BRegistrationFields | undefined;
    if (field && !(field in errors)) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

// Generic error codes (matching the previous hand-rolled `validate()`) for
// the /api/b2b-register handler.
const registerFieldsSchema = buildB2BFieldsSchema({
  empresaRequired: 'empresa_required',
  cnpjRequired: 'cnpj_invalid',
  cnpjLength: 'cnpj_invalid',
  telefoneRequired: 'telefone_invalid',
  telefoneRange: 'telefone_invalid',
  emailRequired: 'email_invalid',
  emailInvalid: 'email_invalid',
});

function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

/** Accepts an untrusted request body and normalizes missing/non-string fields to `''`. */
export const b2bRegisterRequestSchema = z.preprocess((raw) => {
  const record = (raw ?? {}) as Record<string, unknown>;
  return {
    empresa: stringField(record, 'empresa'),
    cnpj: stringField(record, 'cnpj'),
    telefone: stringField(record, 'telefone'),
    email: stringField(record, 'email'),
    mensagem: stringField(record, 'mensagem'),
  };
}, registerFieldsSchema);

export type B2BRegisterRequestData = z.output<typeof b2bRegisterRequestSchema>;

/**
 * Validates raw registration input for server handlers, returning normalized
 * data (digits-only cnpj/telefone, trimmed + lowercased email) on success or
 * a generic error code (matching the previous hand-rolled `validate()`) on
 * failure.
 */
export function parseB2BRegistration(
  input: unknown,
): { ok: true; data: B2BRegisterRequestData } | { ok: false; error: string } {
  const result = b2bRegisterRequestSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    error: result.error.issues[0]?.message ?? 'invalid_input',
  };
}

export const b2bQuoteItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().positive(),
});

export type B2BQuoteItem = z.output<typeof b2bQuoteItemSchema>;

// Malformed individual items are dropped (matching the previous hand-rolled
// filtering) rather than failing the whole request; callers should treat a
// resulting empty `items` array as `items_invalid`.
export const b2bQuoteRequestSchema = z.object({
  tier: z.enum(['start', 'pro', 'max']),
  items: z.array(z.unknown()).transform((items) =>
    items
      .map((item) => b2bQuoteItemSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data),
  ),
  notes: z.string().trim().default(''),
});

export type B2BQuoteRequestData = z.output<typeof b2bQuoteRequestSchema>;

/**
 * Validates a quote request body. The request is only rejected if the item
 * list is missing/not an array (`items_required`) or every item turns out to
 * be malformed (`items_invalid`).
 */
export function parseB2BQuoteRequest(input: unknown):
  | {
      ok: true;
      items: B2BQuoteItem[];
      notes: string;
      tier: 'start' | 'pro' | 'max';
    }
  | { ok: false; error: 'items_required' | 'items_invalid' | 'tier_invalid' } {
  const parsed = b2bQuoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    const tierIssue = parsed.error.issues.some(
      (issue) => issue.path[0] === 'tier',
    );
    const itemsIssue = parsed.error.issues.some(
      (issue) => issue.path[0] === 'items',
    );
    if (tierIssue && !itemsIssue) return { ok: false, error: 'tier_invalid' };
    return { ok: false, error: 'items_required' };
  }
  if (parsed.data.items.length === 0)
    return { ok: false, error: 'items_invalid' };
  return {
    ok: true,
    items: parsed.data.items,
    notes: parsed.data.notes,
    tier: parsed.data.tier,
  };
}
