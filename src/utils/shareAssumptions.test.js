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
  });

  it('slugify normalizes text for URL usage', () => {
    expect(slugify('  My Optimistic Scenario!  ')).toBe('my-optimistic-scenario');
    expect(isValidSlug('my-optimistic-scenario')).toBe(true);
    expect(isValidSlug('bad slug')).toBe(false);
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
      slug: 'scenario',
    });

    expect(result.reference).toBe('abc123');
    expect(result.shareUrl).toContain('/?shared=abc123');
    expect(fetchSpy).toHaveBeenCalledWith('/api/shared-assumptions', expect.objectContaining({ method: 'POST' }));
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
});
