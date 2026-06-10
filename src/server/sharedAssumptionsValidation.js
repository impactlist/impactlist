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
import { isPlainObject } from '../utils/typeGuards.js';

const ALLOWED_TOP_LEVEL_KEYS = ['globalParameters', 'categories', 'recipients'];

// Keys that could rewire an object's prototype when later code assigns into
// merged structures (e.g. merged[fieldName] = value on the client).
const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

// Keep attacker-controlled keys from bloating error messages.
const describeKey = (key) => {
  const text = String(key);
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
};

const invalidAssumptions = (message) => createSharedAssumptionsError(400, 'invalid_assumptions', message);

const requirePlainObject = (value, path) => {
  if (!isPlainObject(value)) {
    throw invalidAssumptions(`${path} must be an object.`);
  }
};

const rejectForbiddenKeys = (value, path) => {
  Object.keys(value).forEach((key) => {
    if (FORBIDDEN_OBJECT_KEYS.has(key)) {
      throw invalidAssumptions(`Forbidden key '${key}' in ${path}.`);
    }
  });
};

const validateGlobalParametersShape = (globalParameters, defaults) => {
  requirePlainObject(globalParameters, 'assumptions.globalParameters');
  rejectForbiddenKeys(globalParameters, 'assumptions.globalParameters');

  Object.entries(globalParameters).forEach(([name, value]) => {
    if (!Object.hasOwn(defaults.globalParameters, name)) {
      throw invalidAssumptions(`Unknown global parameter '${describeKey(name)}'.`);
    }
    if (!isFiniteNumber(value)) {
      throw invalidAssumptions(`Global parameter '${name}' must be a finite number.`);
    }
  });
};

// Validates one user effect entry against the base category effect that
// defines which fields exist. `fields` describes the entry's editable keys:
// category effects override base fields directly; recipient effects nest them
// under 'overrides'/'multipliers'.
const validateEffectEntries = ({ effects, defaultEffects, path, isRecipientEffect }) => {
  if (!Array.isArray(effects)) {
    throw invalidAssumptions(`${path}.effects must be an array.`);
  }

  const seenEffectIds = new Set();
  effects.forEach((effect, index) => {
    const effectPath = `${path}.effects[${index}]`;
    requirePlainObject(effect, effectPath);
    rejectForbiddenKeys(effect, effectPath);

    const defaultEffect =
      typeof effect.effectId === 'string'
        ? defaultEffects.find((candidate) => candidate.effectId === effect.effectId)
        : null;
    if (!defaultEffect) {
      throw invalidAssumptions(`${effectPath} references unknown effectId '${describeKey(effect.effectId)}'.`);
    }
    if (seenEffectIds.has(effect.effectId)) {
      throw invalidAssumptions(`${effectPath} duplicates effectId '${effect.effectId}'.`);
    }
    seenEffectIds.add(effect.effectId);

    const validateFieldMap = (fieldMap, fieldMapPath) => {
      requirePlainObject(fieldMap, fieldMapPath);
      rejectForbiddenKeys(fieldMap, fieldMapPath);
      Object.entries(fieldMap).forEach(([field, value]) => {
        if (!isFiniteNumber(defaultEffect[field])) {
          throw invalidAssumptions(`${fieldMapPath} has unknown effect field '${describeKey(field)}'.`);
        }
        if (!isFiniteNumber(value)) {
          throw invalidAssumptions(`${fieldMapPath}.${field} must be a finite number.`);
        }
      });
    };

    Object.entries(effect).forEach(([field, value]) => {
      if (field === 'effectId') {
        return;
      }
      if (field === 'disabled') {
        if (typeof value !== 'boolean') {
          throw invalidAssumptions(`${effectPath}.disabled must be a boolean.`);
        }
        return;
      }

      if (isRecipientEffect) {
        if (field === 'overrides' || field === 'multipliers') {
          validateFieldMap(value, `${effectPath}.${field}`);
          return;
        }
        throw invalidAssumptions(
          `${effectPath} has unknown field '${describeKey(field)}'. ` +
            `Recipient effects support 'overrides', 'multipliers', and 'disabled'.`
        );
      }

      if (!isFiniteNumber(defaultEffect[field])) {
        throw invalidAssumptions(`${effectPath} has unknown effect field '${describeKey(field)}'.`);
      }
      if (!isFiniteNumber(value)) {
        throw invalidAssumptions(`${effectPath}.${field} must be a finite number.`);
      }
    });
  });
};

const validateCategoriesShape = (categories, defaults) => {
  requirePlainObject(categories, 'assumptions.categories');
  rejectForbiddenKeys(categories, 'assumptions.categories');

  Object.entries(categories).forEach(([categoryId, category]) => {
    if (!Object.hasOwn(defaults.categories, categoryId)) {
      throw invalidAssumptions(`Unknown category '${describeKey(categoryId)}' in assumptions.categories.`);
    }

    const path = `assumptions.categories.${categoryId}`;
    requirePlainObject(category, path);
    rejectForbiddenKeys(category, path);
    Object.keys(category).forEach((key) => {
      if (key !== 'effects') {
        throw invalidAssumptions(`${path} has unknown field '${describeKey(key)}'. Only 'effects' is supported.`);
      }
    });

    validateEffectEntries({
      effects: category.effects,
      defaultEffects: defaults.categories[categoryId].effects,
      path,
      isRecipientEffect: false,
    });
  });
};

const validateRecipientsShape = (recipients, defaults) => {
  requirePlainObject(recipients, 'assumptions.recipients');
  rejectForbiddenKeys(recipients, 'assumptions.recipients');

  Object.entries(recipients).forEach(([recipientId, recipient]) => {
    if (!Object.hasOwn(defaults.recipients, recipientId)) {
      throw invalidAssumptions(`Unknown recipient '${describeKey(recipientId)}' in assumptions.recipients.`);
    }

    const recipientPath = `assumptions.recipients.${recipientId}`;
    requirePlainObject(recipient, recipientPath);
    rejectForbiddenKeys(recipient, recipientPath);
    Object.keys(recipient).forEach((key) => {
      if (key !== 'categories') {
        throw invalidAssumptions(
          `${recipientPath} has unknown field '${describeKey(key)}'. Only 'categories' is supported.`
        );
      }
    });

    const recipientCategories = recipient.categories;
    requirePlainObject(recipientCategories, `${recipientPath}.categories`);
    rejectForbiddenKeys(recipientCategories, `${recipientPath}.categories`);

    const defaultRecipient = defaults.recipients[recipientId];
    Object.entries(recipientCategories).forEach(([categoryId, recipientCategory]) => {
      if (!Object.hasOwn(defaultRecipient.categories, categoryId) || !Object.hasOwn(defaults.categories, categoryId)) {
        throw invalidAssumptions(
          `Category '${describeKey(categoryId)}' is not associated with recipient '${recipientId}'.`
        );
      }

      const path = `${recipientPath}.categories.${categoryId}`;
      requirePlainObject(recipientCategory, path);
      rejectForbiddenKeys(recipientCategory, path);
      Object.keys(recipientCategory).forEach((key) => {
        if (key !== 'effects') {
          throw invalidAssumptions(`${path} has unknown field '${describeKey(key)}'. Only 'effects' is supported.`);
        }
      });

      validateEffectEntries({
        effects: recipientCategory.effects,
        defaultEffects: defaults.categories[categoryId].effects,
        path,
        isRecipientEffect: true,
      });
    });
  });
};

// Deep schema validation of user assumptions against the server defaults.
// Anything that doesn't look like output of the app's own assumptions editor
// is rejected with a 400: stored snapshots are re-imported by other users'
// browsers, so a malformed snapshot would crash the app for everyone who
// opens its share link.
const validateAssumptionsShape = (assumptions, defaults) => {
  rejectForbiddenKeys(assumptions, 'assumptions');
  Object.keys(assumptions).forEach((key) => {
    if (!ALLOWED_TOP_LEVEL_KEYS.includes(key)) {
      throw invalidAssumptions(`Unknown key '${describeKey(key)}' in assumptions.`);
    }
  });

  if (assumptions.globalParameters !== undefined) {
    validateGlobalParametersShape(assumptions.globalParameters, defaults);
  }
  if (assumptions.categories !== undefined) {
    validateCategoriesShape(assumptions.categories, defaults);
  }
  if (assumptions.recipients !== undefined) {
    validateRecipientsShape(assumptions.recipients, defaults);
  }
};

// Re-validate assumptions loaded back from storage before serving them to
// clients. Snapshots stored before write-side validation existed — or that
// have drifted from the current data schema — would otherwise crash the app
// of anyone importing them.
export const validateStoredAssumptions = (assumptions) => {
  if (!isPlainObject(assumptions)) {
    throw invalidAssumptions('Assumptions must be an object.');
  }
  validateAssumptionsShape(assumptions, serverDefaultAssumptions);
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
  validateAssumptionsShape(payload.assumptions, serverDefaultAssumptions);

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
