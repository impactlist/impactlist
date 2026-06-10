import { describe, expect, it } from 'vitest';
import {
  buildRecipientEditableEffects,
  calculateEffectCostPerLife,
  getRecipientEffectsChangeState,
} from './effectEditorUtils';

describe('buildRecipientEditableEffects', () => {
  it('uses user category values as the recipient base effect for downstream calculations', () => {
    const baseCategoryEffects = [
      {
        effectId: 'standard',
        costPerQALY: 160000,
        startTime: 1,
        windowLength: 10,
      },
    ];

    const userCategoryEffects = [
      {
        effectId: 'standard',
        costPerQALY: 80000,
      },
    ];

    const [editableEffect] = buildRecipientEditableEffects({
      baseCategoryEffects,
      userCategoryEffects,
    });

    expect(editableEffect._baseEffect.costPerQALY).toBe(80000);

    const globalParameters = {
      yearsPerLife: 100,
      discountRate: 0,
      timeLimit: 100,
    };

    expect(calculateEffectCostPerLife(editableEffect._baseEffect, globalParameters, 2026)).toBe(8000000);
  });

  it('preserves category-level disabled state on the recipient base effect', () => {
    const [editableEffect] = buildRecipientEditableEffects({
      baseCategoryEffects: [
        {
          effectId: 'standard',
          costPerQALY: 160000,
          startTime: 1,
          windowLength: 10,
          disabled: false,
        },
      ],
      userCategoryEffects: [
        {
          effectId: 'standard',
          disabled: true,
        },
      ],
    });

    expect(editableEffect._baseEffect.disabled).toBe(true);
  });
});

describe('getRecipientEffectsChangeState', () => {
  const baseEffect = { effectId: 'std', costPerQALY: 1000, startTime: 0, windowLength: 10 };

  const buildDraft = (overrides = {}) => ({
    effectId: 'std',
    overrides: {},
    multipliers: {},
    disabled: false,
    _baseEffect: baseEffect,
    _defaultRecipientEffect: undefined,
    _userEffect: undefined,
    ...overrides,
  });

  it('reports no changes for empty input and for drafts matching their defaults', () => {
    expect(getRecipientEffectsChangeState([])).toEqual({ effectsToSave: [], hasUnsavedChanges: false });
    expect(getRecipientEffectsChangeState([buildDraft()])).toEqual({ effectsToSave: [], hasUnsavedChanges: false });
  });

  it('converts stringly overrides to numbers and strips internal draft fields', () => {
    const { effectsToSave, hasUnsavedChanges } = getRecipientEffectsChangeState([
      buildDraft({ overrides: { costPerQALY: '2,000' } }),
    ]);

    expect(hasUnsavedChanges).toBe(true);
    expect(effectsToSave).toHaveLength(1);
    expect(effectsToSave[0].overrides).toEqual({ costPerQALY: 2000 });
    // _baseEffect must never reach saved state (validation rejects it).
    expect(Object.keys(effectsToSave[0]).some((key) => key.startsWith('_'))).toBe(false);
  });

  it('saves a disabled toggle only when it differs from the recipient default', () => {
    const toggled = getRecipientEffectsChangeState([buildDraft({ disabled: true })]);
    expect(toggled.hasUnsavedChanges).toBe(true);
    expect(toggled.effectsToSave[0].disabled).toBe(true);

    const matchingDefault = getRecipientEffectsChangeState([
      buildDraft({ disabled: true, _defaultRecipientEffect: { effectId: 'std', disabled: true } }),
    ]);
    expect(matchingDefault.hasUnsavedChanges).toBe(false);
    expect(matchingDefault.effectsToSave).toEqual([]);
  });

  it('treats clearing a previously-saved override as a change to persist', () => {
    const { effectsToSave, hasUnsavedChanges } = getRecipientEffectsChangeState([
      buildDraft({
        overrides: {},
        _userEffect: { effectId: 'std', overrides: { costPerQALY: 500 } },
      }),
    ]);

    expect(hasUnsavedChanges).toBe(true);
    // The cleared effect is included (with no overrides) so the save path
    // replaces the stale user entry.
    expect(effectsToSave).toHaveLength(1);
    expect(effectsToSave[0].overrides).toEqual({});
  });

  it('treats a multiplier cleared by override-mode editing as a change', () => {
    const { hasUnsavedChanges } = getRecipientEffectsChangeState([
      buildDraft({
        multipliers: {},
        _userEffect: { effectId: 'std', multipliers: { costPerQALY: 4 } },
      }),
    ]);

    expect(hasUnsavedChanges).toBe(true);
  });

  it('throws on unconvertible override values by default and skips them with throwOnInvalid: false', () => {
    const drafts = [buildDraft({ overrides: { costPerQALY: 'garbage' } })];

    expect(() => getRecipientEffectsChangeState(drafts)).toThrow(/Failed to convert/);

    const lenient = getRecipientEffectsChangeState(drafts, { throwOnInvalid: false });
    expect(lenient.effectsToSave).toEqual([]);
  });
});
