/**
 * Simplified visualization calculations for lives saved over time
 * Uses sampling approach instead of complex decomposition
 */

import { selectEffectsForYear, calculateCombinedCostPerLife } from './effectsCalculation';
import { getCostPerLifeForRecipientFromCombined } from './assumptionsDataHelpers';

/**
 * Calculate visualization points by sampling the rate at different times
 * @param {string} recipientId - Recipient ID
 * @param {number} donationAmount - Amount donated
 * @param {number} donationYear - Year of donation
 * @param {Object} combinedAssumptions - Combined assumptions with all data
 * @returns {Array} Array of points for visualization
 */
export const calculateLivesSavedSegments = (recipientId, donationAmount, donationYear, combinedAssumptions) => {
  // Get the cost per life for this recipient
  const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, donationYear);

  if (!costPerLife || costPerLife === Infinity || costPerLife === 0) {
    return [];
  }

  // Total lives saved from this donation
  const totalLivesSaved = donationAmount / costPerLife;

  // Get global parameters
  const globalParams = combinedAssumptions.globalParameters;
  const timeLimit = globalParams.timeLimit || 100;

  // Get recipient and effects
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient) return [];

  // Collect all effects from all categories
  const allEffects = [];
  Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
    const categoryWeight = categoryData.fraction;
    // Only skip if fraction is explicitly set to 0
    if (categoryData.fraction === 0) return;

    const category = combinedAssumptions.categories[categoryId];
    if (!category || !category.effects) return;

    const effects = selectEffectsForYear(category.effects, donationYear);
    effects.forEach((effect) => {
      allEffects.push({
        ...effect,
        id: effect.effectId, // Map effectId to id for graph display
        weight: categoryWeight,
      });
    });
  });

  if (allEffects.length === 0) return [];

  // Sample points across the time range
  const numSamples = 100;
  const points = [];

  // Calculate the rate at each sample point
  for (let i = 0; i <= numSamples; i++) {
    const t = (i / numSamples) * timeLimit;
    const absoluteYear = donationYear + t;
    const point = {
      year: absoluteYear,
    };

    // For each effect, calculate its marginal contribution
    allEffects.forEach((effect) => {
      const startTime = effect.startTime;
      const windowLength = effect.windowLength;

      // Initialize this effect's contribution to 0
      point[effect.id] = 0;

      // Check if effect is active at this time
      if (t >= startTime && t < startTime + windowLength) {
        // Calculate cost per life WITH this effect
        const effectsAtTime = allEffects.filter((e) => {
          return t >= e.startTime && t < e.startTime + e.windowLength;
        });

        // Calculate cost per life WITHOUT this effect
        const effectsWithout = effectsAtTime.filter((e) => e.id !== effect.id);

        // Calculate combined cost per life for both scenarios
        let costWith = Infinity;
        let costWithout = Infinity;

        if (effectsAtTime.length > 0) {
          try {
            costWith = calculateCombinedCostPerLife(effectsAtTime, globalParams, absoluteYear);
          } catch {
            costWith = Infinity;
          }
        }

        if (effectsWithout.length > 0) {
          try {
            costWithout = calculateCombinedCostPerLife(effectsWithout, globalParams, absoluteYear);
          } catch {
            costWithout = Infinity;
          }
        }

        // Calculate marginal contribution (lives saved with - lives saved without)
        // For a fixed donation amount, lives saved = amount / cost
        // So marginal contribution = amount * (1/costWith - 1/costWithout)
        // We'll use amount = 1 for the rate calculation
        let marginalRate = 0;
        if (costWith !== Infinity && costWith !== 0) {
          marginalRate = 1 / costWith;
        }
        if (costWithout !== Infinity && costWithout !== 0) {
          marginalRate -= 1 / costWithout;
        }

        // Apply the category weight
        point[effect.id] = marginalRate * effect.weight;
      }
    });

    points.push(point);
  }

  // Normalize the points so they integrate to totalLivesSaved
  // First, calculate the integral for each effect using trapezoidal rule
  const effectIntegrals = {};
  let totalIntegral = 0;

  // Get all effect IDs from the first point (all points have the same structure)
  if (points.length > 0) {
    const effectIds = Object.keys(points[0]).filter((key) => key !== 'year');

    effectIds.forEach((effectId) => {
      let effectIntegral = 0;
      for (let i = 1; i < points.length; i++) {
        const dt = timeLimit / numSamples;
        effectIntegral += ((points[i - 1][effectId] + points[i][effectId]) * dt) / 2;
      }
      effectIntegrals[effectId] = effectIntegral;
      totalIntegral += effectIntegral;
    });
  }

  // Normalize if we have a non-zero integral
  if (totalIntegral !== 0) {
    const normalizer = totalLivesSaved / totalIntegral;
    points.forEach((point) => {
      Object.keys(point).forEach((key) => {
        if (key !== 'year') {
          point[key] *= normalizer;
        }
      });
    });
  }

  return points;
};

/**
 * Calculate breakdown of total lives saved
 * @param {Array} points - Array of visualization points
 * @returns {Object} Breakdown with totals and percentages
 */
export const calculateIntegralBreakdown = (points) => {
  const breakdown = {
    historical: { lives: 0, percentage: 0 },
    futureGrowth: { lives: 0, percentage: 0 },
    populationLimit: { lives: 0, percentage: 0 },
    qaly: { lives: 0, percentage: 0 },
    total: 0,
  };

  if (!points || points.length < 2) return breakdown;

  // Integrate using trapezoidal rule
  for (let i = 1; i < points.length; i++) {
    const dt = points[i].year - points[i - 1].year;
    const avgHistorical = (points[i - 1].historical + points[i].historical) / 2;
    const avgFuture = (points[i - 1]['future-growth'] + points[i]['future-growth']) / 2;
    const avgLimit = (points[i - 1]['population-limit'] + points[i]['population-limit']) / 2;
    const avgQaly = (points[i - 1].qaly + points[i].qaly) / 2;

    breakdown.historical.lives += avgHistorical * dt;
    breakdown.futureGrowth.lives += avgFuture * dt;
    breakdown.populationLimit.lives += avgLimit * dt;
    breakdown.qaly.lives += avgQaly * dt;
  }

  breakdown.total =
    breakdown.historical.lives + breakdown.futureGrowth.lives + breakdown.populationLimit.lives + breakdown.qaly.lives;

  // Calculate percentages
  if (breakdown.total > 0) {
    breakdown.historical.percentage = (breakdown.historical.lives / breakdown.total) * 100;
    breakdown.futureGrowth.percentage = (breakdown.futureGrowth.lives / breakdown.total) * 100;
    breakdown.populationLimit.percentage = (breakdown.populationLimit.lives / breakdown.total) * 100;
    breakdown.qaly.percentage = (breakdown.qaly.lives / breakdown.total) * 100;
  }

  return breakdown;
};

/**
 * Format large numbers for display
 * @param {number} value - Value to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatLargeNumber = (value, precision = 2) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue < 1e3) {
    return sign + absValue.toFixed(precision);
  } else if (absValue < 1e6) {
    return sign + (absValue / 1e3).toFixed(precision) + 'k';
  } else if (absValue < 1e9) {
    return sign + (absValue / 1e6).toFixed(precision) + 'M';
  } else if (absValue < 1e12) {
    return sign + (absValue / 1e9).toFixed(precision) + 'B';
  } else {
    return sign + absValue.toExponential(precision);
  }
};

/**
 * Format calendar years for display on axes
 * @param {number} year - Calendar year (e.g., 2025)
 * @returns {string} Formatted string
 */
export const formatCalendarYear = (year) => {
  if (year < 10000) {
    return Math.round(year).toString();
  } else if (year < 1e6) {
    return (year / 1e3).toFixed(0) + 'k';
  } else if (year < 1e9) {
    return (year / 1e6).toFixed(1) + 'M';
  } else {
    return year.toExponential(1);
  }
};
