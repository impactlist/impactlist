import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ShareAssumptionsAPIError,
  fetchSharedAssumptions,
  isValidSlug,
  normalizeSlugInput,
  saveSharedAssumptions,
  slugify,
} from './shareAssumptions';

describe('shareAssumptions utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('slugify normalizes text for URL usage', () => {
    expect(slugify('  My Optimistic Scenario!  ')).toBe('my-optimistic-scenario');
    expect(isValidSlug('my-optimistic-scenario')).toBe(true);
    expect(isValidSlug('bad slug')).toBe(false);
    expect(isValidSlug('abc123def456')).toBe(false);
    expect(isValidSlug('abc123-def456')).toBe(true);
  });

  it('normalizeSlugInput converts non-alphanumeric input to dashes', () => {
    expect(normalizeSlugInput("Bob's Cool Model 2026")).toBe('bob-s-cool-model-2026');
    expect(normalizeSlugInput('Bob’s Cool Model 2026')).toBe('bob-s-cool-model-2026');
    expect(normalizeSlugInput('___A__B___C___')).toBe('-a-b-c-');
    expect(normalizeSlugInput('!@#$%^&*()')).toBe('-');
    expect(normalizeSlugInput('alpha-beta')).toBe('alpha-beta');
    expect(normalizeSlugInput('alpha beta')).toBe('alpha-beta');
  });

  it('slugify(normalizeSlugInput(x)) is empty or a valid slug for noisy input', () => {
    const cases = [
      '___A__B___C___',
      '  hello world  ',
      "Bob's Optimistic Model!!!",
      'Bob’s Optimistic Model!!!',
      '--alpha---beta--',
      '!@#$%^&*()',
      '123',
      'Mixed CASE + punctuation / slash',
      'a'.repeat(100),
    ];

    cases.forEach((value) => {
      const canonical = slugify(normalizeSlugInput(value));
      expect(canonical.length).toBeLessThanOrEqual(40);
      if (canonical !== '') {
        expect(isValidSlug(canonical)).toBe(true);
      }
    });
  });

  it('saveSharedAssumptions posts payload', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'abc123',
        reference: 'abc123',
      }),
    });

    const result = await saveSharedAssumptions({
      assumptions: { globalParameters: { timeLimit: 200 } },
      name: 'Scenario',
      description: 'Scenario notes',
      slug: 'scenario',
    });

    expect(result.reference).toBe('abc123');
    expect(result.shareUrl).toContain('/?shared=abc123');
    expect(fetchSpy).toHaveBeenCalledWith('/api/shared-assumptions', expect.objectContaining({ method: 'POST' }));
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toMatchObject({
      description: 'Scenario notes',
    });
  });

  it('fetchSharedAssumptions throws typed API errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'not_found', message: 'Missing' }),
    });

    await expect(fetchSharedAssumptions('missing')).rejects.toBeInstanceOf(ShareAssumptionsAPIError);
  });

  it('throws invalid_response when server returns malformed JSON payload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Malformed JSON');
      },
    });

    await expect(fetchSharedAssumptions('bad-payload')).rejects.toMatchObject({
      code: 'invalid_response',
    });
  });

  it('throws invalid_response when snapshot payload has no assumptions object', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'abc123' }),
    });

    await expect(fetchSharedAssumptions('bad-shape')).rejects.toMatchObject({
      code: 'invalid_response',
    });
  });

  it('aborts a hung request and returns a useful timeout error', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, { signal }) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      });
    });

    const pendingRequest = fetchSharedAssumptions('hung-request');
    const rejection = expect(pendingRequest).rejects.toMatchObject({
      status: 408,
      code: 'request_timeout',
      message: 'The request timed out. Check your connection and try again.',
    });

    await vi.advanceTimersByTimeAsync(15_000);
    await rejection;
  });

  it('preserves a caller cancellation as AbortError instead of reporting a timeout', async () => {
    const callerController = new globalThis.AbortController();
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, { signal }) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            const error = new Error('canceled');
            error.name = 'AbortError';
            reject(error);
          },
          { once: true }
        );
      });
    });

    const pendingRequest = fetchSharedAssumptions('canceled-request', { signal: callerController.signal });
    callerController.abort();

    await expect(pendingRequest).rejects.toMatchObject({ name: 'AbortError' });
  });
});
