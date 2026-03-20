import { assertExists, assertNonNegativeNumber, assertNumber, assertPositiveNumber } from './dataValidation';
import { getCurrentYear } from './donationDataHelpers';

const FUTURE_VALUE_SERIES_ID = 'future-value';
const MAX_SAMPLED_POINTS = 240;

const getPreviewParameterValue = (paramKey, formValues, globalParameters, defaultGlobalParameters) => {
  const rawValue = formValues?.[paramKey]?.raw;

  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return defaultGlobalParameters[paramKey];
  }

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
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

  return {
    currentPopulation: assertPositiveNumber(globalParameters.currentPopulation, 'currentPopulation', context),
    populationLimitFactor: assertPositiveNumber(globalParameters.populationLimit, 'populationLimit', context),
    growthRate: assertNumber(globalParameters.populationGrowthRate, 'populationGrowthRate', context),
    discountRate: assertNonNegativeNumber(globalParameters.discountRate, 'discountRate', context),
    timeLimit: assertNonNegativeNumber(globalParameters.timeLimit, 'timeLimit', context),
    yearsPerLife: assertPositiveNumber(globalParameters.yearsPerLife, 'yearsPerLife', context),
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

const buildSampleTimes = (timeLimit) => {
  if (timeLimit <= 0) {
    return [0];
  }

  const step = timeLimit <= MAX_SAMPLED_POINTS - 1 ? 1 : timeLimit / (MAX_SAMPLED_POINTS - 1);
  const sampledTimes = [];

  for (let time = 0; time < timeLimit; time += step) {
    sampledTimes.push(time);
  }

  const lastSample = sampledTimes[sampledTimes.length - 1];
  if (typeof lastSample !== 'number' || Math.abs(lastSample - timeLimit) > 1e-9) {
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
  const sampledTimes = buildSampleTimes(timeLimit);

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
