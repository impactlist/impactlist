import { describe, it, expect } from 'vitest';
import {
  getCurrentYear,
  getDonationsForDonor,
  getDonationsForRecipient,
  getDonorById,
  normalizeCalculatorDonationAmount,
  parseCalculatorDonationYear,
  resolveCalcYear,
} from './donationDataHelpers';

describe('entity ID lookups', () => {
  it('does not treat inherited object keys as generated entities', () => {
    expect(getDonorById('__proto__')).toBeNull();
    expect(getDonorById('constructor')).toBeNull();
    expect(() => getDonationsForDonor('toString')).toThrow(/Invalid donor ID/);
    expect(() => getDonationsForRecipient('__proto__')).toThrow(/Invalid recipient ID/);
  });
});

describe('parseCalculatorDonationYear', () => {
  it('accepts only exact in-range calculator years', () => {
    expect(parseCalculatorDonationYear('2024')).toBe(2024);
    expect(parseCalculatorDonationYear(2024)).toBe(2024);
    expect(parseCalculatorDonationYear('2024junk')).toBeNull();
    expect(parseCalculatorDonationYear('2024.5')).toBeNull();
    expect(parseCalculatorDonationYear(2024.5)).toBeNull();
    expect(parseCalculatorDonationYear('1899')).toBeNull();
    expect(parseCalculatorDonationYear(String(getCurrentYear() + 1))).toBeNull();
  });
});

describe('normalizeCalculatorDonationAmount', () => {
  it('accepts plain and conventionally comma-formatted amounts', () => {
    expect(normalizeCalculatorDonationAmount('')).toEqual({ displayText: '', rawText: '' });
    expect(normalizeCalculatorDonationAmount('.')).toEqual({ displayText: '.', rawText: '.' });
    expect(normalizeCalculatorDonationAmount('1234.50')).toEqual({ displayText: '1234.50', rawText: '1234.50' });
    expect(normalizeCalculatorDonationAmount('1,234.50')).toEqual({
      displayText: '1,234.50',
      rawText: '1234.50',
    });
    expect(normalizeCalculatorDonationAmount('$1,234', { allowLeadingCurrencySign: true })).toEqual({
      displayText: '1,234',
      rawText: '1234',
    });
    expect(normalizeCalculatorDonationAmount('1e20')).toEqual({ displayText: '1e20', rawText: '1e20' });
    expect(normalizeCalculatorDonationAmount('+1e20')).toEqual({ displayText: '+1e20', rawText: '+1e20' });
  });

  it('rejects text, non-finite values, negative values, and misplaced commas', () => {
    expect(normalizeCalculatorDonationAmount('1e309')).toBeNull();
    expect(normalizeCalculatorDonationAmount('-100')).toBeNull();
    expect(normalizeCalculatorDonationAmount('12,34')).toBeNull();
    expect(normalizeCalculatorDonationAmount('1,234,')).toBeNull();
    expect(normalizeCalculatorDonationAmount(String(Number.MAX_VALUE))).not.toBeNull();
    expect(normalizeCalculatorDonationAmount('9'.repeat(309))).toBeNull();
  });
});

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

  it('uses the complete value instead of parseInt prefix truncation', () => {
    expect(resolveCalcYear('2e3')).toBe(2000);
    expect(resolveCalcYear('2024junk')).toBe(getCurrentYear());
  });

  it('always returns an integer', () => {
    expect(resolveCalcYear(2030.7)).toBe(getCurrentYear());
    expect(Number.isInteger(resolveCalcYear(''))).toBe(true);
    expect(Number.isInteger(resolveCalcYear('2030'))).toBe(true);
  });
});
