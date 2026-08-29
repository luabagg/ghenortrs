import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getServerEnv } from '../env';
import * as schema from './schema';

export type AppDatabase = PostgresJsDatabase<typeof schema>;

let client: ReturnType<typeof postgres> | undefined;
let db: AppDatabase | undefined;

export function getDb(): AppDatabase {
  if (db) return db;

  const { databaseUrl } = getServerEnv();
  client = postgres(databaseUrl, {
    prepare: false,
    max: 1,
  });
  db = drizzle({ client, schema });
  return db;
}
