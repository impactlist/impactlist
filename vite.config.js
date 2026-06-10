import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Single config for Vite and Vitest (vitest reads the `test` key).
// https://vitejs.dev/config/ and https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The generated dataset (~1MB) changes only with content edits.
          // Isolating it pairs with the immutable /assets cache headers in
          // vercel.json: code deploys no longer re-download the data, and
          // content updates no longer re-download the app.
          if (id.includes('src/data/generatedData')) {
            return 'generated-data';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    css: true,
    exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**', '.worktrees/**'],
    server: {
      deps: {
        // The generator pipeline tests import the module their subprocess
        // wrote into an OS temp workspace; vite-node can't transform files
        // outside the project root, so hand these to native import().
        external: [/impactlist-generate-data-/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/test-setup.js',
        'src/data/generatedData.js',
        'e2e/**',
        '.claude/**',
        '.worktrees/**',
      ],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
  },
});
