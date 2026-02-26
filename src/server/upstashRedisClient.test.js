import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runRedisCommand, runRedisPipeline } from './upstashRedisClient.js';
import { SharedAssumptionsError } from './sharedAssumptionsErrors.js';

describe('upstashRedisClient', () => {
  const originalEnv = globalThis.process?.env;

  beforeEach(() => {
    globalThis.process = {
      ...globalThis.process,
      env: {
        ...(originalEnv || {}),
        SHARED_ASSUMPTIONS_REDIS_REST_URL: 'https://example.upstash.io',
        SHARED_ASSUMPTIONS_REDIS_REST_TOKEN: 'token',
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

  it('throws when redis pipeline response count does not match command count', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ result: 'only-one-result' }],
    });

    await expect(
      runRedisPipeline([
        ['GET', 'foo'],
        ['GET', 'bar'],
      ])
    ).rejects.toMatchObject({ code: 'redis_invalid_response' });
  });

  it('maps upstream 429 responses to retryable service errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      clone: () => ({
        json: async () => ({ error: 'daily request limit exceeded' }),
        text: async () => 'daily request limit exceeded',
      }),
    });

    await expect(runRedisCommand('GET', 'foo')).rejects.toMatchObject({
      status: 503,
      code: 'redis_quota_or_rate_limited',
    });
  });

  it('maps quota-related command errors to retryable service errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ error: 'max request limit exceeded' }],
    });

    await expect(runRedisCommand('GET', 'foo')).rejects.toMatchObject({
      status: 503,
      code: 'redis_quota_or_rate_limited',
    });
  });

  it('throws when redis config is missing', async () => {
    globalThis.process = {
      ...globalThis.process,
      env: {},
    };

    await expect(runRedisCommand('GET', 'foo')).rejects.toBeInstanceOf(SharedAssumptionsError);
  });
});
