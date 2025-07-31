// Effects-based calculation utilities
// Converts the new effects data structure to cost-per-life calculations
import {
  assertExists,
  assertNumber,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonEmptyArray,
  validateCategory,
} from './dataValidation';

/**
 * Calculate the sum of a discounted geometric series from year start to year end
 * Sum from t=start to t=end-1 of 1/(1+r)^t
 * @param {number} discountRate - Annual discount rate (e.g., 0.02 for 2%)
 * @param {number} start - Start year (inclusive)
 * @param {number} end - End year (exclusive)
 * @returns {number} Sum of discounted values
 */
const calculateDiscountedSum = (discountRate, start, end) => {
  if (start >= end) return 0;

  // For the sum from t=start to t=end-1 of (1/(1+r))^t
  // This equals (1/(1+r))^start * (1 - (1/(1+r))^(end-start)) / (1 - 1/(1+r))
  // Which simplifies to: (1/(1+r))^start * (1 - (1/(1+r))^(end-start)) / (r/(1+r))

  const discountFactor = 1 / (1 + discountRate);
  const startDiscount = Math.pow(discountFactor, start);
  const periodDiscount = 1 - Math.pow(discountFactor, end - start);

  // Handle the case where discount rate is effectively zero
  if (Math.abs(discountRate) < 1e-10) {
    return end - start;
  }

  return (startDiscount * periodDiscount) / (discountRate / (1 + discountRate));
};

/**
 * Convert a QALY-based effect to cost per life
 * @param {Object} effect - The effect with costPerQALY
 * @param {Object} globalParams - Global parameters object
 * @returns {number} Cost per life
 */
const qalyEffectToCostPerLife = (effect, globalParams) => {
  assertExists(effect, 'effect');
  assertNonZeroNumber(effect.costPerQALY, 'costPerQALY', 'in QALY effect');
  assertExists(effect.startTime, 'startTime', 'in QALY effect');
  assertPositiveNumber(effect.windowLength, 'windowLength', 'in QALY effect');

  // Get global parameters
  assertExists(globalParams, 'globalParams');
  assertPositiveNumber(globalParams.yearsPerLife, 'yearsPerLife', 'in globalParams');
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');

  const startYear = effect.startTime;
  const endYear = Math.min(startYear + effect.windowLength, globalParams.timeLimit);

  // Calculate discounted sum for this time window
  const discountedYears = calculateDiscountedSum(globalParams.discountRate, startYear, endYear);

  // Average QALYs per life, considering discounting over the effect window
  const avgLifeYears = globalParams.yearsPerLife;
  const qalyPerLife = avgLifeYears * 1.0;

  // Adjust cost per QALY for the discounted time window
  // If we save 1 QALY per year for discountedYears, that's discountedYears QALYs total
  // So the effective cost per life is costPerQALY * qalyPerLife / discountedYears * (endYear - startYear)
  // This accounts for the fact that we're only applying the effect during a specific time window
  const timeWindowAdjustment = (endYear - startYear) / discountedYears;

  return effect.costPerQALY * qalyPerLife * timeWindowAdjustment;
};

/**
 * Convert a population-based effect to cost per life
 * @param {Object} effect - The effect with costPerMicroprobability and population data
 * @param {Object} globalParams - Global parameters object
 * @returns {number} Cost per life
 */
const populationEffectToCostPerLife = (effect, globalParams) => {
  assertExists(effect, 'effect');
  assertNonZeroNumber(effect.costPerMicroprobability, 'costPerMicroprobability', 'in population effect');
  assertPositiveNumber(effect.populationFractionImpacted, 'populationFractionImpacted', 'in population effect');
  assertNonZeroNumber(effect.rawQALYImprovementPerYear, 'rawQALYImprovementPerYear', 'in population effect');
  assertExists(effect.startTime, 'startTime', 'in population effect');
  assertPositiveNumber(effect.windowLength, 'windowLength', 'in population effect');

  // Get global parameters
  assertExists(globalParams, 'globalParams');
  assertPositiveNumber(globalParams.currentPopulation, 'currentPopulation', 'in globalParams');
  assertPositiveNumber(globalParams.populationGrowthRate, 'populationGrowthRate', 'in globalParams');
  assertPositiveNumber(globalParams.populationLimit, 'populationLimit', 'in globalParams');
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');
  assertPositiveNumber(globalParams.yearsPerLife, 'yearsPerLife', 'in globalParams');

  const startYear = effect.startTime;
  const endYear = Math.min(startYear + effect.windowLength, globalParams.timeLimit);
  const populationLimitActual = globalParams.populationLimit * 1e9; // Convert billions to actual number

  // Calculate total QALYs using closed-form solution
  const g = globalParams.populationGrowthRate;
  const r = globalParams.discountRate;
  const P0 = globalParams.currentPopulation;
  const fraction = effect.populationFractionImpacted;
  const qalyPerYear = effect.rawQALYImprovementPerYear;

  let totalQALYs;

  // Check if we hit population limit
  const yearToHitLimit = g > 0 ? Math.log(populationLimitActual / P0) / Math.log(1 + g) : Infinity;

  if (yearToHitLimit >= endYear) {
    // Population doesn't hit limit during the effect window
    // Sum from year=startYear to year=endYear-1 of:
    // P0 * (1+g)^year * fraction * qalyPerYear * (1/(1+r))^year
    // = P0 * fraction * qalyPerYear * sum((1+g)/(1+r))^year

    const combinedRate = (1 + g) / (1 + r) - 1;

    if (Math.abs(combinedRate) < 1e-10) {
      // Special case when growth rate equals discount rate
      totalQALYs =
        (P0 * fraction * qalyPerYear * (endYear - startYear) * Math.pow(1 + g, startYear)) / Math.pow(1 + r, startYear);
    } else {
      // General case: geometric series
      const base = (1 + g) / (1 + r);
      const firstTerm = Math.pow(base, startYear);
      const lastTerm = Math.pow(base, endYear);
      totalQALYs = (P0 * fraction * qalyPerYear * (firstTerm - lastTerm)) / (1 - base);
    }
  } else if (yearToHitLimit <= startYear) {
    // Population already at limit for entire effect window
    const discountedSum = calculateDiscountedSum(r, startYear, endYear);
    totalQALYs = populationLimitActual * fraction * qalyPerYear * discountedSum;
  } else {
    // Population hits limit during effect window - need to split calculation
    const limitYear = Math.ceil(yearToHitLimit);

    // Before hitting limit (startYear to limitYear)
    const combinedRate = (1 + g) / (1 + r) - 1;
    let totalBeforeLimit;

    if (Math.abs(combinedRate) < 1e-10) {
      totalBeforeLimit =
        (P0 * fraction * qalyPerYear * (limitYear - startYear) * Math.pow(1 + g, startYear)) /
        Math.pow(1 + r, startYear);
    } else {
      const base = (1 + g) / (1 + r);
      const firstTerm = Math.pow(base, startYear);
      const lastTerm = Math.pow(base, limitYear);
      totalBeforeLimit = (P0 * fraction * qalyPerYear * (firstTerm - lastTerm)) / (1 - base);
    }

    // After hitting limit (limitYear to endYear)
    const discountedSum = calculateDiscountedSum(r, limitYear, endYear);
    const totalAfterLimit = populationLimitActual * fraction * qalyPerYear * discountedSum;

    totalQALYs = totalBeforeLimit + totalAfterLimit;
  }

  // Convert micropropability to probability (1 micropropability = 1/1,000,000)
  const probability = 1 / 1_000_000;

  // Cost per life = cost per micropropability / (probability * total QALYs / average life QALYs)
  const avgLifeQALYs = globalParams.yearsPerLife;
  const livesSavedPerMicroprobability = (probability * totalQALYs) / avgLifeQALYs;

  return effect.costPerMicroprobability / livesSavedPerMicroprobability;
};

/**
 * Convert any effect to cost per life
 * @param {Object} effect - The effect object
 * @param {Object} globalParams - Global parameters object
 * @returns {number} Cost per life
 */
export const effectToCostPerLife = (effect, globalParams) => {
  assertExists(effect, 'effect');
  assertExists(globalParams, 'globalParams');

  if (effect.costPerQALY !== undefined) {
    return qalyEffectToCostPerLife(effect, globalParams);
  } else if (effect.costPerMicroprobability !== undefined) {
    return populationEffectToCostPerLife(effect, globalParams);
  } else {
    throw new Error('Effect must have either costPerQALY or costPerMicroprobability');
  }
};

/**
 * Calculate cost per life from multiple effects with time windows
 * @param {Array} effects - Array of effect objects with time windows
 * @param {string} categoryId - Category ID for context
 * @param {Object} globalParams - Global parameters object
 * @returns {number} Weighted average cost per life
 */
const calculateMultiEffectCostPerLife = (effects, categoryId, globalParams) => {
  assertNonEmptyArray(effects, 'effects', `in category "${categoryId}"`);

  // Get global parameters for discounting
  assertExists(globalParams, 'globalParams');
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');

  const discountRate = globalParams.discountRate;
  const timeLimit = globalParams.timeLimit;

  // Calculate weighted average of already-discounted cost per life values
  let totalWeight = 0;
  let weightedSum = 0;

  effects.forEach((effect) => {
    assertExists(effect.startTime, 'startTime', `in effect ${effect.effectId}`);
    assertPositiveNumber(effect.windowLength, 'windowLength', `in effect ${effect.effectId}`);

    // Get the already-discounted cost per life from the effect
    const costPerLife = effectToCostPerLife(effect, globalParams);

    const startYear = effect.startTime;
    const endYear = Math.min(startYear + effect.windowLength, timeLimit);

    // Weight by the discounted time window
    const weight = calculateDiscountedSum(discountRate, startYear, endYear);

    totalWeight += weight;
    weightedSum += costPerLife * weight;
  });

  // Return weighted average cost per life
  if (totalWeight === 0) {
    throw new Error(`No weight calculated for category "${categoryId}" with multiple effects`);
  }

  return weightedSum / totalWeight;
};

/**
 * Calculate cost per life for a category from its effects
 * @param {Object} category - The category object with effects array
 * @param {string} categoryId - The category ID for context
 * @param {Object} globalParams - Global parameters object
 * @returns {number} Cost per life for the category
 */
export const calculateCategoryBaseCostPerLife = (category, categoryId, globalParams) => {
  validateCategory(category, categoryId);
  assertExists(globalParams, 'globalParams');

  const effects = assertNonEmptyArray(category.effects, 'effects', `in category "${categoryId}"`);

  // Always use the multi-effect calculation to ensure time windows and discounting are applied
  return calculateMultiEffectCostPerLife(effects, categoryId, globalParams);
};

/**
 * Validate that an effect doesn't have both override and multiplier for the same field
 * @param {Object} effect - The effect object to validate
 * @param {string} context - Context for error messages
 */
const validateEffectOverridesMultipliers = (effect, context) => {
  if (!effect.overrides || !effect.multipliers) {
    return; // No conflict possible
  }

  Object.keys(effect.overrides).forEach((field) => {
    if (effect.multipliers[field] !== undefined) {
      throw new Error(`Effect has both override and multiplier for field "${field}" ${context}`);
    }
  });
};

/**
 * Apply multipliers to effect fields and return modified effect
 * @param {Object} baseEffect - The base effect object
 * @param {Object} multipliers - Object containing field multipliers
 * @param {string} context - Context for error messages
 * @returns {Object} New effect with multiplied values
 */
const applyEffectMultipliers = (baseEffect, multipliers, context) => {
  const modifiedEffect = { ...baseEffect };

  Object.entries(multipliers).forEach(([field, multiplier]) => {
    if (baseEffect[field] !== undefined && typeof baseEffect[field] === 'number') {
      const validMultiplier = assertExists(multiplier, `multipliers.${field}`, context);
      modifiedEffect[field] = baseEffect[field] * validMultiplier;
    }
  });

  return modifiedEffect;
};

/**
 * Apply recipient effect modifications to a base effect object
 * @param {Object} baseEffect - The base effect from category
 * @param {Object} recipientEffect - The recipient's effect modification (with overrides/multipliers)
 * @param {string} context - Context for error messages
 * @returns {Object} Modified effect object
 */
export const applyRecipientEffectToBase = (baseEffect, recipientEffect, context) => {
  assertExists(baseEffect, 'baseEffect', context);
  assertExists(recipientEffect, 'recipientEffect', context);

  if (recipientEffect.effectId !== baseEffect.effectId) {
    throw new Error(
      `Effect ID mismatch ${context}: expected "${baseEffect.effectId}", got "${recipientEffect.effectId}"`
    );
  }

  // Validate structure
  validateEffectOverridesMultipliers(recipientEffect, context);

  let result = { ...baseEffect };

  // Apply overrides first
  if (recipientEffect.overrides) {
    result = { ...result, ...recipientEffect.overrides };
  }

  // Apply multipliers
  if (recipientEffect.multipliers) {
    result = applyEffectMultipliers(result, recipientEffect.multipliers, context);
  }

  return result;
};
