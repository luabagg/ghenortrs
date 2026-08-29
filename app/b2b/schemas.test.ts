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
  it('keeps valid items and notes', () => {
    const parsed = parseB2BQuoteRequest({
      items: [
        { productId: 1, quantity: 6 },
        { productId: 'nope', quantity: 1 },
      ],
      notes: '  mix semanal  ',
    });
    expect(parsed).toEqual({
      ok: true,
      items: [{ productId: 1, quantity: 6 }],
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
