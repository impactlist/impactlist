import { describe, it, expect, beforeEach } from 'vitest';
import { calculateCostPerLife } from '../../utils/effectsCalculation';
import { formatCurrency, formatLives } from '../../utils/formatters';

describe('Donation Flow Integration', () => {
  let globalParams;

  beforeEach(() => {
    // Set up standard global parameters
    globalParams = {
      yearsPerLife: 50,
      discountRate: 0.02,
      timeLimit: 100,
      currentPopulation: 8000000000,
      populationGrowthRate: 0.01,
      populationLimit: 2,
    };
  });

  describe('Complete donation calculation flow', () => {
    it('should calculate correct lives saved for a simple QALY effect', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 10,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      const donationAmount = 10000;
      const livesSaved = donationAmount / costPerLife;

      expect(costPerLife).toBeCloseTo(5511.394348736568, 8);
      expect(livesSaved).toBeCloseTo(1.8144228787207723, 8);
    });

    it('should handle multiple effects correctly', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 10,
        },
        {
          type: 'qaly',
          costPerQALY: 200,
          startTime: 10,
          windowLength: 10,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      const donationAmount = 50000;
      const livesSaved = donationAmount / costPerLife;

      expect(costPerLife).toBeCloseTo(3908.3076008594635, 8);
      expect(livesSaved).toBeCloseTo(12.79326120313679, 8);
    });

    it('should format currency and lives correctly', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 1000,
          startTime: 0,
          windowLength: 20,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      const donationAmount = 100000;
      const livesSaved = donationAmount / costPerLife;

      // Test formatting
      const formattedCost = formatCurrency(costPerLife);
      const formattedLives = formatLives(livesSaved);

      expect(costPerLife).toBeCloseTo(60553.18478463219, 8);
      expect(livesSaved).toBeCloseTo(1.651440801266972, 8);
      expect(formattedCost).toBe('$60,553');
      expect(formattedLives).toBe('1.65');
    });

    it('should handle population effects', () => {
      const effects = [
        {
          type: 'population',
          costPerMicroprobability: 10,
          populationFractionAffected: 0.1,
          qalyImprovementPerYear: 1,
          startTime: 0,
          windowLength: 20,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      const donationAmountA = 100000;
      const donationAmountB = 50000;
      const livesSavedA = donationAmountA / costPerLife;
      const livesSavedB = donationAmountB / costPerLife;
      const doubledCostEffect = [{ ...effects[0], costPerMicroprobability: 20 }];
      const doubledFractionEffect = [{ ...effects[0], populationFractionAffected: 0.2 }];
      const doubledCostPerLife = calculateCostPerLife(doubledCostEffect, globalParams, 2020);
      const doubledFractionCostPerLife = calculateCostPerLife(doubledFractionEffect, globalParams, 2020);

      // Validate linear scaling and core population-effect proportionality.
      expect(costPerLife).toBeGreaterThan(0);
      expect(livesSavedA).toBeCloseTo(livesSavedB * 2, 10);
      expect(doubledCostPerLife).toBeCloseTo(costPerLife * 2, 10);
      expect(doubledFractionCostPerLife).toBeCloseTo(costPerLife / 2, 10);
    });

    it('should combine mixed effect types using harmonic-sum math', () => {
      const qalyEffect = {
        type: 'qaly',
        costPerQALY: 100,
        startTime: 0,
        windowLength: 10,
      };
      const populationEffect = {
        type: 'population',
        costPerMicroprobability: 50,
        populationFractionAffected: 0.05,
        qalyImprovementPerYear: 0.5,
        startTime: 10,
        windowLength: 20,
      };

      const costQalyOnly = calculateCostPerLife([qalyEffect], globalParams, 2020);
      const costPopulationOnly = calculateCostPerLife([populationEffect], globalParams, 2020);
      const mixedCost = calculateCostPerLife([qalyEffect, populationEffect], globalParams, 2020);

      const expectedMixedCost = 1 / (1 / costQalyOnly + 1 / costPopulationOnly);
      expect(mixedCost).toBeCloseTo(expectedMixedCost, 10);
      expect(mixedCost).toBeLessThan(costQalyOnly);
      expect(mixedCost).toBeLessThan(costPopulationOnly);
    });

    it('should handle edge case: zero discount rate', () => {
      const zeroDiscountParams = { ...globalParams, discountRate: 0 };
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 10,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, zeroDiscountParams, 2020);
      expect(costPerLife).toBe(5000);
    });

    it('should handle edge case: very short effect', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 1, // Very short effect
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      expect(costPerLife).toBeCloseTo(5049.669960525826, 8);
    });

    it('should handle edge case: effects beyond time limit', () => {
      const effects = [
        {
          type: 'qaly',
          costPerQALY: 100,
          startTime: 150, // Beyond timeLimit of 100
          windowLength: 10,
        },
      ];

      const costPerLife = calculateCostPerLife(effects, globalParams, 2020);
      expect(costPerLife).toBe(Infinity);

      const donationAmount = 100000;
      const livesSaved = donationAmount / costPerLife;
      expect(livesSaved).toBe(0);
    });
  });

  describe('Formatting integration', () => {
    it('should format donation amounts consistently', () => {
      const amounts = [100, 1000, 10000, 1000000, 1000000000];
      const formatted = amounts.map((amt) => formatCurrency(amt));

      expect(formatted[0]).toBe('$100');
      expect(formatted[1]).toBe('$1,000');
      expect(formatted[2]).toBe('$10,000');
      expect(formatted[3]).toBe('$1.00 M');
      expect(formatted[4]).toBe('$1.00 B');
    });

    it('should format lives saved consistently', () => {
      const lives = [0.001, 0.1, 1, 10, 100, 1000];
      const formatted = lives.map(formatLives);

      // Check that all are formatted as strings
      formatted.forEach((f) => {
        expect(typeof f).toBe('string');
      });

      // Check specific formatting rules
      expect(formatted[2]).toBe('1'); // 1 life is an integer, shows as "1"
      expect(formatted[3]).toBe('10'); // 10 lives is an integer, shows as "10"
      expect(formatted[4]).toBe('100'); // 100 lives shows no decimals
      expect(formatted[5]).toBe('1,000'); // 1000 lives shows with comma
    });
  });
});
