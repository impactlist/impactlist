import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React, { useEffect } from 'react';
import { AssumptionsProvider, useAssumptions } from './AssumptionsContext';
import { globalParameters } from '../data/generatedData';
import {
  ACTIVE_APPLIED_ASSUMPTIONS_KEY,
  SESSION_APPLIED_ASSUMPTIONS_KEY,
} from '../utils/activeAppliedAssumptionsStore';

/* global localStorage, sessionStorage, Storage */

const ContextProbe = ({ onContextChange }) => {
  const context = useAssumptions();

  useEffect(() => {
    onContextChange(context);
  }, [context, onContextChange]);

  return null;
};

const renderWithProvider = async () => {
  let latestContext = null;

  const view = render(
    <AssumptionsProvider>
      <ContextProbe onContextChange={(ctx) => (latestContext = ctx)} />
    </AssumptionsProvider>
  );

  await waitFor(() => {
    expect(latestContext).toBeTruthy();
  });

  return {
    getContext: () => latestContext,
    unmount: view.unmount,
  };
};

// A cost field valid for the given base effect's type: overriding or
// multiplying a field the effect doesn't have is rejected by normalization.
const findCostField = (baseEffect) =>
  Object.keys(baseEffect).find(
    (field) => !['effectId', 'startTime', 'windowLength'].includes(field) && typeof baseEffect[field] === 'number'
  );

const findRecipientScenario = (context) => {
  for (const [recipientId, recipient] of Object.entries(context.combinedAssumptions.recipients)) {
    for (const categoryId of Object.keys(recipient.categories || {})) {
      const category = context.combinedAssumptions.categories[categoryId];
      if (category?.effects?.length > 0) {
        return {
          recipientId,
          categoryId,
          effectId: category.effects[0].effectId,
          costField: findCostField(category.effects[0]),
        };
      }
    }
  }

  throw new Error('No recipient with category effects found in assumptions data');
};

describe('AssumptionsContext integration', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('migrates session assumptions into durable storage and normalizes default-equivalent values', async () => {
    const savedState = {
      globalParameters: {
        discountRate: globalParameters.discountRate,
        timeLimit: globalParameters.timeLimit + 5,
      },
    };
    sessionStorage.setItem('customEffectsData', JSON.stringify(savedState));

    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    const { getContext } = await renderWithProvider();
    const context = getContext();

    expect(removeItemSpy).toHaveBeenCalledWith('customCostPerLifeValues');
    expect(removeItemSpy).toHaveBeenCalledWith('customEffectsData');
    expect(removeItemSpy).toHaveBeenCalledWith('activeSavedAssumptionsId:v1');
    expect(localStorage.getItem('assumptionsSessionStorageCleanup:v1')).toBe('1');
    expect(context.userAssumptions).toEqual({
      globalParameters: {
        timeLimit: globalParameters.timeLimit + 5,
      },
    });

    await waitFor(() => {
      const persisted = JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY));
      expect(persisted).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 5,
        },
      });
      expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual(persisted);
    });
  });

  it('restores applied assumptions after the tab session is gone', async () => {
    const firstVisit = await renderWithProvider();
    const restoredTimeLimit = globalParameters.timeLimit + 9;

    act(() => {
      firstVisit.getContext().updateGlobalParameterValue('timeLimit', restoredTimeLimit);
    });

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY))).toEqual({
        globalParameters: { timeLimit: restoredTimeLimit },
      });
    });

    firstVisit.unmount();
    sessionStorage.clear();

    const returningVisit = await renderWithProvider();

    expect(returningVisit.getContext().userAssumptions).toEqual({
      globalParameters: { timeLimit: restoredTimeLimit },
    });
    expect(returningVisit.getContext().combinedAssumptions.globalParameters.timeLimit).toBe(restoredTimeLimit);
  });

  it('uses durable applied assumptions instead of a stale session mirror', async () => {
    const durableTimeLimit = globalParameters.timeLimit + 14;
    localStorage.setItem(
      ACTIVE_APPLIED_ASSUMPTIONS_KEY,
      JSON.stringify({ globalParameters: { timeLimit: durableTimeLimit } })
    );
    sessionStorage.setItem(
      SESSION_APPLIED_ASSUMPTIONS_KEY,
      JSON.stringify({ globalParameters: { timeLimit: globalParameters.timeLimit + 3 } })
    );

    const { getContext } = await renderWithProvider();

    expect(getContext().userAssumptions).toEqual({
      globalParameters: { timeLimit: durableTimeLimit },
    });
    await waitFor(() => {
      expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual({
        globalParameters: { timeLimit: durableTimeLimit },
      });
    });
  });

  it('discards a persisted discount rate above the supported maximum instead of bricking the session', async () => {
    sessionStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          discountRate: 2e16,
        },
      })
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getContext } = await renderWithProvider();

    expect(getContext().userAssumptions).toBeNull();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Discarding corrupted applied assumptions from sessionStorage',
      expect.any(Error)
    );
  });

  it('mounts with defaults when the session fallback becomes unreadable after its availability probe', async () => {
    const originalGetItem = Storage.prototype.getItem;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (key) {
      if (this === sessionStorage && key === 'customEffectsData') {
        throw new Error('SecurityError: storage access was revoked');
      }
      return originalGetItem.call(this, key);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getContext } = await renderWithProvider();

    expect(getContext().userAssumptions).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Could not read applied assumptions from sessionStorage; trying fallback',
      expect.any(Error)
    );
  });

  it('keeps applied assumptions usable when a later session mirror write exceeds quota', async () => {
    const { getContext } = await renderWithProvider();
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (this === sessionStorage && key === 'customEffectsData') {
        throw new Error('QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      getContext().updateGlobalParameterValue('timeLimit', globalParameters.timeLimit + 7);
    });

    await waitFor(() => {
      expect(getContext().userAssumptions?.globalParameters?.timeLimit).toBe(globalParameters.timeLimit + 7);
    });
    expect(JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY))).toEqual({
      globalParameters: { timeLimit: globalParameters.timeLimit + 7 },
    });
    expect(console.error).toHaveBeenCalledWith(
      'Could not persist applied assumptions to sessionStorage',
      expect.any(Error)
    );
  });

  it('does not revive the obsolete unversioned localStorage value', async () => {
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 12,
        },
      })
    );

    const { getContext } = await renderWithProvider();

    expect(getContext().userAssumptions).toBeNull();
    expect(sessionStorage.getItem('customEffectsData')).toBeNull();
  });

  it('clears obsolete browser-global assumptions keys from localStorage on startup', async () => {
    localStorage.setItem(
      'customEffectsData',
      JSON.stringify({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 12,
        },
      })
    );
    localStorage.setItem('activeSavedAssumptionsId:v1', 'legacy-entry');

    await renderWithProvider();

    expect(localStorage.getItem('customEffectsData')).toBeNull();
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBeNull();
    expect(localStorage.getItem('assumptionsSessionStorageCleanup:v1')).toBe('1');
  });

  it('skips legacy cleanup once the cleanup marker is set', async () => {
    localStorage.setItem('assumptionsSessionStorageCleanup:v1', '1');
    localStorage.setItem('customEffectsData', '{"legacy":true}');
    localStorage.setItem('activeSavedAssumptionsId:v1', 'legacy-entry');

    await renderWithProvider();

    expect(localStorage.getItem('customEffectsData')).toBe('{"legacy":true}');
    expect(localStorage.getItem('activeSavedAssumptionsId:v1')).toBe('legacy-entry');
  });

  it('persists category updates durably and to the session fallback', async () => {
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
      const persisted = JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY));
      expect(persisted.categories[firstCategoryId].effects[0]).toMatchObject({
        effectId: firstEffect.effectId,
        startTime: firstEffect.startTime + 1,
      });
      expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual(persisted);
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
          multipliers: { [scenario.costField]: 2 },
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
      expect(effect.multipliers).toEqual({ [scenario.costField]: 2 });
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
    const firstEffect = context.combinedAssumptions.categories[firstCategoryId].effects[0];
    const secondEffect = context.combinedAssumptions.categories[secondCategoryId].effects[0];
    const secondCostField = findCostField(secondEffect);

    act(() => {
      getContext().replaceRecipientEffectsByCategory(recipientId, {
        [firstCategoryId]: [{ effectId: firstEffect.effectId, overrides: { startTime: 5 } }],
        [secondCategoryId]: [{ effectId: secondEffect.effectId, multipliers: { [secondCostField]: 1.4 } }],
      });
    });

    await waitFor(() => {
      const recipientData = getContext().userAssumptions?.recipients?.[recipientId];
      expect(recipientData?.categories?.[firstCategoryId]?.effects?.[0]?.overrides?.startTime).toBe(5);
      expect(recipientData?.categories?.[secondCategoryId]?.effects?.[0]?.multipliers?.[secondCostField]).toBe(1.4);
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
      expect(sessionStorage.getItem('customEffectsData')).toBeNull();
      expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');
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
      expect(sessionStorage.getItem('customEffectsData')).toBeNull();
      expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');
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
      expect(sessionStorage.getItem('customEffectsData')).toBeNull();
      expect(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY)).toBe('null');
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
      const persisted = JSON.parse(localStorage.getItem(ACTIVE_APPLIED_ASSUMPTIONS_KEY));
      expect(persisted).toEqual({
        globalParameters: {
          timeLimit: globalParameters.timeLimit + 25,
        },
      });
      expect(JSON.parse(sessionStorage.getItem(SESSION_APPLIED_ASSUMPTIONS_KEY))).toEqual(persisted);
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
