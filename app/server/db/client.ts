import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getServerEnv } from '../env';
import * as schema from './schema';

export type AppDb = ReturnType<typeof createDrizzle>;

type PostgresClient = ReturnType<typeof postgres>;

let cached:
  | {
      client: PostgresClient;
      db: AppDb;
    }
  | undefined;

function createDrizzle(client: PostgresClient) {
  return drizzle({ client, schema });
}

export function createDb(): AppDb {
  if (cached) return cached.db;

  const { databaseUrl } = getServerEnv();
  // Supabase transaction pooler does not support prepared statements.
  const client = postgres(databaseUrl, { prepare: false });
  const db = createDrizzle(client);
  cached = { client, db };
  return db;
}

export async function closeDb(): Promise<void> {
  if (!cached) return;
  const { client } = cached;
  cached = undefined;
  await client.end({ timeout: 5 });
}
