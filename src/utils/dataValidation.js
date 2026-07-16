// Data validation utilities to prevent silent failures
// All functions in this module should crash loudly when expected data is missing
// Explicit .js extension: this module is also imported by the Node-run
// generator script, where extensionless ESM imports don't resolve.
import { WEIGHT_NORMALIZATION_TOLERANCE } from './constants.js';

const OBJECT_PROTOTYPE_KEYS = new Set([...Object.getOwnPropertyNames(Object.prototype), 'prototype']);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/**
 * Assert that an author-controlled identifier is safe to use as an object key.
 * Generated data is keyed by IDs in several places; inherited Object keys such
 * as "constructor" and "__proto__" can otherwise collide with or mutate those
 * maps before the data ever reaches the app.
 */
export const assertSafeIdentifier = (value, fieldName, context = '') => {
  if (!isNonEmptyString(value)) {
    throw new Error(`Field ${fieldName} must be a non-empty string${context ? ` ${context}` : ''}`);
  }
  if (value !== value.trim()) {
    throw new Error(`Field ${fieldName} cannot have surrounding whitespace${context ? ` ${context}` : ''}`);
  }
  if (OBJECT_PROTOTYPE_KEYS.has(value)) {
    throw new Error(
      `Field ${fieldName} uses reserved object key "${value}"${context ? ` ${context}` : ''}; choose another ID`
    );
  }
  return value;
};

const ENTITY_ID_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/**
 * Assert that a content/entity ID is safe as both a URL segment and an
 * ordinary-object key. The underscore allowance keeps legacy fixture/data
 * IDs valid; production content conventionally uses hyphens.
 */
export const assertValidEntityId = (value, fieldName = 'id', context = '') => {
  assertExists(value, fieldName, context);
  if (typeof value !== 'string' || !ENTITY_ID_PATTERN.test(value)) {
    throw new Error(
      `Field ${fieldName}${context ? ` ${context}` : ''} must use lowercase letters and numbers separated by single hyphens or underscores, got: ${JSON.stringify(value)}`
    );
  }
  assertSafeIdentifier(value, fieldName, context);
  return value;
};

/**
 * Assert that a value exists and is not null/undefined
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error (e.g., "in category global-health")
 */
export const assertExists = (value, fieldName, context = '') => {
  if (value === null || value === undefined) {
    throw new Error(`Missing required field: ${fieldName}${context ? ` ${context}` : ''}`);
  }
  return value;
};

/**
 * Assert that a value is a number and not NaN. Runtime calculations use
 * Infinity as a deliberate sentinel (for example, no effect within the time
 * horizon), so source/schema boundaries that require finiteness must use
 * assertFiniteNumber instead.
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertNumber = (value, fieldName, context = '') => {
  assertExists(value, fieldName, context);
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(
      `Field ${fieldName} must be a valid number${context ? ` ${context}` : ''}, got: ${value} (type: ${typeof value})`
    );
  }
  return value;
};

export const assertFiniteNumber = (value, fieldName, context = '') => {
  assertNumber(value, fieldName, context);
  if (!Number.isFinite(value)) {
    throw new Error(`Field ${fieldName} must be a finite number${context ? ` ${context}` : ''}, got: ${value}`);
  }
  return value;
};

/**
 * Assert that a value is a positive number
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertPositiveNumber = (value, fieldName, context = '') => {
  assertNumber(value, fieldName, context);
  if (value <= 0) {
    throw new Error(`Field ${fieldName} must be positive${context ? ` ${context}` : ''}, got: ${value}`);
  }
  return value;
};

/**
 * Assert that a value is a non-zero number (positive or negative, but not zero)
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertNonZeroNumber = (value, fieldName, context = '') => {
  assertNumber(value, fieldName, context);
  if (value === 0) {
    throw new Error(`Field ${fieldName} cannot be zero${context ? ` ${context}` : ''}, got: ${value}`);
  }
  return value;
};

export const assertNonNegativeNumber = (value, fieldName, context = '') => {
  assertNumber(value, fieldName, context);
  if (value < 0) {
    throw new Error(`Field ${fieldName} cannot be negative${context ? ` ${context}` : ''}, got: ${value}`);
  }
  return value;
};

/**
 * Assert that a value is an array
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertArray = (value, fieldName, context = '') => {
  assertExists(value, fieldName, context);
  if (!Array.isArray(value)) {
    throw new Error(`Field ${fieldName} must be an array${context ? ` ${context}` : ''}, got: ${typeof value}`);
  }
  return value;
};

/**
 * Assert that an array is not empty
 * @param {*} value - The array to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertNonEmptyArray = (value, fieldName, context = '') => {
  assertArray(value, fieldName, context);
  if (value.length === 0) {
    throw new Error(`Field ${fieldName} cannot be empty${context ? ` ${context}` : ''}`);
  }
  return value;
};

/**
 * Assert that a value is an object
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertObject = (value, fieldName, context = '') => {
  assertExists(value, fieldName, context);
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Field ${fieldName} must be an object${context ? ` ${context}` : ''}, got: ${typeof value}`);
  }
  return value;
};

/**
 * Validate the optional [startYear, endYear] applicability interval used by
 * category effects. Either endpoint may be null, but numeric endpoints must be
 * finite integers and the interval may not run backwards.
 */
export const assertValidTimeInterval = (value, fieldName = 'validTimeInterval', context = '') => {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`Field ${fieldName} must be a two-item [startYear, endYear] array${context ? ` ${context}` : ''}`);
  }

  const [startYear, endYear] = value;
  for (const [label, year] of [
    ['start year', startYear],
    ['end year', endYear],
  ]) {
    if (year !== null && !Number.isSafeInteger(year)) {
      throw new Error(`Field ${fieldName} ${label} must be null or a safe integer${context ? ` ${context}` : ''}`);
    }
  }

  if (startYear !== null && endYear !== null && endYear < startYear) {
    throw new Error(`Field ${fieldName} end year cannot precede its start year${context ? ` ${context}` : ''}`);
  }

  return value;
};

/**
 * Validate one numeric effect value without imposing a sign on costs or
 * welfare. Negative costs and qalyImprovementPerYear are legitimate; only the
 * calculation-breaking domains are rejected.
 */
export const assertValidEffectFieldValue = (value, fieldName, context = '') => {
  if (fieldName === 'validTimeInterval') {
    return assertValidTimeInterval(value, fieldName, context);
  }

  const number = assertFiniteNumber(value, fieldName, context);
  if (fieldName === 'startTime' && number < 0) {
    throw new Error(`Field ${fieldName} cannot be negative${context ? ` ${context}` : ''}, got: ${number}`);
  }
  if (fieldName === 'windowLength' && number <= 0) {
    throw new Error(`Field ${fieldName} must be positive${context ? ` ${context}` : ''}, got: ${number}`);
  }
  if (
    (fieldName === 'costPerQALY' ||
      fieldName === 'costPerMicroprobability' ||
      fieldName === 'qalyImprovementPerYear') &&
    number === 0
  ) {
    throw new Error(`Field ${fieldName} cannot be zero${context ? ` ${context}` : ''}, got: ${number}`);
  }
  if (fieldName === 'populationFractionAffected' && (number <= 0 || number > 1)) {
    throw new Error(
      `Field ${fieldName} must be greater than 0 and no greater than 1${context ? ` ${context}` : ''}, got: ${number}`
    );
  }

  return number;
};

/**
 * Validate a category effect structure
 * @param {Object} effect - The effect to validate
 * @param {string} categoryId - The category ID for context
 * @param {number} index - The effect index for context
 */
export const validateCategoryEffect = (effect, categoryId, index) => {
  const context = `in category "${categoryId}" effect #${index + 1}`;

  assertExists(effect, 'effect', context);
  assertObject(effect, 'effect', context);

  // Required fields
  assertSafeIdentifier(effect.effectId, 'effectId', context);
  assertValidEffectFieldValue(effect.startTime, 'startTime', context);
  assertValidEffectFieldValue(effect.windowLength, 'windowLength', context);

  // Must have either costPerQALY or costPerMicroprobability
  const hasCostPerQALY = effect.costPerQALY !== undefined;
  const hasCostPerMicroprobability = effect.costPerMicroprobability !== undefined;

  if (hasCostPerQALY === hasCostPerMicroprobability) {
    throw new Error(`Effect ${context} must have exactly one of costPerQALY or costPerMicroprobability`);
  }

  if (hasCostPerQALY) {
    assertValidEffectFieldValue(effect.costPerQALY, 'costPerQALY', context);
    if (effect.populationFractionAffected !== undefined || effect.qalyImprovementPerYear !== undefined) {
      throw new Error(`QALY effect ${context} cannot define population-effect fields`);
    }
  }

  if (hasCostPerMicroprobability) {
    assertValidEffectFieldValue(effect.costPerMicroprobability, 'costPerMicroprobability', context);
    assertValidEffectFieldValue(effect.populationFractionAffected, 'populationFractionAffected', context);
    assertValidEffectFieldValue(effect.qalyImprovementPerYear, 'qalyImprovementPerYear', context);
  }

  if (effect.validTimeInterval !== undefined) {
    assertValidTimeInterval(effect.validTimeInterval, 'validTimeInterval', context);
  }
};

/**
 * Validate a complete category structure
 * @param {Object} category - The category to validate
 * @param {string} categoryId - The category ID for context
 */
export const validateCategory = (category, categoryId) => {
  const context = `in category "${categoryId}"`;

  assertSafeIdentifier(categoryId, 'categoryId');
  assertExists(category, 'category', context);
  assertObject(category, 'category', context);

  assertExists(category.name, 'name', context);
  assertNonEmptyArray(category.effects, 'effects', context);

  const seenEffectIds = new Set();
  category.effects.forEach((effect, index) => {
    validateCategoryEffect(effect, categoryId, index);
    if (seenEffectIds.has(effect.effectId)) {
      throw new Error(`Category ${context} has duplicate effectId "${effect.effectId}"`);
    }
    seenEffectIds.add(effect.effectId);
  });
};

const validateRecipientEffectMap = (map, mapName, effectContext, baseEffect) => {
  assertObject(map, mapName, effectContext);
  const entries = Object.entries(map);
  if (entries.length === 0) {
    throw new Error(`Effect ${effectContext} must not have an empty ${mapName} object`);
  }

  entries.forEach(([fieldName, value]) => {
    if (OBJECT_PROTOTYPE_KEYS.has(fieldName)) {
      throw new Error(`Effect ${effectContext} ${mapName} uses reserved field "${fieldName}"`);
    }
    assertFiniteNumber(value, `${mapName}.${fieldName}`, effectContext);

    if (mapName === 'multipliers' && value === 0) {
      throw new Error(`Field ${fieldName} multiplier ${effectContext} cannot be zero`);
    }

    if (!baseEffect) return;
    if (!Object.hasOwn(baseEffect, fieldName) || typeof baseEffect[fieldName] !== 'number') {
      throw new Error(`Effect ${effectContext} ${mapName} references unknown numeric field "${fieldName}"`);
    }

    const effectiveValue = mapName === 'multipliers' ? baseEffect[fieldName] * value : value;
    if (!Number.isFinite(effectiveValue)) {
      throw new Error(`Field ${fieldName} ${mapName} ${effectContext} produces a non-finite value`);
    }
    assertValidEffectFieldValue(effectiveValue, fieldName, effectContext);
  });
};

/**
 * Validate a recipient wrapper against the category effect it modifies. This
 * catches unknown fields and invalid effective values before multipliers are
 * applied at runtime.
 */
export const validateRecipientEffectAgainstBase = (effect, baseEffect, context) => {
  assertObject(effect, 'effect', context);
  assertObject(baseEffect, 'baseEffect', context);

  if (effect.effectId !== baseEffect.effectId) {
    throw new Error(
      `Effect ${context} references effectId "${effect.effectId}" but the base effect is "${baseEffect.effectId}"`
    );
  }

  const hasOverrides = effect.overrides !== undefined;
  const hasMultipliers = effect.multipliers !== undefined;
  if (hasOverrides) {
    validateRecipientEffectMap(effect.overrides, 'overrides', context, baseEffect);
  }
  if (hasMultipliers) {
    validateRecipientEffectMap(effect.multipliers, 'multipliers', context, baseEffect);
  }

  if (hasOverrides && hasMultipliers) {
    Object.keys(effect.overrides).forEach((fieldName) => {
      if (Object.hasOwn(effect.multipliers, fieldName)) {
        throw new Error(`Field "${fieldName}" ${context} cannot have both an override and a multiplier`);
      }
    });
  }
};

/**
 * Validate a recipient category reference
 * @param {Object} categoryRef - The category reference to validate
 * @param {string} recipientId - The recipient ID for context
 * @param {number} index - The category index for context
 */
export const validateRecipientCategory = (categoryRef, recipientId, index, baseCategory = null) => {
  const context = `in recipient "${recipientId}" category #${index + 1}`;

  assertExists(categoryRef, 'category', context);
  assertObject(categoryRef, 'category', context);

  assertSafeIdentifier(categoryRef.id, 'id', context);

  const fraction = assertNumber(categoryRef.fraction, 'fraction', context);
  if (fraction <= 0 || fraction > 1) {
    throw new Error(`Field fraction ${context} must be between 0 and 1, got: ${fraction}`);
  }

  // Validate effects if present
  if (categoryRef.effects !== undefined) {
    assertArray(categoryRef.effects, 'effects', context);
    const seenEffectIds = new Set();
    categoryRef.effects.forEach((effect, effectIndex) => {
      const effectContext = `${context} effect #${effectIndex + 1}`;
      assertObject(effect, 'effect', effectContext);
      assertSafeIdentifier(effect.effectId, 'effectId', effectContext);
      if (seenEffectIds.has(effect.effectId)) {
        throw new Error(
          `Recipient "${recipientId}" category "${categoryRef.id}" has duplicate effectId "${effect.effectId}"`
        );
      }
      seenEffectIds.add(effect.effectId);

      // Authored recipient data stores lightweight wrappers
      // ({effectId, overrides/multipliers/disabled}). After assumptions are
      // combined, however, a disabled-only edit is represented as a fully
      // resolved category effect with no maps. Accept and validate that resolved
      // form instead of crashing a legitimate runtime sentinel path.
      const hasOverrides = effect.overrides !== undefined;
      const hasMultipliers = effect.multipliers !== undefined;
      const isResolvedEffect = effect.costPerQALY !== undefined || effect.costPerMicroprobability !== undefined;

      if (!hasOverrides && !hasMultipliers) {
        if (!isResolvedEffect) {
          throw new Error(`Effect ${effectContext} must have either overrides or multipliers object`);
        }
        if (effect.disabled !== undefined && typeof effect.disabled !== 'boolean') {
          throw new Error(`Field disabled ${effectContext} must be a boolean`);
        }
        validateCategoryEffect(effect, categoryRef.id, effectIndex);
      }

      const baseEffect = baseCategory?.effects?.find((candidate) => candidate.effectId === effect.effectId) || null;
      if (baseCategory && !baseEffect) {
        throw new Error(
          `Effect ${effectContext} references effectId "${effect.effectId}" that does not exist in category "${categoryRef.id}"`
        );
      }

      if (baseEffect) {
        validateRecipientEffectAgainstBase(effect, baseEffect, effectContext);
      } else {
        if (hasOverrides) {
          validateRecipientEffectMap(effect.overrides, 'overrides', effectContext, null);
        }
        if (hasMultipliers) {
          validateRecipientEffectMap(effect.multipliers, 'multipliers', effectContext, null);
        }
        if (hasOverrides && hasMultipliers) {
          Object.keys(effect.overrides).forEach((fieldName) => {
            if (Object.hasOwn(effect.multipliers, fieldName)) {
              throw new Error(`Field "${fieldName}" ${effectContext} cannot have both an override and a multiplier`);
            }
          });
        }
      }
    });
  }
};

/**
 * Validate a complete recipient structure
 * @param {Object} recipient - The recipient to validate
 * @param {string} recipientId - The recipient ID for context
 */
export const validateRecipient = (recipient, recipientId, categoriesById = null) => {
  const context = `in recipient "${recipientId}"`;

  assertSafeIdentifier(recipientId, 'recipientId');
  assertExists(recipient, 'recipient', context);
  assertObject(recipient, 'recipient', context);

  assertExists(recipient.name, 'name', context);
  assertObject(recipient.categories, 'categories', context);

  const categoryEntries = Object.entries(recipient.categories);
  if (categoryEntries.length === 0) {
    throw new Error(`Recipient ${context} must have at least one category`);
  }

  let totalFraction = 0;
  categoryEntries.forEach(([categoryId, categoryData], index) => {
    const baseCategory =
      categoriesById && Object.hasOwn(categoriesById, categoryId) ? categoriesById[categoryId] : null;
    validateRecipientCategory({ id: categoryId, ...categoryData }, recipientId, index, baseCategory);
    totalFraction += categoryData.fraction;
  });

  // Check fraction normalization
  if (Math.abs(totalFraction - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category fractions for recipient "${recipientId}" do not sum to 1 (total: ${totalFraction})`);
  }
};

/**
 * No-op function that crashes loudly instead of returning fallback values
 * Use this to replace any silent fallback patterns in the codebase
 * @param {string} message - Error message describing what was expected
 */
export const crashInsteadOfFallback = (message) => {
  throw new Error(`SILENT FAILURE PREVENTED: ${message}`);
};
