import { defineConfig } from 'drizzle-kit';

// Schema file is a typed mirror of `supabase/migrations/`.
// Do not `drizzle-kit generate` or `push` — that would fork the migration history.

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/server/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
