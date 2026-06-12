import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/server/upstashRedisClient.js', () => ({
  runRedisCommand: vi.fn(),
  runRedisPipeline: vi.fn(),
}));

import handler from '../../../api/shared-assumptions/[reference].js';
import { serverDefaultAssumptions } from '../../../src/server/sharedAssumptionsNormalization.js';
import { runRedisCommand, runRedisPipeline } from '../../../src/server/upstashRedisClient.js';

const [firstGlobalParamName, firstGlobalParamValue] = Object.entries(serverDefaultAssumptions.globalParameters)[0];

const buildSnapshotJson = (overrides = {}) =>
  JSON.stringify({
    createdAt: '2026-02-13T00:00:00.000Z',
    assumptions: { globalParameters: { [firstGlobalParamName]: Number(firstGlobalParamValue) + 1 } },
    ...overrides,
  });

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

const createRequest = (reference) => ({
  method: 'GET',
  headers: {},
  query: { reference },
});

describe('/api/shared-assumptions/[reference]', () => {
  beforeEach(() => {
    vi.mocked(runRedisCommand).mockReset();
    vi.mocked(runRedisPipeline).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-GET methods', async () => {
    const res = createResponse();

    await handler({ method: 'POST', headers: {}, query: {} }, res);

    expect(res.statusCode).toBe(405);
    expect(JSON.parse(res.payload).error).toBe('method_not_allowed');
  });

  it('serves id-resolved snapshots with a long immutable cache header', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(1); // read rate limit
    vi.mocked(runRedisPipeline).mockResolvedValueOnce([null, buildSnapshotJson()]);

    const res = createResponse();
    await handler(createRequest('abc123def456'), res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Cache-Control']).toBe('public, max-age=3600, s-maxage=31536000, immutable');
    expect(JSON.parse(res.payload).id).toBe('abc123def456');
  });

  it('serves slug-resolved snapshots with a short cache header', async () => {
    vi.mocked(runRedisCommand)
      .mockResolvedValueOnce(1) // read rate limit
      .mockResolvedValueOnce(buildSnapshotJson({ slug: 'my-slug' })); // snapshot fetch via mapped id
    vi.mocked(runRedisPipeline).mockResolvedValueOnce(['abc123def456', null]);

    const res = createResponse();
    await handler(createRequest('my-slug'), res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Cache-Control']).toBe('public, max-age=60, s-maxage=300');
    expect(JSON.parse(res.payload).slug).toBe('my-slug');
  });

  it('rate limits reads', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(runRedisCommand).mockResolvedValueOnce(301); // over the read limit

    const res = createResponse();
    await handler(createRequest('abc123def456'), res);

    expect(res.statusCode).toBe(429);
    expect(JSON.parse(res.payload).error).toBe('rate_limited');
    expect(vi.mocked(runRedisPipeline)).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('returns 404 for missing snapshots without setting a cache header', async () => {
    vi.mocked(runRedisCommand).mockResolvedValueOnce(1);
    vi.mocked(runRedisPipeline).mockResolvedValueOnce([null, null]);

    const res = createResponse();
    await handler(createRequest('missing-ref'), res);

    expect(res.statusCode).toBe(404);
    expect(res.headers['Cache-Control']).toBeUndefined();
  });
});
