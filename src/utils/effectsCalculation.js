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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate discount factor for a specific time point
 * @param {number} rate - Annual discount rate (e.g., 0.02 for 2%)
 * @param {number} time - Time in years
 * @returns {number} Discount factor: (1+r)^(-time)
 */
const calculateDiscountToTime = (rate, time) => {
  return Math.pow(1 + rate, -time);
};

/**
 * Calculate the sum of discrete discount factors for a time window
 * Returns the sum of discount factors over the window (in years)
 * @param {number} discountRate - Annual discount rate (e.g., 0.02 for 2%)
 * @param {number} windowLength - Length of time window in years
 * @returns {number} Sum of discount factors over window: Σ(1/(1+r)^t) for t=0 to windowLength-1
 */
const calculateDiscountWindowSum = (discountRate, windowLength) => {
  if (Math.abs(discountRate) < 1e-10) {
    return windowLength;
  }
  // Using expm1 for better numerical stability: 1 - (1+r)^(-n) = -expm1(-n*log1p(r))
  const numerator = -Math.expm1(-windowLength * Math.log1p(discountRate));
  return numerator / Math.log1p(discountRate);
};

/**
 * Validate that an effect window is valid given time constraints
 * @param {number} startYear - Start year of the effect
 * @param {number} windowLength - Actual window length after trimming
 * @param {number} originalWindowLength - Original window length before trimming
 * @param {number} timeLimit - Maximum time horizon
 * @returns {boolean} True if window is valid, false otherwise
 */
const validateEffectWindow = (startYear, windowLength, originalWindowLength, timeLimit) => {
  // If window was trimmed to zero (but wasn't originally zero), it's invalid
  // If start is beyond time limit or window is negative, it's invalid
  return !(startYear >= timeLimit || windowLength < 0 || (windowLength === 0 && originalWindowLength !== 0));
};

/**
 * Integrate discrete growth over a time window
 * Calculates integral of baseAmount * (1 + rate)^t from startTime to startTime + duration
 * @param {number} baseAmount - Base amount to grow
 * @param {number} rate - Growth rate (can be negative for decline)
 * @param {number} startTime - Start time for integration
 * @param {number} duration - Duration of integration window
 * @returns {number} Integrated amount over the time window
 */
const integrateDiscreteGrowth = (baseAmount, rate, startTime, duration) => {
  if (Math.abs(rate) < 1e-10) {
    // Rate is effectively zero, no growth
    return baseAmount * duration;
  }

  const startLevel = Math.pow(1 + rate, startTime);
  const endLevel = Math.pow(1 + rate, startTime + duration);
  const growthFactor = endLevel - startLevel;

  return (baseAmount * growthFactor) / Math.log1p(rate);
};

/**
 * Calculate when population will hit a limit given growth rate
 * @param {number} currentPop - Current population
 * @param {number} limitPop - Population limit (absolute number)
 * @param {number} growthRate - Annual growth rate
 * @returns {number} Years until limit is hit, or Infinity if never hit
 */
const calculateYearToPopulationLimit = (currentPop, limitPop, growthRate) => {
  if (Math.abs(growthRate) < 1e-10) {
    return Infinity; // No growth means never hit limit (unless already there)
  }

  // Check if already at limit
  if (currentPop === limitPop) {
    return 0; // Already at limit
  }

  // Check if we're past the limit or growing away from it
  if (growthRate > 0 && currentPop > limitPop) {
    return Infinity; // Already above cap and growing
  }
  if (growthRate < 0 && currentPop < limitPop) {
    return Infinity; // Already below floor and declining
  }

  // Calculate time to hit limit using discrete growth formula
  // P(t) = P0 * (1 + g)^t = limitPop
  // t = log(limitPop / P0) / log(1 + g)
  return Math.log(limitPop / currentPop) / Math.log1p(growthRate);
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

  if (!validateEffectWindow(startYear, windowLength, effect.windowLength, globalParams.timeLimit)) {
    return Infinity;
  }

  // Calculate average discount factor for the effect window
  let averageDiscountFactor;
  const i = globalParams.discountRate;

  if (effect.windowLength === 0) {
    // Instantaneous pulse effect
    averageDiscountFactor = calculateDiscountToTime(i, startYear);
  } else {
    // Fixed window effect - use helper for discount factor
    const discountToWindowStart = calculateDiscountToTime(i, startYear);
    const windowDiscountFactorSum = calculateDiscountWindowSum(i, windowLength);
    averageDiscountFactor = (discountToWindowStart * windowDiscountFactorSum) / windowLength;
  }

  const costPerLife = effect.costPerQALY * globalParams.yearsPerLife;

  // We divide by the average discount factor because:
  // - A smaller discount factor means future QALYs are worth less
  // - So we need MORE money today to achieve the same impact
  // - Division by a number < 1 increases the cost appropriately
  return costPerLife / averageDiscountFactor;
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

  if (!validateEffectWindow(startYear, windowLength, effect.windowLength, globalParams.timeLimit)) {
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

  // Calculate when/if we hit population limit
  let yearToHitLimit = Infinity;

  // Only calculate if limit is relevant based on growth direction
  if ((g > 0 && globalParams.populationLimit > 1) || (g < 0 && globalParams.populationLimit < 1)) {
    yearToHitLimit = calculateYearToPopulationLimit(P0, populationLimitNumerical, g);
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
    totalQALYs = currentPopulation * fraction * qalyPerYear * calculateDiscountToTime(r, startYear);
  } else if (yearToHitLimit < 0 || yearToHitLimit >= startYear + windowLength) {
    // Population doesn't hit limit during the effect window
    // Integral from t=startYear to t=startYear+windowLength of:
    // P0 * (1+g)^t * fraction * qalyPerYear * (1+r)^(-t) dt
    // = P0 * fraction * qalyPerYear * integral of ((1+g)/(1+r))^t dt

    // Use stable net form: exp(log1p(g) - log1p(r)) - 1 = expm1(log1p(g) - log1p(r))
    const netRate = Math.expm1(Math.log1p(g) - Math.log1p(r));
    const baseAmount = P0 * fraction * qalyPerYear;
    totalQALYs = integrateDiscreteGrowth(baseAmount, netRate, startYear, windowLength);
  } else if (yearToHitLimit <= startYear) {
    // Population already at limit at start of effect window
    // Use discounting formula similar to qalyEffectToCostPerLife
    const discountFactor = calculateDiscountWindowSum(r, windowLength);
    totalQALYs =
      populationLimitNumerical * fraction * qalyPerYear * calculateDiscountToTime(r, startYear) * discountFactor;
  } else {
    // Population hits limit during effect window - need to split calculation
    const timeToLimit = yearToHitLimit - startYear;

    // Before hitting limit (startYear to yearToHitLimit)
    // Use stable net form for combined rate
    const netRate = Math.expm1(Math.log1p(g) - Math.log1p(r));
    const baseAmount = P0 * fraction * qalyPerYear;
    const totalBeforeLimit = integrateDiscreteGrowth(baseAmount, netRate, startYear, timeToLimit);

    // After hitting limit (yearToHitLimit to startYear + windowLength)
    const remainingTime = windowLength - timeToLimit;
    const discountFactor = calculateDiscountWindowSum(r, remainingTime);
    const totalAfterLimit =
      populationLimitNumerical * fraction * qalyPerYear * calculateDiscountToTime(r, yearToHitLimit) * discountFactor;

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
 * Select effects applicable to a specific year
 * @param {Array} effects - Array of effect objects
 * @param {number} calculationYear - Year to calculate for (e.g., 2020)
 * @returns {Array} Effects applicable to the given year
 */
export const selectEffectsForYear = (effects, calculationYear) => {
  // Basic validation - just ensure it's a number
  if (typeof calculationYear !== 'number' || !Number.isInteger(calculationYear)) {
    throw new Error('calculationYear must be an integer');
  }

  const applicableEffects = effects.filter((effect) => {
    if (!effect.validTimeInterval) {
      // Legacy effects without intervals apply to all times
      return true;
    }

    const [startYear, endYear] = effect.validTimeInterval;

    // Check if calculation year falls within interval
    // null start means "from beginning of time"
    if (startYear !== null && calculationYear < startYear) return false;
    // null end means "to present/future"
    if (endYear !== null && calculationYear > endYear) return false;

    return true;
  });

  if (applicableEffects.length === 0) {
    throw new Error(`No applicable effects found for year ${calculationYear}`);
  }

  return applicableEffects;
};

/**
 * Calculate combined cost per life from multiple effects with time windows
 * @param {Array} effects - Array of effect objects with time windows
 * @param {Object} globalParams - Global parameters object
 * @param {number} calculationYear - Year to calculate for (required)
 * @returns {number} Combined cost per life
 */
export const calculateCostPerLife = (effects, globalParams, calculationYear) => {
  // Enforce year requirement
  if (typeof calculationYear !== 'number' || !Number.isInteger(calculationYear)) {
    throw new Error('calculationYear must be an integer');
  }

  assertNonEmptyArray(effects, 'effects');

  // Get global parameters for discounting
  assertExists(globalParams, 'globalParams');
  assertNumber(globalParams.discountRate, 'discountRate', 'in globalParams');
  assertPositiveNumber(globalParams.timeLimit, 'timeLimit', 'in globalParams');

  // Select applicable effects based on calculation year
  const applicableEffects = selectEffectsForYear(effects, calculationYear);

  // Calculate individual cost per life for each effect
  const effectCosts = applicableEffects.map((effect) => {
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
