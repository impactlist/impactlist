import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useRecipientEffectsDraft from './useRecipientEffectsDraft';

const globalParameters = {
  discountRate: 0.02,
  populationGrowthRate: 0.01,
  timeLimit: 100,
  populationLimit: 2,
  currentPopulation: 8000000000,
  yearsPerLife: 50,
};

const baseQalyEffect = {
  effectId: 'health-effect',
  costPerQALY: 1000,
  startTime: 0,
  windowLength: 10,
};

const buildDefaults = ({ recipientMultiplier } = {}) => ({
  categories: {
    health: { name: 'Health', effects: [baseQalyEffect] },
  },
  recipients: {
    clinic: {
      name: 'Clinic',
      categories: {
        health: recipientMultiplier
          ? { fraction: 1, effects: [{ effectId: 'health-effect', multipliers: { costPerQALY: recipientMultiplier } }] }
          : { fraction: 1 },
      },
    },
  },
});

const renderDraft = ({ defaultAssumptions = buildDefaults(), userAssumptions = null } = {}) =>
  renderHook(() =>
    useRecipientEffectsDraft({
      recipientId: 'clinic',
      categoryId: 'health',
      category: defaultAssumptions.categories.health,
      globalParameters,
      previewYear: 2026,
      defaultAssumptions,
      userAssumptions,
    })
  );

describe('useRecipientEffectsDraft', () => {
  it('initializes drafts from the baseline with a _baseEffect reference and no changes', () => {
    const { result } = renderDraft();

    expect(result.current.effects).toHaveLength(1);
    expect(result.current.effects[0].effectId).toBe('health-effect');
    expect(result.current.effects[0]._baseEffect).toMatchObject({ costPerQALY: 1000 });
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.hasErrors).toBe(false);
    expect(result.current.getEffectsToSave()).toEqual([]);
  });

  it('updateEffectField stores a stringly override, marks unsaved changes, and clears it on empty input', () => {
    const { result } = renderDraft();

    act(() => result.current.updateEffectField(0, 'costPerQALY', '2,000'));
    expect(result.current.effects[0].overrides.costPerQALY).toBe('2,000');
    expect(result.current.hasUnsavedChanges).toBe(true);

    act(() => result.current.updateEffectField(0, 'costPerQALY', ''));
    expect(result.current.effects[0].overrides?.costPerQALY).toBeUndefined();
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it('editing a field removes any multiplier for that field (override-only UI)', () => {
    const { result } = renderDraft({ defaultAssumptions: buildDefaults({ recipientMultiplier: 4 }) });

    expect(result.current.effects[0].multipliers.costPerQALY).toBe(4);

    act(() => result.current.updateEffectField(0, 'costPerQALY', '500'));
    expect(result.current.effects[0].multipliers.costPerQALY).toBeUndefined();
    expect(result.current.effects[0].overrides.costPerQALY).toBe('500');
  });

  it('records a validation error for garbage input and clears it once valid', () => {
    const { result } = renderDraft();

    act(() => result.current.updateEffectField(0, 'costPerQALY', 'abc'));
    expect(result.current.hasErrors).toBe(true);
    expect(result.current.errors['0-costPerQALY-override']).toBeTruthy();

    act(() => result.current.updateEffectField(0, 'costPerQALY', '750'));
    expect(result.current.hasErrors).toBe(false);
  });

  it('toggleEffectDisabled flips the draft and previews Infinity cost', () => {
    const { result } = renderDraft();

    expect(result.current.effectCostPerLife[0]).toBeGreaterThan(0);
    expect(Number.isFinite(result.current.effectCostPerLife[0])).toBe(true);

    act(() => result.current.toggleEffectDisabled(0));
    expect(result.current.effects[0].disabled).toBe(true);
    expect(result.current.effectCostPerLife[0]).toBe(Infinity);
    expect(result.current.combinedCostPerLife).toBe(Infinity);
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('keeps "unsaved changes" when editing then clearing a field that has a default multiplier', () => {
    const { result } = renderDraft({ defaultAssumptions: buildDefaults({ recipientMultiplier: 4 }) });

    // Editing the field removes the ×4 multiplier; clearing the input then
    // removes the override. Net effect vs the baseline: the multiplier is
    // gone — a real, saveable change. (Regression: the multiplier delete
    // used to mutate the baseline's shared nested map, making this register
    // as "no changes".)
    act(() => result.current.updateEffectField(0, 'costPerQALY', '500'));
    act(() => result.current.updateEffectField(0, 'costPerQALY', ''));

    expect(result.current.effects[0].multipliers?.costPerQALY).toBeUndefined();
    expect(result.current.effects[0].overrides?.costPerQALY).toBeUndefined();
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('getEffectsToSave returns minimal wrappers without _baseEffect', () => {
    const { result } = renderDraft();

    act(() => result.current.updateEffectField(0, 'costPerQALY', '2000'));
    const effectsToSave = result.current.getEffectsToSave();

    expect(effectsToSave).toHaveLength(1);
    expect(effectsToSave[0].effectId).toBe('health-effect');
    expect(effectsToSave[0].overrides.costPerQALY).toBe(2000);
    // _baseEffect must never reach saved state — normalizeUserAssumptions
    // would reject it as an unknown field.
    expect(Object.hasOwn(effectsToSave[0], '_baseEffect')).toBe(false);
  });

  it('exposes per-effect input sources including the recipient default wrapper', () => {
    const { result } = renderDraft({ defaultAssumptions: buildDefaults({ recipientMultiplier: 4 }) });

    expect(result.current.effectInputSources).toHaveLength(1);
    expect(result.current.effectInputSources[0].defaultCategoryEffect).toMatchObject({ costPerQALY: 1000 });
    expect(result.current.effectInputSources[0].defaultRecipientEffect).toMatchObject({
      multipliers: { costPerQALY: 4 },
    });
  });

  it('reinitializes drafts when user assumptions change underneath (e.g. save or external load)', () => {
    const defaultAssumptions = buildDefaults();
    const { result, rerender } = renderHook(
      ({ userAssumptions }) =>
        useRecipientEffectsDraft({
          recipientId: 'clinic',
          categoryId: 'health',
          category: defaultAssumptions.categories.health,
          globalParameters,
          previewYear: 2026,
          defaultAssumptions,
          userAssumptions,
        }),
      { initialProps: { userAssumptions: null } }
    );

    expect(result.current.effects[0].overrides ?? {}).toEqual({});

    rerender({
      userAssumptions: {
        recipients: {
          clinic: {
            categories: { health: { effects: [{ effectId: 'health-effect', overrides: { costPerQALY: 250 } }] } },
          },
        },
      },
    });

    expect(result.current.effects[0].overrides.costPerQALY).toBe(250);
    expect(result.current.hasUnsavedChanges).toBe(false);
  });
});
