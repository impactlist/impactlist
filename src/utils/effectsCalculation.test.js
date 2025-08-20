import { describe, it, expect } from 'vitest';
import { calculateCostPerLife, effectToCostPerLife, calculateCombinedCostPerLife } from './effectsCalculation';

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
      const result = effectToCostPerLife(effect, baseGlobalParams);
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
      const result = effectToCostPerLife(effect, baseGlobalParams);
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
      const result = effectToCostPerLife(effect, baseGlobalParams);
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
        const costNoDiscount = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0 });
        const costWithDiscount = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.02 });

        expect(costNoDiscount).toBeLessThan(costWithDiscount);
      });

      it('should increase cost as discount rate increases', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const cost1 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.01 });
        const cost2 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.02 });
        const cost5 = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0.05 });

        expect(cost1).toBeLessThan(cost2);
        expect(cost2).toBeLessThan(cost5);
      });

      it('should have higher cost for later effects when discount > 0', () => {
        const earlyEffect = createQALYEffect(1000, 5, 10);
        const lateEffect = createQALYEffect(1000, 20, 10);
        const params = { ...baseGlobalParams, discountRate: 0.03 };

        const earlyCost = effectToCostPerLife(earlyEffect, params);
        const lateCost = effectToCostPerLife(lateEffect, params);

        expect(earlyCost).toBeLessThan(lateCost);
      });

      it('should have same cost for different start times when discount = 0', () => {
        const earlyEffect = createQALYEffect(1000, 5, 10);
        const lateEffect = createQALYEffect(1000, 20, 10);
        const params = { ...baseGlobalParams, discountRate: 0 };

        const earlyCost = effectToCostPerLife(earlyEffect, params);
        const lateCost = effectToCostPerLife(lateEffect, params);

        expect(earlyCost).toBeCloseTo(lateCost, 10);
      });
    });

    describe('Time Window Effects (QALY)', () => {
      it('should have same cost regardless of window length when discount = 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0 };
        const pulseEffect = createQALYEffect(1000, 10, 0);
        const shortWindow = createQALYEffect(1000, 10, 5);
        const longWindow = createQALYEffect(1000, 10, 30);

        const pulseCost = effectToCostPerLife(pulseEffect, params);
        const shortCost = effectToCostPerLife(shortWindow, params);
        const longCost = effectToCostPerLife(longWindow, params);

        expect(pulseCost).toBeCloseTo(shortCost, 10);
        expect(shortCost).toBeCloseTo(longCost, 10);
      });

      it('should have higher cost with longer window when discount > 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0.03 };
        const pulseEffect = createQALYEffect(1000, 0, 0);
        const shortWindow = createQALYEffect(1000, 0, 5);
        const longWindow = createQALYEffect(1000, 0, 20);

        const pulseCost = effectToCostPerLife(pulseEffect, params);
        const shortCost = effectToCostPerLife(shortWindow, params);
        const longCost = effectToCostPerLife(longWindow, params);

        expect(pulseCost).toBeLessThan(shortCost);
        expect(shortCost).toBeLessThan(longCost);
      });

      it('should have higher cost when window extends past time limit', () => {
        const params = { ...baseGlobalParams, discountRate: 0.02, timeLimit: 50 };
        const withinLimit = createQALYEffect(1000, 30, 15);
        const pastLimit = createQALYEffect(1000, 30, 25); // extends to year 55

        const withinCost = effectToCostPerLife(withinLimit, params);
        const pastCost = effectToCostPerLife(pastLimit, params);

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

        const cost20 = effectToCostPerLife(window20, params);
        const cost30 = effectToCostPerLife(window30, params);
        const cost50 = effectToCostPerLife(window50, params);

        // All should have the same cost since they're all truncated to 10 years
        expect(cost20).toBeCloseTo(cost30, 10);
        expect(cost30).toBeCloseTo(cost50, 10);

        // Also test that they match a window that exactly fits the limit
        const windowExact = createQALYEffect(1000, startTime, 10); // exactly to year 40
        const costExact = effectToCostPerLife(windowExact, params);
        expect(cost20).toBeCloseTo(costExact, 10);
      });
    });

    describe('Population Growth Effects', () => {
      it('should have lower cost with positive growth than zero growth', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const zeroGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0 });
        const positiveGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.01 });

        expect(positiveGrowth).toBeLessThan(zeroGrowth);
      });

      it('should have higher cost with negative growth than zero growth', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const zeroGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0 });
        const negativeGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: -0.01 });

        expect(negativeGrowth).toBeGreaterThan(zeroGrowth);
      });

      it('should have lower cost with higher positive growth rates', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const lowGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.005 });
        const medGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.01 });
        const highGrowth = effectToCostPerLife(effect, { ...baseGlobalParams, populationGrowthRate: 0.02 });

        expect(highGrowth).toBeLessThan(medGrowth);
        expect(medGrowth).toBeLessThan(lowGrowth);
      });

      it('should have lower cost with higher population limit when growth > 0', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 50);
        const params = { ...baseGlobalParams, populationGrowthRate: 0.02 };
        const lowLimit = effectToCostPerLife(effect, { ...params, populationLimit: 1.5 });
        const highLimit = effectToCostPerLife(effect, { ...params, populationLimit: 3 });

        expect(highLimit).toBeLessThan(lowLimit);
      });

      it('should have no effect from population limit when growth = 0', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const params = { ...baseGlobalParams, populationGrowthRate: 0 };
        const limit1 = effectToCostPerLife(effect, { ...params, populationLimit: 1.5 });
        const limit2 = effectToCostPerLife(effect, { ...params, populationLimit: 3 });

        expect(limit1).toBeCloseTo(limit2, 10);
      });
    });

    describe('Combined Growth and Discount Effects', () => {
      it('should have lower cost when growth > discount', () => {
        const effect = createPopEffect(100, 0.1, 1, 10, 20);
        const growthDominates = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.04,
          discountRate: 0.02,
        });
        const balanced = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.02,
          discountRate: 0.02,
        });

        expect(growthDominates).toBeLessThan(balanced);
      });

      it('should have higher cost when growth < discount', () => {
        const effect = createPopEffect(100, 0.1, 1, 10, 20);
        const discountDominates = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.01,
          discountRate: 0.03,
        });
        const balanced = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.02,
          discountRate: 0.02,
        });

        expect(discountDominates).toBeGreaterThan(balanced);
      });

      it('should handle near-equal growth and discount rates (numerical stability)', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 20);
        const almostEqual = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.02000001,
          discountRate: 0.02,
        });
        const exactlyEqual = effectToCostPerLife(effect, {
          ...baseGlobalParams,
          populationGrowthRate: 0.02,
          discountRate: 0.02,
        });

        // Should be very close but not cause numerical issues
        expect(Math.abs(almostEqual - exactlyEqual) / exactlyEqual).toBeLessThan(0.001);
      });
    });

    describe('Population-Specific Parameters', () => {
      it('should halve cost when doubling population fraction', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(100, 0.2, 1, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams);

        expect(doubleCost).toBeCloseTo(baseCost / 2, 5);
      });

      it('should halve cost when doubling QALY improvement per year', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(100, 0.1, 2, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams);

        expect(doubleCost).toBeCloseTo(baseCost / 2, 5);
      });

      it('should double cost when doubling cost per microprobability', () => {
        const baseEffect = createPopEffect(100, 0.1, 1, 0, 10);
        const doubleEffect = createPopEffect(200, 0.1, 1, 0, 10);

        const baseCost = effectToCostPerLife(baseEffect, baseGlobalParams);
        const doubleCost = effectToCostPerLife(doubleEffect, baseGlobalParams);

        expect(doubleCost).toBeCloseTo(baseCost * 2, 5);
      });

      it('should have lower cost with larger initial population', () => {
        const effect = createPopEffect(100, 0.1, 1, 0, 10);
        const smallPop = effectToCostPerLife(effect, { ...baseGlobalParams, currentPopulation: 1000000000 });
        const largePop = effectToCostPerLife(effect, { ...baseGlobalParams, currentPopulation: 10000000000 });

        expect(largePop).toBeLessThan(smallPop);
      });
    });

    describe('Parameter Sensitivity', () => {
      it('should double cost when doubling years per life', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const base = effectToCostPerLife(effect, baseGlobalParams);
        const double = effectToCostPerLife(effect, { ...baseGlobalParams, yearsPerLife: 100 });

        expect(double).toBeCloseTo(base * 2, 5);
      });

      it('should increase cost exponentially with start time when discount > 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0.05 };
        const time0 = effectToCostPerLife(createQALYEffect(1000, 0, 5), params);
        const time10 = effectToCostPerLife(createQALYEffect(1000, 10, 5), params);
        const time20 = effectToCostPerLife(createQALYEffect(1000, 20, 5), params);

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
        const single = effectToCostPerLife(effect, baseGlobalParams);
        const double = calculateCombinedCostPerLife([single, single]);

        expect(double).toBeCloseTo(single / 2, 5);
      });

      it('should scale proportionally with monetary values', () => {
        const base = createQALYEffect(1000, 0, 10);
        const scaled = createQALYEffect(2500, 0, 10);

        const baseCost = effectToCostPerLife(base, baseGlobalParams);
        const scaledCost = effectToCostPerLife(scaled, baseGlobalParams);

        expect(scaledCost).toBeCloseTo(baseCost * 2.5, 5);
      });

      it('should have averageDiscountFactor = 1 when discountRate = 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0 };
        const pulse = createQALYEffect(1000, 10, 0);
        const window = createQALYEffect(1000, 10, 20);

        // Since averageDiscountFactor = 1, cost = costPerQALY * yearsPerLife
        const expectedCost = 1000 * 50;

        const pulseCost = effectToCostPerLife(pulse, params);
        const windowCost = effectToCostPerLife(window, params);

        expect(pulseCost).toBeCloseTo(expectedCost, 10);
        expect(windowCost).toBeCloseTo(expectedCost, 10);
      });
    });

    describe('Edge Cases', () => {
      it('should handle very small rates near 1e-10', () => {
        const effect = createQALYEffect(1000, 0, 10);
        const tinyRate = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 1e-11 });
        const zeroRate = effectToCostPerLife(effect, { ...baseGlobalParams, discountRate: 0 });

        expect(tinyRate).toBeCloseTo(zeroRate, 8);
      });

      it('should handle very large windows', () => {
        const shortWindow = createQALYEffect(1000, 0, 10);
        const longWindow = createQALYEffect(1000, 0, 1000);
        const params = { ...baseGlobalParams, timeLimit: 1100, discountRate: 0.01 };

        const shortCost = effectToCostPerLife(shortWindow, params);
        const longCost = effectToCostPerLife(longWindow, params);

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

        const cost = effectToCostPerLife(effect, params);
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

        const cost1 = effectToCostPerLife(effect, params1);
        const cost2 = effectToCostPerLife(effect, params2);

        // Should be stable and continuous near the critical point
        expect(Math.abs(cost1 - cost2) / cost1).toBeLessThan(0.01);
      });
    });

    describe('Population Window Scaling', () => {
      it('should scale cost inversely with window length when growth and discount are zero', () => {
        const params = { ...baseGlobalParams, populationGrowthRate: 0, discountRate: 0 };
        const short = createPopEffect(100, 0.1, 1, 0, 10);
        const long = createPopEffect(100, 0.1, 1, 0, 40);

        const shortCost = effectToCostPerLife(short, params);
        const longCost = effectToCostPerLife(long, params);

        // 4x window should give 1/4 cost
        expect(longCost).toBeCloseTo(shortCost / 4, 5);
      });

      it('should reduce cost more than proportionally with longer windows when growth > 0', () => {
        const params = { ...baseGlobalParams, populationGrowthRate: 0.02, discountRate: 0 };
        const short = createPopEffect(100, 0.1, 1, 0, 10);
        const long = createPopEffect(100, 0.1, 1, 0, 20);

        const shortCost = effectToCostPerLife(short, params);
        const longCost = effectToCostPerLife(long, params);

        // With growth, doubling window should more than halve cost
        expect(longCost).toBeLessThan(shortCost / 2);
      });
    });
  });
});
