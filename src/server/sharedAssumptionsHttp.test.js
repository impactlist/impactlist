import { EventEmitter } from 'events';
import { describe, expect, it, vi } from 'vitest';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors';
import { handleApiError, parseJsonBody } from './sharedAssumptionsHttp';

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
    request.destroy = vi.fn();

    const parsePromise = parseJsonBody(request);
    request.emit('data', 'a'.repeat(130 * 1024));

    await expect(parsePromise).rejects.toMatchObject({ status: 413, code: 'payload_too_large' });
    expect(request.destroy).toHaveBeenCalledTimes(1);
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

  it('logs known server errors with request context', () => {
    const response = createMockResponse();
    const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const request = {
      method: 'POST',
      url: '/api/shared-assumptions',
    };

    handleApiError(request, response, createSharedAssumptionsError(500, 'redis_request_failed', 'Redis failed.'));

    expect(response.statusCode).toBe(500);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.payload)).toEqual({
      error: 'redis_request_failed',
      message: 'Redis failed.',
    });
  });
});
