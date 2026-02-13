import { describe, expect, it } from 'vitest';
import { createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import { validateCreatePayload, validateReference } from './sharedAssumptionsValidation';
import { SharedAssumptionsError } from './sharedAssumptionsErrors';

const defaults = createDefaultAssumptions();
const [firstGlobalParamName, firstGlobalParamValue] = Object.entries(defaults.globalParameters)[0];

const buildValidPayload = () => ({
  assumptions: {
    globalParameters: {
      [firstGlobalParamName]: Number(firstGlobalParamValue) + 1,
    },
  },
});

describe('sharedAssumptionsValidation', () => {
  it('accepts valid payload and normalizes slug/name', () => {
    const result = validateCreatePayload({
      ...buildValidPayload(),
      name: '  My Scenario  ',
      slug: '  My-Scenario  ',
    });

    expect(result.name).toBe('My Scenario');
    expect(result.slug).toBe('my-scenario');
    expect(result.assumptions.globalParameters[firstGlobalParamName]).toBe(Number(firstGlobalParamValue) + 1);
  });

  it('rejects empty/default-only assumptions payload', () => {
    expect(() =>
      validateCreatePayload({
        assumptions: {
          globalParameters: {
            [firstGlobalParamName]: firstGlobalParamValue,
          },
        },
      })
    ).toThrowError(SharedAssumptionsError);
  });

  it('rejects invalid slug format', () => {
    expect(() =>
      validateCreatePayload({
        ...buildValidPayload(),
        slug: 'Not Valid',
      })
    ).toThrowError(SharedAssumptionsError);
  });

  it('rejects reserved slug', () => {
    expect(() =>
      validateCreatePayload({
        ...buildValidPayload(),
        slug: 'assumptions',
      })
    ).toThrowError(SharedAssumptionsError);
  });

  it('validates shared reference', () => {
    expect(validateReference('  abc-123  ')).toBe('abc-123');
    expect(() => validateReference('')).toThrowError(SharedAssumptionsError);
  });
});
