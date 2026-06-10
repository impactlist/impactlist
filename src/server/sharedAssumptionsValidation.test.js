import { describe, expect, it } from 'vitest';
import { MAX_ASSUMPTIONS_BYTES, MAX_DESCRIPTION_LENGTH } from './sharedAssumptionsConfig.js';
import { serverDefaultAssumptions } from './sharedAssumptionsNormalization.js';
import { validateCreatePayload, validateReference } from './sharedAssumptionsValidation.js';
import { SharedAssumptionsError } from './sharedAssumptionsErrors.js';

const defaults = serverDefaultAssumptions;
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
      description: '  Notes about this scenario.  ',
      slug: '  My-Scenario  ',
    });

    expect(result.name).toBe('My Scenario');
    expect(result.description).toBe('Notes about this scenario.');
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

  it('rejects assumptions payload that exceeds max size', () => {
    const hugeValue = 'x'.repeat(MAX_ASSUMPTIONS_BYTES + 1);

    try {
      validateCreatePayload({
        assumptions: {
          globalParameters: {
            [firstGlobalParamName]: Number(firstGlobalParamValue) + 1,
            hugeValue,
          },
        },
      });
      throw new Error('Expected payload to be rejected for size');
    } catch (error) {
      expect(error).toBeInstanceOf(SharedAssumptionsError);
      expect(error.code).toBe('assumptions_too_large');
    }
  });

  it('rejects descriptions that exceed the max length', () => {
    expect(() =>
      validateCreatePayload({
        ...buildValidPayload(),
        description: 'x'.repeat(MAX_DESCRIPTION_LENGTH + 1),
      })
    ).toThrowError(SharedAssumptionsError);
  });
});

describe('assumptions shape validation', () => {
  const [firstCategoryId, firstCategory] = Object.entries(defaults.categories)[0];
  const firstEffect = firstCategory.effects[0];
  const numericEffectField = Object.keys(firstEffect).find((field) => typeof firstEffect[field] === 'number');

  const [recipientId, defaultRecipient] = Object.entries(defaults.recipients).find(
    ([, recipient]) => recipient.categories && Object.keys(recipient.categories).length > 0
  );
  const recipientCategoryId = Object.keys(defaultRecipient.categories)[0];
  const recipientBaseEffect = defaults.categories[recipientCategoryId].effects[0];
  const recipientNumericField = Object.keys(recipientBaseEffect).find(
    (field) => typeof recipientBaseEffect[field] === 'number'
  );
  const unrelatedCategoryId = Object.keys(defaults.categories).find(
    (categoryId) => !Object.hasOwn(defaultRecipient.categories, categoryId)
  );

  const expectInvalidAssumptions = (assumptions, messageFragment) => {
    try {
      validateCreatePayload({ assumptions });
      throw new Error('Expected assumptions to be rejected');
    } catch (error) {
      expect(error).toBeInstanceOf(SharedAssumptionsError);
      expect(error.status).toBe(400);
      expect(error.code).toBe('invalid_assumptions');
      expect(error.message).toContain(messageFragment);
    }
  };

  it('accepts a fully-loaded valid payload, including negative values', () => {
    const result = validateCreatePayload({
      assumptions: {
        globalParameters: { [firstGlobalParamName]: Number(firstGlobalParamValue) + 1 },
        categories: {
          [firstCategoryId]: {
            effects: [{ effectId: firstEffect.effectId, [numericEffectField]: -123.45, disabled: false }],
          },
        },
        recipients: {
          [recipientId]: {
            categories: {
              [recipientCategoryId]: {
                effects: [
                  {
                    effectId: recipientBaseEffect.effectId,
                    overrides: { [recipientNumericField]: -5 },
                    multipliers: { [recipientNumericField]: 2 },
                    disabled: true,
                  },
                ],
              },
            },
          },
        },
      },
    });

    expect(result.assumptions.globalParameters[firstGlobalParamName]).toBe(Number(firstGlobalParamValue) + 1);
    expect(result.assumptions.categories[firstCategoryId].effects[0][numericEffectField]).toBe(-123.45);
    expect(result.assumptions.recipients[recipientId].categories[recipientCategoryId].effects[0].overrides).toEqual({
      [recipientNumericField]: -5,
    });
  });

  it('rejects non-array effects with a 400 instead of storing them or crashing', () => {
    expectInvalidAssumptions({ categories: { [firstCategoryId]: { effects: {} } } }, 'must be an array.');
    // This shape used to reach effects.splice and blow up as a 500.
    expectInvalidAssumptions({ categories: { [firstCategoryId]: { effects: 'ab' } } }, 'must be an array.');
  });

  it('rejects non-numeric global parameter values', () => {
    expectInvalidAssumptions({ globalParameters: { [firstGlobalParamName]: 'abc' } }, 'must be a finite number.');
    expectInvalidAssumptions({ globalParameters: { [firstGlobalParamName]: null } }, 'must be a finite number.');
  });

  it('rejects unknown global parameters, categories, recipients, and top-level keys', () => {
    expectInvalidAssumptions({ globalParameters: { madeUpParameter: 1 } }, 'unknown global parameter');
    expectInvalidAssumptions({ categories: { madeUpCategory: { effects: [] } } }, 'unknown category');
    expectInvalidAssumptions({ recipients: { madeUpRecipient: { categories: {} } } }, 'unknown recipient');
    expectInvalidAssumptions({ madeUpSection: {} }, 'unknown section');
  });

  it('rejects unknown effect ids and unknown or non-numeric effect fields', () => {
    expectInvalidAssumptions(
      { categories: { [firstCategoryId]: { effects: [{ effectId: 'made-up-effect' }] } } },
      'unknown effect'
    );
    expectInvalidAssumptions(
      { categories: { [firstCategoryId]: { effects: [{ effectId: firstEffect.effectId, madeUpField: 1 }] } } },
      'unknown field'
    );
    expectInvalidAssumptions(
      {
        categories: {
          [firstCategoryId]: { effects: [{ effectId: firstEffect.effectId, [numericEffectField]: 'NaN-ish' }] },
        },
      },
      'must be a finite number.'
    );
  });

  it('rejects duplicate effect ids and non-boolean disabled flags', () => {
    expectInvalidAssumptions(
      {
        categories: {
          [firstCategoryId]: {
            effects: [
              { effectId: firstEffect.effectId, [numericEffectField]: 1 },
              { effectId: firstEffect.effectId, [numericEffectField]: 2 },
            ],
          },
        },
      },
      'duplicates effect'
    );
    expectInvalidAssumptions(
      { categories: { [firstCategoryId]: { effects: [{ effectId: firstEffect.effectId, disabled: 'yes' }] } } },
      'must be a boolean.'
    );
  });

  it('rejects recipient categories the recipient is not associated with', () => {
    expectInvalidAssumptions(
      {
        recipients: {
          [recipientId]: { categories: { [unrelatedCategoryId]: { effects: [] } } },
        },
      },
      'not associated with recipient'
    );
  });

  it('rejects recipient effect fields outside overrides/multipliers/disabled', () => {
    expectInvalidAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [recipientCategoryId]: {
                effects: [{ effectId: recipientBaseEffect.effectId, [recipientNumericField]: 5 }],
              },
            },
          },
        },
      },
      "recipient effects support 'overrides', 'multipliers', and 'disabled'."
    );
    expectInvalidAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [recipientCategoryId]: {
                effects: [{ effectId: recipientBaseEffect.effectId, overrides: { madeUpField: 5 } }],
              },
            },
          },
        },
      },
      'unknown field'
    );
    expectInvalidAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [recipientCategoryId]: {
                effects: [{ effectId: recipientBaseEffect.effectId, overrides: { [recipientNumericField]: 'x' } }],
              },
            },
          },
        },
      },
      'must be a finite number.'
    );
  });

  it('rejects __proto__ and other prototype-rewiring keys anywhere in the payload', () => {
    expectInvalidAssumptions({ globalParameters: JSON.parse('{"__proto__": 1}') }, 'Forbidden key');
    expectInvalidAssumptions(
      { categories: { [firstCategoryId]: { effects: [JSON.parse('{"effectId": "x", "constructor": 1}')] } } },
      'Forbidden key'
    );
    expectInvalidAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [recipientCategoryId]: {
                effects: [
                  {
                    effectId: recipientBaseEffect.effectId,
                    overrides: JSON.parse('{"prototype": 2}'),
                  },
                ],
              },
            },
          },
        },
      },
      'Forbidden key'
    );
  });
});
