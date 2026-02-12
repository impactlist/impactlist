import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { createDefaultAssumptions, createCombinedAssumptions } from '../utils/assumptionsDataHelpers';
import * as apiHelpers from '../utils/assumptionsAPIHelpers';
import { normalizeUserAssumptions } from '../utils/assumptionsAPIHelpers';

/* global localStorage */

// Create context
const AssumptionsContext = createContext();

// Create default assumptions once at module load (pure function, no dependencies)
const defaultAssumptions = createDefaultAssumptions();

// Custom hook to use the context
export const useAssumptions = () => {
  const context = useContext(AssumptionsContext);
  if (!context) {
    throw new Error('useAssumptions must be used within an AssumptionsProvider');
  }
  return context;
};

// Provider component
export const AssumptionsProvider = ({ children }) => {
  // Initialize user assumptions from localStorage, normalizing to remove legacy default values
  const [userAssumptions, setUserAssumptions] = useState(() => {
    // Clean up old format data
    localStorage.removeItem('customCostPerLifeValues');

    const savedData = localStorage.getItem('customEffectsData');
    if (!savedData) return null;

    // Normalize saved data to remove any values that match defaults
    const parsed = JSON.parse(savedData);
    return normalizeUserAssumptions(parsed, defaultAssumptions);
  });

  // Create combined assumptions whenever userAssumptions changes
  const combinedAssumptions = useMemo(() => {
    return createCombinedAssumptions(defaultAssumptions, userAssumptions);
  }, [userAssumptions]);

  // Save to localStorage when userAssumptions changes
  useEffect(() => {
    if (userAssumptions) {
      localStorage.setItem('customEffectsData', JSON.stringify(userAssumptions));
    } else {
      localStorage.removeItem('customEffectsData');
    }
  }, [userAssumptions]);

  // ============ CATEGORY OPERATIONS ============
  // Update category field with a custom value
  const updateCategoryFieldValue = (categoryId, effectId, fieldName, value) => {
    // Validate required parameters
    if (!categoryId || !effectId || !fieldName) {
      throw new Error(
        `Missing required parameters for updateCategoryFieldValue: categoryId=${categoryId}, effectId=${effectId}, fieldName=${fieldName}`
      );
    }

    // Validate value is a number (can be negative, but not NaN)
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(
        `Invalid value for category field ${categoryId}.${effectId}.${fieldName}: expected number, got ${typeof value} (${value})`
      );
    }

    setUserAssumptions((prev) =>
      apiHelpers.setCategoryFieldValue(prev, defaultAssumptions, categoryId, effectId, fieldName, value)
    );
  };

  // Update all fields of a category effect at once (batch update)
  const updateCategoryEffect = (categoryId, effectId, effectData) => {
    // Validate required parameters
    if (!categoryId || !effectId || !effectData) {
      throw new Error(
        `Missing required parameters for updateCategoryEffect: categoryId=${categoryId}, effectId=${effectId}, effectData=${effectData}`
      );
    }

    setUserAssumptions((prev) => {
      const newData = apiHelpers.setCategoryEffect(prev, defaultAssumptions, categoryId, effectId, effectData);
      return newData;
    });
  };

  // Replace all category effects in one operation
  const replaceCategoryEffects = (categoryId, effectsData) => {
    if (!categoryId) {
      throw new Error("Required parameter 'categoryId' is missing");
    }

    setUserAssumptions((prev) => apiHelpers.setCategoryEffects(prev, defaultAssumptions, categoryId, effectsData));
  };

  // Reset category to defaults
  const resetCategoryToDefaults = (categoryId) => {
    setUserAssumptions((prev) => apiHelpers.clearCategoryCustomValues(prev, categoryId));
  };

  // ============ RECIPIENT OPERATIONS ============
  // Update recipient field with override value (handles name to ID conversion)
  const updateRecipientFieldOverride = (recipientName, categoryId, effectId, fieldName, value) => {
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      console.error(`Recipient ${recipientName} not found`);
      return;
    }
    setUserAssumptions((prev) =>
      apiHelpers.setRecipientFieldOverride(
        prev,
        defaultAssumptions,
        recipientId,
        categoryId,
        effectId,
        fieldName,
        value
      )
    );
  };

  // Update recipient field with multiplier (handles name to ID conversion)
  const updateRecipientFieldMultiplier = (recipientName, categoryId, effectId, fieldName, multiplier) => {
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      console.error(`Recipient ${recipientName} not found`);
      return;
    }
    setUserAssumptions((prev) =>
      apiHelpers.setRecipientFieldMultiplier(
        prev,
        defaultAssumptions,
        recipientId,
        categoryId,
        effectId,
        fieldName,
        multiplier
      )
    );
  };

  // Reset recipient to defaults (handles name to ID conversion)
  const resetRecipientToDefaults = (recipientName) => {
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      console.error(`Recipient ${recipientName} not found`);
      return;
    }
    setUserAssumptions((prev) => apiHelpers.clearRecipientOverrides(prev, recipientId));
  };

  // Update a recipient's effect with multiple field overrides/multipliers at once
  // effectData should be an object with 'overrides' and/or 'multipliers' objects
  const updateRecipientEffect = (recipientName, categoryId, effectId, effectData) => {
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      console.error(`Recipient ${recipientName} not found`);
      return;
    }

    setUserAssumptions((prev) => {
      let newData = prev;

      // Process overrides
      if (effectData.overrides) {
        Object.entries(effectData.overrides).forEach(([fieldName, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            newData = apiHelpers.setRecipientFieldOverride(
              newData,
              defaultAssumptions,
              recipientId,
              categoryId,
              effectId,
              fieldName,
              value
            );
          }
        });
      }

      // Process multipliers
      if (effectData.multipliers) {
        Object.entries(effectData.multipliers).forEach(([fieldName, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            newData = apiHelpers.setRecipientFieldMultiplier(
              newData,
              defaultAssumptions,
              recipientId,
              categoryId,
              effectId,
              fieldName,
              value
            );
          }
        });
      }

      // Process disabled field
      if (effectData.disabled !== undefined) {
        // Need to ensure structure exists since there might be no overrides/multipliers
        if (!newData) newData = {};
        if (!newData.recipients) newData.recipients = {};
        if (!newData.recipients[recipientId]) newData.recipients[recipientId] = { categories: {} };
        if (!newData.recipients[recipientId].categories) newData.recipients[recipientId].categories = {};
        if (!newData.recipients[recipientId].categories[categoryId]) {
          newData.recipients[recipientId].categories[categoryId] = { effects: [] };
        }
        if (!newData.recipients[recipientId].categories[categoryId].effects) {
          newData.recipients[recipientId].categories[categoryId].effects = [];
        }

        // Find or create the effect
        let effect = newData.recipients[recipientId].categories[categoryId].effects.find(
          (e) => e.effectId === effectId
        );
        if (!effect) {
          effect = { effectId };
          newData.recipients[recipientId].categories[categoryId].effects.push(effect);
        }

        effect.disabled = effectData.disabled;
      }

      return newData;
    });
  };

  // Replace all effects in a recipient/category in one operation
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

  // Replace effects across multiple categories for one recipient
  const replaceRecipientEffectsByCategory = (recipientId, effectsByCategory) => {
    if (!recipientId) {
      throw new Error("Required parameter 'recipientId' is missing");
    }

    setUserAssumptions((prev) =>
      apiHelpers.setRecipientEffectsByCategory(prev, defaultAssumptions, recipientId, effectsByCategory)
    );
  };

  // Clear all overrides/multipliers for a specific recipient effect
  const clearRecipientEffect = (recipientName, categoryId) => {
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      console.error(`Recipient ${recipientName} not found`);
      return;
    }

    // Clear the entire category for this recipient if it only has this effect
    // Otherwise we'd need to clear field by field which isn't available in the API
    setUserAssumptions((prev) => apiHelpers.clearRecipientCategoryOverrides(prev, recipientId, categoryId));
  };

  // ============ GLOBAL PARAMETER OPERATIONS ============
  const updateGlobalParameterValue = (parameterName, value) => {
    setUserAssumptions((prev) => apiHelpers.setGlobalParameter(prev, defaultAssumptions, parameterName, value));
  };

  const resetGlobalParameter = (parameterName) => {
    setUserAssumptions((prev) => apiHelpers.clearGlobalParameter(prev, parameterName));
  };

  const resetAllGlobalParameters = () => {
    setUserAssumptions((prev) => apiHelpers.clearAllGlobalParameters(prev));
  };

  // Reset all to default values
  const resetToDefaults = () => {
    setUserAssumptions(apiHelpers.clearAllOverrides());
  };

  // Helper function to check if userAssumptions contains any actual overrides
  const hasCustomValues = (assumptions) => {
    if (!assumptions) return false;

    // Check if the assumptions object itself is empty
    if (Object.keys(assumptions).length === 0) return false;

    return (
      (assumptions.globalParameters && Object.keys(assumptions.globalParameters).length > 0) ||
      (assumptions.categories && Object.keys(assumptions.categories).length > 0) ||
      (assumptions.recipients && Object.keys(assumptions.recipients).length > 0)
    );
  };

  // Determine if custom values are being used
  const isUsingCustomValues = hasCustomValues(userAssumptions);

  // Context value
  const contextValue = {
    // Direct data access (read-only by convention)
    defaultAssumptions,
    userAssumptions,
    combinedAssumptions,

    // State flags
    isUsingCustomValues,

    // New API functions
    updateCategoryFieldValue,
    updateCategoryEffect,
    replaceCategoryEffects,
    resetCategoryToDefaults,
    updateRecipientFieldOverride,
    updateRecipientFieldMultiplier,
    updateRecipientEffect,
    replaceRecipientCategoryEffects,
    replaceRecipientEffectsByCategory,
    clearRecipientEffect,
    resetRecipientToDefaults,
    updateGlobalParameterValue,
    resetGlobalParameter,
    resetAllGlobalParameters,

    // Compatibility helper
    resetToDefaults,
  };

  return <AssumptionsContext.Provider value={contextValue}>{children}</AssumptionsContext.Provider>;
};

export default AssumptionsContext;
