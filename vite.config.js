import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Single config for Vite and Vitest (vitest reads the `test` key).
// https://vitejs.dev/config/ and https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    css: true,
    exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**', '.worktrees/**'],
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
