import { describe, expect, it } from 'vitest';
import {
  calculateFutureValueSeries,
  calculateFutureValueTotal,
  resolveFutureValuePreviewParameters,
} from './futureValueVisualization';
import { NONZERO_EPSILON } from './visualizationConstants';

describe('resolveFutureValuePreviewParameters', () => {
  const globalParameters = {
    discountRate: 0.04,
    populationGrowthRate: 0.01,
    populationLimit: 10,
    timeLimit: 100,
    currentPopulation: 8_000_000_000,
    yearsPerLife: 80,
  };

  const defaultGlobalParameters = {
    discountRate: 0.02,
    populationGrowthRate: 0.015,
    populationLimit: 8,
    timeLimit: 120,
    currentPopulation: 8_300_000_000,
    yearsPerLife: 80,
  };

  it('uses the current valid form value, falls back to defaults for empty values, and keeps saved values for invalid input', () => {
    const previewParameters = resolveFutureValuePreviewParameters(globalParameters, defaultGlobalParameters, {
      discountRate: { raw: 0.05 },
      populationGrowthRate: { raw: '' },
      populationLimit: { raw: '-' },
    });

    expect(previewParameters.discountRate).toBe(0.05);
    expect(previewParameters.populationGrowthRate).toBe(defaultGlobalParameters.populationGrowthRate);
    expect(previewParameters.populationLimit).toBe(globalParameters.populationLimit);
  });

  it('keeps saved values for finite numbers the parameter rules reject (typed mid-edit)', () => {
    // Each of these crashed the editor when fed into the preview math:
    // assertValidGlobalParameters throws on them.
    const previewParameters = resolveFutureValuePreviewParameters(globalParameters, defaultGlobalParameters, {
      timeLimit: { raw: 0 },
      discountRate: { raw: -0.01 },
      populationLimit: { raw: -1 },
    });

    expect(previewParameters.timeLimit).toBe(globalParameters.timeLimit);
    expect(previewParameters.discountRate).toBe(globalParameters.discountRate);
    expect(previewParameters.populationLimit).toBe(globalParameters.populationLimit);

    const negativeTimeLimit = resolveFutureValuePreviewParameters(globalParameters, defaultGlobalParameters, {
      timeLimit: { raw: -1 },
    });
    expect(negativeTimeLimit.timeLimit).toBe(globalParameters.timeLimit);
  });

  it('returns null when required inputs are missing', () => {
    expect(resolveFutureValuePreviewParameters(null, {}, {})).toBeNull();
    expect(resolveFutureValuePreviewParameters({}, null, {})).toBeNull();
  });
});

describe('calculateFutureValueSeries', () => {
  it('calculates discounted life-equivalent value per future year', () => {
    const result = calculateFutureValueSeries(
      {
        currentPopulation: 100,
        populationGrowthRate: 0,
        populationLimit: 10,
        discountRate: 0.1,
        timeLimit: 2,
        yearsPerLife: 10,
      },
      { currentYear: 2030 }
    );
    const { points, totalFutureLives, seriesMetadata } = result;

    expect(points).toHaveLength(3);
    expect(points[0].year).toBe(2030);
    expect(points[0]['future-value']).toBeCloseTo(100, 6);
    expect(points[1]['future-value']).toBeCloseTo(100 / 1.1, 6);
    expect(points[2]['future-value']).toBeCloseTo(100 / Math.pow(1.1, 2), 6);
    expect(totalFutureLives).toBeCloseTo(calculateFutureValueTotal(points) / 10, 6);
    expect(seriesMetadata).toEqual([
      expect.objectContaining({
        id: 'future-value',
        totalLives: totalFutureLives,
      }),
    ]);
  });

  it('applies the population limit when future growth reaches it', () => {
    const { points } = calculateFutureValueSeries(
      {
        currentPopulation: 100,
        populationGrowthRate: 0.1,
        populationLimit: 1.05,
        discountRate: 0,
        timeLimit: 2,
        yearsPerLife: 10,
      },
      { currentYear: 2030 }
    );

    expect(points[0]['future-value']).toBeCloseTo(100, 6);
    expect(points[1]['future-value']).toBeCloseTo(105, 6);
    expect(points[2]['future-value']).toBeCloseTo(105, 6);
  });

  it('downsamples long horizons while still including the final year', () => {
    const { points } = calculateFutureValueSeries(
      {
        currentPopulation: 100,
        populationGrowthRate: 0.01,
        populationLimit: 10,
        discountRate: 0,
        timeLimit: 1000,
        yearsPerLife: 10,
      },
      { currentYear: 2030 }
    );

    expect(points.length).toBeLessThanOrEqual(240);
    expect(points[0].year).toBe(2030);
    expect(points[points.length - 1].year).toBeCloseTo(3030, 10);
  });

  it('concentrates samples on the visible decay when discounting empties a long horizon', () => {
    // 1% discounting decays the series to nothing within a few thousand years.
    // Uniform sampling over the million-year window would put that entire decay
    // inside one ~4,200-year step: a single visible point and a trapezoid total
    // ~20x too high.
    const { points, totalFutureLives } = calculateFutureValueSeries(
      {
        currentPopulation: 8_000_000_000,
        populationGrowthRate: 0,
        populationLimit: 10,
        discountRate: 0.01,
        timeLimit: 1_000_000,
        yearsPerLife: 80,
      },
      { currentYear: 2030 }
    );

    const visiblePoints = points.filter((point) => point['future-value'] > NONZERO_EPSILON);
    expect(visiblePoints.length).toBeGreaterThan(100);
    expect(points.length).toBeLessThanOrEqual(241);
    expect(points[points.length - 1].year).toBeCloseTo(1_002_030, 6);

    // Flat population, so the exact integral is closed-form.
    const analyticTotal = (8_000_000_000 * (1 - Math.pow(1.01, -1_000_000))) / Math.log(1.01) / 80;
    expect(Math.abs(totalFutureLives - analyticTotal) / analyticTotal).toBeLessThan(0.02);
  });

  it('concentrates samples the same way when a shrinking population empties the horizon', () => {
    const { points } = calculateFutureValueSeries(
      {
        currentPopulation: 8_000_000_000,
        populationGrowthRate: -0.01,
        populationLimit: 10,
        discountRate: 0,
        timeLimit: 1_000_000,
        yearsPerLife: 80,
      },
      { currentYear: 2030 }
    );

    const visiblePoints = points.filter((point) => point['future-value'] > NONZERO_EPSILON);
    expect(visiblePoints.length).toBeGreaterThan(100);
    expect(points[points.length - 1].year).toBeCloseTo(1_002_030, 6);
  });

  it('keeps uniform sampling across the full window when nothing decays', () => {
    const { points } = calculateFutureValueSeries(
      {
        currentPopulation: 100,
        populationGrowthRate: 0.01,
        populationLimit: 10,
        discountRate: 0,
        timeLimit: 1_000_000,
        yearsPerLife: 80,
      },
      { currentYear: 2030 }
    );

    expect(points.length).toBeLessThanOrEqual(240);
    expect(points[1].year - points[0].year).toBeGreaterThan(4000);
    expect(points.every((point) => point['future-value'] > NONZERO_EPSILON)).toBe(true);
    expect(points[points.length - 1].year).toBeCloseTo(1_002_030, 6);
  });

  it('throws for invalid global parameter values instead of silently coercing them', () => {
    expect(() =>
      calculateFutureValueSeries({
        currentPopulation: 100,
        populationGrowthRate: -1,
        populationLimit: 10,
        discountRate: 0.1,
        timeLimit: 2,
        yearsPerLife: 10,
      })
    ).toThrow(/cannot be -100% or less/);
  });
});

describe('calculateFutureValueTotal', () => {
  it('returns 0 for empty or single-point inputs', () => {
    expect(calculateFutureValueTotal([])).toBe(0);
    expect(calculateFutureValueTotal([{ year: 2030, 'future-value': 100 }])).toBe(0);
  });
});
