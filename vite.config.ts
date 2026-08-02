import { createRequire } from 'node:module';
import { fileURLToPath, URL } from 'node:url';

import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

const require = createRequire(import.meta.url);
const appPath = fileURLToPath(new URL('./app', import.meta.url));
const isVitest = Boolean(process.env.VITEST);

// Only for unit tests: force a single react-router instance so Remix Link
// hooks share context with createMemoryRouter from react-router-dom.
const testRouterAliases = isVitest
  ? (() => {
      const reactRouterDomPath = require.resolve('react-router-dom');
      const reactRouterPath = require.resolve('react-router', {
        paths: [reactRouterDomPath],
      });
      return {
        'react-router': reactRouterPath,
        'react-router-dom': reactRouterDomPath,
      } as Record<string, string>;
    })()
  : {};

export default defineConfig({
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
} as UserConfig);
