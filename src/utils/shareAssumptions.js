import { isPlainObject } from './typeGuards';

const SHARED_ASSUMPTIONS_BASE_PATH = '/api/shared-assumptions';
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
const SNAPSHOT_ID_REGEX = /^[0-9a-z]{12}$/;
const REQUEST_TIMEOUT_MS = 15_000;

export class ShareAssumptionsAPIError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ShareAssumptionsAPIError';
    this.status = status;
    this.code = code;
  }
}

const createRequestTimeoutError = () =>
  new ShareAssumptionsAPIError(408, 'request_timeout', 'The request timed out. Check your connection and try again.');

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const buildSharePath = (reference) => `/?shared=${encodeURIComponent(reference)}`;

const buildShareUrl = (reference) => {
  const sharePath = buildSharePath(reference);
  const origin = globalThis.location?.origin;

  if (!origin) {
    return sharePath;
  }

  return new globalThis.URL(sharePath, origin).toString();
};

const requestJson = async (url, options = {}) => {
  const { signal: callerSignal, ...fetchOptions } = options;
  const abortController = new globalThis.AbortController();
  let didTimeOut = false;

  const abortFromCaller = () => {
    abortController.abort(callerSignal?.reason);
  };

  if (callerSignal?.aborted) {
    abortFromCaller();
  } else {
    callerSignal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  const timeoutId = globalThis.setTimeout(() => {
    didTimeOut = true;
    abortController.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await globalThis.fetch(url, { ...fetchOptions, signal: abortController.signal });
    const payload = await parseJsonSafely(response);

    // A body read can reject after its request is aborted; parseJsonSafely
    // intentionally converts malformed JSON to null, so restore the more
    // useful abort/timeout semantics before validating the payload.
    if (didTimeOut) {
      throw createRequestTimeoutError();
    }
    if (callerSignal?.aborted) {
      if (callerSignal.reason instanceof Error) {
        throw callerSignal.reason;
      }
      const abortError = new Error(
        typeof callerSignal.reason === 'string' && callerSignal.reason
          ? callerSignal.reason
          : 'The request was canceled.'
      );
      abortError.name = 'AbortError';
      throw abortError;
    }

    const fallbackErrorMessage = `Request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`;

    if (!response.ok) {
      throw new ShareAssumptionsAPIError(
        response.status,
        payload?.error || 'request_failed',
        payload?.message || fallbackErrorMessage
      );
    }

    if (!isPlainObject(payload)) {
      throw new ShareAssumptionsAPIError(500, 'invalid_response', 'Server returned invalid JSON.');
    }

    return payload;
  } catch (error) {
    if (didTimeOut && error?.code !== 'request_timeout') {
      throw createRequestTimeoutError();
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
    callerSignal?.removeEventListener('abort', abortFromCaller);
  }
};

export const slugify = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
};

export const normalizeSlugInput = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
};

export const isValidSlug = (value) => {
  if (!value) return false;
  return SLUG_REGEX.test(value) && !SNAPSHOT_ID_REGEX.test(value);
};

export const saveSharedAssumptions = async ({ assumptions, name, description, slug }) => {
  const payload = await requestJson(SHARED_ASSUMPTIONS_BASE_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assumptions,
      name: name || null,
      description: description || null,
      slug: slug || null,
    }),
  });

  if (!isNonEmptyString(payload.id) || !isNonEmptyString(payload.reference)) {
    throw new ShareAssumptionsAPIError(500, 'invalid_response', 'Server returned an invalid save response.');
  }

  return {
    ...payload,
    shareUrl: buildShareUrl(payload.reference),
  };
};

export const fetchSharedAssumptions = async (reference, options = {}) => {
  const encodedReference = encodeURIComponent(reference);
  const payload = await requestJson(`${SHARED_ASSUMPTIONS_BASE_PATH}/${encodedReference}`, options);

  if (!isPlainObject(payload.assumptions)) {
    throw new ShareAssumptionsAPIError(500, 'invalid_response', 'Server returned an invalid snapshot response.');
  }

  return payload;
};
