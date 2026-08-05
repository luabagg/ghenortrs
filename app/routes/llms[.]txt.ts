import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function loader() {
  const filePath = path.join(process.cwd(), 'public', 'llms.txt');
  const body = await readFile(filePath, 'utf8');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
