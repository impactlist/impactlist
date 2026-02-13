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
      json: async () => ({ reference: 'abc123' }),
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
});
