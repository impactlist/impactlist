import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./upstashRedisClient', () => ({
  runRedisCommand: vi.fn(),
}));

import { SharedAssumptionsError } from './sharedAssumptionsErrors';
import { createSharedSnapshot, getSharedSnapshot } from './sharedAssumptionsService';
import { runRedisCommand } from './upstashRedisClient';

describe('sharedAssumptionsService', () => {
  beforeEach(() => {
    vi.mocked(runRedisCommand).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates snapshot with slug and returns share metadata', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // INCR
      .mockResolvedValueOnce(1) // EXPIRE
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
      3,
      'SET',
      'assumptions:slug:scenario-a',
      result.id,
      'NX',
      'EX',
      expect.any(String)
    );
  });

  it('returns 409 when slug already exists', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(1).mockResolvedValueOnce(1).mockResolvedValueOnce(null);

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
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce('abc123def456')
      .mockResolvedValueOnce(
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

  it('throws not found when snapshot does not exist', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    await expect(getSharedSnapshot('missing')).rejects.toBeInstanceOf(SharedAssumptionsError);
  });
});
