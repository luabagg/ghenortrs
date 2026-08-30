import { createRequire } from 'node:module';
import { fileURLToPath, URL } from 'node:url';

import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

const require = createRequire(import.meta.url);
const appPath = fileURLToPath(new URL('./app', import.meta.url));
const isVitest = Boolean(process.env.VITEST);

// Vitest only: force Remix and the test harness onto one react-router copy.
// Resolve through @remix-run/react so pnpm nested deps stay consistent.
const testRouterAliases = isVitest
  ? (() => {
      const remixReactEntry = require.resolve('@remix-run/react');
      const reactRouterDomPath = require.resolve('react-router-dom', {
        paths: [remixReactEntry],
      });
      const reactRouterPath = require.resolve('react-router', {
        paths: [reactRouterDomPath, remixReactEntry],
      });
      return {
        'react-router': reactRouterPath,
        'react-router-dom': reactRouterDomPath,
      } as Record<string, string>;
    })()
  : {};

export default defineConfig(({ mode }) => {
  // Anon URL/key are public by design. Map server SUPABASE_* into the client
  // so we do not need duplicate VITE_SUPABASE_* in .env. Never expose service_role.
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';

  return {
    plugins: [
      tailwindcss(),
      !isVitest &&
        remix({
          presets: [vercelPreset()],
          ignoredRouteFiles: ['**/*.test.*'],
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
            v3_singleFetch: true,
            v3_lazyRouteDiscovery: true,
          },
        }),
      tsconfigPaths(),
    ].filter(Boolean),
    // Keep Vitest on the unconfigured B2B path (no real .env leakage into unit tests).
    define: isVitest
      ? {}
      : {
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
          'import.meta.env.VITE_SUPABASE_ANON_KEY':
            JSON.stringify(supabaseAnonKey),
        },
    resolve: {
      alias: {
        '~': appPath,
        '@': appPath,
        ...testRouterAliases,
      },
      dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
    test: {
      environment: 'jsdom',
      exclude: ['**/node_modules/**', '**/.worktrees/**', '**/build/**'],
      globals: true,
      setupFiles: './app/test/setup.ts',
    },
  } as UserConfig;
});
