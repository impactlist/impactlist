import { describe, expect, it } from 'vitest';
import { categoriesById, globalParameters, recipientsById } from '../data/generatedData.js';
import { normalizeUserAssumptions } from './assumptionsNormalization.js';

// Wrapper-aware pruning: for a recipient that ships default overrides /
// multipliers / disabled (a customized recipient), the no-op value for a user
// edit is the recipient's own default, not the category base. These tests use
// synthetic defaults so the cases don't depend on which corpus recipients
// happen to be customized.
const buildDefaults = () => ({
  globalParameters: { discountRate: 0.05 },
  categories: {
    health: {
      effects: [{ effectId: 'health-effect', costPerQALY: 100, startTime: 0, windowLength: 10 }],
    },
  },
  recipients: {
    customized: {
      categories: {
        health: {
          effects: [
            {
              effectId: 'health-effect',
              overrides: { startTime: 3, costPerQALY: 120 },
              multipliers: { windowLength: 4 },
              disabled: true,
            },
          ],
        },
      },
    },
    plain: {
      categories: { health: {} },
    },
  },
});

const recipientEffectAssumptions = (recipientId, effectEntry) => ({
  recipients: {
    [recipientId]: {
      categories: {
        health: { effects: [{ effectId: 'health-effect', ...effectEntry }] },
      },
    },
  },
});

const normalizedEffect = (result, recipientId) => result.recipients[recipientId].categories.health.effects[0];

describe('normalizeUserAssumptions recipient-default awareness', () => {
  it('prunes multipliers equal to the recipient default multiplier', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { multipliers: { windowLength: 4 } }),
      buildDefaults()
    );

    expect(result).toBeNull();
  });

  it('keeps an explicit multiplier of 1 that resets a customized recipient to the category baseline', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { multipliers: { windowLength: 1 } }),
      buildDefaults()
    );

    expect(normalizedEffect(result, 'customized').multipliers).toEqual({ windowLength: 1 });
  });

  it('keeps a base-equal override that replaces a recipient default multiplier', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { overrides: { windowLength: 10 } }),
      buildDefaults()
    );

    expect(normalizedEffect(result, 'customized').overrides).toEqual({ windowLength: 10 });
  });

  it('keeps a 1x multiplier that replaces a recipient default override', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { multipliers: { costPerQALY: 1 } }),
      buildDefaults()
    );

    expect(normalizedEffect(result, 'customized').multipliers).toEqual({ costPerQALY: 1 });
  });

  it('still prunes a multiplier of 1 when the recipient has no default multiplier', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('plain', { multipliers: { windowLength: 1 } }),
      buildDefaults()
    );

    expect(result).toBeNull();
  });

  it('prunes a user overrides object identical to the recipient default overrides', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { overrides: { startTime: 3, costPerQALY: 120 } }),
      buildDefaults()
    );

    expect(result).toBeNull();
  });

  it('keeps a partially-changed overrides object INTACT (combine replaces override sets wholesale)', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('customized', { overrides: { startTime: 3, costPerQALY: 999 } }),
      buildDefaults()
    );

    // startTime: 3 matches the recipient default, but pruning it would change
    // what the whole-object replacement reconstructs to at combine time.
    expect(normalizedEffect(result, 'customized').overrides).toEqual({ startTime: 3, costPerQALY: 999 });
  });

  it('prunes per-field against the base effect when the recipient has no default overrides', () => {
    const result = normalizeUserAssumptions(
      recipientEffectAssumptions('plain', { overrides: { costPerQALY: 100 } }),
      buildDefaults()
    );

    expect(result).toBeNull();
  });

  it('compares disabled against the recipient default, falling back to the base effect', () => {
    const defaults = buildDefaults();

    expect(normalizeUserAssumptions(recipientEffectAssumptions('customized', { disabled: true }), defaults)).toBeNull();
    expect(
      normalizedEffect(
        normalizeUserAssumptions(recipientEffectAssumptions('customized', { disabled: false }), defaults),
        'customized'
      ).disabled
    ).toBe(false);

    expect(normalizeUserAssumptions(recipientEffectAssumptions('plain', { disabled: false }), defaults)).toBeNull();
    expect(
      normalizedEffect(
        normalizeUserAssumptions(recipientEffectAssumptions('plain', { disabled: true }), defaults),
        'plain'
      ).disabled
    ).toBe(true);
  });
});

describe('normalizeUserAssumptions production recipient resets', () => {
  const productionDefaults = {
    globalParameters,
    categories: categoriesById,
    recipients: recipientsById,
  };

  it('keeps Future of Life Institute resetting its default override to the category base value', () => {
    const categoryId = 'ai-risk';
    const recipientId = 'future-of-life-institute';
    const effectId = 'population';
    const field = 'costPerMicroprobability';
    const baseValue = categoriesById[categoryId].effects.find((effect) => effect.effectId === effectId)[field];
    const defaultOverride = recipientsById[recipientId].categories[categoryId].effects.find(
      (effect) => effect.effectId === effectId
    ).overrides[field];

    expect(defaultOverride).toBe(2_400_000);
    expect(baseValue).not.toBe(defaultOverride);

    const result = normalizeUserAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [categoryId]: { effects: [{ effectId, overrides: { [field]: baseValue } }] },
            },
          },
        },
      },
      productionDefaults
    );

    expect(result.recipients[recipientId].categories[categoryId].effects[0].overrides).toEqual({
      [field]: baseValue,
    });

    // Matching the recipient's own default override exactly is the no-op.
    expect(
      normalizeUserAssumptions(
        {
          recipients: {
            [recipientId]: {
              categories: {
                [categoryId]: { effects: [{ effectId, overrides: { [field]: defaultOverride } }] },
              },
            },
          },
        },
        productionDefaults
      )
    ).toBeNull();
  });

  it('keeps Internet Archive switching its default override to a 1x category multiplier', () => {
    const categoryId = 'science-tech';
    const recipientId = 'internet-archive';
    const effectId = 'standard';
    const field = 'costPerQALY';

    expect(
      recipientsById[recipientId].categories[categoryId].effects.find((effect) => effect.effectId === effectId)
        .overrides[field]
    ).toBe(6000);

    const result = normalizeUserAssumptions(
      {
        recipients: {
          [recipientId]: {
            categories: {
              [categoryId]: { effects: [{ effectId, multipliers: { [field]: 1 } }] },
            },
          },
        },
      },
      productionDefaults
    );

    expect(result.recipients[recipientId].categories[categoryId].effects[0].multipliers).toEqual({ [field]: 1 });
  });
});

describe('normalizeUserAssumptions semantic validation', () => {
  it('rejects global parameter values that would violate calculation invariants', () => {
    const defaults = {
      ...buildDefaults(),
      globalParameters: {
        discountRate: 0.05,
        populationGrowthRate: 0.01,
        timeLimit: 100,
        populationLimit: 2,
        currentPopulation: 8_000_000_000,
        yearsPerLife: 80,
      },
    };

    expect(() => normalizeUserAssumptions({ globalParameters: { discountRate: -0.01 } }, defaults)).toThrow(
      /discount rate cannot be negative/i
    );
    expect(normalizeUserAssumptions({ globalParameters: { discountRate: 10 } }, defaults)).toEqual({
      globalParameters: { discountRate: 10 },
    });
    expect(() => normalizeUserAssumptions({ globalParameters: { discountRate: 10.01 } }, defaults)).toThrow(
      /discount rate must be no greater than 1,000%/i
    );
    expect(() => normalizeUserAssumptions({ globalParameters: { populationGrowthRate: -1 } }, defaults)).toThrow(
      /population growth rate cannot be -100% or less/i
    );
    expect(() => normalizeUserAssumptions({ globalParameters: { timeLimit: 0 } }, defaults)).toThrow(
      /time limit must be positive/i
    );
    expect(() => normalizeUserAssumptions({ globalParameters: { populationLimit: -2 } }, defaults)).toThrow(
      /population limit must be positive/i
    );
    expect(normalizeUserAssumptions({ globalParameters: { yearsPerLife: 5e-324 } }, defaults)).toEqual({
      globalParameters: { yearsPerLife: 5e-324 },
    });
    expect(normalizeUserAssumptions({ globalParameters: { currentPopulation: Number.MAX_VALUE } }, defaults)).toEqual({
      globalParameters: { currentPopulation: Number.MAX_VALUE },
    });
  });

  it('rejects category effect values that would crash the calculation layer', () => {
    const buildCategoryEdit = (field, value) => ({
      categories: {
        health: { effects: [{ effectId: 'health-effect', [field]: value }] },
      },
    });
    const defaults = buildDefaults();

    expect(() => normalizeUserAssumptions(buildCategoryEdit('costPerQALY', 0), defaults)).toThrow(
      /costPerQALY.*cannot be zero/
    );
    expect(() => normalizeUserAssumptions(buildCategoryEdit('startTime', -1), defaults)).toThrow(
      /startTime.*must be non-negative/
    );
    expect(() => normalizeUserAssumptions(buildCategoryEdit('windowLength', 0), defaults)).toThrow(
      /windowLength.*must be positive/
    );
    expect(normalizeUserAssumptions(buildCategoryEdit('costPerQALY', 5e-324), defaults)).toEqual(
      buildCategoryEdit('costPerQALY', 5e-324)
    );

    expect(normalizeUserAssumptions(buildCategoryEdit('costPerQALY', -25), defaults)).toEqual(
      buildCategoryEdit('costPerQALY', -25)
    );
  });

  it('rejects invalid recipient overrides, multipliers, and conflicting modes', () => {
    const defaults = buildDefaults();

    expect(() =>
      normalizeUserAssumptions(recipientEffectAssumptions('plain', { overrides: { windowLength: 0 } }), defaults)
    ).toThrow(/windowLength.*must be positive/);

    expect(() =>
      normalizeUserAssumptions(recipientEffectAssumptions('plain', { multipliers: { costPerQALY: 0 } }), defaults)
    ).toThrow(/multiplier.*costPerQALY.*cannot be zero/);

    expect(() =>
      normalizeUserAssumptions(recipientEffectAssumptions('plain', { multipliers: { windowLength: -1 } }), defaults)
    ).toThrow(/windowLength.*must be positive/);

    expect(() =>
      normalizeUserAssumptions(recipientEffectAssumptions('plain', { multipliers: { windowLength: 1e308 } }), defaults)
    ).toThrow(/windowLength.*non-finite value/);

    expect(() =>
      normalizeUserAssumptions(
        recipientEffectAssumptions('plain', {
          overrides: { costPerQALY: 50 },
          multipliers: { costPerQALY: 2 },
        }),
        defaults
      )
    ).toThrow(/cannot have both an override and a multiplier/);
  });

  it('allows large finite category edits through built-in recipient wrappers', () => {
    const defaults = buildDefaults();
    defaults.recipients.plain.categories.health.effects = [
      { effectId: 'health-effect', multipliers: { costPerQALY: 2 } },
    ];
    const categoryCost = 7e15;
    const assumptions = {
      categories: {
        health: { effects: [{ effectId: 'health-effect', costPerQALY: categoryCost }] },
      },
      recipients: {
        plain: {
          categories: {
            health: { effects: [{ effectId: 'health-effect', overrides: { windowLength: 20 } }] },
          },
        },
      },
    };

    expect(normalizeUserAssumptions(assumptions, defaults)).toEqual(assumptions);

    const overflowingAssumptions = {
      categories: {
        health: { effects: [{ effectId: 'health-effect', costPerQALY: 1e308 }] },
      },
    };
    expect(() => normalizeUserAssumptions(overflowingAssumptions, defaults)).toThrow(/produces a non-finite value/);
  });
});
