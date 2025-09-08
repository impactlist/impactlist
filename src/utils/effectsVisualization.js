/**
 * Simplified visualization calculations for lives saved over time
 * Uses sampling approach instead of complex decomposition
 */

import { selectEffectsForYear, effectToCostPerLife } from './effectsCalculation';
import { getCostPerLifeForRecipientFromCombined, getCostPerLifeFromCombined } from './assumptionsDataHelpers';

/**
 * Calculate visualization points by sampling the rate at different times
 * @param {string} entityId - Recipient ID or Category ID
 * @param {number} donationAmount - Amount donated
 * @param {number} donationYear - Year of donation
 * @param {Object} combinedAssumptions - Combined assumptions with all data
 * @param {Object} options - Options object
 * @param {boolean} options.isCategory - Whether entityId is a category (default: false, treats as recipient)
 * @returns {Array} Array of points for visualization
 */
export const calculateLivesSavedSegments = (
  entityId,
  donationAmount,
  donationYear,
  combinedAssumptions,
  options = {}
) => {
  const { isCategory = false } = options;

  // Get the cost per life for this entity
  const costPerLife = isCategory
    ? getCostPerLifeFromCombined(combinedAssumptions, entityId, donationYear)
    : getCostPerLifeForRecipientFromCombined(combinedAssumptions, entityId, donationYear);

  if (!costPerLife || costPerLife === Infinity || costPerLife === 0) {
    return [];
  }

  // Total lives saved from this donation
  const totalLivesSaved = donationAmount / costPerLife;

  // Get global parameters
  const globalParams = combinedAssumptions.globalParameters;
  const timeLimit = globalParams.timeLimit;

  // Handle edge case: if time limit is 0 or negative, no effects can occur
  if (timeLimit <= 0) {
    return [{ year: donationYear }]; // Single point with no effects
  }

  // Collect all effects - different logic for recipients vs categories
  const allEffects = [];

  if (isCategory) {
    // Category case: get effects directly from the single category
    const category = combinedAssumptions.categories[entityId];
    if (!category || !category.effects) return [];

    const effects = selectEffectsForYear(category.effects, donationYear);
    effects.forEach((effect) => {
      allEffects.push({
        ...effect,
        id: `${entityId}-${effect.effectId}`, // Use category-effect combination for unique graph display ID
        weight: 1, // Categories don't have fractional weights
      });
    });
  } else {
    // Recipient case: collect effects from all categories (existing logic)
    const recipient = combinedAssumptions.getRecipientById(entityId);
    if (!recipient) return [];

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
          id: `${categoryId}-${effect.effectId}`, // Use category-effect combination for unique graph display ID
          weight: categoryWeight,
        });
      });
    });
  }

  if (allEffects.length === 0) return [];

  // --- New "Critical Point Sampling" logic ---

  // 1. Generate a set of critical time points for sharp, accurate graphs
  const timePoints = new Set();
  timePoints.add(0);
  timePoints.add(timeLimit);
  const EPSILON = 1; // Use a 1-year delta to create sharp-but-not-vertical edges, avoiding tooltip issues with rounding.

  const SAMPLES_PER_EFFECT = 30; // Number of intermediate samples within an effect's window

  allEffects.forEach((effect) => {
    const { startTime, windowLength } = effect;

    // --- Add points to create sharp edges for effect start and end ---
    // Point just before the effect starts (to anchor the line at zero)
    if (startTime > EPSILON) {
      timePoints.add(startTime - EPSILON);
    }
    timePoints.add(startTime); // Point at the exact start

    // Point just before the effect ends (to show the value before dropping to zero)
    if (windowLength > EPSILON) {
      timePoints.add(startTime + windowLength - EPSILON);
    }
    timePoints.add(startTime + windowLength); // Point at the exact end (where value becomes zero)
    // --- End sharp edges ---

    // Add intermediate sample points for curve resolution, respecting the global timeLimit.
    const effectiveEndTime = Math.min(startTime + windowLength, timeLimit);
    const effectiveWindow = effectiveEndTime - startTime;

    if (effectiveWindow > 1) {
      // Only add for windows larger than a year to avoid clutter
      for (let i = 1; i < SAMPLES_PER_EFFECT; i++) {
        const intermediatePoint = startTime + (i / SAMPLES_PER_EFFECT) * effectiveWindow;
        timePoints.add(intermediatePoint);
      }
    }
  });

  // 2. Consolidate and sort the time points
  const sortedTimePoints = Array.from(timePoints)
    .filter((t) => t <= timeLimit) // Ensure no points extend beyond the global time limit
    .sort((a, b) => a - b);

  // 3. Calculate the rate at each critical point
  const points = [];
  for (let i = 0; i < sortedTimePoints.length; i++) {
    const t = sortedTimePoints[i];
    const absoluteYear = donationYear + t;
    const point = {
      year: absoluteYear,
    };

    // The interval (dt) is the time between this point and the next
    // For the last point, we can use the difference to the previous point
    const dt = i < sortedTimePoints.length - 1 ? sortedTimePoints[i + 1] - t : t - sortedTimePoints[i - 1];

    if (dt <= 0) {
      // Avoid division by zero and redundant calculations if points are too close
      // We can just copy the values from the previous point if dt is 0
      if (i > 0) {
        const prevPoint = points[points.length - 1];
        // Create a new object to avoid mutation issues
        const newPoint = { ...prevPoint, year: absoluteYear };
        points.push(newPoint);
      }
      continue;
    }

    allEffects.forEach((effect) => {
      const { startTime, windowLength } = effect;

      // Initialize this effect's contribution to 0
      point[effect.id] = 0;

      // Check if effect is active at this time. Note: includes start, excludes end.
      if (t >= startTime && t < startTime + windowLength) {
        // Calculate cumulative impact using effectToCostPerLife with different time limits
        let cumulativeAtT, cumulativeAtTplusDt;

        if (t <= 0) {
          cumulativeAtT = 0;
        } else {
          const paramsAtT = { ...globalParams, timeLimit: t };
          const costPerLifeAtT = effectToCostPerLife(effect, paramsAtT, donationYear);
          cumulativeAtT = costPerLifeAtT === Infinity || costPerLifeAtT === 0 ? 0 : 1 / costPerLifeAtT;
        }

        const paramsAtTplusDt = { ...globalParams, timeLimit: t + dt };
        const costPerLifeAtTplusDt = effectToCostPerLife(effect, paramsAtTplusDt, donationYear);
        cumulativeAtTplusDt =
          costPerLifeAtTplusDt === Infinity || costPerLifeAtTplusDt === 0 ? 0 : 1 / costPerLifeAtTplusDt;

        // The rate at time t is the difference in cumulative impact divided by dt
        const rate = (cumulativeAtTplusDt - cumulativeAtT) / dt;

        // Apply the category weight
        point[effect.id] = rate * effect.weight;
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

    // Integrate the area under the curve for each effect using the trapezoidal rule.
    effectIds.forEach((effectId) => {
      let effectIntegral = 0;
      for (let i = 1; i < points.length; i++) {
        // dt is now variable, based on the time difference between points
        const dt = points[i].year - points[i - 1].year;
        if (dt > 0) {
          const p0 = points[i - 1][effectId] || 0;
          const p1 = points[i][effectId] || 0;
          effectIntegral += ((p0 + p1) * dt) / 2;
        }
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

/**
 * Generate evenly spaced tick marks for X-axis based on time range
 * @param {number} minYear - Minimum year in the data
 * @param {number} maxYear - Maximum year in the data
 * @returns {number[]} Array of tick positions
 */
export const generateEvenlySpacedTicks = (minYear, maxYear) => {
  const range = maxYear - minYear;

  // For very small ranges, let Recharts handle automatic ticks
  if (range < 100) {
    return undefined; // Use automatic ticks
  }

  // Calculate optimal number of ticks based on range size
  let targetTickCount;
  if (range < 1000) {
    targetTickCount = 8;
  } else if (range < 10000) {
    targetTickCount = 10;
  } else {
    targetTickCount = 8; // For very large ranges, use fewer ticks for clarity
  }

  // Calculate step size and round to nice numbers
  const rawStep = range / (targetTickCount - 1);
  const step = roundToNiceNumber(rawStep);

  // Generate ticks starting from a nice number at or after minYear
  const ticks = [];
  const startTick = Math.ceil(minYear / step) * step;

  // Always include the first year
  ticks.push(minYear);

  // Add evenly spaced ticks
  for (let tick = startTick; tick < maxYear; tick += step) {
    if (tick > minYear && Math.abs(tick - minYear) > step * 0.1) {
      // Avoid too-close ticks
      ticks.push(tick);
    }
  }

  // Always include the last year if it's not too close to the previous tick
  if (maxYear - ticks[ticks.length - 1] > step * 0.1) {
    ticks.push(maxYear);
  }

  return ticks;
};

/**
 * Round a number to a "nice" value for tick marks (1, 2, 5, 10, 20, 50, 100, etc.)
 * @param {number} value - Raw value to round
 * @returns {number} Nice rounded value
 */
const roundToNiceNumber = (value) => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;

  // Round normalized value to nice numbers: 1, 2, 5, 10
  let niceNormalized;
  if (normalized <= 1) {
    niceNormalized = 1;
  } else if (normalized <= 2) {
    niceNormalized = 2;
  } else if (normalized <= 5) {
    niceNormalized = 5;
  } else {
    niceNormalized = 10;
  }

  return niceNormalized * magnitude;
};
