import {
  MAX_ASSUMPTIONS_BYTES,
  MAX_NAME_LENGTH,
  MAX_REFERENCE_LENGTH,
  MIN_SLUG_LENGTH,
  MAX_SLUG_LENGTH,
  RESERVED_SLUGS,
  SLUG_REGEX,
} from './sharedAssumptionsConfig';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors';
import { normalizeSharedUserAssumptions, serverDefaultAssumptions } from './sharedAssumptionsNormalization';

const ALLOWED_TOP_LEVEL_KEYS = ['globalParameters', 'categories', 'recipients'];

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const sanitizeAssumptionsPayload = (assumptions) => {
  if (!isPlainObject(assumptions)) {
    return null;
  }

  const sanitized = {};
  ALLOWED_TOP_LEVEL_KEYS.forEach((key) => {
    const value = assumptions[key];
    if (isPlainObject(value)) {
      sanitized[key] = cloneJson(value);
    }
  });

  return sanitized;
};

export const normalizeSlug = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const validateSlug = (slug) => {
  if (!slug) return;

  if (slug.length < MIN_SLUG_LENGTH || slug.length > MAX_SLUG_LENGTH || !SLUG_REGEX.test(slug)) {
    throw createSharedAssumptionsError(
      400,
      'invalid_slug',
      'Slug must use lowercase letters, numbers, and dashes (3-40 chars).'
    );
  }

  if (RESERVED_SLUGS.has(slug)) {
    throw createSharedAssumptionsError(400, 'reserved_slug', 'That slug is reserved.');
  }
};

const validateName = (name) => {
  if (name === null || name === undefined) {
    return null;
  }

  const normalizedName = String(name).trim();
  if (normalizedName.length === 0) {
    return null;
  }

  if (normalizedName.length > MAX_NAME_LENGTH) {
    throw createSharedAssumptionsError(400, 'invalid_name', `Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
  }

  return normalizedName;
};

const validateAssumptionsSize = (assumptions) => {
  const sizeBytes = new globalThis.TextEncoder().encode(JSON.stringify(assumptions)).length;
  if (sizeBytes > MAX_ASSUMPTIONS_BYTES) {
    throw createSharedAssumptionsError(
      413,
      'assumptions_too_large',
      `Assumptions payload exceeds ${MAX_ASSUMPTIONS_BYTES} bytes.`
    );
  }
};

export const validateReference = (reference) => {
  if (!reference || typeof reference !== 'string') {
    throw createSharedAssumptionsError(400, 'invalid_reference', 'Reference is required.');
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    throw createSharedAssumptionsError(400, 'invalid_reference', 'Reference is required.');
  }

  if (trimmed.length > MAX_REFERENCE_LENGTH) {
    throw createSharedAssumptionsError(400, 'invalid_reference', 'Reference is too long.');
  }

  return trimmed;
};

export const validateCreatePayload = (payload) => {
  if (!isPlainObject(payload)) {
    throw createSharedAssumptionsError(400, 'invalid_payload', 'Invalid request body.');
  }

  const assumptions = sanitizeAssumptionsPayload(payload.assumptions);
  if (!assumptions) {
    throw createSharedAssumptionsError(400, 'invalid_assumptions', 'Assumptions must be an object.');
  }

  validateAssumptionsSize(assumptions);

  const normalizedAssumptions = normalizeSharedUserAssumptions(assumptions, serverDefaultAssumptions);
  if (!normalizedAssumptions) {
    throw createSharedAssumptionsError(
      400,
      'empty_assumptions',
      'Assumptions must include at least one non-default custom value.'
    );
  }

  const name = validateName(payload.name);
  const slug = normalizeSlug(payload.slug);
  validateSlug(slug);

  return {
    assumptions: normalizedAssumptions,
    name,
    slug,
  };
};
