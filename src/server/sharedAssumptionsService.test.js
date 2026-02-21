import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RATE_LIMIT_MAX_SAVES } from './sharedAssumptionsConfig.js';

vi.mock('./upstashRedisClient.js', () => ({
  runRedisCommand: vi.fn(),
  runRedisPipeline: vi.fn(),
}));

import {
  createSharedSnapshot,
  extractClientIp,
  getRequestOrigin,
  getSharedSnapshot,
} from './sharedAssumptionsService.js';
import { SharedAssumptionsError } from './sharedAssumptionsErrors.js';
import { runRedisCommand, runRedisPipeline } from './upstashRedisClient.js';

describe('sharedAssumptionsService', () => {
  const originalEnv = globalThis.process?.env;

  beforeEach(() => {
    vi.mocked(runRedisCommand).mockReset();
    vi.mocked(runRedisPipeline).mockReset();
    globalThis.process = {
      ...globalThis.process,
      env: {
        ...(originalEnv || {}),
        PUBLIC_SITE_ORIGIN: '',
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

  it('creates snapshot with slug and returns share metadata', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // EVAL rate limit
      .mockResolvedValueOnce('OK') // SET slug NX EX
      .mockResolvedValueOnce('OK'); // SET snapshot

    const result = await createSharedSnapshot({
      assumptions: { globalParameters: { timeLimit: 500 } },
      name: 'Scenario',
      slug: 'scenario-a',
      clientIp: '1.2.3.4',
      origin: 'https://impactlist.xyz',
    });

    expect(result.slug).toBe('scenario-a');
    expect(result.reference).toBe('scenario-a');
    expect(result.id).toHaveLength(12);
    expect(result.shareUrl).toBe('https://impactlist.xyz/assumptions?shared=scenario-a');

    expect(runRedisCommand).toHaveBeenNthCalledWith(
      2,
      'SET',
      'assumptions:slug:scenario-a',
      result.id,
      'NX',
      'EX',
      expect.any(String)
    );
  });

  it('creates snapshot without slug and uses canonical id reference', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // EVAL rate limit
      .mockResolvedValueOnce('OK'); // SET snapshot

    const result = await createSharedSnapshot({
      assumptions: { globalParameters: { timeLimit: 700 } },
      name: 'No Slug Scenario',
      clientIp: '4.3.2.1',
      origin: 'https://impactlist.xyz',
    });

    expect(result.slug).toBeNull();
    expect(result.reference).toBe(result.id);
    expect(result.shareUrl).toBe(`https://impactlist.xyz/assumptions?shared=${result.id}`);
  });

  it('rejects when rate limit is exceeded', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(RATE_LIMIT_MAX_SAVES + 1);

    await expect(
      createSharedSnapshot({
        assumptions: { globalParameters: { timeLimit: 500 } },
        clientIp: '1.2.3.4',
        origin: 'https://impactlist.xyz',
      })
    ).rejects.toMatchObject({ status: 429, code: 'rate_limited' });
  });

  it('returns 409 when slug already exists', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // EVAL rate limit
      .mockResolvedValueOnce(null); // SET slug NX EX

    await expect(
      createSharedSnapshot({
        assumptions: { globalParameters: { timeLimit: 500 } },
        slug: 'taken-slug',
        clientIp: '1.2.3.4',
        origin: 'https://impactlist.xyz',
      })
    ).rejects.toMatchObject({ status: 409, code: 'slug_taken' });
  });

  it('rolls back slug claim when snapshot write fails', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce('OK')
      .mockRejectedValueOnce(new Error('write failed'))
      .mockResolvedValueOnce(1);

    await expect(
      createSharedSnapshot({
        assumptions: { globalParameters: { timeLimit: 500 } },
        slug: 'rollback-me',
        clientIp: '1.2.3.4',
        origin: 'https://impactlist.xyz',
      })
    ).rejects.toBeTruthy();

    expect(runRedisCommand).toHaveBeenLastCalledWith('DEL', 'assumptions:slug:rollback-me');
  });

  it('resolves slug aliases before loading snapshot', async () => {
    vi.mocked(runRedisPipeline).mockResolvedValueOnce(['abc123def456', null]);
    vi.mocked(runRedisCommand).mockResolvedValueOnce(
      JSON.stringify({
        createdAt: '2026-02-13T00:00:00.000Z',
        slug: 'my-slug',
        assumptions: { globalParameters: { timeLimit: 1000 } },
      })
    );

    const snapshot = await getSharedSnapshot('my-slug');

    expect(snapshot.id).toBe('abc123def456');
    expect(snapshot.slug).toBe('my-slug');
    expect(snapshot.assumptions.globalParameters.timeLimit).toBe(1000);
  });

  it('loads direct-id snapshot without alias follow-up lookup', async () => {
    vi.mocked(runRedisPipeline).mockResolvedValueOnce([
      null,
      JSON.stringify({
        createdAt: '2026-02-13T00:00:00.000Z',
        assumptions: { globalParameters: { timeLimit: 1000 } },
      }),
    ]);

    const snapshot = await getSharedSnapshot('abc123def456');

    expect(snapshot.id).toBe('abc123def456');
    expect(vi.mocked(runRedisCommand)).not.toHaveBeenCalled();
  });

  it('throws not found when snapshot does not exist', async () => {
    vi.mocked(runRedisPipeline).mockResolvedValueOnce([null, null]);

    await expect(getSharedSnapshot('missing')).rejects.toBeInstanceOf(SharedAssumptionsError);
  });

  it('extractClientIp prefers first forwarded IP and falls back to x-real-ip', () => {
    expect(
      extractClientIp({
        headers: {
          'x-forwarded-for': '203.0.113.5, 70.41.3.18',
          'x-real-ip': '198.51.100.20',
        },
      })
    ).toBe('203.0.113.5');

    expect(
      extractClientIp({
        headers: {
          'x-real-ip': '198.51.100.20',
        },
      })
    ).toBe('198.51.100.20');
  });

  it('getRequestOrigin uses first forwarded protocol when header has multiple values', () => {
    const origin = getRequestOrigin({
      headers: {
        host: 'impactlist.xyz',
        'x-forwarded-proto': 'https, http',
      },
    });

    expect(origin).toBe('https://impactlist.xyz');
  });
});
