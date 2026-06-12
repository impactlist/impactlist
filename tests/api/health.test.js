import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSharedAssumptionsError } from '../../src/server/sharedAssumptionsErrors.js';

vi.mock('../../src/server/upstashRedisClient.js', () => ({
  runRedisCommand: vi.fn(),
}));

import handler from '../../api/health.js';
import { runRedisCommand } from '../../src/server/upstashRedisClient.js';

const createResponse = () => {
  const response = {
    statusCode: 200,
    headers: {},
    payload: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(value) {
      this.payload = value;
    },
  };

  return response;
};

describe('/api/health', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns app health for basic GET checks', async () => {
    const req = { method: 'GET', query: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.ok).toBe(true);
    expect(body.checks.app).toBe('ok');
    expect(vi.mocked(runRedisCommand)).not.toHaveBeenCalled();
  });

  it('runs redis + eval checks when check=redis', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // rate-limit EVAL
      .mockResolvedValueOnce('PONG')
      .mockResolvedValueOnce('ok');

    const req = { method: 'GET', query: { check: 'redis' }, headers: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.checks.redisPing).toBe('ok');
    expect(body.checks.redisEval).toBe('ok');
    expect(runRedisCommand).toHaveBeenNthCalledWith(2, 'PING');
    expect(runRedisCommand).toHaveBeenNthCalledWith(3, 'EVAL', "return 'ok'", '0');
  });

  it('rate limits redis health checks', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(31); // over the health limit

    const req = { method: 'GET', query: { check: 'redis' }, headers: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(429);
    expect(JSON.parse(res.payload).error).toBe('rate_limited');
    expect(runRedisCommand).toHaveBeenCalledTimes(1);
  });

  it('returns 503 with a generic message when redis checks fail', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(runRedisCommand).mockRejectedValue(
      createSharedAssumptionsError(503, 'redis_quota_or_rate_limited', 'Upstream detail: quota exhausted.')
    );

    const req = { method: 'GET', query: { check: 'redis' }, headers: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(503);
    const body = JSON.parse(res.payload);
    expect(body.ok).toBe(false);
    expect(body.error).toBe('redis_quota_or_rate_limited');
    expect(body.message).not.toContain('Upstream detail');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('rejects non-GET methods', async () => {
    const req = { method: 'POST', query: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const body = JSON.parse(res.payload);
    expect(body.error).toBe('method_not_allowed');
  });
});
