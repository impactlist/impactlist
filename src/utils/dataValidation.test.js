import { describe, it, expect } from 'vitest';
import {
  assertExists,
  assertFiniteNumber,
  assertNumber,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonNegativeNumber,
  assertArray,
  assertNonEmptyArray,
  assertObject,
  assertSafeIdentifier,
  assertValidEntityId,
  validateCategory,
  validateRecipient,
} from './dataValidation';

describe('dataValidation', () => {
  describe('assertValidEntityId', () => {
    it('accepts URL-safe hyphenated and legacy underscored IDs', () => {
      expect(assertValidEntityId('global-health', 'id')).toBe('global-health');
      expect(assertValidEntityId('recipient_one', 'id')).toBe('recipient_one');
    });

    it('rejects prototype keys and URL-ambiguous IDs', () => {
      expect(() => assertValidEntityId('__proto__', 'id')).toThrow(/must use lowercase/);
      expect(() => assertValidEntityId('constructor', 'id')).toThrow(/reserved object key/);
      expect(() => assertValidEntityId('prototype', 'id')).toThrow(/reserved object key/);
      expect(() => assertValidEntityId('bad&id', 'id')).toThrow(/must use lowercase/);
      expect(() => assertValidEntityId('MixedCase', 'id')).toThrow(/must use lowercase/);
    });
  });

  describe('assertSafeIdentifier', () => {
    it('allows runtime fixture IDs but rejects object-prototype keys', () => {
      expect(assertSafeIdentifier('recipientA', 'id')).toBe('recipientA');
      expect(() => assertSafeIdentifier('constructor', 'id')).toThrow(/reserved object key/);
      expect(() => assertSafeIdentifier('__proto__', 'id')).toThrow(/reserved object key/);
    });
  });

  describe('assertExists', () => {
    it('should pass for defined values', () => {
      expect(assertExists(0, 'field')).toBe(0);
      expect(assertExists('', 'field')).toBe('');
      expect(assertExists(false, 'field')).toBe(false);
      expect(assertExists([], 'field')).toEqual([]);
    });

    it('should throw for null', () => {
      expect(() => assertExists(null, 'field')).toThrow('Missing required field: field');
    });

    it('should throw for undefined', () => {
      expect(() => assertExists(undefined, 'field')).toThrow('Missing required field: field');
    });

    it('should include context in error message', () => {
      expect(() => assertExists(null, 'field', 'in test context')).toThrow(
        'Missing required field: field in test context'
      );
    });
  });

  describe('assertNumber', () => {
    it('should pass for valid numbers', () => {
      expect(assertNumber(0, 'field')).toBe(0);
      expect(assertNumber(42, 'field')).toBe(42);
      expect(assertNumber(-10, 'field')).toBe(-10);
      expect(assertNumber(3.14, 'field')).toBe(3.14);
    });

    it('should throw for non-numbers', () => {
      expect(() => assertNumber('42', 'field')).toThrow('Field field must be a valid number');
      expect(() => assertNumber(null, 'field')).toThrow('Missing required field: field');
      expect(() => assertNumber(undefined, 'field')).toThrow('Missing required field: field');
      expect(() => assertNumber([], 'field')).toThrow('Field field must be a valid number');
    });

    it('should throw for NaN', () => {
      expect(() => assertNumber(NaN, 'field')).toThrow('Field field must be a valid number');
    });

    it('preserves Infinity as a runtime calculation sentinel', () => {
      expect(assertNumber(Infinity, 'field')).toBe(Infinity);
      expect(assertNumber(-Infinity, 'field')).toBe(-Infinity);
    });

    it('should include context in error message', () => {
      expect(() => assertNumber('not a number', 'field', 'in calculation')).toThrow(
        'Field field must be a valid number in calculation'
      );
    });
  });

  describe('assertFiniteNumber', () => {
    it('rejects non-finite source/schema values', () => {
      expect(assertFiniteNumber(42, 'field')).toBe(42);
      expect(() => assertFiniteNumber(Infinity, 'field')).toThrow('must be a finite number');
      expect(() => assertFiniteNumber(-Infinity, 'field')).toThrow('must be a finite number');
    });
  });

  describe('assertPositiveNumber', () => {
    it('should pass for positive numbers', () => {
      expect(assertPositiveNumber(1, 'field')).toBe(1);
      expect(assertPositiveNumber(0.001, 'field')).toBe(0.001);
      expect(assertPositiveNumber(999999, 'field')).toBe(999999);
    });

    it('should throw for zero', () => {
      expect(() => assertPositiveNumber(0, 'field')).toThrow('Field field must be positive');
    });

    it('should throw for negative numbers', () => {
      expect(() => assertPositiveNumber(-1, 'field')).toThrow('Field field must be positive');
      expect(() => assertPositiveNumber(-0.001, 'field')).toThrow('Field field must be positive');
    });

    it('should throw for non-numbers', () => {
      expect(() => assertPositiveNumber('1', 'field')).toThrow('Field field must be a valid number');
    });
  });

  describe('assertNonZeroNumber', () => {
    it('should pass for non-zero numbers', () => {
      expect(assertNonZeroNumber(1, 'field')).toBe(1);
      expect(assertNonZeroNumber(-1, 'field')).toBe(-1);
      expect(assertNonZeroNumber(0.001, 'field')).toBe(0.001);
    });

    it('should throw for zero', () => {
      expect(() => assertNonZeroNumber(0, 'field')).toThrow('Field field cannot be zero');
    });

    it('should throw for non-numbers', () => {
      expect(() => assertNonZeroNumber('1', 'field')).toThrow('Field field must be a valid number');
    });
  });

  describe('assertNonNegativeNumber', () => {
    it('should pass for zero and positive numbers', () => {
      expect(assertNonNegativeNumber(0, 'field')).toBe(0);
      expect(assertNonNegativeNumber(1, 'field')).toBe(1);
      expect(assertNonNegativeNumber(999, 'field')).toBe(999);
    });

    it('should throw for negative numbers', () => {
      expect(() => assertNonNegativeNumber(-1, 'field')).toThrow('Field field cannot be negative');
      expect(() => assertNonNegativeNumber(-0.001, 'field')).toThrow('Field field cannot be negative');
    });

    it('should throw for non-numbers', () => {
      expect(() => assertNonNegativeNumber('0', 'field')).toThrow('Field field must be a valid number');
    });
  });

  describe('assertArray', () => {
    it('should pass for arrays', () => {
      expect(assertArray([], 'field')).toEqual([]);
      expect(assertArray([1, 2, 3], 'field')).toEqual([1, 2, 3]);
      expect(assertArray(['a', 'b'], 'field')).toEqual(['a', 'b']);
    });

    it('should throw for non-arrays', () => {
      expect(() => assertArray('[]', 'field')).toThrow('Field field must be an array');
      expect(() => assertArray({}, 'field')).toThrow('Field field must be an array');
      expect(() => assertArray(null, 'field')).toThrow('Missing required field: field');
      expect(() => assertArray(undefined, 'field')).toThrow('Missing required field: field');
    });
  });

  describe('assertNonEmptyArray', () => {
    it('should pass for non-empty arrays', () => {
      expect(assertNonEmptyArray([1], 'field')).toEqual([1]);
      expect(assertNonEmptyArray([1, 2, 3], 'field')).toEqual([1, 2, 3]);
    });

    it('should throw for empty arrays', () => {
      expect(() => assertNonEmptyArray([], 'field')).toThrow('Field field cannot be empty');
    });

    it('should throw for non-arrays', () => {
      expect(() => assertNonEmptyArray('not array', 'field')).toThrow('Field field must be an array');
    });
  });

  describe('assertObject', () => {
    it('should pass for objects', () => {
      expect(assertObject({}, 'field')).toEqual({});
      expect(assertObject({ a: 1 }, 'field')).toEqual({ a: 1 });
    });

    it('should throw for non-objects', () => {
      expect(() => assertObject([], 'field')).toThrow('Field field must be an object');
      expect(() => assertObject('{}', 'field')).toThrow('Field field must be an object');
      expect(() => assertObject(null, 'field')).toThrow('Missing required field: field');
      expect(() => assertObject(undefined, 'field')).toThrow('Missing required field: field');
    });
  });

  describe('category and recipient schemas', () => {
    const qalyEffect = {
      effectId: 'standard',
      startTime: 0,
      windowLength: 10,
      costPerQALY: 100,
    };
    const categories = {
      health: {
        name: 'Health',
        effects: [qalyEffect],
      },
    };

    it('allows finite negative costs while rejecting ambiguous or duplicate effects', () => {
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, costPerQALY: -100 }] }, 'health')
      ).not.toThrow();
      expect(() =>
        validateCategory(
          {
            name: 'Health',
            effects: [
              { ...qalyEffect, costPerMicroprobability: 10, populationFractionAffected: 1, qalyImprovementPerYear: 1 },
            ],
          },
          'health'
        )
      ).toThrow(/exactly one/);
      expect(() => validateCategory({ name: 'Health', effects: [qalyEffect, { ...qalyEffect }] }, 'health')).toThrow(
        /duplicate effectId/
      );
    });

    it('rejects non-finite and out-of-domain fields while allowing all finite magnitudes', () => {
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, startTime: Infinity }] }, 'health')
      ).toThrow(/finite number/);
      expect(() => validateCategory({ name: 'Health', effects: [{ ...qalyEffect, startTime: -1 }] }, 'health')).toThrow(
        /cannot be negative/
      );
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, validTimeInterval: [2030, 2020] }] }, 'health')
      ).toThrow(/cannot precede/);
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, costPerQALY: 5e-324 }] }, 'health')
      ).not.toThrow();
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, costPerQALY: Number.MAX_VALUE }] }, 'health')
      ).not.toThrow();
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, windowLength: 1e-100 }] }, 'health')
      ).not.toThrow();
      expect(() =>
        validateCategory({ name: 'Health', effects: [{ ...qalyEffect, validTimeInterval: [1e100, null] }] }, 'health')
      ).toThrow(/safe integer/);
    });

    it('validates recipient maps against their base effects', () => {
      const recipient = (effect) => ({
        name: 'Recipient',
        categories: { health: { fraction: 1, effects: [effect] } },
      });

      expect(() =>
        validateRecipient(
          recipient({ effectId: 'standard', overrides: { costPerQALY: -50 } }),
          'recipientA',
          categories
        )
      ).not.toThrow();
      expect(() =>
        validateRecipient(recipient({ effectId: 'standard', overrides: { madeUpField: 2 } }), 'recipientA', categories)
      ).toThrow(/unknown numeric field/);
      expect(() =>
        validateRecipient(
          recipient({
            effectId: 'standard',
            overrides: { costPerQALY: 50 },
            multipliers: { costPerQALY: 2 },
          }),
          'recipientA',
          categories
        )
      ).toThrow(/both an override and a multiplier/);
      expect(() =>
        validateRecipient(
          recipient({ effectId: 'standard', multipliers: { windowLength: 1e308 } }),
          'recipientA',
          categories
        )
      ).toThrow(/non-finite value/);
      expect(() =>
        validateRecipient(
          recipient({ effectId: 'standard', multipliers: { costPerQALY: 1e14 } }),
          'recipientA',
          categories
        )
      ).not.toThrow();
    });
  });
});
