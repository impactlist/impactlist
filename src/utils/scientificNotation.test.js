import { describe, expect, it } from 'vitest';
import { parseScientificNotationDisplay } from './scientificNotation';

describe('parseScientificNotationDisplay', () => {
  it('returns null for nullish and non-string-like inputs', () => {
    expect(parseScientificNotationDisplay(null)).toBeNull();
    expect(parseScientificNotationDisplay(undefined)).toBeNull();
    expect(parseScientificNotationDisplay({})).toBeNull();
  });

  it('returns null for values that are not in the scientific display format', () => {
    expect(parseScientificNotationDisplay('$1.50 B')).toBeNull();
    expect(parseScientificNotationDisplay('1.00e21')).toBeNull();
    expect(parseScientificNotationDisplay('plain text')).toBeNull();
  });

  it('parses positive scientific-notation strings', () => {
    expect(parseScientificNotationDisplay('1.00 × 10²¹')).toEqual({
      textValue: '1.00 × 10²¹',
      mantissa: '1.00',
      powerBase: ' × 10',
      exponentSuperscript: '²¹',
      exponentPlain: '21',
    });
  });

  it('parses negative exponents and preserves leading prefixes', () => {
    expect(parseScientificNotationDisplay('$1.00 × 10⁻⁵')).toEqual({
      textValue: '$1.00 × 10⁻⁵',
      mantissa: '$1.00',
      powerBase: ' × 10',
      exponentSuperscript: '⁻⁵',
      exponentPlain: '−5',
    });
  });
});
