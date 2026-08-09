// Shared Zod schemas for B2B lead form and quote requests.
// Used by Remix `b2b` route and server handlers so rules stay in one place.

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
        z.string().min(1, messages.cnpjRequired).length(14, messages.cnpjLength),
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

// Portuguese per-field messages for the lead form UI.
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

/** Validate raw form fields. Return Portuguese per-field errors. */
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

// Generic error codes for /api/b2b-register (match prior `validate()`).
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

/** Normalize untrusted body fields. Missing or non-string becomes `''`. */
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
 * Validate registration input for server handlers.
 * Success: normalized data. Failure: generic error code.
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

// Drop malformed items. Empty `items` means `items_invalid` for callers.
// `requestKey` is required for idempotent persistence (unique per seller).
export const b2bQuoteRequestSchema = z.object({
  items: z.array(z.unknown()).transform((items) =>
    items
      .map((item) => b2bQuoteItemSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data),
  ),
  notes: z.string().trim().default(''),
  requestKey: z.uuid(),
});

export type B2BQuoteRequestData = z.output<typeof b2bQuoteRequestSchema>;

/**
 * Validate a quote request body.
 * Fail if requestKey is missing/invalid, items are missing, or every item is malformed.
 */
export function parseB2BQuoteRequest(input: unknown):
  | { ok: true; items: B2BQuoteItem[]; notes: string; requestKey: string }
  | {
      ok: false;
      error: 'items_required' | 'items_invalid' | 'request_key_invalid';
    } {
  if (
    input == null ||
    typeof input !== 'object' ||
    !('items' in input) ||
    !Array.isArray((input as { items: unknown }).items)
  ) {
    return { ok: false, error: 'items_required' };
  }

  const parsed = b2bQuoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    const requestKeyIssue = parsed.error.issues.some((issue) =>
      issue.path.includes('requestKey'),
    );
    if (requestKeyIssue) return { ok: false, error: 'request_key_invalid' };
    return { ok: false, error: 'items_required' };
  }
  if (parsed.data.items.length === 0) {
    return { ok: false, error: 'items_invalid' };
  }
  return {
    ok: true,
    items: parsed.data.items,
    notes: parsed.data.notes,
    requestKey: parsed.data.requestKey,
  };
}
