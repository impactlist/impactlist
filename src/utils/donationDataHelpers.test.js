import { describe, it, expect } from 'vitest';
import { getCurrentYear, resolveCalcYear } from './donationDataHelpers';

describe('resolveCalcYear', () => {
  // YearSelector emits '' (and other partial states) while the field is being
  // edited; cost/lives helpers assert an integer year, so resolveCalcYear must
  // always hand them a valid integer rather than the raw mid-edit value.
  it('falls back to the current year for the empty string', () => {
    expect(resolveCalcYear('')).toBe(getCurrentYear());
  });

  it('falls back to the current year for non-numeric values', () => {
    expect(resolveCalcYear(NaN)).toBe(getCurrentYear());
    expect(resolveCalcYear('abc')).toBe(getCurrentYear());
  });

  it('falls back to the current year for whitespace and nullish values', () => {
    // isNaN(' ') is false (Number(' ') === 0), so the contract must rest on the
    // parsed result, not on the raw value — otherwise this returns NaN.
    expect(resolveCalcYear(' ')).toBe(getCurrentYear());
    expect(resolveCalcYear(null)).toBe(getCurrentYear());
    expect(resolveCalcYear(undefined)).toBe(getCurrentYear());
  });

  it('passes a valid integer year through unchanged', () => {
    expect(resolveCalcYear(2030)).toBe(2030);
  });

  it('parses a numeric string into a number', () => {
    expect(resolveCalcYear('2030')).toBe(2030);
  });

  it('always returns an integer', () => {
    expect(resolveCalcYear(2030.7)).toBe(2030);
    expect(Number.isInteger(resolveCalcYear(''))).toBe(true);
    expect(Number.isInteger(resolveCalcYear('2030'))).toBe(true);
  });
});
