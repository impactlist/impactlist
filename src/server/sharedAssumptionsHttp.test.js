import { EventEmitter } from 'events';
import { describe, expect, it, vi } from 'vitest';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors.js';
import { handleApiError, parseJsonBody } from './sharedAssumptionsHttp.js';

const createMockResponse = () => {
  const response = {
    statusCode: 200,
    headers: {},
    setHeader: vi.fn((name, value) => {
      response.headers[name] = value;
    }),
    end: vi.fn((payload) => {
      response.payload = payload;
    }),
  };

  return response;
};

describe('sharedAssumptionsHttp', () => {
  it('logs unexpected errors before returning internal error', () => {
    const response = createMockResponse();
    const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    handleApiError(response, new Error('unexpected'));

    expect(response.statusCode).toBe(500);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.payload)).toEqual({
      error: 'internal_error',
      message: 'An unexpected error occurred.',
    });
  });

  it('stops reading request stream when payload exceeds max body bytes', async () => {
    const request = new EventEmitter();
    request.headers = { 'content-type': 'application/json' };
    request.destroy = vi.fn();

    const parsePromise = parseJsonBody(request);
    request.emit('data', 'a'.repeat(130 * 1024));

    await expect(parsePromise).rejects.toMatchObject({ status: 413, code: 'payload_too_large' });
    expect(request.destroy).toHaveBeenCalledTimes(1);
  });

  it('rejects non-JSON content types with 415', async () => {
    await expect(parseJsonBody({ headers: { 'content-type': 'text/plain' }, body: '{}' })).rejects.toMatchObject({
      status: 415,
      code: 'unsupported_media_type',
    });
    await expect(parseJsonBody({ headers: {} })).rejects.toMatchObject({ status: 415 });
  });

  it('enforces the body size cap on pre-parsed bodies, not just streamed ones', async () => {
    const oversized = 'a'.repeat(130 * 1024);
    const headers = { 'content-type': 'application/json' };

    await expect(parseJsonBody({ headers, body: JSON.stringify({ data: oversized }) })).rejects.toMatchObject({
      status: 413,
      code: 'payload_too_large',
    });
    await expect(
      parseJsonBody({ headers, body: globalThis.Buffer.from(`{"data":"${oversized}"}`) })
    ).rejects.toMatchObject({
      status: 413,
      code: 'payload_too_large',
    });
    await expect(parseJsonBody({ headers, body: { data: oversized } })).rejects.toMatchObject({
      status: 413,
      code: 'payload_too_large',
    });
  });

  it('parses bodies the platform delivered as raw strings', async () => {
    await expect(parseJsonBody({ headers: { 'content-type': 'application/json' }, body: '{"a":1}' })).resolves.toEqual({
      a: 1,
    });
    await expect(
      parseJsonBody({ headers: { 'content-type': 'application/json; charset=utf-8' }, body: 'not json' })
    ).rejects.toMatchObject({ status: 400, code: 'invalid_json' });
  });

  it('returns known shared assumptions errors without logging as unexpected', () => {
    const response = createMockResponse();
    const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    handleApiError(response, createSharedAssumptionsError(404, 'not_found', 'Missing'));

    expect(response.statusCode).toBe(404);
    expect(loggerSpy).not.toHaveBeenCalled();
    expect(JSON.parse(response.payload)).toEqual({
      error: 'not_found',
      message: 'Missing',
    });
  });

  it('logs known server errors with request context and hides details from the response', () => {
    const response = createMockResponse();
    const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const request = {
      method: 'POST',
      url: '/api/shared-assumptions',
    };

    handleApiError(
      request,
      response,
      createSharedAssumptionsError(500, 'redis_request_failed', 'Redis failed: secret upstream detail.')
    );

    expect(response.statusCode).toBe(500);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy.mock.calls[0][1].message).toContain('secret upstream detail');
    const body = JSON.parse(response.payload);
    expect(body.error).toBe('redis_request_failed');
    expect(body.message).not.toContain('secret upstream detail');
  });

  it('logs rate-limited requests as abuse signals', () => {
    const response = createMockResponse();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const request = { method: 'GET', url: '/api/shared-assumptions/abc' };

    handleApiError(request, response, createSharedAssumptionsError(429, 'rate_limited', 'Too many requests.'));

    expect(response.statusCode).toBe(429);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.payload)).toEqual({
      error: 'rate_limited',
      message: 'Too many requests.',
    });
  });
});
