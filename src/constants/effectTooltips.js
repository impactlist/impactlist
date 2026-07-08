/**
 * Centralized tooltip text for effect fields
 * This file contains all tooltip descriptions used across effect input components
 */

export const EFFECT_TOOLTIPS = {
  // QALY/Standard effects
  qaly: {
    costPerQALY:
      'Cost to produce or save one quality-adjusted life year. The benefits are spread evenly over the duration.',
    startTime: 'Number of years after the intervention starts that the effect of that intervention starts.',
    windowLength:
      'Duration of the effect of the intervention. The duration can be superseded by a shorter global time limit parameter.',
  },

  // Population-level effects
  population: {
    costPerMicroprobability: 'Cost to change the probability of an event happening by one in a million.',
    populationFractionAffected:
      'Fraction (0-1) of the population affected if the event happens. For instance if the event is a pandemic that kills 10% of the population, the population fraction affected is 0.1.',
    qalyImprovementPerYear:
      'Estimated welfare change per affected person per year, in quality-adjusted life years (QALYs). Use positive values when the funded work makes a bad event less likely or a good event more likely; use negative values when it does the opposite. For instance, work that reduces the chance of an event that would kill everyone it affects would use a value of about 1, since each affected person would otherwise lose one life-year per year.',
    startTime: 'Number of years after the intervention starts until the event is expected to happen, if it happens.',
    windowLength:
      'Duration of the effect of the event, if it happens. The duration can be superseded by a shorter global time limit parameter.',
  },
};

/**
 * Helper function to get tooltip text for a specific effect type and field
 * @param {string} effectType - The type of effect ('qaly' or 'population')
 * @param {string} fieldName - The name of the field
 * @returns {string} The tooltip text for the field
 */
export const getEffectTooltip = (effectType, fieldName) => {
  return EFFECT_TOOLTIPS[effectType]?.[fieldName] || '';
};
