import { cleanAndParseValue, getEffectType, isPartialInput } from './effectValidation';
import { effectToCostPerLife } from './effectsCalculation';
import { getEffectFieldNames } from '../constants/effectFieldDefinitions';

/**
 * Parse a formatted number string (with commas) to a float
 * @param {string|number} value - Value to parse
 * @returns {number} Parsed number or NaN if invalid
 */
export const parseFormattedNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return NaN;
  }
  return parseFloat(String(value).replace(/,/g, ''));
};

/**
 * Check if an effect window exceeds the global time limit
 * @param {string|number} startTime - Start time value (may be formatted with commas)
 * @param {string|number} windowLength - Window length value (may be formatted with commas)
 * @param {number} timeLimit - Global time limit
 * @returns {boolean} True if the window exceeds the time limit
 */
export const checkWindowExceedsTimeLimit = (startTime, windowLength, timeLimit) => {
  if (!timeLimit) return false;

  const parsedStartTime = parseFormattedNumber(startTime);
  const parsedWindowLength = parseFormattedNumber(windowLength);

  if (isNaN(parsedStartTime) || isNaN(parsedWindowLength)) {
    return false;
  }

  return parsedStartTime + parsedWindowLength > timeLimit;
};

/**
 * Clean and convert effect fields from strings to numbers for calculation
 * @param {Object} effect - Effect with potentially string values
 * @returns {Object} Effect with numeric values
 */
export const cleanEffectForCalculation = (effect) => {
  const cleanedEffect = { ...effect };
  Object.keys(cleanedEffect).forEach((key) => {
    if (typeof cleanedEffect[key] === 'string' && key !== 'effectId') {
      const { cleanValue, numValue } = cleanAndParseValue(cleanedEffect[key]);
      // For display calculation, allow partial inputs
      if (cleanValue === '' || cleanValue === '-' || cleanValue === '.' || cleanValue === '-.') {
        cleanedEffect[key] = 0; // Use 0 for partial inputs in calculation
      } else if (!isNaN(numValue)) {
        cleanedEffect[key] = numValue;
      }
    }
  });
  return cleanedEffect;
};

/**
 * Calculate cost per life for a single effect, handling errors gracefully
 * @param {Object} effect - The effect to calculate
 * @param {Object} globalParameters - Global parameters for calculation
 * @param {number} previewYear - Year to preview calculations for (required)
 * @returns {number} Cost per life or Infinity if invalid
 */
export const calculateEffectCostPerLife = (effect, globalParameters, previewYear) => {
  // Enforce year requirement
  if (typeof previewYear !== 'number' || !Number.isInteger(previewYear)) {
    throw new Error('previewYear must be an integer for calculateEffectCostPerLife');
  }

  // Check if effect is disabled
  if (effect.disabled) {
    return Infinity;
  }

  try {
    const cleanedEffect = cleanEffectForCalculation(effect);

    // Check if effect is applicable to preview year
    if (effect.validTimeInterval) {
      const [start, end] = effect.validTimeInterval;
      // null start means "from beginning of time"
      if (start !== null && previewYear < start) return Infinity;
      // null end means "to present/future"
      if (end !== null && previewYear > end) return Infinity;
    }

    // Check for invalid values that would cause calculation errors
    const effectType = getEffectType(cleanedEffect);
    if (effectType === 'qaly' && (cleanedEffect.costPerQALY === 0 || cleanedEffect.costPerQALY === undefined)) {
      return Infinity;
    }
    if (
      effectType === 'population' &&
      (cleanedEffect.costPerMicroprobability === 0 || cleanedEffect.costPerMicroprobability === undefined)
    ) {
      return Infinity;
    }

    return effectToCostPerLife(cleanedEffect, globalParameters, previewYear);
  } catch {
    // During editing, return Infinity for invalid calculations
    return Infinity;
  }
};

/**
 * Clean effects for saving by converting string values to numbers
 * @param {Object[]} effects - Array of effects to clean
 * @returns {Object[]} Cleaned effects ready for saving
 * @throws {Error} If conversion fails
 */
export const cleanEffectsForSave = (effects) => {
  return effects.map((effect, effectIndex) => {
    const cleanedEffect = { ...effect };
    Object.keys(cleanedEffect).forEach((key) => {
      if (typeof cleanedEffect[key] === 'string' && key !== 'effectId') {
        const { numValue } = cleanAndParseValue(cleanedEffect[key]);

        if (isNaN(numValue)) {
          throw new Error(
            `Failed to convert ${key} to number in effect ${effectIndex}. Value: "${cleanedEffect[key]}"`
          );
        }

        cleanedEffect[key] = numValue;
      }
    });
    return cleanedEffect;
  });
};

/**
 * Format cost per life for display
 * @param {number} cost - Cost value
 * @param {boolean} showInfinity - Whether to show infinity symbol
 * @returns {string} Formatted cost string
 */
export const formatCostForDisplay = (cost, showInfinity = true) => {
  if (cost === Infinity) {
    return showInfinity ? '∞' : 'Invalid';
  }
  return new Intl.NumberFormat('en-US').format(Math.round(cost));
};

/**
 * Sorts effects by active date (latest to earliest), with standard effects before population effects
 * for effects that end in the same year.
 *
 * @param {Array} effects - Array of effect objects
 * @returns {Array} - Sorted array (new array, doesn't mutate original)
 */
export const sortEffectsByActiveDate = (effects) => {
  return [...effects].sort((a, b) => {
    // Get validTimeInterval from effect or its _baseEffect (for recipient effects)
    const aInterval = a.validTimeInterval || a._baseEffect?.validTimeInterval;
    const bInterval = b.validTimeInterval || b._baseEffect?.validTimeInterval;

    // Get end years (null means currently active)
    const aEnd = aInterval?.[1] ?? null;
    const bEnd = bInterval?.[1] ?? null;

    // Currently active (null end) comes first
    if (aEnd === null && bEnd !== null) return -1;
    if (aEnd !== null && bEnd === null) return 1;

    // Both have end dates - sort by descending year (later years first)
    if (aEnd !== null && bEnd !== null && aEnd !== bEnd) {
      return bEnd - aEnd;
    }

    // Same end date (or both null/currently active) - secondary sort by effect type
    // Standard (qaly) effects before population effects
    const aType = getEffectType(a._baseEffect || a);
    const bType = getEffectType(b._baseEffect || b);

    if (aType === 'qaly' && bType === 'population') return -1;
    if (aType === 'population' && bType === 'qaly') return 1;

    // Same type and same end date, maintain original order
    return 0;
  });
};

const hasValue = (value) => {
  return value !== undefined && value !== null && value !== '';
};

export const buildRecipientEditableEffects = ({
  baseCategoryEffects = [],
  defaultRecipientEffects = [],
  userRecipientEffects = [],
}) => {
  const initialEffects = baseCategoryEffects.map((effect) => {
    const defaultRecipientEffect = defaultRecipientEffects.find((item) => item.effectId === effect.effectId);
    const userEffect = userRecipientEffects?.find((item) => item.effectId === effect.effectId);

    let effectOverrides = {};
    let effectMultipliers = {};

    if (defaultRecipientEffect?.overrides) {
      effectOverrides = { ...defaultRecipientEffect.overrides };
    }
    if (defaultRecipientEffect?.multipliers) {
      effectMultipliers = { ...defaultRecipientEffect.multipliers };
    }

    if (userEffect) {
      if (userEffect.overrides) {
        Object.keys(userEffect.overrides).forEach((field) => {
          effectOverrides[field] = userEffect.overrides[field];
          delete effectMultipliers[field];
        });
      }
      if (userEffect.multipliers) {
        Object.keys(userEffect.multipliers).forEach((field) => {
          effectMultipliers[field] = userEffect.multipliers[field];
          delete effectOverrides[field];
        });
      }
    }

    return {
      effectId: effect.effectId,
      overrides: effectOverrides,
      multipliers: effectMultipliers,
      disabled: userEffect?.disabled || defaultRecipientEffect?.disabled || false,
      _baseEffect: effect,
      _defaultRecipientEffect: defaultRecipientEffect,
      _userEffect: userEffect,
    };
  });

  return sortEffectsByActiveDate(initialEffects);
};

export const initializeRecipientFieldModes = (effects) => {
  const modes = {};
  effects.forEach((effect, effectIndex) => {
    const fieldNames = getEffectFieldNames(effect._baseEffect);
    fieldNames.forEach((fieldName) => {
      const modeKey = `${effectIndex}-${fieldName}`;
      if (effect.overrides && hasValue(effect.overrides[fieldName])) {
        modes[modeKey] = 'override';
      } else if (effect.multipliers && hasValue(effect.multipliers[fieldName])) {
        modes[modeKey] = 'multiplier';
      } else {
        modes[modeKey] = 'override';
      }
    });
  });

  return modes;
};

const normalizeEffectValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeEffectValue(item));
  }

  if (value && typeof value === 'object') {
    const normalized = {};
    Object.keys(value)
      .filter((key) => !key.startsWith('_') && value[key] !== undefined)
      .sort()
      .forEach((key) => {
        normalized[key] = normalizeEffectValue(value[key]);
      });
    return normalized;
  }

  if (typeof value === 'string') {
    const { cleanValue, numValue } = cleanAndParseValue(value);
    if (isPartialInput(cleanValue)) {
      return cleanValue;
    }
    if (!isNaN(numValue)) {
      return numValue;
    }
    return cleanValue;
  }

  return value;
};

export const getEffectsSignature = (effects) => {
  if (!effects) return '';
  const normalized = effects.map((effect) => normalizeEffectValue(effect));
  return JSON.stringify(normalized);
};

export const haveEffectsChanged = (currentEffects, baselineEffects) => {
  return getEffectsSignature(currentEffects) !== getEffectsSignature(baselineEffects);
};

export const isMeaningfullyDifferent = (currentValue, defaultValue) => {
  if (
    (currentValue === null || currentValue === undefined || currentValue === '') &&
    (defaultValue === null || defaultValue === undefined || defaultValue === '')
  ) {
    return false;
  }

  if (
    currentValue === null ||
    currentValue === undefined ||
    currentValue === '' ||
    defaultValue === null ||
    defaultValue === undefined ||
    defaultValue === ''
  ) {
    return true;
  }

  const { cleanValue: currentClean, numValue: currentNum } = cleanAndParseValue(currentValue);
  const { cleanValue: defaultClean, numValue: defaultNum } = cleanAndParseValue(defaultValue);

  if (isPartialInput(currentClean) || isPartialInput(defaultClean)) {
    return currentClean !== defaultClean;
  }

  if (isNaN(currentNum) || isNaN(defaultNum)) {
    return currentClean !== defaultClean;
  }

  return Math.abs(currentNum - defaultNum) >= 0.0001;
};

export const getRecipientEffectsChangeState = (effects, fieldModes, options = {}) => {
  const { throwOnInvalid = true, includeUserClearings = true } = options;

  if (!effects || effects.length === 0) {
    return { effectsToSave: [], hasUnsavedChanges: false };
  }

  const effectsToSave = [];
  let hasUnsavedChanges = false;

  effects.forEach((effect, effectIndex) => {
    const cleanEffect = {
      effectId: effect.effectId,
      overrides: {},
      multipliers: {},
      disabled: effect.disabled || false,
    };

    const fieldNames = getEffectFieldNames(effect._baseEffect);
    const defaultRecipientEffect = effect._defaultRecipientEffect;
    const userEffect = effect._userEffect;

    const defaultDisabled = defaultRecipientEffect?.disabled || false;
    const currentDisabled = effect.disabled || false;
    const disabledDiffersFromDefault = currentDisabled !== defaultDisabled;

    const userDisabled = userEffect?.disabled;
    const userHadDisabledOverride = userDisabled !== undefined;
    const disabledNeedsClearing =
      includeUserClearings && userHadDisabledOverride && currentDisabled === defaultDisabled;

    let needsClearing = disabledNeedsClearing;
    let effectHasChanges = disabledDiffersFromDefault || needsClearing;

    fieldNames.forEach((fieldName) => {
      const modeKey = `${effectIndex}-${fieldName}`;
      const selectedMode = fieldModes?.[modeKey] || 'override';

      const currentValue =
        selectedMode === 'override' ? effect.overrides?.[fieldName] : effect.multipliers?.[fieldName];

      const defaultValue =
        selectedMode === 'override'
          ? defaultRecipientEffect?.overrides?.[fieldName]
          : defaultRecipientEffect?.multipliers?.[fieldName];

      const userHadOverride =
        userEffect?.overrides?.[fieldName] !== undefined && userEffect?.overrides?.[fieldName] !== null;
      const userHadMultiplier =
        userEffect?.multipliers?.[fieldName] !== undefined && userEffect?.multipliers?.[fieldName] !== null;
      const userHadCustomValue = selectedMode === 'override' ? userHadOverride : userHadMultiplier;

      if (isMeaningfullyDifferent(currentValue, defaultValue)) {
        effectHasChanges = true;
        if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
          const { numValue } = cleanAndParseValue(currentValue);
          if (isNaN(numValue)) {
            if (throwOnInvalid) {
              throw new Error(
                `Failed to convert ${selectedMode} ${fieldName} to number in effect ${effect.effectId}. Value: "${currentValue}"`
              );
            }
            return;
          }

          if (selectedMode === 'override') {
            cleanEffect.overrides[fieldName] = numValue;
          } else {
            cleanEffect.multipliers[fieldName] = numValue;
          }
        } else if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
          needsClearing = true;
        }
      } else if (
        includeUserClearings &&
        userHadCustomValue &&
        (currentValue === null || currentValue === undefined || currentValue === '')
      ) {
        needsClearing = true;
        effectHasChanges = true;
      }
    });

    if (
      Object.keys(cleanEffect.overrides).length > 0 ||
      Object.keys(cleanEffect.multipliers).length > 0 ||
      disabledDiffersFromDefault ||
      needsClearing
    ) {
      if (!disabledDiffersFromDefault) {
        delete cleanEffect.disabled;
      }
      effectsToSave.push(cleanEffect);
      effectHasChanges = true;
    }

    if (effectHasChanges) {
      hasUnsavedChanges = true;
    }
  });

  return { effectsToSave, hasUnsavedChanges };
};
