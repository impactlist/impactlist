import { assertExists } from './dataValidation';
import { assertValidGlobalParameters, getGlobalParameterError } from './globalParameterRules';
import { getCurrentYear } from './donationDataHelpers';
import { NONZERO_EPSILON } from './visualizationConstants';

const FUTURE_VALUE_SERIES_ID = 'future-value';
// Caps the densely sampled window. When decay ends that window before the time
// limit, the sentinel sample at the real limit can push the series to MAX + 1.
const MAX_SAMPLED_POINTS = 240;

const getPreviewParameterValue = (paramKey, formValues, globalParameters, defaultGlobalParameters) => {
  const rawValue = formValues?.[paramKey]?.raw;

  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return defaultGlobalParameters[paramKey];
  }

  // Mid-typing form values are expected input, including finite numbers the
  // rules reject (a time limit of 0, a negative population limit). The field
  // shows its validation error; the preview keeps rendering the last saved
  // value rather than feeding the invalid number into math that asserts.
  if (typeof rawValue === 'number' && Number.isFinite(rawValue) && !getGlobalParameterError(paramKey, rawValue)) {
    return rawValue;
  }

  return globalParameters[paramKey];
};

export const resolveFutureValuePreviewParameters = (globalParameters, defaultGlobalParameters, formValues) => {
  if (!globalParameters || !defaultGlobalParameters) {
    return null;
  }

  return Object.keys(globalParameters).reduce((resolved, paramKey) => {
    resolved[paramKey] = getPreviewParameterValue(paramKey, formValues, globalParameters, defaultGlobalParameters);
    return resolved;
  }, {});
};

const validateFutureValueParameters = (globalParameters) => {
  const context = 'in future value visualization';

  assertExists(globalParameters, 'globalParameters', context);
  assertValidGlobalParameters(globalParameters, context);

  return {
    currentPopulation: globalParameters.currentPopulation,
    populationLimitFactor: globalParameters.populationLimit,
    growthRate: globalParameters.populationGrowthRate,
    discountRate: globalParameters.discountRate,
    timeLimit: globalParameters.timeLimit,
    yearsPerLife: globalParameters.yearsPerLife,
  };
};

const getPopulationAtTime = ({ currentPopulation, populationLimitFactor, growthRate }, timeYears) => {
  let effectiveGrowthRate = growthRate;

  if (populationLimitFactor === 1) {
    effectiveGrowthRate = 0;
  }

  if (effectiveGrowthRate <= -1) {
    throw new Error(
      `Population growth rate must be greater than -100% in future value visualization, got: ${growthRate}`
    );
  }

  const projectedPopulation = currentPopulation * Math.pow(1 + effectiveGrowthRate, timeYears);
  const populationLimit = populationLimitFactor * currentPopulation;

  if (effectiveGrowthRate > 0 && populationLimitFactor > 1) {
    return Math.min(projectedPopulation, populationLimit);
  }

  if (effectiveGrowthRate < 0 && populationLimitFactor < 1) {
    return Math.max(projectedPopulation, populationLimit);
  }

  return projectedPopulation;
};

const getDiscountFactorAtTime = (discountRate, timeYears) => {
  return Math.pow(1 + discountRate, -timeYears);
};

// Discounting (or a shrinking population) can drive the series to negligible
// values long before the time limit. Sampling the full window uniformly would
// then bury the entire visible curve inside a single step, starving the graph
// of detail and badly overestimating the trapezoid integral in
// calculateFutureValueTotal. Find where the series first becomes negligible so
// sampling can concentrate on the part that matters.
//
// The series is piecewise exponential with one regime change (the population
// cap or floor), and the validated discount rate is non-negative, so once the
// value is below the threshold and falling it never recovers. Doubling probes
// locate that point within a factor of two, which is all the sampler needs.
const findEffectiveTimeLimit = (parameters) => {
  const { timeLimit, discountRate } = parameters;
  let previousValue = getPopulationAtTime(parameters, 0);

  for (let probe = 1; probe < timeLimit; probe *= 2) {
    const value = getPopulationAtTime(parameters, probe) * getDiscountFactorAtTime(discountRate, probe);
    if (value <= NONZERO_EPSILON && value < previousValue) {
      return probe;
    }
    previousValue = value;
  }

  return timeLimit;
};

const buildSampleTimes = (parameters) => {
  const { timeLimit } = parameters;

  if (timeLimit <= 0) {
    return [0];
  }

  const effectiveTimeLimit = findEffectiveTimeLimit(parameters);
  // Indexed interpolation (not an accumulating step) so the endpoint is exact
  // and the point count is deterministic.
  const intervalCount = Math.min(Math.ceil(effectiveTimeLimit), MAX_SAMPLED_POINTS - 1);
  const sampledTimes = [];

  for (let i = 0; i < intervalCount; i += 1) {
    sampledTimes.push((i * effectiveTimeLimit) / intervalCount);
  }
  sampledTimes.push(effectiveTimeLimit);

  // Keep a final sample at the real limit so the series spans the full window;
  // everything past the effective limit is negligible by construction.
  if (effectiveTimeLimit < timeLimit) {
    sampledTimes.push(timeLimit);
  }

  return sampledTimes;
};

export const calculateFutureValueTotal = (points) => {
  if (!Array.isArray(points) || points.length < 2) {
    return 0;
  }

  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = points[index - 1];
    const currentPoint = points[index];
    const deltaYears = currentPoint.year - previousPoint.year;
    const averageValue = (previousPoint[FUTURE_VALUE_SERIES_ID] + currentPoint[FUTURE_VALUE_SERIES_ID]) / 2;

    total += averageValue * deltaYears;
  }

  return total;
};

export const calculateFutureValueSeries = (globalParameters, options = {}) => {
  const validatedParameters = validateFutureValueParameters(globalParameters);

  const currentYear = options.currentYear ?? getCurrentYear();
  const { timeLimit, yearsPerLife, discountRate } = validatedParameters;
  const sampledTimes = buildSampleTimes(validatedParameters);

  const points = sampledTimes.map((timeYears) => {
    const population = getPopulationAtTime(validatedParameters, timeYears);
    const discountedPopulation = population * getDiscountFactorAtTime(discountRate, timeYears);

    return {
      year: currentYear + timeYears,
      population,
      [FUTURE_VALUE_SERIES_ID]: discountedPopulation,
    };
  });

  const totalFutureLives = calculateFutureValueTotal(points) / yearsPerLife;

  const seriesMetadata = [
    {
      id: FUTURE_VALUE_SERIES_ID,
      label: 'Future value',
      effectType: 'qaly',
      totalLives: totalFutureLives,
      shareOfTotal: 1,
      startYear: currentYear,
      endYear: currentYear + timeLimit,
    },
  ];

  return {
    points,
    seriesMetadata,
    totalFutureLives,
  };
};
