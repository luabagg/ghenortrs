import { describe, expect, it } from 'vitest';

import {
  parseB2BQuoteRequest,
  parseB2BRegistration,
  validateB2BFields,
} from './schemas';

describe('validateB2BFields', () => {
  it('returns Portuguese errors for empty required fields', () => {
    expect(
      validateB2BFields({
        empresa: '  ',
        cnpj: '',
        telefone: '',
        email: '',
        mensagem: '',
      }),
    ).toEqual({
      empresa: 'Nome da empresa é obrigatório.',
      cnpj: 'CNPJ é obrigatório.',
      telefone: 'Telefone/WhatsApp é obrigatório.',
      email: 'E-mail é obrigatório.',
    });
  });

  it('returns Portuguese errors for invalid shapes', () => {
    expect(
      validateB2BFields({
        empresa: 'GHENO',
        cnpj: '123',
        telefone: '11999',
        email: 'not-an-email',
        mensagem: 'oi',
      }),
    ).toEqual({
      cnpj: 'CNPJ deve ter 14 dígitos.',
      telefone: 'Informe um número com DDD (10 ou 11 dígitos).',
      email: 'Informe um e-mail válido.',
    });
  });
});

describe('parseB2BRegistration', () => {
  it('normalizes digits, trim, and lowercase email on success', () => {
    const result = parseB2BRegistration({
      empresa: '  GHENO Rotors  ',
      cnpj: '12.345.678/0001-95',
      telefone: '(11) 98888-7777',
      email: '  Sales@Example.COM ',
      mensagem: '  Preciso de pastilhas  ',
    });

    expect(result).toEqual({
      ok: true,
      data: {
        empresa: 'GHENO Rotors',
        cnpj: '12345678000195',
        telefone: '11988887777',
        email: 'sales@example.com',
        mensagem: 'Preciso de pastilhas',
      },
    });
  });

  it('coerces missing and non-string body fields before validation', () => {
    const result = parseB2BRegistration({
      empresa: 42,
      cnpj: null,
      telefone: undefined,
      email: ['x'],
    });

    expect(result).toEqual({ ok: false, error: 'empresa_required' });
  });

  it('returns generic error codes for invalid registration input', () => {
    expect(
      parseB2BRegistration({
        empresa: 'GHENO',
        cnpj: '123',
        telefone: '11988887777',
        email: 'ok@example.com',
        mensagem: '',
      }),
    ).toEqual({ ok: false, error: 'cnpj_invalid' });

    expect(
      parseB2BRegistration({
        empresa: 'GHENO',
        cnpj: '12345678000195',
        telefone: '1199',
        email: 'ok@example.com',
        mensagem: '',
      }),
    ).toEqual({ ok: false, error: 'telefone_invalid' });

    expect(
      parseB2BRegistration({
        empresa: 'GHENO',
        cnpj: '12345678000195',
        telefone: '11988887777',
        email: 'bad',
        mensagem: '',
      }),
    ).toEqual({ ok: false, error: 'email_invalid' });
  });
});

describe('parseB2BQuoteRequest', () => {
  const requestKey = '550e8400-e29b-41d4-a716-446655440000';

  it('requires an items array', () => {
    expect(parseB2BQuoteRequest({})).toEqual({
      ok: false,
      error: 'items_required',
    });
    expect(parseB2BQuoteRequest({ items: 'nope' })).toEqual({
      ok: false,
      error: 'items_required',
    });
  });

  it('rejects invalid requestKey', () => {
    expect(
      parseB2BQuoteRequest({
        items: [{ productId: 1, quantity: 1 }],
        requestKey: 'not-a-uuid',
      }),
    ).toEqual({ ok: false, error: 'request_key_invalid' });
    expect(
      parseB2BQuoteRequest({
        items: [{ productId: 1, quantity: 1 }],
      }),
    ).toEqual({ ok: false, error: 'request_key_invalid' });
  });

  it('rejects when every item is malformed', () => {
    expect(
      parseB2BQuoteRequest({
        items: [{ productId: -1, quantity: 0 }, { foo: 'bar' }],
        requestKey,
      }),
    ).toEqual({ ok: false, error: 'items_invalid' });
  });

  it('keeps valid items, drops malformed ones, and defaults notes', () => {
    const result = parseB2BQuoteRequest({
      items: [
        { productId: '12', quantity: '2.5' },
        { productId: 0, quantity: 3 },
        { productId: 9, quantity: 1 },
      ],
      requestKey,
    });

    expect(result).toEqual({
      ok: true,
      items: [
        { productId: 12, quantity: 2.5 },
        { productId: 9, quantity: 1 },
      ],
      notes: '',
      requestKey,
    });
  });

  it('trims notes when provided', () => {
    const result = parseB2BQuoteRequest({
      items: [{ productId: 1, quantity: 1 }],
      notes: '  urgente  ',
      requestKey,
    });

    expect(result).toEqual({
      ok: true,
      items: [{ productId: 1, quantity: 1 }],
      notes: 'urgente',
      requestKey,
    });
  });
});
