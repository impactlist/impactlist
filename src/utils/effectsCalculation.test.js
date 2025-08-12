import { describe, it, expect } from 'vitest';
import { calculateCostPerLife, effectToCostPerLife } from './effectsCalculation';

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
      expect(() => calculateCostPerLife([], baseGlobalParams)).toThrow('Field effects cannot be empty');
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
      const result = calculateCostPerLife(effects, params);
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
      const result = calculateCostPerLife(effects, baseGlobalParams);
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
});
