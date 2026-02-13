import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runRedisCommand } from './upstashRedisClient';
import { SharedAssumptionsError } from './sharedAssumptionsErrors';

describe('upstashRedisClient', () => {
  const originalEnv = globalThis.process?.env;

  beforeEach(() => {
    globalThis.process = {
      ...globalThis.process,
      env: {
        ...(originalEnv || {}),
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.process = {
      ...globalThis.process,
      env: originalEnv || {},
    };
  });

  it('sends command to upstash pipeline endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ result: 'value' }],
    });

    const result = await runRedisCommand('GET', 'foo');

    expect(result).toBe('value');
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.upstash.io/pipeline',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('throws when redis returns command error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ error: 'ERR something' }],
    });

    await expect(runRedisCommand('GET', 'foo')).rejects.toBeInstanceOf(SharedAssumptionsError);
  });

  it('throws when redis config is missing', async () => {
    globalThis.process = {
      ...globalThis.process,
      env: {},
    };

    await expect(runRedisCommand('GET', 'foo')).rejects.toBeInstanceOf(SharedAssumptionsError);
  });
});
