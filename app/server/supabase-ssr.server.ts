import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

import { getServerEnv } from './env';

export function createSupabaseRequestClient(request: Request) {
  const env = getServerEnv();
  const headers = new Headers();

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet, responseHeaders) {
        for (const { name, value, options } of cookiesToSet) {
          headers.append(
            'Set-Cookie',
            serializeCookieHeader(name, value, options),
          );
        }
        for (const [key, value] of Object.entries(responseHeaders)) {
          headers.set(key, value);
        }
      },
    },
  });

  return { supabase, headers };
}
