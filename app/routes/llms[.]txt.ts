import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader(_args: LoaderFunctionArgs) {
  const filePath = path.join(process.cwd(), 'public', 'llms.txt');
  const body = await readFile(filePath, 'utf8');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
