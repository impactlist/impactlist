import { describe, expect, it } from 'vitest';
import {
  calculateFutureValueSeries,
  calculateFutureValueTotal,
  resolveFutureValuePreviewParameters,
} from './futureValueVisualization';

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
    ).toThrow(/greater than -100%/);
  });
});

describe('calculateFutureValueTotal', () => {
  it('returns 0 for empty or single-point inputs', () => {
    expect(calculateFutureValueTotal([])).toBe(0);
    expect(calculateFutureValueTotal([{ year: 2030, 'future-value': 100 }])).toBe(0);
  });
});
