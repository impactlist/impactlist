import { describe, expect, it } from 'vitest';
import { parseFiniteDecimal } from './numberParsing';

describe('parseFiniteDecimal', () => {
  it('parses finite decimal and scientific input including formatted values', () => {
    expect(parseFiniteDecimal('1,234.5')).toBe(1234.5);
    expect(parseFiniteDecimal('-.5')).toBe(-0.5);
    expect(parseFiniteDecimal('1.')).toBe(1);
    expect(parseFiniteDecimal('1e3')).toBe(1000);
    expect(parseFiniteDecimal('+100')).toBe(100);
    expect(parseFiniteDecimal('+1,000e-2')).toBe(10);
    expect(parseFiniteDecimal(42)).toBe(42);
  });

  it('rejects unsupported syntax, incomplete exponents, and non-finite values', () => {
    expect(parseFiniteDecimal('0x10')).toBeNull();
    expect(parseFiniteDecimal('1e')).toBeNull();
    expect(parseFiniteDecimal('1e+')).toBeNull();
    expect(parseFiniteDecimal('1e309')).toBeNull();
    expect(parseFiniteDecimal('12,34')).toBeNull();
    expect(parseFiniteDecimal('12oops')).toBeNull();
    expect(parseFiniteDecimal('')).toBeNull();
    expect(parseFiniteDecimal(Infinity)).toBeNull();
  });
});
