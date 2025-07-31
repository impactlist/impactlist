// Data validation utilities to prevent silent failures
// All functions in this module should crash loudly when expected data is missing

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
 * Assert that a value is a number and not NaN
 * @param {*} value - The value to check
 * @param {string} fieldName - The name of the field for error messages
 * @param {string} context - Additional context for the error
 */
export const assertNumber = (value, fieldName, context = '') => {
  assertExists(value, fieldName, context);
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(
      `Field ${fieldName} must be a valid number${context ? ` ${context}` : ''}, got: ${value} (type: ${typeof value})`
    );
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
  assertExists(effect.effectId, 'effectId', context);
  assertNumber(effect.startTime, 'startTime', context);
  assertNumber(effect.windowLength, 'windowLength', context);

  // Must have either costPerQALY or costPerMicroprobability
  const hasCostPerQALY = effect.costPerQALY !== undefined;
  const hasCostPerMicroprobability = effect.costPerMicroprobability !== undefined;

  if (!hasCostPerQALY && !hasCostPerMicroprobability) {
    throw new Error(`Effect ${context} must have either costPerQALY or costPerMicroprobability`);
  }

  if (hasCostPerQALY) {
    const value = assertNumber(effect.costPerQALY, 'costPerQALY', context);
    if (value === 0) {
      throw new Error(`Field costPerQALY ${context} cannot be 0`);
    }
  }

  if (hasCostPerMicroprobability) {
    const value = assertNumber(effect.costPerMicroprobability, 'costPerMicroprobability', context);
    if (value === 0) {
      throw new Error(`Field costPerMicroprobability ${context} cannot be 0`);
    }
    assertPositiveNumber(effect.populationFractionAffected, 'populationFractionAffected', context);
    const qalyImprovement = assertNumber(effect.qalyImprovementPerYear, 'qalyImprovementPerYear', context);
    if (qalyImprovement === 0) {
      throw new Error(`Field qalyImprovementPerYear ${context} cannot be 0`);
    }
  }
};

/**
 * Validate a complete category structure
 * @param {Object} category - The category to validate
 * @param {string} categoryId - The category ID for context
 */
export const validateCategory = (category, categoryId) => {
  const context = `in category "${categoryId}"`;

  assertExists(category, 'category', context);
  assertObject(category, 'category', context);

  assertExists(category.name, 'name', context);
  assertNonEmptyArray(category.effects, 'effects', context);

  category.effects.forEach((effect, index) => {
    validateCategoryEffect(effect, categoryId, index);
  });
};

/**
 * Validate a recipient category reference
 * @param {Object} categoryRef - The category reference to validate
 * @param {string} recipientId - The recipient ID for context
 * @param {number} index - The category index for context
 */
export const validateRecipientCategory = (categoryRef, recipientId, index) => {
  const context = `in recipient "${recipientId}" category #${index + 1}`;

  assertExists(categoryRef, 'category', context);
  assertObject(categoryRef, 'category', context);

  assertExists(categoryRef.id, 'id', context);

  const fraction = assertNumber(categoryRef.fraction, 'fraction', context);
  if (fraction <= 0 || fraction > 1) {
    throw new Error(`Field fraction ${context} must be between 0 and 1, got: ${fraction}`);
  }

  // Validate effects if present
  if (categoryRef.effects) {
    assertArray(categoryRef.effects, 'effects', context);
    categoryRef.effects.forEach((effect, effectIndex) => {
      const effectContext = `${context} effect #${effectIndex + 1}`;
      assertExists(effect.effectId, 'effectId', effectContext);

      // Must have either overrides or multipliers
      const hasOverrides = effect.overrides && typeof effect.overrides === 'object';
      const hasMultipliers = effect.multipliers && typeof effect.multipliers === 'object';

      if (!hasOverrides && !hasMultipliers) {
        throw new Error(`Effect ${effectContext} must have either overrides or multipliers object`);
      }
    });
  }
};

/**
 * Validate a complete recipient structure
 * @param {Object} recipient - The recipient to validate
 * @param {string} recipientId - The recipient ID for context
 */
export const validateRecipient = (recipient, recipientId) => {
  const context = `in recipient "${recipientId}"`;

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
    validateRecipientCategory({ id: categoryId, ...categoryData }, recipientId, index);
    totalFraction += categoryData.fraction;
  });

  // Check fraction normalization
  const WEIGHT_NORMALIZATION_TOLERANCE = 0.001;
  if (Math.abs(totalFraction - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category fractions for recipient "${recipientId}" do not sum to 1 (total: ${totalFraction})`);
  }
};

/**
 * Validate global parameters structure
 * @param {Object} globalParams - The global parameters object
 */
export const validateGlobalParameters = (globalParams) => {
  assertExists(globalParams, 'globalParameters');
  assertObject(globalParams, 'globalParameters');

  // Parameters that must be positive (> 0)
  assertPositiveNumber(globalParams.currentPopulation, 'currentPopulation', 'in globalParameters');
  assertPositiveNumber(globalParams.yearsPerLife, 'yearsPerLife', 'in globalParameters');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParameters');

  // Parameters that must be non-negative (>= 0)
  assertNumber(globalParams.populationLimit, 'populationLimit', 'in globalParameters');
  if (globalParams.populationLimit < 0) {
    throw new Error(
      'Field populationLimit in globalParameters must be non-negative, got: ' + globalParams.populationLimit
    );
  }

  // Parameters that can be any number (including negative)
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParameters');
  assertNumber(globalParams.populationGrowthRate, 'populationGrowthRate', 'in globalParameters');
};

/**
 * No-op function that crashes loudly instead of returning fallback values
 * Use this to replace any silent fallback patterns in the codebase
 * @param {string} message - Error message describing what was expected
 */
export const crashInsteadOfFallback = (message) => {
  throw new Error(`SILENT FAILURE PREVENTED: ${message}`);
};
