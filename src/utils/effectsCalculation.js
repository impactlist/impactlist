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

  // Assume average life expectancy remaining is 40 years
  // Assume 1 QALY per year of life (could be made configurable)
  const avgLifeYears = 40;
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
  const avgLifeQALYs = 40; // Same assumption as above
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
  // For now, just use the first effect as a simplification
  // TODO: Implement proper multi-effect calculation
  console.warn(
    `Category "${categoryId}" has ${effects.length} effects. Using first effect for now. Multi-effect calculation not yet implemented.`
  );
  return effectToCostPerLife(effects[0]);
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
