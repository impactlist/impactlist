import { describe, it, expect } from 'vitest';
import {
  assertExists,
  assertNumber,
  assertPositiveNumber,
  assertNonZeroNumber,
  assertNonNegativeNumber,
  assertArray,
  assertNonEmptyArray,
  assertObject,
} from './dataValidation';

describe('dataValidation', () => {
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

    it('should include context in error message', () => {
      expect(() => assertNumber('not a number', 'field', 'in calculation')).toThrow(
        'Field field must be a valid number in calculation'
      );
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
});
