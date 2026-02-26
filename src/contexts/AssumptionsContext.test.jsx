import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React, { useEffect } from 'react';
import { AssumptionsProvider, useAssumptions } from './AssumptionsContext';
import { globalParameters } from '../data/generatedData';

/* global localStorage, Storage */

const ContextProbe = ({ onContextChange }) => {
  const context = useAssumptions();

  useEffect(() => {
    onContextChange(context);
  }, [context, onContextChange]);

  return null;
};

const renderWithProvider = async () => {
  let latestContext = null;

  render(
    <AssumptionsProvider>
      <ContextProbe onContextChange={(ctx) => (latestContext = ctx)} />
    </AssumptionsProvider>
  );

  await waitFor(() => {
    expect(latestContext).toBeTruthy();
  });

  return {
    getContext: () => latestContext,
  };
};

const findRecipientScenario = (context) => {
  for (const [recipientId, recipient] of Object.entries(context.combinedAssumptions.recipients)) {
    for (const categoryId of Object.keys(recipient.categories || {})) {
      const category = context.combinedAssumptions.categories[categoryId];
      if (category?.effects?.length > 0) {
        return {
          recipientId,
          categoryId,
          effectId: category.effects[0].effectId,
        };
      }
    }
  }

  throw new Error('No recipient with category effects found in assumptions data');
};

describe('AssumptionsContext integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('bootstraps from localStorage and normalizes default-equivalent values', async () => {
    const savedState = {
      globalParameters: {
        discountRate: globalParameters.discountRate,
        timeLimit: globalParameters.timeLimit + 5,
      },
    };
    localStorage.setItem('customEffectsData', JSON.stringify(savedState));

    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    const { getContext } = await renderWithProvider();
    const context = getContext();

    expect(removeItemSpy).toHaveBeenCalledWith('customCostPerLifeValues');
    expect(context.userAssumptions).toEqual({
      globalParameters: {
        timeLimit: globalParameters.timeLimit + 5,
      },
    });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem('customEffectsData'));
      expect(persisted).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 5,
        },
      });
    });
  });

  it('persists category updates to localStorage', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();
    const firstCategoryId = Object.keys(context.defaultAssumptions.categories)[0];
    const firstEffect = context.defaultAssumptions.categories[firstCategoryId].effects[0];

    act(() => {
      context.replaceCategoryEffects(firstCategoryId, [
        {
          effectId: firstEffect.effectId,
          startTime: firstEffect.startTime + 1,
        },
      ]);
    });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem('customEffectsData'));
      expect(persisted.categories[firstCategoryId].effects[0]).toMatchObject({
        effectId: firstEffect.effectId,
        startTime: firstEffect.startTime + 1,
      });
    });
  });

  it('replaceCategoryEffects writes only default-diff values', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();
    const firstCategoryId = Object.keys(context.defaultAssumptions.categories)[0];
    const firstEffect = context.defaultAssumptions.categories[firstCategoryId].effects[0];

    act(() => {
      getContext().replaceCategoryEffects(firstCategoryId, [
        {
          effectId: firstEffect.effectId,
          startTime: firstEffect.startTime + 3,
          windowLength: firstEffect.windowLength,
          disabled: firstEffect.disabled,
        },
      ]);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.categories?.[firstCategoryId]?.effects).toEqual([
        {
          effectId: firstEffect.effectId,
          startTime: firstEffect.startTime + 3,
        },
      ]);
    });
  });

  it('replaceRecipientCategoryEffects applies overrides, multipliers and disabled', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().replaceRecipientCategoryEffects(scenario.recipientId, scenario.categoryId, [
        {
          effectId: scenario.effectId,
          overrides: { startTime: 6, windowLength: 11 },
          multipliers: { costPerQALY: 2 },
          disabled: true,
        },
      ]);
    });

    await waitFor(() => {
      const effect =
        getContext().userAssumptions.recipients[scenario.recipientId].categories[scenario.categoryId].effects[0];
      expect(effect.effectId).toBe(scenario.effectId);
      expect(effect.disabled).toBe(true);
      expect(effect.overrides).toEqual({ startTime: 6, windowLength: 11 });
      expect(effect.multipliers).toEqual({ costPerQALY: 2 });
    });
  });

  it('replaceRecipientCategoryEffects clears custom branch when saving default-equivalent values', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().replaceRecipientCategoryEffects(scenario.recipientId, scenario.categoryId, [
        { effectId: scenario.effectId, disabled: false },
      ]);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toBeNull();
    });
  });

  it('replaceRecipientEffectsByCategory applies updates across multiple categories', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();

    const recipientEntry = Object.entries(context.combinedAssumptions.recipients).find(([, recipient]) => {
      const categoryIds = Object.keys(recipient.categories || {});
      return categoryIds.length >= 2;
    });

    if (!recipientEntry) {
      throw new Error('Expected at least one recipient with multiple categories');
    }

    const [recipientId, recipient] = recipientEntry;
    const [firstCategoryId, secondCategoryId] = Object.keys(recipient.categories);
    const firstEffectId = context.combinedAssumptions.categories[firstCategoryId].effects[0].effectId;
    const secondEffectId = context.combinedAssumptions.categories[secondCategoryId].effects[0].effectId;

    act(() => {
      getContext().replaceRecipientEffectsByCategory(recipientId, {
        [firstCategoryId]: [{ effectId: firstEffectId, overrides: { startTime: 5 } }],
        [secondCategoryId]: [{ effectId: secondEffectId, multipliers: { costPerQALY: 1.4 } }],
      });
    });

    await waitFor(() => {
      const recipientData = getContext().userAssumptions?.recipients?.[recipientId];
      expect(recipientData?.categories?.[firstCategoryId]?.effects?.[0]?.overrides?.startTime).toBe(5);
      expect(recipientData?.categories?.[secondCategoryId]?.effects?.[0]?.multipliers?.costPerQALY).toBe(1.4);
    });
  });

  it('resetCategoryToDefaults clears category-level overrides and storage entry', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();
    const firstCategoryId = Object.keys(context.defaultAssumptions.categories)[0];
    const firstEffect = context.defaultAssumptions.categories[firstCategoryId].effects[0];

    act(() => {
      context.replaceCategoryEffects(firstCategoryId, [
        {
          effectId: firstEffect.effectId,
          startTime: firstEffect.startTime + 2,
        },
      ]);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.categories?.[firstCategoryId]).toBeTruthy();
    });

    act(() => {
      getContext().resetCategoryToDefaults(firstCategoryId);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toBeNull();
      expect(localStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('resetRecipientToDefaults clears recipient overrides by recipient id', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().replaceRecipientCategoryEffects(scenario.recipientId, scenario.categoryId, [
        { effectId: scenario.effectId, overrides: { startTime: 9 } },
      ]);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.recipients?.[scenario.recipientId]).toBeTruthy();
    });

    act(() => {
      getContext().resetRecipientToDefaults(scenario.recipientId);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toBeNull();
      expect(localStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('resetGlobalParameter removes only the specified global parameter override', async () => {
    const { getContext } = await renderWithProvider();

    act(() => {
      getContext().updateGlobalParameterValue('timeLimit', globalParameters.timeLimit + 10);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.globalParameters?.timeLimit).toBe(globalParameters.timeLimit + 10);
    });

    act(() => {
      getContext().resetGlobalParameter('timeLimit');
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toBeNull();
      expect(localStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('setAllUserAssumptions replaces state and persists normalized values', async () => {
    const { getContext } = await renderWithProvider();

    act(() => {
      getContext().setAllUserAssumptions({
        globalParameters: {
          discountRate: globalParameters.discountRate,
          timeLimit: globalParameters.timeLimit + 25,
        },
      });
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 25,
        },
      });
    });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem('customEffectsData'));
      expect(persisted).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 25,
        },
      });
    });
  });

  it('getNormalizedUserAssumptionsForSharing returns normalized assumptions', async () => {
    const { getContext } = await renderWithProvider();

    act(() => {
      getContext().setAllUserAssumptions({
        globalParameters: {
          discountRate: globalParameters.discountRate,
          timeLimit: globalParameters.timeLimit + 30,
        },
      });
    });

    await waitFor(() => {
      const normalized = getContext().getNormalizedUserAssumptionsForSharing();
      expect(normalized).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 30,
        },
      });
    });
  });
});
