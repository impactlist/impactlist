import { describe, expect, it } from 'vitest';
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
