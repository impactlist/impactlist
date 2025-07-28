// Effects-based calculation utilities
// Converts the new effects data structure to cost-per-life calculations
import { globalParameters } from '../data/generatedData';
import {
  assertExists,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonEmptyArray,
  validateCategory,
} from './dataValidation';

/**
 * Convert a QALY-based effect to cost per life
 * @param {Object} effect - The effect with costPerQALY
 * @returns {number} Cost per life
 */
const qalyEffectToCostPerLife = (effect) => {
  assertExists(effect, 'effect');
  assertNonZeroNumber(effect.costPerQALY, 'costPerQALY', 'in QALY effect');

  // Use global parameter for average life expectancy remaining
  // Assume 1 QALY per year of life (could be made configurable)
  assertExists(globalParameters, 'globalParameters');
  assertPositiveNumber(globalParameters.yearsPerLife, 'yearsPerLife', 'in globalParameters');
  const avgLifeYears = globalParameters.yearsPerLife;
  const qalyPerLife = avgLifeYears * 1.0;

  return effect.costPerQALY * qalyPerLife;
};

/**
 * Convert a population-based effect to cost per life
 * @param {Object} effect - The effect with costPerMicroprobability and population data
 * @returns {number} Cost per life
 */
const populationEffectToCostPerLife = (effect) => {
  assertExists(effect, 'effect');
  assertNonZeroNumber(effect.costPerMicroprobability, 'costPerMicroprobability', 'in population effect');
  assertPositiveNumber(effect.populationFractionAffected, 'populationFractionAffected', 'in population effect');
  assertNonZeroNumber(effect.qalyImprovementPerYear, 'qalyImprovementPerYear', 'in population effect');

  // Get global parameters
  assertExists(globalParameters, 'globalParameters');
  assertPositiveNumber(globalParameters.currentPopulation, 'currentPopulation', 'in globalParameters');
  assertPositiveNumber(globalParameters.discountRate, 'discountRate', 'in globalParameters');
  assertPositiveNumber(globalParameters.timeLimit, 'timeLimit', 'in globalParameters');

  const currentPopulation = globalParameters.currentPopulation;
  const discountRate = globalParameters.discountRate;
  const timeLimit = globalParameters.timeLimit;

  // Calculate affected population
  const affectedPopulation = currentPopulation * effect.populationFractionAffected;

  // Calculate total QALYs over time with discounting
  let totalQALYs = 0;
  for (let year = 0; year < timeLimit; year++) {
    const discountFactor = Math.pow(1 / (1 + discountRate), year);
    totalQALYs += affectedPopulation * effect.qalyImprovementPerYear * discountFactor;
  }

  // Convert micropropability to probability (1 micropropability = 1/1,000,000)
  const probability = 1 / 1_000_000;

  // Cost per life = cost per micropropability / (probability * total QALYs / average life QALYs)
  assertPositiveNumber(globalParameters.yearsPerLife, 'yearsPerLife', 'in globalParameters');
  const avgLifeQALYs = globalParameters.yearsPerLife; // Same assumption as above
  const livesSavedPerMicroprobability = (probability * totalQALYs) / avgLifeQALYs;

  return effect.costPerMicroprobability / livesSavedPerMicroprobability;
};

/**
 * Convert any effect to cost per life
 * @param {Object} effect - The effect object
 * @returns {number} Cost per life
 */
export const effectToCostPerLife = (effect) => {
  assertExists(effect, 'effect');

  if (effect.costPerQALY !== undefined) {
    return qalyEffectToCostPerLife(effect);
  } else if (effect.costPerMicroprobability !== undefined) {
    return populationEffectToCostPerLife(effect);
  } else {
    throw new Error('Effect must have either costPerQALY or costPerMicroprobability');
  }
};

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
 * Calculate cost per life from multiple effects with time windows
 * @param {Array} effects - Array of effect objects with time windows
 * @param {string} categoryId - Category ID for context
 * @returns {number} Weighted average cost per life
 */
const calculateMultiEffectCostPerLife = (effects, categoryId) => {
  assertNonEmptyArray(effects, 'effects', `in category "${categoryId}"`);

  // Get global parameters for discounting
  assertExists(globalParameters, 'globalParameters');
  assertPositiveNumber(globalParameters.discountRate, 'discountRate', 'in globalParameters');
  assertPositiveNumber(globalParameters.timeLimit, 'timeLimit', 'in globalParameters');

  const discountRate = globalParameters.discountRate;
  const timeLimit = globalParameters.timeLimit;

  // Calculate total discounted impact for each effect
  let totalDiscountedCost = 0;
  let totalDiscountedLives = 0;

  effects.forEach((effect) => {
    assertExists(effect.startTime, 'startTime', `in effect ${effect.effectId}`);
    assertPositiveNumber(effect.windowLength, 'windowLength', `in effect ${effect.effectId}`);

    const costPerLife = effectToCostPerLife(effect);
    const startYear = effect.startTime;
    const endYear = Math.min(startYear + effect.windowLength, timeLimit);

    // Calculate discounted sum for this time window
    const discountedYears = calculateDiscountedSum(discountRate, startYear, endYear);

    // With $1/year spending, lives saved per year = 1/costPerLife
    const livesPerYear = 1 / costPerLife;

    totalDiscountedCost += discountedYears; // $1/year * discountedYears
    totalDiscountedLives += livesPerYear * discountedYears;
  });

  // Return weighted average cost per life
  if (totalDiscountedLives === 0) {
    throw new Error(`No lives saved calculated for category "${categoryId}" with multiple effects`);
  }

  return totalDiscountedCost / totalDiscountedLives;
};

/**
 * Calculate cost per life for a category from its effects
 * @param {Object} category - The category object with effects array
 * @param {string} categoryId - The category ID for context
 * @returns {number} Cost per life for the category
 */
export const calculateCategoryBaseCostPerLife = (category, categoryId) => {
  validateCategory(category, categoryId);

  const effects = assertNonEmptyArray(category.effects, 'effects', `in category "${categoryId}"`);

  if (effects.length === 1) {
    // Single effect - simple case
    return effectToCostPerLife(effects[0]);
  }

  // Multiple effects - calculate weighted average based on time windows
  return calculateMultiEffectCostPerLife(effects, categoryId);
};

/**
 * Apply recipient effect modifications (overrides/multipliers) to a base cost per life
 * @param {number} baseCostPerLife - The base cost per life from category
 * @param {Object} recipientEffect - The recipient's effect modification
 * @param {string} effectId - The effect ID for validation
 * @param {string} context - Context for error messages
 * @returns {number} Modified cost per life
 */
export const applyRecipientEffectModifications = (baseCostPerLife, recipientEffect, effectId, context) => {
  assertNonZeroNumber(baseCostPerLife, 'baseCostPerLife', context);
  assertExists(recipientEffect, 'recipientEffect', context);

  if (recipientEffect.effectId !== effectId) {
    throw new Error(`Effect ID mismatch ${context}: expected "${effectId}", got "${recipientEffect.effectId}"`);
  }

  let result = baseCostPerLife;

  // Apply overrides first (completely replace base values)
  if (recipientEffect.overrides) {
    if (recipientEffect.overrides.costPerQALY !== undefined) {
      const qalyEffect = {
        costPerQALY: assertNonZeroNumber(recipientEffect.overrides.costPerQALY, 'overrides.costPerQALY', context),
      };
      result = qalyEffectToCostPerLife(qalyEffect);
    }

    if (recipientEffect.overrides.costPerMicroprobability !== undefined) {
      // For overrides of population effects, we need all the population parameters
      const popEffect = {
        costPerMicroprobability: assertNonZeroNumber(
          recipientEffect.overrides.costPerMicroprobability,
          'overrides.costPerMicroprobability',
          context
        ),
        populationFractionAffected: assertPositiveNumber(
          recipientEffect.overrides.populationFractionAffected,
          'overrides.populationFractionAffected',
          context
        ),
        qalyImprovementPerYear: assertNonZeroNumber(
          recipientEffect.overrides.qalyImprovementPerYear,
          'overrides.qalyImprovementPerYear',
          context
        ),
      };
      result = populationEffectToCostPerLife(popEffect);
    }
  }

  // Apply multipliers (modify the base or overridden values)
  if (recipientEffect.multipliers) {
    if (recipientEffect.multipliers.costPerQALY !== undefined) {
      const multiplier = assertPositiveNumber(
        recipientEffect.multipliers.costPerQALY,
        'multipliers.costPerQALY',
        context
      );
      // Higher multiplier means more effective (lower cost per life)
      result = result / multiplier;
    }

    if (recipientEffect.multipliers.costPerMicroprobability !== undefined) {
      const multiplier = assertPositiveNumber(
        recipientEffect.multipliers.costPerMicroprobability,
        'multipliers.costPerMicroprobability',
        context
      );
      // Higher multiplier means more effective (lower cost per life)
      result = result / multiplier;
    }
  }

  return result;
};
