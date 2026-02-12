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
          recipientName: recipient.name,
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

  it('persists updates and resetToDefaults clears saved assumptions', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();

    const firstCategoryId = Object.keys(context.defaultAssumptions.categories)[0];
    const firstEffect = context.defaultAssumptions.categories[firstCategoryId].effects[0];
    const nextStartTime = firstEffect.startTime + 1;

    act(() => {
      context.updateCategoryFieldValue(firstCategoryId, firstEffect.effectId, 'startTime', nextStartTime);
    });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem('customEffectsData'));
      expect(persisted.categories[firstCategoryId].effects[0]).toMatchObject({
        effectId: firstEffect.effectId,
        startTime: nextStartTime,
      });
    });

    act(() => {
      getContext().resetToDefaults();
    });

    await waitFor(() => {
      expect(getContext().userAssumptions).toBeNull();
      expect(localStorage.getItem('customEffectsData')).toBeNull();
    });
  });

  it('updateRecipientEffect applies overrides-only updates', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().updateRecipientEffect(scenario.recipientName, scenario.categoryId, scenario.effectId, {
        overrides: { startTime: 7 },
      });
    });

    await waitFor(() => {
      const effect =
        getContext().userAssumptions.recipients[scenario.recipientId].categories[scenario.categoryId].effects[0];
      expect(effect).toEqual({
        effectId: scenario.effectId,
        overrides: { startTime: 7 },
      });
    });
  });

  it('replaceCategoryEffects writes the entire category effect payload in one call', async () => {
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

  it('updateRecipientEffect applies multipliers-only updates', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().updateRecipientEffect(scenario.recipientName, scenario.categoryId, scenario.effectId, {
        multipliers: { startTime: 2 },
      });
    });

    await waitFor(() => {
      const effect =
        getContext().userAssumptions.recipients[scenario.recipientId].categories[scenario.categoryId].effects[0];
      expect(effect).toEqual({
        effectId: scenario.effectId,
        multipliers: { startTime: 2 },
      });
    });
  });

  it('updateRecipientEffect handles disabled-only updates by creating nested structure', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().updateRecipientEffect(scenario.recipientName, scenario.categoryId, scenario.effectId, {
        disabled: true,
      });
    });

    await waitFor(() => {
      const effect =
        getContext().userAssumptions.recipients[scenario.recipientId].categories[scenario.categoryId].effects[0];
      expect(effect).toEqual({
        effectId: scenario.effectId,
        disabled: true,
      });
    });
  });

  it('updateRecipientEffect combines overrides, multipliers, and disabled with precedence', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().updateRecipientEffect(scenario.recipientName, scenario.categoryId, scenario.effectId, {
        overrides: { startTime: 6, windowLength: 11 },
        multipliers: { startTime: 1.5, costPerQALY: 2 },
        disabled: true,
      });
    });

    await waitFor(() => {
      const effect =
        getContext().userAssumptions.recipients[scenario.recipientId].categories[scenario.categoryId].effects[0];
      expect(effect.effectId).toBe(scenario.effectId);
      expect(effect.disabled).toBe(true);
      expect(effect.overrides).toEqual({ windowLength: 11 });
      expect(effect.multipliers).toEqual({ startTime: 1.5, costPerQALY: 2 });
      expect(effect.overrides.startTime).toBeUndefined();
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

  it('updateRecipientEffect logs error and leaves state unchanged when recipient is not found', async () => {
    const { getContext } = await renderWithProvider();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      getContext().updateRecipientEffect('Recipient That Does Not Exist', 'health', 'effect-does-not-matter', {
        disabled: true,
      });
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Recipient Recipient That Does Not Exist not found');
      expect(getContext().userAssumptions).toBeNull();
    });
  });

  it('resetCategoryToDefaults clears category-level overrides and storage entry', async () => {
    const { getContext } = await renderWithProvider();
    const context = getContext();
    const firstCategoryId = Object.keys(context.defaultAssumptions.categories)[0];
    const firstEffect = context.defaultAssumptions.categories[firstCategoryId].effects[0];

    act(() => {
      context.updateCategoryFieldValue(firstCategoryId, firstEffect.effectId, 'startTime', firstEffect.startTime + 2);
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

  it('resetRecipientToDefaults clears recipient overrides resolved by recipient name', async () => {
    const { getContext } = await renderWithProvider();
    const scenario = findRecipientScenario(getContext());

    act(() => {
      getContext().updateRecipientEffect(scenario.recipientName, scenario.categoryId, scenario.effectId, {
        overrides: { startTime: 9 },
      });
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.recipients?.[scenario.recipientId]).toBeTruthy();
    });

    act(() => {
      getContext().resetRecipientToDefaults(scenario.recipientName);
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
});
