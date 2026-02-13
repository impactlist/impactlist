import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runRedisCommand, runRedisPipeline } from './upstashRedisClient';
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

  it('sends multi-command pipeline to upstash', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ result: 'value-1' }, { result: 'value-2' }],
    });

    const result = await runRedisPipeline([
      ['GET', 'foo'],
      ['GET', 'bar'],
    ]);

    expect(result).toEqual(['value-1', 'value-2']);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.upstash.io/pipeline',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([
          ['GET', 'foo'],
          ['GET', 'bar'],
        ]),
      })
    );
  });

  it('runRedisCommand wraps single commands through pipeline helper', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ result: 'value' }],
    });

    const result = await runRedisCommand('GET', 'foo');
    expect(result).toBe('value');
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
