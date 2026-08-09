#!/usr/bin/env node
/**
 * Offline/CI sync: Bling products into Supabase cache.
 * Needs: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * and Bling tokens in Supabase or a one-shot access token.
 *
 * Prefer production path: POST /api/bling-sync with admin secret
 * (OAuth refresh runs in the edge runtime).
 *
 * When B2B_SYNC_URL is set, this script calls the deployed endpoint:
 *   B2B_SYNC_URL=https://…/api/bling-sync B2B_ADMIN_APPROVE_SECRET=… pnpm catalog:sync
 */

const syncUrl = process.env.B2B_SYNC_URL;
const secret = process.env.B2B_ADMIN_APPROVE_SECRET;

async function main() {
  if (!syncUrl || !secret) {
    console.error(`
bling-catalog-sync

Set:
  B2B_SYNC_URL=https://ghenortrs.vercel.app/api/bling-sync
  B2B_ADMIN_APPROVE_SECRET=…

Or call the endpoint directly after connecting Bling OAuth once via
  POST /api/bling-oauth-start with X-Admin-Secret, then open authorizeUrl.
`);
    process.exitCode = 1;
    return;
  }

  const res = await fetch(syncUrl, {
    method: 'POST',
    headers: {
      'X-Admin-Secret': secret,
      Accept: 'application/json',
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Sync failed', res.status, body);
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify(body, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
