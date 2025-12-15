/**
 * Shared validation utilities for effect fields
 */

import { getEffectFieldNames } from '../constants/effectFieldDefinitions';

/**
 * Detect the type of an effect based on its fields
 */
export const getEffectType = (effect) => {
  if (!effect) return 'unknown';
  if (effect.costPerQALY !== undefined) return 'qaly';
  if (effect.costPerMicroprobability !== undefined) return 'population';
  return 'unknown';
};

/**
 * Check if a value is a partial input state (user is still typing)
 */
export const isPartialInput = (value) => {
  return value === '' || value === '-' || value === '.' || value === '-.';
};

/**
 * Clean and parse a value that might be a formatted string
 * @param {string|number} value - The value to clean and parse
 * @returns {Object} Object with cleanValue (string) and numValue (number)
 */
export const cleanAndParseValue = (value) => {
  // If already a number, return it
  if (typeof value === 'number') {
    return { cleanValue: value, numValue: value };
  }

  // Clean the string (remove commas and dollar signs)
  const cleanValue = value.replace(/[,$]/g, '');

  // Check if the entire cleaned value is a valid number format
  // This regex allows: integers, decimals, negative numbers, and scientific notation
  const validNumberPattern = /^-?(\d+\.?\d*|\d*\.?\d+)([eE][+-]?\d+)?$/;

  if (!validNumberPattern.test(cleanValue) && !isPartialInput(cleanValue)) {
    // Return NaN for invalid formats like "10550000dff"
    return { cleanValue, numValue: NaN };
  }

  const numValue = parseFloat(cleanValue);

  return { cleanValue, numValue };
};

/**
 * Validate a single effect field
 * @param {string} fieldName - The name of the field being validated
 * @param {any} value - The value to validate
 * @param {string} effectType - The type of effect ('qaly' or 'population')
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validateEffectField = (fieldName, value, effectType) => {
  // Common validations for all effect types
  if (fieldName === 'startTime') {
    const { cleanValue, numValue } = cleanAndParseValue(value);
    if (isPartialInput(cleanValue)) {
      return 'Start time is required';
    }
    if (isNaN(numValue) || numValue < 0) {
      return 'Start time must be non-negative';
    }
  }

  if (fieldName === 'windowLength') {
    const { cleanValue, numValue } = cleanAndParseValue(value);
    if (isPartialInput(cleanValue)) {
      return 'Duration is required';
    }
    if (isNaN(numValue) || numValue <= 0) {
      return 'Duration must be positive';
    }
  }

  // QALY-specific validations
  if (effectType === 'qaly' && fieldName === 'costPerQALY') {
    const { cleanValue, numValue } = cleanAndParseValue(value);
    if (isPartialInput(cleanValue)) {
      return 'Cost per QALY is required';
    }
    if (isNaN(numValue)) {
      return 'Cost per QALY must be a valid number';
    }
    if (numValue === 0) {
      return 'Cost per QALY cannot be zero';
    }
  }

  // Population-specific validations
  if (effectType === 'population') {
    if (fieldName === 'costPerMicroprobability') {
      const { cleanValue, numValue } = cleanAndParseValue(value);
      if (isPartialInput(cleanValue)) {
        return 'Cost per microprobability is required';
      }
      if (isNaN(numValue)) {
        return 'Cost per microprobability must be a valid number';
      }
      if (numValue === 0) {
        return 'Cost per microprobability cannot be zero';
      }
    }

    if (fieldName === 'populationFractionAffected') {
      const { cleanValue, numValue } = cleanAndParseValue(value);
      if (isPartialInput(cleanValue)) {
        return 'Population fraction is required';
      }
      if (isNaN(numValue)) {
        return 'Population fraction must be a valid number';
      }
      if (numValue <= 0 || numValue > 1) {
        return 'Population fraction must be between 0 and 1';
      }
    }

    if (fieldName === 'qalyImprovementPerYear') {
      const { cleanValue, numValue } = cleanAndParseValue(value);
      if (isPartialInput(cleanValue)) {
        return 'QALY improvement is required';
      }
      if (isNaN(numValue)) {
        return 'QALY improvement must be a valid number';
      }
      if (numValue === 0) {
        return 'QALY improvement cannot be zero';
      }
    }
  }

  return null; // No error
};

/**
 * Validate a time interval
 * @param {Array} interval - The time interval [startYear, endYear]
 * @param {string} effectId - The effect ID for error messages
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validateTimeInterval = (interval, effectId) => {
  if (!interval) return null; // Optional field

  if (!Array.isArray(interval) || interval.length !== 2) {
    return `Effect ${effectId}: validTimeInterval must be [startYear, endYear]`;
  }

  const [start, end] = interval;

  // Start year can be null (meaning "from the beginning of time")
  if (start !== null && !Number.isInteger(start)) {
    return `Effect ${effectId}: Start year must be null or an integer, got ${start}`;
  }

  // End year can be null (meaning "to the present/future")
  if (end !== null && !Number.isInteger(end)) {
    return `Effect ${effectId}: End year must be null or an integer, got ${end}`;
  }

  // If both are specified, end must be >= start
  if (start !== null && end !== null && end < start) {
    return `Effect ${effectId}: End year (${end}) must be >= start year (${start})`;
  }

  return null;
};

/**
 * Validate all fields of an effect
 * @param {Object} effect - The effect object to validate
 * @param {number} effectIndex - The index of this effect (for error keys)
 * @returns {Object} Object with errors (keyed by field) and isValid boolean
 */
export const validateEffect = (effect, effectIndex = 0) => {
  const errors = {};
  const effectType = getEffectType(effect);

  // Get all fields that need validation based on effect type
  const fieldsFromSchema = getEffectFieldNames(effect);
  const fieldsToValidate = fieldsFromSchema.length > 0 ? fieldsFromSchema : ['startTime', 'windowLength'];

  // Validate each field
  fieldsToValidate.forEach((fieldName) => {
    const error = validateEffectField(fieldName, effect[fieldName], effectType);
    if (error) {
      errors[`${effectIndex}-${fieldName}`] = error;
    }
  });

  // Validate time interval if present
  if (effect.validTimeInterval) {
    const intervalError = validateTimeInterval(effect.validTimeInterval, effect.effectId || `effect-${effectIndex}`);
    if (intervalError) {
      errors[`${effectIndex}-interval`] = intervalError;
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validate multiple effects
 * @param {Array} effects - Array of effect objects
 * @returns {Object} Object with combined errors and isValid boolean
 */
export const validateEffects = (effects) => {
  let allErrors = {};
  let isValid = true;

  effects.forEach((effect, index) => {
    const validation = validateEffect(effect, index);
    allErrors = { ...allErrors, ...validation.errors };
    if (!validation.isValid) {
      isValid = false;
    }
  });

  return { errors: allErrors, isValid };
};

/**
 * Validate a single global parameter field
 * @param {string} fieldName - The name of the field being validated
 * @param {any} value - The value to validate
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validateGlobalField = (fieldName, value) => {
  // Use cleanAndParseValue to properly validate the entire string
  const { cleanValue, numValue } = cleanAndParseValue(value);

  // Allow partial inputs during typing
  if (isPartialInput(cleanValue)) {
    return null; // Don't show error for partial inputs
  }

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return 'Invalid number';
  }

  // Parameter-specific validations
  if (fieldName === 'discountRate') {
    // Discount rate cannot be negative and must be no greater than 100%
    // Note: numValue is already in decimal form (0.1 = 10%)
    if (numValue < 0) {
      return 'Discount rate cannot be negative';
    }
    if (numValue > 1) {
      return 'Discount rate must be no greater than 100%';
    }
  } else if (fieldName === 'populationGrowthRate') {
    // Population growth rate cannot be -100% or less (would cause immediate collapse)
    // Note: numValue is already in decimal form (-1 = -100%)
    if (numValue <= -1) {
      return 'Population growth rate cannot be -100% or less';
    }
  } else if (fieldName === 'timeLimit') {
    if (numValue <= 0) {
      return 'Time limit must be positive';
    }
  } else if (fieldName === 'populationLimit') {
    if (numValue <= 0) {
      return 'Population limit must be positive';
    }
  } else if (fieldName === 'currentPopulation') {
    if (numValue <= 0) {
      return 'Current population must be positive';
    }
  } else if (fieldName === 'yearsPerLife') {
    if (numValue <= 0) {
      return 'Years per life must be positive';
    }
  }

  return null; // No error
};

/**
 * Validate a recipient effect field (override or multiplier)
 * @param {string} fieldName - The name of the field being validated
 * @param {any} value - The value to validate
 * @param {string} type - 'override' or 'multiplier'
 * @param {string} effectType - 'qaly' or 'population'
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validateRecipientEffectField = (fieldName, value, type, effectType) => {
  // Use cleanAndParseValue to properly validate the entire string
  const { cleanValue, numValue } = cleanAndParseValue(value);

  // Allow partial inputs during typing
  if (isPartialInput(cleanValue)) {
    return null; // Don't show error for partial inputs
  }

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return 'Invalid number';
  }

  // For multipliers, value cannot be zero
  if (type === 'multiplier') {
    if (numValue === 0) {
      return 'Multiplier cannot be zero';
    }

    // Additional validation for fields that must remain positive after multiplication
    if (
      (fieldName === 'windowLength' || fieldName === 'startTime' || fieldName === 'populationFractionAffected') &&
      numValue < 0
    ) {
      return `Multiplier for ${fieldName} cannot be negative`;
    }
  }

  // For overrides, use the same validation as regular effect fields
  if (type === 'override') {
    return validateEffectField(fieldName, value, effectType);
  }

  return null; // No error
};

/**
 * Validate all recipient effects for a category
 * @param {Array} effects - Array of effect objects with overrides/multipliers
 * @returns {Object} Object with combined errors and isValid boolean
 */
export const validateRecipientEffects = (effects) => {
  let allErrors = {};
  let isValid = true;

  effects.forEach((effect, index) => {
    // Validate overrides
    if (effect.overrides) {
      Object.entries(effect.overrides).forEach(([fieldName, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          const effectType = effect.costPerQALY !== undefined ? 'qaly' : 'population';
          const error = validateRecipientEffectField(fieldName, value, 'override', effectType);
          if (error) {
            allErrors[`${index}-${fieldName}-override`] = error;
            isValid = false;
          }
        }
      });
    }

    // Validate multipliers
    if (effect.multipliers) {
      Object.entries(effect.multipliers).forEach(([fieldName, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          const effectType = effect.costPerQALY !== undefined ? 'qaly' : 'population';
          const error = validateRecipientEffectField(fieldName, value, 'multiplier', effectType);
          if (error) {
            allErrors[`${index}-${fieldName}-multiplier`] = error;
            isValid = false;
          }
        }
      });
    }

    // Check that no field has both override and multiplier
    if (effect.overrides && effect.multipliers) {
      Object.keys(effect.overrides).forEach((fieldName) => {
        if (
          effect.multipliers[fieldName] !== null &&
          effect.multipliers[fieldName] !== undefined &&
          effect.multipliers[fieldName] !== ''
        ) {
          allErrors[`${index}-${fieldName}-conflict`] = `Cannot have both override and multiplier for ${fieldName}`;
          isValid = false;
        }
      });
    }
  });

  return { errors: allErrors, isValid };
};
