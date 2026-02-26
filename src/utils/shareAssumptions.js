import { isPlainObject } from './typeGuards';

const SHARED_ASSUMPTIONS_BASE_PATH = '/api/shared-assumptions';
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

export class ShareAssumptionsAPIError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ShareAssumptionsAPIError';
    this.status = status;
    this.code = code;
  }
}

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
  const response = await globalThis.fetch(url, options);
  const payload = await parseJsonSafely(response);
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
  return SLUG_REGEX.test(value);
};

export const saveSharedAssumptions = async ({ assumptions, name, slug }) => {
  const payload = await requestJson(SHARED_ASSUMPTIONS_BASE_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assumptions,
      name: name || null,
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
