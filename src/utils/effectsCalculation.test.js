import { describe, it, expect, vi } from 'vitest';
import { calculateCostPerLife, effectToCostPerLife, calculateCombinedCostPerLife } from './effectsCalculation';

// Mock getCurrentYear to have consistent test results
vi.mock('./donationDataHelpers', async () => {
  const actual = await vi.importActual('./donationDataHelpers');
  return {
    ...actual,
    getCurrentYear: vi.fn(() => 2024),
  };
});

describe('effectsCalculation', () => {
  const baseGlobalParams = {
    yearsPerLife: 50,
    discountRate: 0.02,
    timeLimit: 100,
    currentPopulation: 8000000000,
    populationGrowthRate: 0.01,
    populationLimit: 2,
  };

  describe('calculateCostPerLife', () => {
    it('should throw for empty effects array', () => {
      expect(() => calculateCostPerLife([], baseGlobalParams, 2020)).toThrow('Field effects cannot be empty');
    });

    it('should throw when year is missing or invalid', () => {
      const effects = [{ type: 'qaly', costPerQALY: 1000, startTime: 0, windowLength: 10 }];
      expect(() => calculateCostPerLife(effects, baseGlobalParams)).toThrow('calculationYear must be an integer');
      expect(() => calculateCostPerLife(effects, baseGlobalParams, null)).toThrow('calculationYear must be an integer');
      expect(() => calculateCostPerLife(effects, baseGlobalParams, '2020')).toThrow(
        'calculationYear must be an integer'
      );
    });

    it('should handle single QALY effect', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle single population effect', () => {
      const effects = [
        {
          type: 'population',
          costPerMicroprobability: 100,
          populationFractionAffected: 0.1,
          qalyImprovementPerYear: 1,
          startTime: 0,
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle multiple effects', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 10,
        },
        {
          type: 'qaly',
          costPerQALY: 2000,
          startTime: 10,
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle effects with zero window length (pulse)', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 0, // Pulse effect
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle effects starting after time limit', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 200, // After timeLimit of 100
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBe(Infinity);
    });

    it('should handle zero discount rate', () => {
      const params = { ...baseGlobalParams, discountRate: 0 };
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, params, 2020);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle negative QALY effects', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: -1000, // Negative cost (benefit)
          startTime: 0,
          windowLength: 10,
        },
      ];
      const result = calculateCostPerLife(effects, baseGlobalParams, 2020);
      expect(result).toBeLessThan(0);
    });

    it('should throw for invalid effect type', () => {
      const effects = [
        {
          type: 'invalid',
          someField: 1000,
        },
      ];
      expect(() => calculateCostPerLife(effects, baseGlobalParams)).toThrow();
    });
  });

  describe('effectToCostPerLife', () => {
    it('should convert QALY effect correctly', () => {
      const effect = {
        type: 'qaly',
        costPerQALY: 1000,
        startTime: 0,
        windowLength: 10,
      };
      const result = effectToCostPerLife(effect, baseGlobalParams, 2024);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should convert population effect correctly', () => {
      const effect = {
        type: 'population',
        costPerMicroprobability: 100,
        populationFractionAffected: 0.1,
        qalyImprovementPerYear: 1,
        startTime: 0,
        windowLength: 10,
      };
      const result = effectToCostPerLife(effect, baseGlobalParams, 2024);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(Infinity);
    });

    it('should handle effect with Infinity cost per life', () => {
      const effect = {
        type: 'qaly',
        costPerQALY: 1000,
        startTime: 200, // After time limit
        windowLength: 10,
      };
      const result = effectToCostPerLife(effect, baseGlobalParams, 2024);
      expect(result).toBe(Infinity);
    });
  });

  // ============================================================================
  // Relative Comparison Tests - Comprehensive Mathematical Validation
  // ============================================================================

  describe('Relative Cost Comparisons', () => {
    // Helper function to create QALY effect
    const createQALYEffect = (costPerQALY, startTime, windowLength) => ({
      costPerQALY,
      startTime,
      windowLength,
    });

    // Helper function to create population effect
    const createPopEffect = (costPerMicroprobability, fraction, qalyPerYear, startTime, windowLength) => ({
      costPerMicroprobability,
      populationFractionAffected: fraction,
      qalyImprovementPerYear: qalyPerYear,
      startTime,
      windowLength,
    });

    describe('Discount Rate Effects (QALY)', () => {
      it('should have lower cost with zero discount than positive discount', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const costNoDiscount = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0 }, 2024);
        const costWithDiscount = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.02 }, 2024);

        expect(costNoDiscount).toBeLessThan(costWithDiscount);
      });

      it('should increase cost as discount rate increases', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const cost1 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.01 }, 2024);
        const cost2 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.02 }, 2024);
        const cost5 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.05 }, 2024);

        expect(cost1).toBeLessThan(cost2);
        expect(cost2).toBeLessThan(cost5);
      });

      it('should have higher cost for later effects when discount > 0', () => {
        const earlyEffect = createQALYEffect(1000, 5, 10);
        const lateEffect = createQALYEffect(1000, 20, 10);
        const params = { ...baseGlobalParams, discountRate: 0.03 };

        const earlyCost = effectToCostPerLife(earlyEffect, params, 2024);
        const lateCost = effectToCostPerLife(lateEffect, params, 2024);

        expect(earlyCost).toBeLessThan(lateCost);
      });

      it('should have same cost for different start times when discount = 0', () => {
        const earlyEffect = createQALYEffect(1000, 5, 10);
        const lateEffect = createQALYEffect(1000, 20, 10);
        const params = { ...baseGlobalParams, discountRate: 0 };

        const earlyCost = effectToCostPerLife(earlyEffect, params, 2024);
        const lateCost = effectToCostPerLife(lateEffect, params, 2024);

        expect(earlyCost).toBeCloseTo(lateCost, 10);
      });
    });

    describe('Time Window Effects (QALY)', () => {
      it('should have same cost regardless of window length when discount = 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0 };
        const pulseEffect = createQALYEffect(1000, 10, 0);
        const shortWindow = createQALYEffect(1000, 10, 5);
        const longWindow = createQALYEffect(1000, 10, 30);

        const pulseCost = effectToCostPerLife(pulseEffect, params, 2024);
        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const longCost = effectToCostPerLife(longWindow, params, 2024);

        expect(pulseCost).toBeCloseTo(shortCost, 10);
        expect(shortCost).toBeCloseTo(longCost, 10);
      });

      it('should have higher cost with longer window when discount > 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0.03 };
        const pulseEffect = createQALYEffect(1000, 0, 0);
        const shortWindow = createQALYEffect(1000, 0, 5);
        const longWindow = createQALYEffect(1000, 0, 20);

        const pulseCost = effectToCostPerLife(pulseEffect, params, 2024);
        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const longCost = effectToCostPerLife(longWindow, params, 2024);

        expect(pulseCost).toBeLessThan(shortCost);
        expect(shortCost).toBeLessThan(longCost);
      });

      it('should have higher cost when window extends past time limit', () => {
        const params = { ...baseGlobalParams, discountRate: 0.02, timeLimit: 50 };
        const withinLimit = createQALYEffect(1000, 30, 15);
        const pastLimit = createQALYEffect(1000, 30, 25); // extends to year 55

        const withinCost = effectToCostPerLife(withinLimit, params, 2024);
        const pastCost = effectToCostPerLife(pastLimit, params, 2024);

        expect(withinCost).toBeLessThan(pastCost);
      });

      it('should have same cost for different window lengths that both extend past time limit', () => {
        const params = { ...baseGlobalParams, discountRate: 0.03, timeLimit: 40 };
        const startTime = 30;

        // Both effects start at year 30 and extend past the time limit of 40
        // They should both be truncated to 10 years (40 - 30)
        const window20 = createQALYEffect(1000, startTime, 20); // extends to year 50
        const window30 = createQALYEffect(1000, startTime, 30); // extends to year 60
        const window50 = createQALYEffect(1000, startTime, 50); // extends to year 80

        const cost20 = effectToCostPerLife(window20, params, 2024);
        const cost30 = effectToCostPerLife(window30, params, 2024);
        const cost50 = effectToCostPerLife(window50, params, 2024);

        // All should have the same cost since they're all truncated to 10 years
        expect(cost20).toBeCloseTo(cost30, 10);
        expect(cost30).toBeCloseTo(cost50, 10);

        // Also test that they match a window that exactly fits the limit
        const windowExact = createQALYEffect(1000, startTime, 10); // exactly to year 40
        const costExact = effectToCostPerLife(windowExact, params, 2024);
        expect(cost20).toBeCloseTo(costExact, 10);
      });
    });

    describe('Population Growth Effects', () => {
      it('should have lower cost with positive growth than zero growth', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const zeroGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0 }, 2024);
        const positiveGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.01 }, 2024);

        expect(positiveGrowth).toBeLessThan(zeroGrowth);
      });

      it('should have higher cost with negative growth than zero growth', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const zeroGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0 }, 2024);
        const negativeGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: -0.01 }, 2024);

        expect(negativeGrowth).toBeGreaterThan(zeroGrowth);
      });

      it('should have lower cost with higher positive growth rates', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const lowGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.005 }, 2024);
        const medGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.01 }, 2024);
        const highGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.02 }, 2024);

        expect(highGrowth).toBeLessThan(medGrowth);
        expect(medGrowth).toBeLessThan(lowGrowth);
      });

      it('should have lower cost with higher population limit when growth > 0', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 50);
        const params = { ...baseGlobalParams, populationGrowthRate: 0.02 };
        const lowLimit = effectToCostPerLife(effect, { ...params, populationLimit: 1.5 }, 2024);
        const highLimit = effectToCostPerLife(effect, { ...params, populationLimit: 3 }, 2024);

        expect(highLimit).toBeLessThan(lowLimit);
      });

      it('should have no effect from population limit when growth = 0', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const params = { ...baseGlobalParams, populationGrowthRate: 0 };
        const limit1 = effectToCostPerLife(effect, { ...params, populationLimit: 1.5 }, 2024);
        const limit2 = effectToCostPerLife(effect, { ...params, populationLimit: 3 }, 2024);

        expect(limit1).toBeCloseTo(limit2, 10);
      });
    });

    describe('Combined Growth and Discount Effects', () => {
      it('should have lower cost when growth > discount', () => {
        const effect = createPopEffect(100, 0.1, 1, 10, 20);
        const growthDominates = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.04,
            discountRate: 0.02,
          },
          2024
        );
        const balanced = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.02,
            discountRate: 0.02,
          },
          2024
        );

        expect(growthDominates).toBeLessThan(balanced);
      });

      it('should have higher cost when growth < discount', () => {
        const effect = createPopEffect(100, 0.1, 1, 10, 20);
        const discountDominates = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.01,
            discountRate: 0.03,
          },
          2024
        );
        const balanced = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.02,
            discountRate: 0.02,
          },
          2024
        );

        expect(discountDominates).toBeGreaterThan(balanced);
      });

      it('should handle near-equal growth and discount rates (numerical stability)', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const almostEqual = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.02000001,
            discountRate: 0.02,
          },
          2024
        );
        const exactlyEqual = effectToCostPerLife(
          effect,
          {
            ...baseGlobalParams,
            populationGrowthRate: 0.02,
            discountRate: 0.02,
          },
          2024
        );

        // Should be very close but not cause numerical issues
        expect(Math.abs(almostEqual - exactlyEqual) / exactlyEqual).toBeLessThan(0.001);
      });
    });

    describe('Population-Specific Parameters', () => {
      it('should halve cost when doubling population fraction', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(100, 0.2, 1, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams, 2024);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams, 2024);

        expect(doubleCost).toBeCloseTo(baseCost / 2, 5);
      });

      it('should halve cost when doubling QALY improvement per year', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(100, 0.1, 2, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams, 2024);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams, 2024);

        expect(doubleCost).toBeCloseTo(baseCost / 2, 5);
      });

      it('should double cost when doubling cost per microprobability', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(200, 0.1, 1, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams, 2024);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams, 2024);

        expect(doubleCost).toBeCloseTo(baseCost * 2, 5);
      });

      it('should have lower cost with larger initial population', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const smallPop = effectToCostPerLife(effect, { ...baseGlobalParams, currentPopulation: 1000000000 }, 2024);
        const largePop = effectToCostPerLife(effect, { ...baseGlobalParams, currentPopulation: 10000000000 }, 2024);

        expect(largePop).toBeLessThan(smallPop);
      });
    });

    describe('Parameter Sensitivity', () => {
      it('should double cost when doubling years per life', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const base = effectToCostPerLife(effect, baseGlobalParams, 2024);
        const double = effectToCostPerLife(effect, { ...baseGlobalParams, yearsPerLife: 100 }, 2024);

        expect(double).toBeCloseTo(base * 2, 5);
      });

      it('should increase cost exponentially with start time when discount > 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0.05 };
        const time0 = effectToCostPerLife(createQALYEffect(1000, 0, 5), params, 2024);
        const time10 = effectToCostPerLife(createQALYEffect(1000, 10, 5), params, 2024);
        const time20 = effectToCostPerLife(createQALYEffect(1000, 20, 5), params, 2024);

        // Cost should grow exponentially
        const ratio1 = time10 / time0;
        const ratio2 = time20 / time10;

        expect(ratio2).toBeCloseTo(ratio1, 1);
        expect(ratio1).toBeCloseTo(Math.pow(1.05, 10), 1);
      });
    });

    describe('Mathematical Consistency', () => {
      it('should maintain reciprocal relationships for combined effects', () => {
        const cost1 = 50000;
        const cost2 = 100000;
        const combined = calculateCombinedCostPerLife([cost1, cost2]);

        const expectedLivesPerDollar = 1 / cost1 + 1 / cost2;
        const expectedCombined = 1 / expectedLivesPerDollar;

        expect(combined).toBeCloseTo(expectedCombined, 10);
      });

      it('should have half the cost when combining two identical effects', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const single = effectToCostPerLife(effect, baseGlobalParams, 2024);
        const double = calculateCombinedCostPerLife([single, single]);

        expect(double).toBeCloseTo(single / 2, 5);
      });

      it('should scale proportionally with monetary values', () => {
        const base = createQALYEffect(1000, 0, 10);
        const scaled = createQALYEffect(2500, 0, 10);

        const baseCost = effectToCostPerLife(base, baseGlobalParams, 2024);
        const scaledCost = effectToCostPerLife(scaled, baseGlobalParams, 2024);

        expect(scaledCost).toBeCloseTo(baseCost * 2.5, 5);
      });

      it('should have averageDiscountFactor = 1 when discountRate = 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0 };
        const pulse = createQALYEffect(1000, 10, 0);
        const window = createQALYEffect(1000, 10, 20);

        // Since averageDiscountFactor = 1, cost = costPerQALY * yearsPerLife
        const expectedCost = 1000 * 50;

        const pulseCost = effectToCostPerLife(pulse, params, 2024);
        const windowCost = effectToCostPerLife(window, params, 2024);

        expect(pulseCost).toBeCloseTo(expectedCost, 10);
        expect(windowCost).toBeCloseTo(expectedCost, 10);
      });
    });

    describe('Edge Cases', () => {
      it('should handle very small rates near 1e-10', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const tinyRate = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 1e-11 }, 2024);
        const zeroRate = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0 }, 2024);

        expect(tinyRate).toBeCloseTo(zeroRate, 8);
      });

      it('should handle very large windows', () => {
        const shortWindow = createQALYEffect(1000, 0, 10);
        const longWindow = createQALYEffect(1000, 0, 1000);
        const params = { ...baseGlobalParams, timeLimit: 1100, discountRate: 0.01 };

        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const longCost = effectToCostPerLife(longWindow, params, 2024);

        expect(longCost).toBeGreaterThan(shortCost);
        expect(longCost).toBeLessThan(Infinity);
      });

      it('should handle population at limit', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const params = {
          ...baseGlobalParams,
          currentPopulation: 8000000000,
          populationLimit: 1, // Population already at limit
          populationGrowthRate: 0.01,
        };

        const cost = effectToCostPerLife(effect, params, 2024);
        expect(cost).toBeGreaterThan(0);
        expect(cost).toBeLessThan(Infinity);
      });

      it('should handle combined rate near zero (growth ≈ discount)', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const params1 = {
          ...baseGlobalParams,
          populationGrowthRate: 0.020001,
          discountRate: 0.02,
        };
        const params2 = {
          ...baseGlobalParams,
          populationGrowthRate: 0.019999,
          discountRate: 0.02,
        };

        const cost1 = effectToCostPerLife(effect, params1, 2024);
        const cost2 = effectToCostPerLife(effect, params2, 2024);

        // Should be stable and continuous near the critical point
        expect(Math.abs(cost1 - cost2) / cost1).toBeLessThan(0.01);
      });
    });

    describe('Population Window Scaling', () => {
      it('should scale cost inversely with window length when growth and discount are zero', () => {
        const params = { ...baseGlobalParams, populationGrowthRate: 0, discountRate: 0 };
        const short = createPopEffect(100, 0.1, 1, 0, 10);
        const long = createPopEffect(100, 0.1, 1, 0, 40);

        const shortCost = effectToCostPerLife(short, params, 2024);
        const longCost = effectToCostPerLife(long, params, 2024);

        // 4x window should give 1/4 cost
        expect(longCost).toBeCloseTo(shortCost / 4, 5);
      });

      it('should reduce cost more than proportionally with longer windows when growth > 0', () => {
        const params = { ...baseGlobalParams, populationGrowthRate: 0.02, discountRate: 0 };
        const short = createPopEffect(100, 0.1, 1, 0, 10);
        const long = createPopEffect(100, 0.1, 1, 0, 20);

        const shortCost = effectToCostPerLife(short, params, 2024);
        const longCost = effectToCostPerLife(long, params, 2024);

        // With growth, doubling window should more than halve cost
        expect(longCost).toBeLessThan(shortCost / 2);
      });
    });
  });

  describe('Historical Donation Calculations', () => {
    const createPopEffect = (costPerMicroprobability, fraction, qalyPerYear, startTime, windowLength) => ({
      costPerMicroprobability,
      populationFractionAffected: fraction,
      qalyImprovementPerYear: qalyPerYear,
      startTime,
      windowLength,
    });

    it('should use historical growth rate for past donations with effects in the past', () => {
      const effect = createPopEffect(100, 0.1, 1, 0, 10);
      const params = baseGlobalParams;

      // Donation from 2000 (24 years ago)
      const pastCost = effectToCostPerLife(effect, params, 2000);

      // Donation from 2024 (current year)
      const currentCost = effectToCostPerLife(effect, params, 2024);

      // Past donation should have HIGHER cost because population was smaller in the past
      // (fewer people affected = higher cost per life saved)
      expect(pastCost).toBeGreaterThan(currentCost);

      // Verify both are reasonable values
      expect(pastCost).toBeGreaterThan(0);
      expect(currentCost).toBeGreaterThan(0);
    });

    it('should handle effects spanning past and future correctly', () => {
      // Effect starts 5 years after donation and lasts 30 years
      const effect = createPopEffect(100, 0.1, 1, 5, 30);
      const params = baseGlobalParams;

      // Donation from 2010: effect runs 2015-2045 (spans past/future boundary)
      const spanningCost = effectToCostPerLife(effect, params, 2010);

      // Should be a reasonable value, not infinity
      expect(spanningCost).toBeGreaterThan(0);
      expect(spanningCost).toBeLessThan(Infinity);
    });

    it('should handle past donation with future-only effects', () => {
      // Effect starts 30 years after donation
      const effect = createPopEffect(100, 0.1, 1, 30, 10);
      const params = baseGlobalParams;

      // Donation from 2000: effect runs 2030-2040 (entirely in future)
      const futureCost = effectToCostPerLife(effect, params, 2000);

      // Donation from 2024: effect runs 2054-2064 (also entirely in future)
      const currentFutureCost = effectToCostPerLife(effect, params, 2024);

      // Both should use parameter growth rate for the future period
      // But past donation has longer discounting period
      expect(futureCost).toBeGreaterThan(currentFutureCost);
    });

    it('should show continuity at the current year boundary', () => {
      const effect = createPopEffect(100, 0.1, 1, 0, 20);
      const params = baseGlobalParams;

      // Donation just before current year
      const justBefore = effectToCostPerLife(effect, params, 2023);

      // Donation at current year
      const atCurrent = effectToCostPerLife(effect, params, 2024);

      // Donation just after current year
      const justAfter = effectToCostPerLife(effect, params, 2025);

      // Should show smooth transition (no huge jumps)
      const diff1 = Math.abs(atCurrent - justBefore) / atCurrent;
      const diff2 = Math.abs(justAfter - atCurrent) / atCurrent;

      expect(diff1).toBeLessThan(0.1); // Less than 10% change
      expect(diff2).toBeLessThan(0.1); // Less than 10% change
    });

    it('should handle instantaneous pulse effects in the past correctly', () => {
      const effect = createPopEffect(100, 0.1, 1, 10, 0); // Pulse at year 10
      const params = baseGlobalParams;

      // Donation from 2000: pulse at 2010 (in the past)
      const pastPulse = effectToCostPerLife(effect, params, 2000);

      // Should calculate population at 2010 using historical growth
      expect(pastPulse).toBeGreaterThan(0);
      expect(pastPulse).toBeLessThan(Infinity);
    });

    it('should properly apply population limits only to future periods', () => {
      const effect = createPopEffect(100, 0.1, 1, 0, 50);
      const params = {
        ...baseGlobalParams,
        populationLimit: 1.2, // Low limit to trigger it
        populationGrowthRate: 0.03, // High growth to hit limit quickly
      };

      // Past donation with effect spanning past and future
      const pastDonation = effectToCostPerLife(effect, params, 2000);

      // Future donation
      const futureDonation = effectToCostPerLife(effect, params, 2030);

      // Both should handle population limits but in different ways
      expect(pastDonation).toBeGreaterThan(0);
      expect(futureDonation).toBeGreaterThan(0);
    });

    it('should handle boundary year consistently', () => {
      // Test that effects at exactly the current year are handled correctly
      const pulseEffect = createPopEffect(100, 0.1, 1, 0, 0); // Pulse at donation year
      const windowEffect = createPopEffect(100, 0.1, 1, 0, 1); // 1-year window starting at donation

      // Both at current year (2024)
      const pulseCost = effectToCostPerLife(pulseEffect, baseGlobalParams, 2024);
      const windowCost = effectToCostPerLife(windowEffect, baseGlobalParams, 2024);

      // Both should give similar results (pulse is instantaneous, window is 1 year)
      // They won't be exactly equal due to discounting over the window
      expect(pulseCost).toBeGreaterThan(0);
      expect(windowCost).toBeGreaterThan(0);

      // Test continuity: donation at 2023 vs 2024 should be continuous
      const justBefore = effectToCostPerLife(windowEffect, baseGlobalParams, 2023);
      const atBoundary = effectToCostPerLife(windowEffect, baseGlobalParams, 2024);
      const justAfter = effectToCostPerLife(windowEffect, baseGlobalParams, 2025);

      // Should show smooth progression without jumps
      expect(justBefore).toBeGreaterThan(atBoundary);
      expect(atBoundary).toBeGreaterThan(justAfter);

      // Check the differences are reasonable (no huge jumps)
      const diff1 = (justBefore - atBoundary) / atBoundary;
      const diff2 = (atBoundary - justAfter) / justAfter;
      expect(Math.abs(diff1 - diff2)).toBeLessThan(0.1);
    });

    it('should use different growth rates for historical vs future portions', () => {
      const effect = createPopEffect(100, 0.1, 1, 10, 20); // 10-30 years after donation

      // Test with zero parameter growth but historical growth still applies
      const paramsZeroGrowth = {
        ...baseGlobalParams,
        populationGrowthRate: 0, // No future growth
      };

      // Donation from 2010: effect 2020-2040 (spans boundary)
      const mixedGrowth = effectToCostPerLife(effect, paramsZeroGrowth, 2010);

      // Donation from 2030: effect 2040-2060 (all future, no growth)
      const noGrowth = effectToCostPerLife(effect, paramsZeroGrowth, 2030);

      // 2010 donation's historical portion (2020-2024) had lower population
      // This makes it slightly more expensive (higher cost per life)
      expect(mixedGrowth).toBeGreaterThan(noGrowth);

      // The difference should be small
      const percentDiff = Math.abs(mixedGrowth - noGrowth) / noGrowth;
      expect(percentDiff).toBeLessThan(0.05); // Less than 5% difference
    });
  });
});
