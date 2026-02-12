import { describe, it, expect } from 'vitest';
import {
  setCategoryFieldValue,
  setCategoryEffect,
  setRecipientFieldOverride,
  setRecipientFieldMultiplier,
  clearRecipientCategoryOverrides,
  setGlobalParameter,
  normalizeUserAssumptions,
} from './assumptionsAPIHelpers';

const buildDefaultAssumptions = () => ({
  globalParameters: {
    discountRate: 0.02,
    timeLimit: 100,
  },
  categories: {
    health: {
      effects: [
        {
          effectId: 'e1',
          costPerQALY: 100,
          startTime: 0,
          windowLength: 10,
          disabled: false,
        },
      ],
    },
  },
  recipients: {
    recipientA: {
      name: 'Recipient A',
      categories: {
        health: {
          fraction: 1,
        },
      },
    },
  },
});

const clone = (value) => JSON.parse(JSON.stringify(value));

describe('assumptionsAPIHelpers', () => {
  it('setCategoryFieldValue stores custom field values without mutating input', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      categories: {
        health: {
          effects: [{ effectId: 'e1', startTime: 2 }],
        },
      },
    };
    const original = clone(userAssumptions);

    const result = setCategoryFieldValue(userAssumptions, defaults, 'health', 'e1', 'costPerQALY', 150);

    expect(result).toEqual({
      categories: {
        health: {
          effects: [{ effectId: 'e1', startTime: 2, costPerQALY: 150 }],
        },
      },
    });
    expect(userAssumptions).toEqual(original);
  });

  it('setCategoryFieldValue prunes structure when value is reset to default', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      categories: {
        health: {
          effects: [{ effectId: 'e1', costPerQALY: 150 }],
        },
      },
    };

    const result = setCategoryFieldValue(userAssumptions, defaults, 'health', 'e1', 'costPerQALY', 100);

    expect(result).toBeNull();
  });

  it('setCategoryEffect stores only custom fields and skips metadata fields', () => {
    const defaults = buildDefaultAssumptions();

    const result = setCategoryEffect(null, defaults, 'health', 'e1', {
      effectId: 'e1',
      costPerQALY: 130,
      startTime: 0,
      windowLength: 10,
      disabled: true,
      _uiState: 'ignored',
    });

    expect(result).toEqual({
      categories: {
        health: {
          effects: [{ effectId: 'e1', costPerQALY: 130, disabled: true }],
        },
      },
    });
  });

  it('setRecipientFieldOverride removes conflicting multiplier for the same field', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'e1', multipliers: { costPerQALY: 2, windowLength: 3 } }],
            },
          },
        },
      },
    };

    const result = setRecipientFieldOverride(
      userAssumptions,
      defaults,
      'recipientA',
      'health',
      'e1',
      'costPerQALY',
      200
    );

    expect(result.recipients.recipientA.categories.health.effects[0]).toEqual({
      effectId: 'e1',
      overrides: { costPerQALY: 200 },
      multipliers: { windowLength: 3 },
    });
  });

  it('setRecipientFieldMultiplier removes conflicting override for the same field', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'e1', overrides: { costPerQALY: 220, startTime: 4 } }],
            },
          },
        },
      },
    };

    const result = setRecipientFieldMultiplier(
      userAssumptions,
      defaults,
      'recipientA',
      'health',
      'e1',
      'costPerQALY',
      1.5
    );

    expect(result.recipients.recipientA.categories.health.effects[0]).toEqual({
      effectId: 'e1',
      overrides: { startTime: 4 },
      multipliers: { costPerQALY: 1.5 },
    });
  });

  it('setRecipientFieldMultiplier with multiplier=1 prunes empty structures', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'e1', multipliers: { costPerQALY: 2 } }],
            },
          },
        },
      },
    };

    const result = setRecipientFieldMultiplier(
      userAssumptions,
      defaults,
      'recipientA',
      'health',
      'e1',
      'costPerQALY',
      1
    );

    expect(result).toBeNull();
  });

  it('setGlobalParameter clears override when value matches default', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      globalParameters: {
        discountRate: 0.05,
      },
    };
    const original = clone(userAssumptions);

    const result = setGlobalParameter(userAssumptions, defaults, 'discountRate', 0.02);

    expect(result).toBeNull();
    expect(userAssumptions).toEqual(original);
  });

  it('clearRecipientCategoryOverrides removes empty recipient branches', () => {
    const userAssumptions = {
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [{ effectId: 'e1', overrides: { startTime: 3 } }],
            },
          },
        },
      },
    };

    const result = clearRecipientCategoryOverrides(userAssumptions, 'recipientA', 'health');

    expect(result).toBeNull();
  });

  it('normalizeUserAssumptions removes default-equivalent values and keeps real customizations', () => {
    const defaults = buildDefaultAssumptions();
    const userAssumptions = {
      globalParameters: {
        discountRate: 0.02,
        timeLimit: 150,
      },
      categories: {
        health: {
          effects: [{ effectId: 'e1', costPerQALY: 100, startTime: 2 }],
        },
      },
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [
                {
                  effectId: 'e1',
                  overrides: { costPerQALY: 100, startTime: 5 },
                  multipliers: { windowLength: 1, costPerQALY: 1.4 },
                },
              ],
            },
          },
        },
      },
    };
    const original = clone(userAssumptions);

    const normalized = normalizeUserAssumptions(userAssumptions, defaults);

    expect(normalized).toEqual({
      globalParameters: {
        timeLimit: 150,
      },
      categories: {
        health: {
          effects: [{ effectId: 'e1', startTime: 2 }],
        },
      },
      recipients: {
        recipientA: {
          categories: {
            health: {
              effects: [
                {
                  effectId: 'e1',
                  overrides: { startTime: 5 },
                  multipliers: { costPerQALY: 1.4 },
                },
              ],
            },
          },
        },
      },
    });
    expect(userAssumptions).toEqual(original);
  });

  it('setRecipientFieldOverride is idempotent for repeated identical updates', () => {
    const defaults = buildDefaultAssumptions();

    const once = setRecipientFieldOverride(null, defaults, 'recipientA', 'health', 'e1', 'startTime', 3);
    const twice = setRecipientFieldOverride(once, defaults, 'recipientA', 'health', 'e1', 'startTime', 3);

    expect(twice).toEqual(once);
  });
});
