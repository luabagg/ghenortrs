import { afterEach, describe, expect, it } from 'vitest';

import { getServerEnv } from './env';

const REQUIRED = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon',
  SUPABASE_SERVICE_ROLE_KEY: 'service',
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/postgres',
} as const;

const KEYS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
] as const;

const previous: Record<string, string | undefined> = {};

afterEach(() => {
  for (const key of KEYS) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
    delete previous[key];
  }
});

function setEnv(values: Record<string, string | undefined>) {
  for (const key of KEYS) {
    if (!(key in previous)) previous[key] = process.env[key];
  }
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

describe('getServerEnv', () => {
  it('requires DATABASE_URL', () => {
    setEnv({ ...REQUIRED, DATABASE_URL: undefined });
    expect(() => getServerEnv()).toThrow(/DATABASE_URL/);
  });

  it('exposes the pooler connection string', () => {
    setEnv(REQUIRED);
    expect(getServerEnv().databaseUrl).toBe(REQUIRED.DATABASE_URL);
  });
});
