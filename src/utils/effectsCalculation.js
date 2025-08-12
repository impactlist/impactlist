// Effects-based calculation utilities
// Converts the new effects data structure to cost-per-life calculations
import {
  assertExists,
  assertNumber,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonNegativeNumber,
  assertNonEmptyArray,
} from './dataValidation';

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

  if (startYear >= globalParams.timeLimit || windowLength < 0 || (windowLength === 0 && effect.windowLength !== 0)) {
    // If the window length is 0 but only because of trimming, don't treat it as a pulse.
    return Infinity;
  }

  // We can get the discounted cost per QALY by dividing the raw cost per QALY by a discount factor.
  // The formula we base this on is:
  // discountedQALYs = (amount donated)/(costperQALY) * e^(-discountRate * startTime) * (1 - e^(-discountRate * windowLength))/(discountRate*windowLength)
  // So we need to divide the raw cost per QALY by everything after it in the expression.
  let discountDivisor;
  const i = globalParams.discountRate;
  if (effect.windowLength === 0) {
    // window length of 0 is a special case, meaning an instantaneous pulse
    discountDivisor = Math.pow(1 + i, -startYear);
  } else if (Math.abs(i) < 1e-10) {
    discountDivisor = 1;
  } else {
    // Numerically stable fixed-window kernel
    const r = Math.log1p(i); // stable ln(1+i)
    const discountToWindowStart = Math.exp(-r * startYear); // == (1+i)^(-startYear)
    const numerator = -Math.expm1(-r * windowLength); // == 1 - (1+i)^(-windowLength), stable
    discountDivisor = (discountToWindowStart * numerator) / (r * windowLength);
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
  assertPositiveNumber(effect.populationFractionAffected, 'populationFractionAffected', 'in population effect');
  assertNonZeroNumber(effect.qalyImprovementPerYear, 'qalyImprovementPerYear', 'in population effect');
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

  if (startYear >= globalParams.timeLimit || windowLength < 0 || (windowLength === 0 && effect.windowLength !== 0)) {
    // If the window length is 0 but only because of trimming, don't treat it as a pulse.
    return Infinity;
  }

  // Use discrete annual rates for growth and discounting
  const g = globalParams.populationGrowthRate;
  const r = globalParams.discountRate;
  const P0 = globalParams.currentPopulation;
  const fraction = effect.populationFractionAffected;
  const qalyPerYear = effect.qalyImprovementPerYear;

  const populationLimitNumerical = globalParams.populationLimit * P0; // Population limit as multiple of current population

  let totalQALYs;

  // Check if and when we hit population limit
  let yearToHitLimit = Infinity;

  // If populationLimit > 1, it acts as a cap (maximum)
  // If populationLimit < 1, it acts as a floor (minimum)
  // If populationLimit = 1, population stays at P0

  if (g === 0) {
    // Zero growth: population stays constant at P0, limit doesn't matter
    yearToHitLimit = Infinity;
  } else if (g > 0) {
    // Positive growth
    if (globalParams.populationLimit > 1) {
      // Can hit a cap with positive growth
      if (P0 >= populationLimitNumerical) {
        yearToHitLimit = Infinity; // Already at or above limit
      } else {
        // log(1 + g) because g is discrete growth rate
        yearToHitLimit = Math.log(populationLimitNumerical / P0) / Math.log(1 + g);
      }
    }
    // If it's a floor (populationLimit < 1), positive growth never hits it
  } else {
    // g < 0 - Negative growth (decline)
    if (globalParams.populationLimit < 1) {
      // Can hit a floor with negative growth
      if (P0 <= populationLimitNumerical) {
        yearToHitLimit = Infinity; // Already at or below limit
      } else {
        yearToHitLimit = Math.log(populationLimitNumerical / P0) / Math.log(1 + g);
      }
    }
    // If it's a cap (populationLimit > 1), negative growth never hits it
  }

  // Helper function to get population at a given time
  const getPopulationAt = (time) => {
    if (g === 0 || globalParams.populationLimit === 1) {
      // Constant population
      return P0;
    }

    const pop = P0 * Math.pow(1 + g, time);

    if (globalParams.populationLimit > 1) {
      // populationLimit > 1: acts as cap
      return Math.min(pop, populationLimitNumerical);
    } else {
      // populationLimit < 1: acts as floor
      return Math.max(pop, populationLimitNumerical);
    }
  };

  if (effect.windowLength === 0) {
    // raw Window length being zero --> instantaneous pulse
    const currentPopulation = getPopulationAt(startYear);
    totalQALYs = currentPopulation * fraction * qalyPerYear * Math.pow(1 + r, -startYear);
  } else if (yearToHitLimit < 0 || yearToHitLimit >= startYear + windowLength) {
    // Population doesn't hit limit during the effect window
    // Integral from t=startYear to t=startYear+windowLength of:
    // P0 * e^(g*t) * fraction * qalyPerYear * e^(-r*t) dt
    // = P0 * fraction * qalyPerYear * integral of e^((g-r)*t) dt

    const combinedRate = (1 + g) / (1 + r) - 1;
    if (Math.abs(combinedRate) < 1e-10) {
      // Special case when growth rate equals discount rate - exponentials cancel
      totalQALYs = P0 * fraction * qalyPerYear * windowLength;
    } else {
      // General case: integral of e^((g-r)*t)
      // Use numerically stable computation: expEnd - expStart = expStart * expm1(combinedRate * windowLength)
      const startLevel = Math.pow(1 + combinedRate, startYear);
      const integratedGrowthFactor = startLevel * (Math.pow(1 + combinedRate, windowLength) - 1);
      totalQALYs = (P0 * fraction * qalyPerYear * integratedGrowthFactor) / combinedRate;
    }
  } else if (yearToHitLimit <= startYear) {
    // Population already at limit at start of effect window
    // Use discounting formula similar to qalyEffectToCostPerLife
    let discountFactor;
    if (Math.abs(r) < 1e-10) {
      discountFactor = windowLength;
    } else {
      const numerator = 1 - Math.pow(1 + r, -windowLength);
      discountFactor = numerator / Math.log1p(r);
    }
    totalQALYs = populationLimitNumerical * fraction * qalyPerYear * Math.exp(-r * startYear) * discountFactor;
  } else {
    // Population hits limit during effect window - need to split calculation
    const timeToLimit = yearToHitLimit - startYear;

    // Before hitting limit (startYear to yearToHitLimit)
    const combinedRate = (1 + g) / (1 + r) - 1;
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
      populationLimitNumerical * fraction * qalyPerYear * Math.exp(-r * yearToHitLimit) * discountFactor;

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
 * Calculate combined cost per life from multiple effects
 * Based on total lives saved per dollar: Σ(1/C_i) where C_i is cost per life
 * Combined cost per life = 1 / Σ(1/C_i)
 * @param {number[]} effectCosts - Array of individual effect costs
 * @returns {number} Combined cost per life or Infinity if no valid costs
 */
export const calculateCombinedCostPerLife = (effectCosts) => {
  // Filter out Infinity but keep both positive and negative costs
  const validCosts = effectCosts.filter((cost) => cost !== Infinity && cost !== 0);
  if (validCosts.length === 0) return Infinity;

  // Calculate total lives saved per dollar across all effects
  const harmonicSum = validCosts.reduce((sum, cost) => sum + 1 / cost, 0);

  // If effects perfectly cancel out, return Infinity
  if (harmonicSum === 0) return Infinity;

  // Return cost per life (reciprocal of lives per dollar)
  return 1 / harmonicSum;
};

/**
 * Calculate combined cost per life from multiple effects with time windows
 * @param {Array} effects - Array of effect objects with time windows
 * @param {Object} globalParams - Global parameters object
 * @param {string} contextId - Context ID for error messages (e.g., categoryId, recipientId)
 * @returns {number} Combined cost per life
 */
export const calculateCostPerLife = (effects, globalParams, contextId = 'unknown') => {
  assertNonEmptyArray(effects, 'effects', `in context "${contextId}"`);

  // Get global parameters for discounting
  assertExists(globalParams, 'globalParams');
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');

  // Calculate individual cost per life for each effect
  const effectCosts = effects.map((effect) => {
    assertExists(effect.startTime, 'startTime', `in effect ${effect.effectId}`);
    assertNonNegativeNumber(effect.windowLength, 'windowLength', `in effect ${effect.effectId}`);

    // Get the already-discounted cost per life from the effect
    return effectToCostPerLife(effect, globalParams);
  });

  // Combine the individual costs using the correct formula
  return calculateCombinedCostPerLife(effectCosts);
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
