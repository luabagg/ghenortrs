import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

import { generateRoutePages } from './build/route-pages';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'generate-route-pages',
      apply: 'build',
      async closeBundle() {
        await generateRoutePages();
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/.worktrees/**'],
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
