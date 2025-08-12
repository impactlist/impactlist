import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatNumberWithCommas,
  formatLives,
  formatCurrency,
  formatNumberWithNoMoreThanOneDecimal,
  calculateCursorPosition,
} from './formatters';

describe('formatNumberWithNoMoreThanOneDecimal', () => {
  it('should format numbers less than 100 with one decimal place if not integer', () => {
    expect(formatNumberWithNoMoreThanOneDecimal(45.678)).toBe('45.7');
    expect(formatNumberWithNoMoreThanOneDecimal(1.234)).toBe('1.2');
    expect(formatNumberWithNoMoreThanOneDecimal(99.99)).toBe('100');
  });

  it('should format integers without decimal places', () => {
    expect(formatNumberWithNoMoreThanOneDecimal(45)).toBe('45');
    expect(formatNumberWithNoMoreThanOneDecimal(100)).toBe('100');
    expect(formatNumberWithNoMoreThanOneDecimal(1000)).toBe('1000');
  });

  it('should round numbers >= 100 to integers', () => {
    expect(formatNumberWithNoMoreThanOneDecimal(100.5)).toBe('101');
    expect(formatNumberWithNoMoreThanOneDecimal(999.9)).toBe('1000');
  });
});

describe('formatNumber', () => {
  it('should format small numbers without commas', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(99)).toBe('99');
  });

  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(10000)).toBe('10,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should format billions with B suffix', () => {
    expect(formatNumber(1000000000)).toBe('1B');
    expect(formatNumber(1500000000)).toBe('1.5B');
    expect(formatNumber(12345000000)).toBe('12.3B');
  });

  it('should format trillions with T suffix', () => {
    expect(formatNumber(1000000000000)).toBe('1T');
    expect(formatNumber(1500000000000)).toBe('1.5T');
    expect(formatNumber(12345000000000)).toBe('12.3T');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
    expect(formatNumber(-1000000000)).toBe('-1B');
    expect(formatNumber(-1000000000000)).toBe('-1T');
  });

  it('should handle very small numbers', () => {
    expect(formatNumber(0.001)).toBe('0.001');
    expect(formatNumber(0.123)).toBe('0.123');
  });
});

describe('formatNumberWithCommas', () => {
  it('should handle null and undefined', () => {
    expect(formatNumberWithCommas(null)).toBe('');
    expect(formatNumberWithCommas(undefined)).toBe('');
  });

  it('should handle empty string', () => {
    expect(formatNumberWithCommas('')).toBe('');
  });

  it('should handle partial inputs', () => {
    expect(formatNumberWithCommas('-')).toBe('-');
    expect(formatNumberWithCommas('.')).toBe('.');
    expect(formatNumberWithCommas('-.')).toBe('-.');
  });

  it('should format integers with commas', () => {
    expect(formatNumberWithCommas('1000')).toBe('1,000');
    expect(formatNumberWithCommas('1000000')).toBe('1,000,000');
  });

  it('should preserve decimal places', () => {
    expect(formatNumberWithCommas('1000.5')).toBe('1,000.5');
    expect(formatNumberWithCommas('1000.50')).toBe('1,000.50');
    expect(formatNumberWithCommas('1000.')).toBe('1,000.');
  });

  it('should handle negative numbers', () => {
    expect(formatNumberWithCommas('-1000')).toBe('-1,000');
    expect(formatNumberWithCommas('-1000.5')).toBe('-1,000.5');
  });

  it('should remove existing commas and reformat', () => {
    expect(formatNumberWithCommas('1,0,0,0')).toBe('1,000');
  });
});

describe('calculateCursorPosition', () => {
  it('should return null for null/undefined position', () => {
    expect(calculateCursorPosition('1000', '1,000', null)).toBe(null);
    expect(calculateCursorPosition('1000', '1,000', undefined)).toBe(null);
  });

  it('should return same position if values are identical', () => {
    expect(calculateCursorPosition('1000', '1000', 2)).toBe(2);
  });

  it('should handle cursor after digits', () => {
    // Cursor after '1' in '1000' -> after '1' in '1,000'
    expect(calculateCursorPosition('1000', '1,000', 1)).toBe(1);
    // Cursor after '10' in '1000' -> after '0' in '1,000' (position 3 to skip comma)
    expect(calculateCursorPosition('1000', '1,000', 2)).toBe(3);
    // Cursor after '100' in '1000' -> after second '0' in '1,000'
    expect(calculateCursorPosition('1000', '1,000', 3)).toBe(4);
  });

  it('should handle cursor at end', () => {
    expect(calculateCursorPosition('1000', '1,000', 4)).toBe(5);
  });

  it('should handle cursor after minus sign', () => {
    expect(calculateCursorPosition('-1000', '-1,000', 1)).toBe(1);
  });

  it('should handle cursor after decimal point', () => {
    expect(calculateCursorPosition('1000.', '1,000.', 5)).toBe(6);
    expect(calculateCursorPosition('1000.5', '1,000.5', 5)).toBe(6);
  });
});

describe('formatLives', () => {
  it('should format whole numbers with commas', () => {
    expect(formatLives(100)).toBe('100');
    expect(formatLives(1000)).toBe('1,000');
    expect(formatLives(1000000)).toBe('1,000,000');
  });

  it('should handle fractional lives >= 100', () => {
    expect(formatLives(100.5)).toBe('101');
    expect(formatLives(999.9)).toBe('1,000');
  });

  it('should show 1 decimal for lives >= 10', () => {
    expect(formatLives(10.5)).toBe('10.5');
    expect(formatLives(99.99)).toBe('100.0');
  });

  it('should show 2 decimals for lives >= 1', () => {
    expect(formatLives(1.5)).toBe('1.50');
    expect(formatLives(9.999)).toBe('10.00');
  });

  it('should show 2 decimals for lives >= 0.01', () => {
    expect(formatLives(0.01)).toBe('0.01');
    expect(formatLives(0.99)).toBe('0.99');
  });

  it('should use scientific notation for very small numbers', () => {
    expect(formatLives(0.001)).toBe('0.00100');
    expect(formatLives(0.0001)).toBe('0.000100');
  });

  it('should handle negative lives', () => {
    expect(formatLives(-100)).toBe('-100');
    expect(formatLives(-10.5)).toBe('-10.5');
    expect(formatLives(-1.5)).toBe('-1.50');
  });
});

describe('formatCurrency', () => {
  it('should return $0 for zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should return ∞ for null/undefined', () => {
    expect(formatCurrency(null)).toBe('∞');
    expect(formatCurrency(undefined)).toBe('∞');
  });

  it('should return ∞ when effectiveness rate is 0', () => {
    expect(formatCurrency(1000, 0)).toBe('∞');
  });

  it('should format small amounts < $10', () => {
    expect(formatCurrency(1)).toBe('$1');
    expect(formatCurrency(5.5)).toBe('$5.5');
    expect(formatCurrency(0.1)).toBe('$0.1');
  });

  it('should format amounts >= $10 as integers', () => {
    expect(formatCurrency(10)).toBe('$10');
    expect(formatCurrency(99.99)).toBe('$100');
  });

  it('should format thousands with commas', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(10000)).toBe('$10,000');
    expect(formatCurrency(999999)).toBe('$999,999');
  });

  it('should format millions with M suffix', () => {
    expect(formatCurrency(1000000)).toBe('$1M');
    expect(formatCurrency(1500000)).toBe('$1.5M');
    expect(formatCurrency(999000000)).toBe('$999M');
  });

  it('should format billions with B suffix', () => {
    expect(formatCurrency(1000000000)).toBe('$1B');
    expect(formatCurrency(1500000000)).toBe('$1.5B');
  });

  it('should format trillions with T suffix', () => {
    expect(formatCurrency(1000000000000)).toBe('$1T');
    expect(formatCurrency(1500000000000)).toBe('$1.5T');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000');
    expect(formatCurrency(-1000000)).toBe('-$1M');
    expect(formatCurrency(-1000000000)).toBe('-$1B');
  });

  it('should use scientific notation for extremely small amounts', () => {
    expect(formatCurrency(0.00001)).toBe('$1.00e-5');
    expect(formatCurrency(0.000001)).toBe('$1.00e-6');
  });
});
