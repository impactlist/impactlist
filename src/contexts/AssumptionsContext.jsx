import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createCombinedAssumptions, createDefaultAssumptions } from '../utils/assumptionsDataHelpers';
import * as apiHelpers from '../utils/assumptionsAPIHelpers';
import { normalizeUserAssumptions } from '../utils/assumptionsAPIHelpers';

/* global localStorage */

const AssumptionsContext = createContext();
const defaultAssumptions = createDefaultAssumptions();

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
    localStorage.removeItem('customCostPerLifeValues');

    const savedData = localStorage.getItem('customEffectsData');
    if (!savedData) return null;

    const parsed = JSON.parse(savedData);
    return normalizeUserAssumptions(parsed, defaultAssumptions);
  });

  const combinedAssumptions = useMemo(
    () => createCombinedAssumptions(defaultAssumptions, userAssumptions),
    [userAssumptions]
  );

  useEffect(() => {
    if (userAssumptions) {
      localStorage.setItem('customEffectsData', JSON.stringify(userAssumptions));
    } else {
      localStorage.removeItem('customEffectsData');
    }
  }, [userAssumptions]);

  const replaceCategoryEffects = (categoryId, effectsData) => {
    if (!categoryId) {
      throw new Error("Required parameter 'categoryId' is missing");
    }

    setUserAssumptions((prev) => apiHelpers.setCategoryEffects(prev, defaultAssumptions, categoryId, effectsData));
  };

  const resetCategoryToDefaults = (categoryId) => {
    setUserAssumptions((prev) => apiHelpers.clearCategoryCustomValues(prev, categoryId));
  };

  const replaceRecipientCategoryEffects = (recipientId, categoryId, effectsData) => {
    if (!recipientId) {
      throw new Error("Required parameter 'recipientId' is missing");
    }
    if (!categoryId) {
      throw new Error("Required parameter 'categoryId' is missing");
    }

    setUserAssumptions((prev) =>
      apiHelpers.setRecipientCategoryEffects(prev, defaultAssumptions, recipientId, categoryId, effectsData)
    );
  };

  const replaceRecipientEffectsByCategory = (recipientId, effectsByCategory) => {
    if (!recipientId) {
      throw new Error("Required parameter 'recipientId' is missing");
    }

    setUserAssumptions((prev) =>
      apiHelpers.setRecipientEffectsByCategory(prev, defaultAssumptions, recipientId, effectsByCategory)
    );
  };

  const resetRecipientToDefaults = (recipientId) => {
    if (!recipientId) {
      throw new Error("Required parameter 'recipientId' is missing");
    }
    setUserAssumptions((prev) => apiHelpers.clearRecipientOverrides(prev, recipientId));
  };

  const updateGlobalParameterValue = (parameterName, value) => {
    setUserAssumptions((prev) => apiHelpers.setGlobalParameter(prev, defaultAssumptions, parameterName, value));
  };

  const resetGlobalParameter = (parameterName) => {
    setUserAssumptions((prev) => apiHelpers.clearGlobalParameter(prev, parameterName));
  };

  const resetAllGlobalParameters = () => {
    setUserAssumptions((prev) => apiHelpers.clearAllGlobalParameters(prev));
  };

  const setAllUserAssumptions = (nextUserAssumptions) => {
    const normalized = apiHelpers.normalizeUserAssumptions(nextUserAssumptions, defaultAssumptions);
    setUserAssumptions(normalized);
  };

  const getNormalizedUserAssumptionsForSharing = () => {
    return apiHelpers.normalizeUserAssumptions(userAssumptions, defaultAssumptions);
  };

  const contextValue = {
    defaultAssumptions,
    userAssumptions,
    combinedAssumptions,
    isUsingCustomValues: hasCustomValues(userAssumptions),
    replaceCategoryEffects,
    resetCategoryToDefaults,
    replaceRecipientCategoryEffects,
    replaceRecipientEffectsByCategory,
    resetRecipientToDefaults,
    updateGlobalParameterValue,
    resetGlobalParameter,
    resetAllGlobalParameters,
    setAllUserAssumptions,
    getNormalizedUserAssumptionsForSharing,
  };

  return <AssumptionsContext.Provider value={contextValue}>{children}</AssumptionsContext.Provider>;
};

export default AssumptionsContext;
