// @vitest-environment node

import { resolve } from 'node:path';

import { UNSAFE_flatRoutes } from '@remix-run/dev';
import { describe, expect, it } from 'vitest';

describe('B2B route manifest', () => {
  it('renders the catalog outside the /b2b page layout', () => {
    const routes = UNSAFE_flatRoutes(resolve(process.cwd(), 'app'), [
      '**/*.test.*',
    ]);

    expect(routes['routes/b2b_.catalogo']).toMatchObject({
      parentId: 'root',
      path: 'b2b/catalogo',
    });
    expect(routes['routes/b2b.catalogo']).toBeUndefined();
  });
});
