import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

// On Vercel these functions run under NATIVE Node ESM, which requires
// fully-specified import paths. Vitest resolves extensionless imports through
// Vite, so a missing .js extension anywhere in the server import graph passes
// every in-process test and then 500s in production. Spawning real `node`
// catches that class of break.
const entrypoints = ['api/shared-assumptions/index.js', 'api/shared-assumptions/[reference].js', 'api/health.js'];

describe('api entrypoints load under native node esm', () => {
  for (const entrypoint of entrypoints) {
    it(`imports ${entrypoint}`, () => {
      const url = pathToFileURL(path.resolve(entrypoint)).href;

      let stderr = '';
      try {
        execFileSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(url)})`], {
          stdio: 'pipe',
        });
      } catch (error) {
        stderr = String(error.stderr || error.message);
      }

      expect(stderr, `native node failed to import ${entrypoint}: ${stderr}`).toBe('');
    });
  }
});
