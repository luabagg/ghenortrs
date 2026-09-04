import { describe, expect, it } from 'vitest';

import { parseEmailList } from './env';

describe('parseEmailList', () => {
  it('reads a single address', () => {
    expect(parseEmailList('contato@ghenortrs.com.br')).toEqual([
      'contato@ghenortrs.com.br',
    ]);
  });

  it('reads several, trimming the spacing around each', () => {
    expect(
      parseEmailList('admin@ghenortrs.com.br, contato@ghenortrs.com.br'),
    ).toEqual(['admin@ghenortrs.com.br', 'contato@ghenortrs.com.br']);
  });

  it('drops empty entries and an unset value', () => {
    expect(parseEmailList('a@x.test,,  ,b@x.test')).toEqual([
      'a@x.test',
      'b@x.test',
    ]);
    expect(parseEmailList(undefined)).toEqual([]);
    expect(parseEmailList('  ')).toEqual([]);
  });
});
