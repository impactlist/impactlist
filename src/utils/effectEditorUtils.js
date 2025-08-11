import { cleanAndParseValue } from './effectValidation';
import { effectToCostPerLife } from './effectsCalculation';
import { getEffectType } from './effectValidation';

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
 * @returns {number} Cost per life or Infinity if invalid
 */
export const calculateEffectCostPerLife = (effect, globalParameters) => {
  try {
    const cleanedEffect = cleanEffectForCalculation(effect);

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

    return effectToCostPerLife(cleanedEffect, globalParameters);
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
