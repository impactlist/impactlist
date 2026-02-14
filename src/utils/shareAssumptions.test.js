import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ShareAssumptionsAPIError,
  fetchSharedAssumptions,
  isValidSlug,
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

  it('saveSharedAssumptions posts payload', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'abc123',
        reference: 'abc123',
        shareUrl: 'https://impactlist.xyz/assumptions?shared=abc123',
      }),
    });

    const result = await saveSharedAssumptions({
      assumptions: { globalParameters: { timeLimit: 200 } },
      name: 'Scenario',
      slug: 'scenario',
    });

    expect(result.reference).toBe('abc123');
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
