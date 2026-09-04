import { describe, expect, it } from 'vitest';

import { parseB2BQuoteRequest, validateB2BFields } from './schemas';

describe('validateB2BFields', () => {
  it('returns Portuguese errors for an empty form', () => {
    const errors = validateB2BFields({
      empresa: '',
      cnpj: '',
      telefone: '',
      email: '',
      mensagem: '',
    });
    expect(errors.empresa).toMatch(/obrigat/i);
    expect(errors.cnpj).toBeTruthy();
    expect(errors.email).toBeTruthy();
  });
});

describe('parseB2BQuoteRequest', () => {
  it('keeps positive integer quantities and ignores a client-supplied tier', () => {
    const parsed = parseB2BQuoteRequest({
      tier: 'max',
      items: [
        { productId: 1, quantity: 4 },
        { productId: 2, quantity: 2 },
        { productId: 3, quantity: 1.5 },
        { productId: 'nope', quantity: 1 },
      ],
      notes: '  mix semanal  ',
    });
    expect(parsed).toEqual({
      ok: true,
      items: [
        { productId: 1, quantity: 4 },
        { productId: 2, quantity: 2 },
      ],
      notes: 'mix semanal',
    });
  });

  it('rejects a missing item list', () => {
    expect(parseB2BQuoteRequest({})).toEqual({
      ok: false,
      error: 'items_required',
    });
  });
});
