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
    expect(cleanAndParseValue(-5)).toEqual({ cleanValue: -5, numValue: -5 });
  });

  it('returns NaN for trailing-garbage values instead of parseFloat-prefix parsing', () => {
    expect(cleanAndParseValue('10550000dff').numValue).toBeNaN();
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

  it('rejects zero and garbage costPerQALY but allows negatives (domain rule)', () => {
    expect(validateEffectField('costPerQALY', '0', 'qaly')).toMatch(/cannot be zero/);
    expect(validateEffectField('costPerQALY', 'abc', 'qaly')).toMatch(/valid number/);
    expect(validateEffectField('costPerQALY', '-40,000', 'qaly')).toBeNull();
  });

  it('bounds populationFractionAffected to (0, 1] and rejects zero qalyImprovementPerYear', () => {
    expect(validateEffectField('populationFractionAffected', '1', 'population')).toBeNull();
    expect(validateEffectField('populationFractionAffected', '0', 'population')).toMatch(/between 0 and 1/);
    expect(validateEffectField('populationFractionAffected', '1.5', 'population')).toMatch(/between 0 and 1/);
    expect(validateEffectField('costPerMicroprobability', '-2', 'population')).toBeNull();
    expect(validateEffectField('qalyImprovementPerYear', '0', 'population')).toMatch(/cannot be zero/);
    expect(validateEffectField('qalyImprovementPerYear', '-0.1', 'population')).toBeNull();
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
  });

  it('delegates bounds to the shared global-parameter rules table', () => {
    expect(validateGlobalField('discountRate', '1.5')).toMatch(/no greater than 100%/);
    expect(validateGlobalField('populationGrowthRate', '-1')).toMatch(/cannot be -100% or less/);
    expect(validateGlobalField('populationGrowthRate', '-0.5')).toBeNull();
    expect(validateGlobalField('timeLimit', '0')).not.toBeNull();
    expect(validateGlobalField('timeLimit', '100')).toBeNull();
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
