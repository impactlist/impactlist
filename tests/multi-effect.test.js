import { describe, expect, it } from 'vitest';
import { calculateCostPerLife } from '../src/utils/effectsCalculation';

const globalParams = {
  yearsPerLife: 80,
  discountRate: 0.02,
  timeLimit: 100,
  currentPopulation: 8000000000,
  populationGrowthRate: 0.01,
  populationLimit: 2,
};

describe('multi-effect cost-per-life scenarios', () => {
  it('keeps single-effect behavior unchanged', () => {
    const effects = [
      {
        effectId: 'single',
        startTime: 0,
        windowLength: 1,
        costPerQALY: 100,
      },
    ];

    const result = calculateCostPerLife(effects, { ...globalParams, discountRate: 0 }, 2020);
    expect(result).toBe(8000);
  });

  it('combines separated effects via harmonic sum', () => {
    const earlyEffect = {
      effectId: 'early',
      startTime: 0,
      windowLength: 10,
      costPerQALY: 50,
    };
    const lateEffect = {
      effectId: 'late',
      startTime: 10,
      windowLength: 20,
      costPerQALY: 100,
    };

    const earlyOnly = calculateCostPerLife([earlyEffect], globalParams, 2020);
    const lateOnly = calculateCostPerLife([lateEffect], globalParams, 2020);
    const combined = calculateCostPerLife([earlyEffect, lateEffect], globalParams, 2020);
    const expectedCombined = 1 / (1 / earlyOnly + 1 / lateOnly);

    expect(combined).toBeCloseTo(expectedCombined, 10);
    expect(combined).toBeLessThan(earlyOnly);
    expect(combined).toBeLessThan(lateOnly);
  });

  it('handles overlapping effects and still improves over base effect alone', () => {
    const baseEffect = {
      effectId: 'base',
      startTime: 0,
      windowLength: 30,
      costPerQALY: 100,
    };
    const boostEffect = {
      effectId: 'boost',
      startTime: 5,
      windowLength: 10,
      costPerQALY: 50,
    };

    const baseOnly = calculateCostPerLife([baseEffect], globalParams, 2020);
    const overlapCombined = calculateCostPerLife([baseEffect, boostEffect], globalParams, 2020);
    const expectedCombined = 1 / (1 / baseOnly + 1 / calculateCostPerLife([boostEffect], globalParams, 2020));

    expect(overlapCombined).toBeCloseTo(expectedCombined, 10);
    expect(overlapCombined).toBeLessThan(baseOnly);
    expect(Number.isFinite(overlapCombined)).toBe(true);
  });
});
