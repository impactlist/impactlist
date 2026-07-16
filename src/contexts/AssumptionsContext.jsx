import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createCombinedAssumptions, createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import * as apiHelpers from '../utils/assumptionsAPIHelpers';
import { normalizeUserAssumptions } from '../utils/assumptionsAPIHelpers';
import { getLocalStorage, getSessionStorage } from '../utils/safeStorage';

const AssumptionsContext = createContext();
const defaultAssumptions = createDefaultAssumptions();
const CUSTOM_EFFECTS_DATA_KEY = 'customEffectsData';
const LEGACY_ACTIVE_SAVED_ASSUMPTIONS_ID_KEY = 'activeSavedAssumptionsId:v1';
const SESSION_STORAGE_CLEANUP_KEY = 'assumptionsSessionStorageCleanup:v1';

const hasCustomValues = (assumptions) => {
  if (!assumptions) return false;
  if (Object.keys(assumptions).length === 0) return false;

  return (
    (assumptions.globalParameters && Object.keys(assumptions.globalParameters).length > 0) ||
    (assumptions.categories && Object.keys(assumptions.categories).length > 0) ||
    (assumptions.recipients && Object.keys(assumptions.recipients).length > 0)
  );
};

export const useAssumptions = () => {
  const context = useContext(AssumptionsContext);
  if (!context) {
    throw new Error('useAssumptions must be used within an AssumptionsProvider');
  }
  return context;
};

export const AssumptionsProvider = ({ children }) => {
  const [userAssumptions, setUserAssumptions] = useState(() => {
    const localStorage = getLocalStorage();
    try {
      localStorage.removeItem('customCostPerLifeValues');

      if (localStorage.getItem(SESSION_STORAGE_CLEANUP_KEY) !== '1') {
        localStorage.removeItem(CUSTOM_EFFECTS_DATA_KEY);
        localStorage.removeItem(LEGACY_ACTIVE_SAVED_ASSUMPTIONS_ID_KEY);
        localStorage.setItem(SESSION_STORAGE_CLEANUP_KEY, '1');
      }
    } catch (error) {
      // Storage can be revoked after the availability probe (privacy-setting
      // changes, sandboxed iframes, WebViews). Legacy cleanup is best-effort;
      // it must never stop the assumptions provider from mounting.
      console.error('Could not clean up legacy assumptions storage', error);
    }

    let savedData;
    try {
      savedData = getSessionStorage().getItem(CUSTOM_EFFECTS_DATA_KEY);
    } catch (error) {
      console.error('Could not read stored assumptions; using defaults', error);
      return null;
    }
    if (!savedData) return null;

    try {
      return normalizeUserAssumptions(JSON.parse(savedData), defaultAssumptions);
    } catch (error) {
      // A corrupted or schema-incompatible stored value would otherwise crash
      // the whole app on every load of this tab (refreshing can't fix
      // persisted storage). Discard it loudly and fall back to defaults.
      console.error('Discarding corrupted stored assumptions', error);
      try {
        getSessionStorage().removeItem(CUSTOM_EFFECTS_DATA_KEY);
      } catch (removeError) {
        console.error('Could not remove corrupted stored assumptions', removeError);
      }
      return null;
    }
  });

  const combinedAssumptions = useMemo(
    () => createCombinedAssumptions(defaultAssumptions, userAssumptions),
    [userAssumptions]
  );

  useEffect(() => {
    try {
      if (userAssumptions) {
        getSessionStorage().setItem(CUSTOM_EFFECTS_DATA_KEY, JSON.stringify(userAssumptions));
      } else {
        getSessionStorage().removeItem(CUSTOM_EFFECTS_DATA_KEY);
      }
    } catch (error) {
      // Working assumptions remain valid in React state even when session
      // persistence fails (quota exhaustion or storage revoked mid-session).
      // Throwing from this effect would replace the usable app with its error
      // boundary merely because persistence — an enhancement — is unavailable.
      console.error('Could not persist working assumptions for this tab', error);
    }
  }, [userAssumptions]);

  // The mutators close over nothing but the stable setter and module-scope
  // defaults, so they're created once — consumers can safely list them in
  // effect/memo dependencies.
  const mutators = useMemo(
    () => ({
      replaceCategoryEffects: (categoryId, effectsData) => {
        if (!categoryId) {
          throw new Error("Required parameter 'categoryId' is missing");
        }

        setUserAssumptions((prev) => apiHelpers.setCategoryEffects(prev, defaultAssumptions, categoryId, effectsData));
      },

      resetCategoryToDefaults: (categoryId) => {
        setUserAssumptions((prev) => apiHelpers.clearCategoryCustomValues(prev, categoryId));
      },

      replaceRecipientCategoryEffects: (recipientId, categoryId, effectsData) => {
        if (!recipientId) {
          throw new Error("Required parameter 'recipientId' is missing");
        }
        if (!categoryId) {
          throw new Error("Required parameter 'categoryId' is missing");
        }

        setUserAssumptions((prev) =>
          apiHelpers.setRecipientCategoryEffects(prev, defaultAssumptions, recipientId, categoryId, effectsData)
        );
      },

      replaceRecipientEffectsByCategory: (recipientId, effectsByCategory) => {
        if (!recipientId) {
          throw new Error("Required parameter 'recipientId' is missing");
        }

        setUserAssumptions((prev) =>
          apiHelpers.setRecipientEffectsByCategory(prev, defaultAssumptions, recipientId, effectsByCategory)
        );
      },

      resetRecipientToDefaults: (recipientId) => {
        if (!recipientId) {
          throw new Error("Required parameter 'recipientId' is missing");
        }
        setUserAssumptions((prev) => apiHelpers.clearRecipientOverrides(prev, recipientId));
      },

      updateGlobalParameterValue: (parameterName, value) => {
        setUserAssumptions((prev) => apiHelpers.setGlobalParameter(prev, defaultAssumptions, parameterName, value));
      },

      resetGlobalParameter: (parameterName) => {
        setUserAssumptions((prev) => apiHelpers.clearGlobalParameter(prev, parameterName));
      },

      setAllUserAssumptions: (nextUserAssumptions) => {
        const normalized = apiHelpers.normalizeUserAssumptions(nextUserAssumptions, defaultAssumptions);
        setUserAssumptions(normalized);
      },
    }),
    []
  );

  // Re-normalized once per assumptions change instead of per caller per
  // render (several consumers fingerprint or serialize this).
  const normalizedUserAssumptionsForSharing = useMemo(
    () => apiHelpers.normalizeUserAssumptions(userAssumptions, defaultAssumptions),
    [userAssumptions]
  );

  const contextValue = useMemo(
    () => ({
      defaultAssumptions,
      userAssumptions,
      combinedAssumptions,
      isUsingCustomValues: hasCustomValues(userAssumptions),
      ...mutators,
      getNormalizedUserAssumptionsForSharing: () => normalizedUserAssumptionsForSharing,
    }),
    [userAssumptions, combinedAssumptions, mutators, normalizedUserAssumptionsForSharing]
  );

  return <AssumptionsContext.Provider value={contextValue}>{children}</AssumptionsContext.Provider>;
};

export default AssumptionsContext;
