// Effects-based calculation utilities
// Converts the new effects data structure to cost-per-life calculations
import {
  assertExists,
  assertNumber,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonNegativeNumber,
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
  assertNonNegativeNumber(effect.startTime, 'startTime', 'in QALY effect');
  assertNonNegativeNumber(effect.windowLength, 'windowLength', 'in QALY effect');

  // Get global parameters
  assertExists(globalParams, 'globalParams');
  assertPositiveNumber(globalParams.yearsPerLife, 'yearsPerLife', 'in globalParams');
  assertNonNegativeNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');

  const startYear = effect.startTime;
  const windowLength = Math.min(effect.windowLength, globalParams.timeLimit - startYear);

  if (startYear >= globalParams.timeLimit || (windowLength === 0 && effect.windowLength !== 0)) {
    // If the window length is 0 but only because of trimming, don't treat it as a pulse.
    return Infinity;
  }

  // We can get the discounted cost per QALY by dividing the raw cost per QALY by a discount factor.
  // The formula we base this on is:
  // discountedQALYs = (amount donated)/(costperQALY) * e^(-discountRate * startTime) * (1 - e^(-discountRate * windowLength))/(discountRate*windowLength)
  // So we need to divide the raw cost per QALY by everything after it in the expression.
  let discountDivisor;
  const r = globalParams.discountRate;
  if (effect.windowLength === 0) {
    // window length of 0 is a special case, meaning an instantaneous pulse
    discountDivisor = Math.exp(-r * startYear);
  } else if (r === 0) {
    discountDivisor = 1;
  } else {
    // Numerically stable fixed-window kernel
    const x = r * windowLength;
    const numerator = -Math.expm1(-x); // 1 - e^(-x) without loss of precision
    discountDivisor = (Math.exp(-r * startYear) * numerator) / x;
  }

  const costPerLife = effect.costPerQALY * globalParams.yearsPerLife;
  return costPerLife / discountDivisor;
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
  assertNonNegativeNumber(effect.startTime, 'startTime', 'in population effect');
  assertNonNegativeNumber(effect.windowLength, 'windowLength', 'in population effect');

  // Get global parameters
  assertExists(globalParams, 'globalParams');
  assertPositiveNumber(globalParams.currentPopulation, 'currentPopulation', 'in globalParams');
  assertNumber(globalParams.populationGrowthRate, 'populationGrowthRate', 'in globalParams');
  assertPositiveNumber(globalParams.populationLimit, 'populationLimit', 'in globalParams');
  assertNonNegativeNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');
  assertPositiveNumber(globalParams.yearsPerLife, 'yearsPerLife', 'in globalParams');

  const startYear = effect.startTime;
  const windowLength = Math.min(effect.windowLength, globalParams.timeLimit - startYear);
  const populationLimitActual = globalParams.populationLimit * 1e9; // Convert billions to actual number

  if (startYear >= globalParams.timeLimit || (windowLength === 0 && effect.windowLength !== 0)) {
    // If the window length is 0 but only because of trimming, don't treat it as a pulse.
    return Infinity;
  }

  // Use continuous rates for growth and discounting
  const g = globalParams.populationGrowthRate;
  const r = globalParams.discountRate;
  const P0 = globalParams.currentPopulation;
  const fraction = effect.populationFractionImpacted;
  const qalyPerYear = effect.rawQALYImprovementPerYear;

  let totalQALYs;

  // Check if and when we hit population limit
  let yearToHitLimit = Infinity;

  // Handle the various cases of population limits
  if (g === 0) {
    // Zero growth: population stays constant at P0, but respect the limit
    // Population is at limit immediately if P0 is beyond it
    yearToHitLimit = P0 > populationLimitActual || P0 < populationLimitActual ? 0 : Infinity;
  } else if (g > 0) {
    // Positive growth
    if (P0 >= populationLimitActual) {
      // Already at or above limit
      yearToHitLimit = 0;
    } else {
      // Will reach limit in the future
      yearToHitLimit = Math.log(populationLimitActual / P0) / g;
    }
  } else {
    // g < 0
    // Negative growth (decline)
    if (P0 <= populationLimitActual) {
      // Already at or below limit (limit acts as floor)
      yearToHitLimit = 0;
    } else {
      // Will reach limit in the future
      yearToHitLimit = Math.log(populationLimitActual / P0) / g;
    }
  }

  // Helper function to get population at a given time, capped at limit
  const getPopulationAt = (time) => {
    if (g === 0) {
      // Constant population, but clamp to limit
      // The limit could be acting as either a cap or a floor
      if (P0 > populationLimitActual) {
        return populationLimitActual; // Cap
      } else if (P0 < populationLimitActual) {
        return P0; // No floor effect when not growing/declining
      } else {
        return P0; // Already at limit
      }
    }
    const pop = P0 * Math.exp(g * time);
    return g > 0 ? Math.min(pop, populationLimitActual) : Math.max(pop, populationLimitActual);
  };

  if (effect.windowLength === 0) {
    // raw Window length being zero --> instantaneous pulse
    const currentPopulation = getPopulationAt(startYear);
    totalQALYs = currentPopulation * fraction * qalyPerYear * Math.exp(-r * startYear);
  } else if (yearToHitLimit < 0 || yearToHitLimit >= startYear + windowLength) {
    // Population doesn't hit limit during the effect window
    // Integral from t=startYear to t=startYear+windowLength of:
    // P0 * e^(g*t) * fraction * qalyPerYear * e^(-r*t) dt
    // = P0 * fraction * qalyPerYear * integral of e^((g-r)*t) dt

    const combinedRate = g - r;

    if (Math.abs(combinedRate) < 1e-10) {
      // Special case when growth rate equals discount rate - exponentials cancel
      totalQALYs = P0 * fraction * qalyPerYear * windowLength;
    } else {
      // General case: integral of e^((g-r)*t)
      // Use numerically stable computation: expEnd - expStart = expStart * expm1(combinedRate * windowLength)
      const expStart = Math.exp(combinedRate * startYear);
      const expDiff = expStart * Math.expm1(combinedRate * windowLength);
      totalQALYs = (P0 * fraction * qalyPerYear * expDiff) / combinedRate;
    }
  } else if (yearToHitLimit <= startYear) {
    // Population already at limit at start of effect window
    // Use continuous discounting formula similar to qalyEffectToCostPerLife
    let discountFactor;
    if (r === 0) {
      discountFactor = windowLength;
    } else {
      const x = r * windowLength;
      const numerator = -Math.expm1(-x); // 1 - e^(-x)
      discountFactor = numerator / r;
    }
    totalQALYs = populationLimitActual * fraction * qalyPerYear * Math.exp(-r * startYear) * discountFactor;
  } else {
    // Population hits limit during effect window - need to split calculation
    const timeToLimit = yearToHitLimit - startYear;

    // Before hitting limit (startYear to yearToHitLimit)
    const combinedRate = g - r;
    let totalBeforeLimit;

    if (Math.abs(combinedRate) < 1e-10) {
      // When g ≈ r, the exponentials cancel out
      totalBeforeLimit = P0 * fraction * qalyPerYear * timeToLimit;
    } else {
      // Use numerically stable computation: expLimit - expStart = expStart * expm1(combinedRate * timeToLimit)
      const expStart = Math.exp(combinedRate * startYear);
      const expDiff = expStart * Math.expm1(combinedRate * timeToLimit);
      totalBeforeLimit = (P0 * fraction * qalyPerYear * expDiff) / combinedRate;
    }

    // After hitting limit (yearToHitLimit to startYear + windowLength)
    const remainingTime = windowLength - timeToLimit;
    let discountFactor;
    if (r === 0) {
      discountFactor = remainingTime;
    } else {
      const x = r * remainingTime;
      const numerator = -Math.expm1(-x); // 1 - e^(-x)
      discountFactor = numerator / r;
    }
    const totalAfterLimit =
      populationLimitActual * fraction * qalyPerYear * Math.exp(-r * yearToHitLimit) * discountFactor;

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
