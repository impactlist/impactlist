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

const requestJson = async (url, options = {}) => {
  const response = await globalThis.fetch(url, options);
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ShareAssumptionsAPIError(
      response.status,
      payload?.error || 'request_failed',
      payload?.message || 'Request failed.'
    );
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

export const isValidSlug = (value) => {
  if (!value) return false;
  return SLUG_REGEX.test(value);
};

export const saveSharedAssumptions = async ({ assumptions, name, slug }) => {
  return requestJson(SHARED_ASSUMPTIONS_BASE_PATH, {
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
};

export const fetchSharedAssumptions = async (reference) => {
  const encodedReference = encodeURIComponent(reference);
  return requestJson(`${SHARED_ASSUMPTIONS_BASE_PATH}/${encodedReference}`);
};
