import { describe, expect, it } from 'vitest';
import { validateGlobalParameterValues } from './assumptionsFormValidation';

describe('validateGlobalParameterValues', () => {
  it('rejects incomplete numeric input during save validation', () => {
    const result = validateGlobalParameterValues(
      {
        discountRate: { raw: '-' },
      },
      {
        discountRate: 0.02,
      }
    );

    expect(result.hasErrors).toBe(true);
    expect(result.errors.discountRate).toBe('Please enter a complete number');
  });

  it('rejects malformed numbers instead of silently parsing them', () => {
    const result = validateGlobalParameterValues(
      {
        timeLimit: { raw: '1.2.3' },
      },
      {
        timeLimit: 100,
      }
    );

    expect(result.hasErrors).toBe(true);
    expect(result.errors.timeLimit).toBe('Invalid number');
  });

  it.each(['0x64'])('does not let coercible unsupported default text bypass final validation: %s', (raw) => {
    const result = validateGlobalParameterValues(
      {
        timeLimit: { raw },
      },
      {
        timeLimit: 100,
      }
    );

    expect(result.hasErrors).toBe(true);
    expect(result.errors.timeLimit).toBe('Invalid number');
  });

  it.each(['+100', '1e2'])('accepts complete finite numeric notation: %s', (raw) => {
    const result = validateGlobalParameterValues(
      {
        timeLimit: { raw },
      },
      {
        timeLimit: 100,
      }
    );

    expect(result.hasErrors).toBe(false);
  });
});
