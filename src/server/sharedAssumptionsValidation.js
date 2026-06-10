import {
  MAX_ASSUMPTIONS_BYTES,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_REFERENCE_LENGTH,
  MIN_SLUG_LENGTH,
  MAX_SLUG_LENGTH,
  RESERVED_SLUGS,
  SLUG_REGEX,
} from './sharedAssumptionsConfig.js';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors.js';
import { normalizeSharedUserAssumptions, serverDefaultAssumptions } from './sharedAssumptionsNormalization.js';
import { validateAssumptionsShape } from '../utils/assumptionsNormalization.js';
import { isPlainObject } from '../utils/typeGuards.js';

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const invalidAssumptions = (message) => createSharedAssumptionsError(400, 'invalid_assumptions', message);

// Deep schema validation is shared with the client (assumptionsNormalization)
// so the two can't drift; this wrapper just injects the server error type.
const validateServerAssumptionsShape = (assumptions) => {
  if (!isPlainObject(assumptions)) {
    throw invalidAssumptions('Assumptions must be an object.');
  }
  validateAssumptionsShape(assumptions, serverDefaultAssumptions, invalidAssumptions);
};

// Re-validate assumptions loaded back from storage before serving them to
// clients. Snapshots stored before write-side validation existed — or that
// have drifted from the current data schema — would otherwise crash the app
// of anyone importing them.
export const validateStoredAssumptions = (assumptions) => {
  validateServerAssumptionsShape(assumptions);
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

const validateDescription = (description) => {
  if (description === null || description === undefined) {
    return null;
  }

  const normalizedDescription = String(description).trim();
  if (normalizedDescription.length === 0) {
    return null;
  }

  if (normalizedDescription.length > MAX_DESCRIPTION_LENGTH) {
    throw createSharedAssumptionsError(
      400,
      'invalid_description',
      `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
    );
  }

  return normalizedDescription;
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

  if (!isPlainObject(payload.assumptions)) {
    throw createSharedAssumptionsError(400, 'invalid_assumptions', 'Assumptions must be an object.');
  }

  // Size first so the deep walk below runs on bounded input.
  validateAssumptionsSize(payload.assumptions);
  validateServerAssumptionsShape(payload.assumptions);

  const assumptions = cloneJson(payload.assumptions);
  const normalizedAssumptions = normalizeSharedUserAssumptions(assumptions, serverDefaultAssumptions);
  if (!normalizedAssumptions) {
    throw createSharedAssumptionsError(
      400,
      'empty_assumptions',
      'Assumptions must include at least one non-default custom value.'
    );
  }

  const name = validateName(payload.name);
  const description = validateDescription(payload.description);
  const slug = normalizeSlug(payload.slug);
  validateSlug(slug);

  return {
    assumptions: normalizedAssumptions,
    name,
    description,
    slug,
  };
};
