import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/server/upstashRedisClient.js', () => ({
  runRedisCommand: vi.fn(),
  runRedisPipeline: vi.fn(),
}));

import handler from './index.js';
import { serverDefaultAssumptions } from '../../src/server/sharedAssumptionsNormalization.js';
import { runRedisCommand } from '../../src/server/upstashRedisClient.js';

const [firstGlobalParamName, firstGlobalParamValue] = Object.entries(serverDefaultAssumptions.globalParameters)[0];
const firstCategoryId = Object.keys(serverDefaultAssumptions.categories)[0];

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

describe('/api/shared-assumptions', () => {
  beforeEach(() => {
    vi.mocked(runRedisCommand).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const req = { method: 'GET', headers: {} };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(JSON.parse(res.payload).error).toBe('method_not_allowed');
    expect(vi.mocked(runRedisCommand)).not.toHaveBeenCalled();
  });

  it('rejects invalid assumptions with a 400 before touching storage', async () => {
    const req = {
      method: 'POST',
      headers: {},
      // This shape used to escape validation and blow up as a 500 inside
      // normalization.
      body: { assumptions: { categories: { [firstCategoryId]: { effects: 'ab' } } } },
    };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    expect(body.error).toBe('invalid_assumptions');
    expect(body.message).toContain('effects must be an array');
    expect(vi.mocked(runRedisCommand)).not.toHaveBeenCalled();
  });

  it('creates a snapshot for a valid payload', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // EVAL rate limit
      .mockResolvedValueOnce('OK'); // SET snapshot

    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.5' },
      body: {
        assumptions: { globalParameters: { [firstGlobalParamName]: Number(firstGlobalParamValue) + 1 } },
        name: 'Route test scenario',
      },
    };
    const res = createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.id).toHaveLength(12);
    expect(body.reference).toBe(body.id);
    expect(body.slug).toBeNull();
    expect(vi.mocked(runRedisCommand)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(runRedisCommand).mock.calls[0][0]).toBe('EVAL');
    expect(vi.mocked(runRedisCommand).mock.calls[1][0]).toBe('SET');
  });
});
