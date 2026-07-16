import { describe, expect, it } from 'vitest';
import {
  cleanAndParseValue,
  getEffectType,
  isPartialInput,
  validateEffect,
  validateEffectField,
  validateEffects,
  validateGlobalField,
  validateRecipientEffectField,
  validateRecipientEffects,
  validateTimeInterval,
} from './effectValidation';

describe('getEffectType', () => {
  it('sniffs the type from field presence', () => {
    expect(getEffectType({ costPerQALY: 100 })).toBe('qaly');
    expect(getEffectType({ costPerMicroprobability: 5 })).toBe('population');
    expect(getEffectType({ effectId: 'x' })).toBe('unknown');
    expect(getEffectType(null)).toBe('unknown');
  });
});

describe('cleanAndParseValue / isPartialInput', () => {
  it('parses formatted currency strings and scientific notation', () => {
    expect(cleanAndParseValue('$1,000')).toEqual({ cleanValue: '1000', numValue: 1000 });
    expect(cleanAndParseValue('1e3').numValue).toBe(1000);
    expect(cleanAndParseValue('+1,000e-2').numValue).toBe(10);
    expect(cleanAndParseValue('12,34').numValue).toBeNaN();
    expect(cleanAndParseValue(-5)).toEqual({ cleanValue: -5, numValue: -5 });
  });

  it('returns NaN for trailing-garbage values instead of parseFloat-prefix parsing', () => {
    expect(cleanAndParseValue('10550000dff').numValue).toBeNaN();
    expect(cleanAndParseValue('1$2').numValue).toBeNaN();
    expect(cleanAndParseValue(null).numValue).toBeNaN();
  });

  it('treats mid-typing states as partial input', () => {
    for (const partial of ['', '-', '.', '-.']) {
      expect(isPartialInput(partial)).toBe(true);
      expect(cleanAndParseValue(partial).cleanValue).toBe(partial);
    }
    expect(isPartialInput('1.')).toBe(false);
  });
});

describe('validateEffectField', () => {
  it('requires non-negative startTime and strictly positive windowLength', () => {
    expect(validateEffectField('startTime', '0', 'qaly')).toBeNull();
    expect(validateEffectField('startTime', '-1', 'qaly')).toMatch(/non-negative/);
    expect(validateEffectField('startTime', '-', 'qaly')).toMatch(/required/);
    expect(validateEffectField('windowLength', '0', 'qaly')).toMatch(/positive/);
    expect(validateEffectField('windowLength', '10', 'qaly')).toBeNull();
  });

  it('rejects zero and garbage costPerQALY but allows all finite nonzero magnitudes', () => {
    expect(validateEffectField('costPerQALY', '0', 'qaly')).toMatch(/cannot be zero/);
    expect(validateEffectField('costPerQALY', 'abc', 'qaly')).toMatch(/valid number/);
    expect(validateEffectField('costPerQALY', '-40,000', 'qaly')).toBeNull();
    expect(validateEffectField('costPerQALY', '5e-324', 'qaly')).toBeNull();
    expect(validateEffectField('costPerQALY', '1e100', 'qaly')).toBeNull();
  });

  it('bounds populationFractionAffected to (0, 1] and rejects zero qalyImprovementPerYear', () => {
    expect(validateEffectField('populationFractionAffected', '1', 'population')).toBeNull();
    expect(validateEffectField('populationFractionAffected', '0', 'population')).toMatch(/between 0 and 1/);
    expect(validateEffectField('populationFractionAffected', '1.5', 'population')).toMatch(/between 0 and 1/);
    expect(validateEffectField('costPerMicroprobability', '-2', 'population')).toBeNull();
    expect(validateEffectField('qalyImprovementPerYear', '0', 'population')).toMatch(/cannot be zero/);
    expect(validateEffectField('qalyImprovementPerYear', '-0.1', 'population')).toBeNull();
    expect(validateEffectField('populationFractionAffected', '1e-100', 'population')).toBeNull();
  });
});

describe('validateTimeInterval', () => {
  it('accepts null, open-ended, and ordered intervals', () => {
    expect(validateTimeInterval(null, 'e')).toBeNull();
    expect(validateTimeInterval([null, 2020], 'e')).toBeNull();
    expect(validateTimeInterval([2000, null], 'e')).toBeNull();
    expect(validateTimeInterval([2000, 2020], 'e')).toBeNull();
  });

  it('rejects malformed shapes, non-integers, and reversed bounds', () => {
    expect(validateTimeInterval([2020], 'e')).toMatch(/must be \[startYear, endYear\]/);
    expect(validateTimeInterval([2000.5, 2020], 'e')).toMatch(/integer/);
    expect(validateTimeInterval([2020, 2000], 'e')).toMatch(/>= start year/);
  });
});

describe('validateEffect / validateEffects', () => {
  const validQaly = { effectId: 'q', costPerQALY: '100', startTime: '0', windowLength: '10' };

  it('returns no errors for a valid effect and keys errors by index-field', () => {
    expect(validateEffect(validQaly).isValid).toBe(true);

    const result = validateEffects([validQaly, { ...validQaly, windowLength: '0' }]);
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(['1-windowLength']);
  });

  it('includes interval errors under the index-interval key', () => {
    const result = validateEffect({ ...validQaly, validTimeInterval: [2020, 2000] }, 3);
    expect(result.errors['3-interval']).toMatch(/>= start year/);
  });
});

describe('validateGlobalField', () => {
  it('allows partial input mid-typing and rejects garbage', () => {
    expect(validateGlobalField('discountRate', '-')).toBeNull();
    expect(validateGlobalField('discountRate', 'abc')).toBe('Invalid number');
    expect(validateGlobalField('timeLimit', '+100')).toBeNull();
    expect(validateGlobalField('timeLimit', '0x64')).toBe('Invalid number');
    expect(validateGlobalField('timeLimit', '1e2')).toBeNull();
  });

  it('delegates bounds to the shared global-parameter rules table', () => {
    expect(validateGlobalField('discountRate', '1.5')).toBeNull();
    expect(validateGlobalField('discountRate', '10')).toBeNull();
    expect(validateGlobalField('discountRate', '10.01')).toMatch(/no greater than 1,000%/);
    expect(validateGlobalField('populationGrowthRate', '-1')).toMatch(/cannot be -100% or less/);
    expect(validateGlobalField('populationGrowthRate', '-0.5')).toBeNull();
    expect(validateGlobalField('timeLimit', '0')).not.toBeNull();
    expect(validateGlobalField('timeLimit', '100')).toBeNull();
    expect(validateGlobalField('timeLimit', 5e-324)).toBeNull();
    expect(validateGlobalField('timeLimit', Number.MAX_VALUE)).toBeNull();
    expect(validateGlobalField('populationGrowthRate', 3)).toBeNull();
  });
});

describe('validateRecipientEffectField', () => {
  it('rejects zero multipliers, and negative multipliers only on must-stay-positive fields', () => {
    expect(validateRecipientEffectField('costPerQALY', '0', 'multiplier', 'qaly')).toMatch(/cannot be zero/);
    expect(validateRecipientEffectField('costPerQALY', '-2', 'multiplier', 'qaly')).toBeNull();
    expect(validateRecipientEffectField('windowLength', '-2', 'multiplier', 'qaly')).toMatch(/cannot be negative/);
    expect(validateRecipientEffectField('populationFractionAffected', '-1', 'multiplier', 'population')).toMatch(
      /cannot be negative/
    );
  });

  it('validates overrides with the regular effect-field rules', () => {
    expect(validateRecipientEffectField('costPerQALY', '0', 'override', 'qaly')).toMatch(/cannot be zero/);
    expect(validateRecipientEffectField('costPerQALY', '-500', 'override', 'qaly')).toBeNull();
    expect(validateRecipientEffectField('windowLength', '0', 'override', 'qaly')).toMatch(/positive/);
  });

  // A RAW empty value is a cleared override/multiplier (falls back to the
  // default), but everything else that can't apply as a finite number must
  // error — returning null let Apply crash converting it ('-') or throw in
  // normalization, which rejects non-finite numbers ('1e999' → Infinity).
  it('accepts raw-empty as cleared but rejects partials, symbols, and non-finite numbers', () => {
    // null/undefined are cleared values per the draft hook's contract and
    // must not reach the string parser (which would throw on them).
    for (const cleared of ['', null, undefined]) {
      expect(validateRecipientEffectField('costPerQALY', cleared, 'override', 'qaly')).toBeNull();
      expect(validateRecipientEffectField('costPerQALY', cleared, 'multiplier', 'qaly')).toBeNull();
    }
    for (const invalid of ['-', '.', '-.', '$', '1e999', '-1e999']) {
      expect(validateRecipientEffectField('costPerQALY', invalid, 'override', 'qaly')).toBe('Invalid number');
      expect(validateRecipientEffectField('costPerQALY', invalid, 'multiplier', 'qaly')).toBe('Invalid number');
    }
  });
});

describe('non-finite parses are invalid everywhere', () => {
  it('rejects 1e999 (parses to Infinity, which passes isNaN) in category effect fields', () => {
    expect(validateEffectField('costPerQALY', '1e999', 'qaly')).toMatch(/valid number/);
    expect(validateEffectField('costPerQALY', '-1e999', 'qaly')).toMatch(/valid number/);
    expect(validateEffectField('windowLength', '1e999', 'qaly')).toMatch(/positive/);
    expect(validateEffectField('startTime', '1e999', 'qaly')).toMatch(/non-negative/);
    expect(validateEffectField('costPerMicroprobability', '1e999', 'population')).toMatch(/valid number/);
    expect(validateEffectField('qalyImprovementPerYear', '-1e999', 'population')).toMatch(/valid number/);
  });

  it('rejects 1e999 in global parameter fields', () => {
    expect(validateGlobalField('timeLimit', '1e999')).not.toBeNull();
    expect(validateGlobalField('discountRate', '-1e999')).not.toBeNull();
  });
});

describe('validateRecipientEffects', () => {
  it('aggregates override/multiplier errors with mode-suffixed keys', () => {
    const result = validateRecipientEffects([
      { effectId: 'e', costPerQALY: 100, overrides: { costPerQALY: '0' }, multipliers: { windowLength: '-1' } },
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors['0-costPerQALY-override']).toMatch(/cannot be zero/);
    expect(result.errors['0-windowLength-multiplier']).toMatch(/cannot be negative/);
  });

  it('flags a field carrying both an override and a multiplier', () => {
    const result = validateRecipientEffects([
      { effectId: 'e', costPerQALY: 100, overrides: { costPerQALY: '50' }, multipliers: { costPerQALY: '2' } },
    ]);

    expect(result.errors['0-costPerQALY-conflict']).toMatch(/both override and multiplier/);
  });

  it('ignores empty values and passes a clean wrapper', () => {
    const result = validateRecipientEffects([
      { effectId: 'e', costPerQALY: 100, overrides: { costPerQALY: '' }, multipliers: {} },
    ]);
    expect(result.isValid).toBe(true);
  });
});
