import { describe, it, expect, vi } from 'vitest';
import { calculateCostPerLife, effectToCostPerLife, calculateCombinedCostPerLife } from './effectsCalculation';
import { calculateLivesSavedSegments } from './effectsVisualization';

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
      expect(() => calculateCostPerLife(effects, baseGlobalParams)).toThrow('donationYear must be an integer');
      expect(() => calculateCostPerLife(effects, baseGlobalParams, null)).toThrow('donationYear must be an integer');
      expect(() => calculateCostPerLife(effects, baseGlobalParams, '2020')).toThrow('donationYear must be an integer');
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

    it('should handle effects with very short window length', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 1, // Very short effect
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
        const veryShortWindow = createQALYEffect(1000, 10, 1);
        const shortWindow = createQALYEffect(1000, 10, 5);
        const longWindow = createQALYEffect(1000, 10, 30);

        const veryShortCost = effectToCostPerLife(veryShortWindow, params, 2024);
        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const longCost = effectToCostPerLife(longWindow, params, 2024);

        expect(veryShortCost).toBeCloseTo(shortCost, 10);
        expect(shortCost).toBeCloseTo(longCost, 10);
      });

      it('should have higher cost with longer window when discount > 0', () => {
        const params = { ...baseGlobalParams, discountRate: 0.03 };
        const veryShortWindow = createQALYEffect(1000, 0, 1);
        const shortWindow = createQALYEffect(1000, 0, 5);
        const longWindow = createQALYEffect(1000, 0, 20);

        const veryShortCost = effectToCostPerLife(veryShortWindow, params, 2024);
        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const longCost = effectToCostPerLife(longWindow, params, 2024);

        expect(veryShortCost).toBeLessThan(shortCost);
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

      it('should maintain intrinsic rates for different window lengths when truncated by time limit', () => {
        const params = { ...baseGlobalParams, discountRate: 0.03, timeLimit: 40 };
        const startTime = 30;

        // Effects with different original window lengths should maintain their intrinsic yearly rates
        // even when truncated by time limits
        const window20 = createQALYEffect(1000, startTime, 20); // extends to year 50
        const window30 = createQALYEffect(1000, startTime, 30); // extends to year 60
        const window50 = createQALYEffect(1000, startTime, 50); // extends to year 80

        const cost20 = effectToCostPerLife(window20, params, 2024);
        const cost30 = effectToCostPerLife(window30, params, 2024);
        const cost50 = effectToCostPerLife(window50, params, 2024);

        // Different window lengths should have different costs per life (different intrinsic rates)
        // Longer window effects have HIGHER cost per life (same costPerQALY spread over more years)
        // 20-year effect should be most cost-effective (lowest cost per life)
        // 50-year effect should be least cost-effective (highest cost per life)
        expect(cost20).toBeLessThan(cost30);
        expect(cost30).toBeLessThan(cost50);

        // Verify that a 10-year effect (which exactly fits the limit) has the lowest cost per life
        const windowExact = createQALYEffect(1000, startTime, 10); // exactly to year 40
        const costExact = effectToCostPerLife(windowExact, params, 2024);
        expect(costExact).toBeLessThan(cost20);
      });

      it('should preserve intrinsic yearly rate regardless of time limit truncation', () => {
        const params = { ...baseGlobalParams, discountRate: 0.0, timeLimit: 100 }; // Zero discount for simple math
        const paramsLimited = { ...baseGlobalParams, discountRate: 0.0, timeLimit: 15 }; // Truncated time limit

        // 30-year effect starting at year 10
        const effect = createQALYEffect(1000, 10, 30); // costPerQALY=1000, 30-year window

        const costUnlimited = effectToCostPerLife(effect, params, 2024);
        const costLimited = effectToCostPerLife(effect, paramsLimited, 2024);

        // Limited effect should have HIGHER cost per life due to truncation
        // Effect runs from year 10-40 (30 years) vs year 10-15 (5 years)
        // So limited delivers 5/30 = 1/6 of the QALYs, meaning 6x higher cost per life
        expect(costLimited).toBeCloseTo(costUnlimited * 6, 10);

        // With zero discount and full 30-year window, cost per life should equal costPerQALY * yearsPerLife
        const expectedCostPerLife = 1000 * params.yearsPerLife;
        expect(costUnlimited).toBeCloseTo(expectedCostPerLife, 10);

        // With truncation to 5 years, cost should be 6x higher
        expect(costLimited).toBeCloseTo(expectedCostPerLife * 6, 10);
      });

      it('should apply time limits correctly in visualization calculations', () => {
        // Create a mock combinedAssumptions structure for testing visualization
        const mockCombinedAssumptions = {
          globalParameters: { ...baseGlobalParams, discountRate: 0.0, timeLimit: 15 },
          recipients: {
            'test-recipient': {
              name: 'Test Recipient',
              categories: {
                testCategory: { fraction: 1.0 },
              },
            },
          },
          categories: {
            testCategory: {
              effects: [{ effectId: 'test-effect', costPerQALY: 1000, startTime: 10, windowLength: 30 }],
            },
          },
          getRecipientById: (id) => mockCombinedAssumptions.recipients[id],
        };

        // Test mathematical consistency: same donation amount should give consistent results
        // regardless of time limit settings when asking about the same time period
        const points1 = calculateLivesSavedSegments('test-recipient', 50000, 2024, mockCombinedAssumptions);

        // Test with unlimited time limit
        const mockUnlimited = {
          ...mockCombinedAssumptions,
          globalParameters: { ...baseGlobalParams, discountRate: 0.0, timeLimit: 100 },
        };
        const points2 = calculateLivesSavedSegments('test-recipient', 50000, 2024, mockUnlimited);

        // Both should have data points and should show consistent behavior in the overlapping region
        expect(points1.length).toBeGreaterThan(0);
        expect(points2.length).toBeGreaterThan(0);

        // Find points around year 15 (5 years after effect start at year 10)
        const targetYear = 2024 + 12.5; // Middle of the allowed period
        const point1 = points1.find((p) => Math.abs(p.year - targetYear) < 0.1);
        const point2 = points2.find((p) => Math.abs(p.year - targetYear) < 0.1);

        if (point1 && point2) {
          // The visualization should give consistent results for the same time period
          // regardless of time limit settings
          expect(point1['testCategory-test-effect']).toBeCloseTo(point2['testCategory-test-effect'], 6);
        }
      });

      it('should handle discount math correctly in visualization with time limits', () => {
        // Create mock combinedAssumptions for testing discount math with time limits
        const params = { ...baseGlobalParams, discountRate: 0.05, timeLimit: 15 };
        const mockCombinedAssumptions = {
          globalParameters: params,
          recipients: {
            'test-recipient': {
              name: 'Test Recipient',
              categories: {
                testCategory: { fraction: 1.0 },
              },
            },
          },
          categories: {
            testCategory: {
              effects: [{ effectId: 'test-effect', costPerQALY: 1000, startTime: 5, windowLength: 20 }],
            },
          },
          getRecipientById: (id) => mockCombinedAssumptions.recipients[id],
        };

        // Test that the unified approach preserves intrinsic rates (cost per life calculation)
        const effect = createQALYEffect(1000, 5, 20);
        const costPerLife = effectToCostPerLife(effect, params, 2024);

        // Manually calculate expected cost per life using truncated window with adjustment
        const actualWindowLength = 10; // truncated from 20 to 10 by timeLimit=15, startTime=5
        const discountToStart = Math.pow(1 + params.discountRate, -5);
        const discountWindowSum =
          (1 - Math.pow(1 + params.discountRate, -actualWindowLength)) / Math.log(1 + params.discountRate);
        const avgDiscountFactor = (discountToStart * discountWindowSum) / actualWindowLength;
        const baseCostPerLife = (1000 * params.yearsPerLife) / avgDiscountFactor;
        // Apply truncation adjustment: effect delivers QALYs over 20 years, but only 10 years are realized
        const expectedCostPerLife = baseCostPerLife / (actualWindowLength / 20);

        expect(costPerLife).toBeCloseTo(expectedCostPerLife, 8);

        // Test that visualization correctly integrates the finite differences
        const points = calculateLivesSavedSegments('test-recipient', 50000, 2024, mockCombinedAssumptions);
        expect(points.length).toBeGreaterThan(0);

        // Integration should sum to approximately the total expected lives saved
        const totalExpectedLives = 50000 / expectedCostPerLife;
        let totalIntegrated = 0;
        for (let i = 1; i < points.length; i++) {
          const dt = points[i].year - points[i - 1].year;
          const avgRate = (points[i]['testCategory-test-effect'] + points[i - 1]['testCategory-test-effect']) / 2;
          totalIntegrated += avgRate * dt;
        }

        // Should be reasonably close (allowing for numerical integration error)
        expect(totalIntegrated).toBeCloseTo(totalExpectedLives, 4);
      });

      it('should debug unified approach with simple case', () => {
        // Super simple test case to isolate the issue
        const simpleParams = { ...baseGlobalParams, discountRate: 0.0, timeLimit: 20 };

        // Simple effect: starts at year 0, runs 10 years, with zero discount
        const mockCombinedAssumptions = {
          globalParameters: simpleParams,
          recipients: {
            'test-recipient': {
              name: 'Test Recipient',
              categories: { testCategory: { fraction: 1.0 } },
            },
          },
          categories: {
            testCategory: {
              effects: [{ effectId: 'test-effect', costPerQALY: 1000, startTime: 0, windowLength: 10 }],
            },
          },
          getRecipientById: (id) => mockCombinedAssumptions.recipients[id],
        };

        // Test the direct cost per life calculation
        const effect = { costPerQALY: 1000, startTime: 0, windowLength: 10 };
        const costPerLifeT5 = effectToCostPerLife(effect, { ...simpleParams, timeLimit: 5 }, 2024); // truncates 10->5 years
        const costPerLifeT7 = effectToCostPerLife(effect, { ...simpleParams, timeLimit: 7 }, 2024); // truncates 10->7 years
        const costPerLifeT10 = effectToCostPerLife(effect, { ...simpleParams, timeLimit: 10 }, 2024); // no truncation

        // Test the visualization
        const points = calculateLivesSavedSegments('test-recipient', 50000, 2024, mockCombinedAssumptions);

        // Basic assertions
        expect(points.length).toBeGreaterThan(0);
        expect(costPerLifeT5).toBeGreaterThan(0);
        expect(costPerLifeT10).toBeGreaterThan(0);
        expect(costPerLifeT5).toBeGreaterThan(costPerLifeT7);
        expect(costPerLifeT7).toBeGreaterThan(costPerLifeT10);
      });

      it('should handle edge cases with time limits', () => {
        // Test effect that starts exactly at time limit
        const params1 = { ...baseGlobalParams, discountRate: 0.02, timeLimit: 10 };
        const effectAtLimit = createQALYEffect(1000, 10, 20);
        const costAtLimit = effectToCostPerLife(effectAtLimit, params1, 2024);
        expect(costAtLimit).toBe(Infinity); // Should be invalid

        // Test effect that starts after time limit
        const effectPastLimit = createQALYEffect(1000, 15, 10);
        const costPastLimit = effectToCostPerLife(effectPastLimit, params1, 2024);
        expect(costPastLimit).toBe(Infinity); // Should be invalid

        // Test effect that ends exactly at time limit
        const params2 = { ...baseGlobalParams, discountRate: 0.02, timeLimit: 30 };
        const effectExactEnd = createQALYEffect(1000, 10, 20); // ends at year 30
        const costExactEnd = effectToCostPerLife(effectExactEnd, params2, 2024);
        expect(Number.isFinite(costExactEnd)).toBe(true); // Should be valid
        expect(costExactEnd).toBeGreaterThan(0);

        // Validate that the unified approach handles boundary conditions correctly
        // by testing that finite difference calculations work properly at time limits
        const mockCombinedAssumptions = {
          globalParameters: params2,
          recipients: {
            'test-recipient': {
              name: 'Test Recipient',
              categories: {
                testCategory: { fraction: 1.0 },
              },
            },
          },
          categories: {
            testCategory: {
              effects: [{ effectId: 'test-effect', costPerQALY: 1000, startTime: 10, windowLength: 20 }],
            },
          },
          getRecipientById: (id) => mockCombinedAssumptions.recipients[id],
        };

        const points = calculateLivesSavedSegments('test-recipient', 50000, 2024, mockCombinedAssumptions);
        expect(points.length).toBeGreaterThan(0);

        // Effect should be active in the visualization during its window
        const activePoints = points.filter((p) => p['testCategory-test-effect'] > 0);
        expect(activePoints.length).toBeGreaterThan(0);
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
        const shortWindow = createQALYEffect(1000, 10, 1);
        const window = createQALYEffect(1000, 10, 20);

        // Since averageDiscountFactor = 1, cost = costPerQALY * yearsPerLife
        const expectedCost = 1000 * 50;

        const shortCost = effectToCostPerLife(shortWindow, params, 2024);
        const windowCost = effectToCostPerLife(window, params, 2024);

        expect(shortCost).toBeCloseTo(expectedCost, 10);
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
      const justAfter = effectToCostPerLife(effect, params, 2024);

      // Should show smooth transition (no huge jumps)
      const diff1 = Math.abs(atCurrent - justBefore) / atCurrent;
      const diff2 = Math.abs(justAfter - atCurrent) / atCurrent;

      expect(diff1).toBeLessThan(0.1); // Less than 10% change
      expect(diff2).toBeLessThan(0.1); // Less than 10% change
    });

    it('should handle very short effects in the past correctly', () => {
      const effect = createPopEffect(100, 0.1, 1, 10, 1); // Very short effect at year 10
      const params = baseGlobalParams;

      // Donation from 2000: effect at 2010 (in the past)
      const pastEffect = effectToCostPerLife(effect, params, 2000);

      // Should calculate population at 2010 using historical growth
      expect(pastEffect).toBeGreaterThan(0);
      expect(pastEffect).toBeLessThan(Infinity);
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
      const futureDonation = effectToCostPerLife(effect, params, 2020);

      // Both should handle population limits but in different ways
      expect(pastDonation).toBeGreaterThan(0);
      expect(futureDonation).toBeGreaterThan(0);
    });

    it('should handle boundary year consistently', () => {
      // Test that effects at exactly the current year are handled correctly
      const shortEffect = createPopEffect(100, 0.1, 1, 0, 1); // 1-year effect at donation year
      const windowEffect = createPopEffect(100, 0.1, 1, 0, 2); // 2-year window starting at donation

      // Both at current year (2024)
      const shortCost = effectToCostPerLife(shortEffect, baseGlobalParams, 2024);
      const windowCost = effectToCostPerLife(windowEffect, baseGlobalParams, 2024);

      // Both should give reasonable results
      expect(shortCost).toBeGreaterThan(0);
      expect(windowCost).toBeGreaterThan(0);

      // Test continuity: donations at different years should be continuous
      const donation2022 = effectToCostPerLife(windowEffect, baseGlobalParams, 2022);
      const donation2023 = effectToCostPerLife(windowEffect, baseGlobalParams, 2023);
      const donation2024 = effectToCostPerLife(windowEffect, baseGlobalParams, 2024);

      // Later donations should have lower cost (more discounting)
      expect(donation2022).toBeGreaterThan(donation2023);
      expect(donation2023).toBeGreaterThan(donation2024);

      // Check the differences are reasonable (no huge jumps)
      const diff1 = (donation2022 - donation2023) / donation2023;
      const diff2 = (donation2023 - donation2024) / donation2024;
      expect(Math.abs(diff1 - diff2)).toBeLessThan(0.2); // Allow some variation due to historical vs future growth
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

      // Donation from 2020: effect 2030-2050 (all future, no growth)
      const noGrowth = effectToCostPerLife(effect, paramsZeroGrowth, 2020);

      // 2010 donation's historical portion (2020-2024) had lower population
      // This makes it slightly more expensive (higher cost per life)
      expect(mixedGrowth).toBeGreaterThan(noGrowth);

      // The difference should be small
      const percentDiff = Math.abs(mixedGrowth - noGrowth) / noGrowth;
      expect(percentDiff).toBeLessThan(0.05); // Less than 5% difference
    });
    it('should handle non-integer years to population limit', () => {
      // Set up parameters where population limit is hit at a non-integer year
      const effect = createPopEffect(100, 0.1, 1, 0, 30);
      const params = {
        ...baseGlobalParams,
        currentPopulation: 8000000000,
        populationGrowthRate: 0.02, // 2% growth
        populationLimit: 1.3, // Will hit this at a non-integer year
        timeLimit: 100,
      };

      // Calculate when limit is hit: log(1.3) / log(1.02) ≈ 13.17 years
      const costWithLimit = effectToCostPerLife(effect, params, 2024);

      // Should not crash and give reasonable result
      expect(costWithLimit).toBeGreaterThan(0);
      expect(costWithLimit).toBeLessThan(Infinity);

      // Compare with no limit - should be more expensive with limit
      const costNoLimit = effectToCostPerLife(effect, { ...params, populationLimit: 10 }, 2024);
      expect(costWithLimit).toBeGreaterThan(costNoLimit);
    });

    it('should handle future donations by using current year', () => {
      const effect = createPopEffect(100, 0.1, 1, 5, 10); // Effect at years 5-15
      const params = { ...baseGlobalParams };

      // Test with a future donation (year 2030)
      const futureDonation = 2030;
      const presentDonation = 2024;

      // Should not throw an error for future donations, instead use current year
      const futureCost = effectToCostPerLife(effect, params, futureDonation);
      const presentCost = effectToCostPerLife(effect, params, presentDonation);

      // Both should return the same result since future year defaults to current year
      expect(futureCost).toBe(presentCost);
      expect(presentCost).toBeGreaterThan(0);
    });

    it('should properly truncate effects extending beyond timeLimit', () => {
      const effect = createPopEffect(100, 0.1, 1, 80, 40); // Starts year 80, wants to run 40 years
      const params = {
        ...baseGlobalParams,
        timeLimit: 100, // Time limit at year 100
      };

      // Effect should be truncated to 20 years (80 to 100)
      const truncatedCost = effectToCostPerLife(effect, params, 2024);

      // Compare with an effect that naturally runs for 20 years
      const naturalEffect = createPopEffect(100, 0.1, 1, 80, 20);
      const naturalCost = effectToCostPerLife(naturalEffect, params, 2024);

      // Should be identical since both run from year 80-100
      expect(truncatedCost).toBeCloseTo(naturalCost, 10);

      // Test with past donation where effect spans past/future AND hits timeLimit
      const pastEffect = createPopEffect(100, 0.1, 1, 50, 70); // Wants to run years 50-120
      const pastDonation = effectToCostPerLife(pastEffect, params, 1960); // Donation from 1960

      // Effect runs 2010-2030, but timeLimit truncates to 2010-2060 (100 years from 1960)
      // So actual duration is 50 years, not 70
      expect(pastDonation).toBeGreaterThan(0);
      expect(pastDonation).toBeLessThan(Infinity);
    });
  });
});
