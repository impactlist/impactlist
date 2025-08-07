import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import {
  createDefaultAssumptions,
  createCombinedAssumptions,
  getCostPerLifeFromCombined,
  getActualCostPerLifeForCategoryDataFromCombined,
} from '../utils/assumptionsDataHelpers';
import * as apiHelpers from '../utils/assumptionsAPIHelpers';

/* global localStorage */

// Create context
const AssumptionsContext = createContext();

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
  // Create default assumptions once
  const defaultAssumptions = useMemo(() => createDefaultAssumptions(), []);

  // Initialize user assumptions from localStorage or defaults (new format)
  const [userAssumptions, setUserAssumptions] = useState(() => {
    // Clean up old format data
    localStorage.removeItem('customCostPerLifeValues');

    const savedData = localStorage.getItem('customEffectsData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create combined assumptions whenever userAssumptions changes
  const combinedAssumptions = useMemo(() => {
    return createCombinedAssumptions(defaultAssumptions, userAssumptions);
  }, [defaultAssumptions, userAssumptions]);

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

  // ============ GLOBAL PARAMETER OPERATIONS ============
  const updateGlobalParameterValue = (parameterName, value) => {
    setUserAssumptions((prev) => apiHelpers.setGlobalParameter(prev, parameterName, value));
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

  // Legacy wrapper: Reset category to defaults when cleared
  const updateCategoryValue = (categoryKey, value) => {
    if (value === '' || isNaN(value) || value === null) {
      resetCategoryToDefaults(categoryKey);
    }
    // Don't do anything else - categories should only be edited through CategoryEffectEditor
  };

  // Legacy wrapper: Update a recipient's override values - type can be 'multiplier' or 'costPerLife'
  const updateRecipientValue = (recipientName, categoryId, type, value) => {
    if (!recipientName) {
      throw new Error("Required parameter 'recipientName' is missing");
    }
    if (!categoryId) {
      throw new Error("Required parameter 'categoryId' is missing");
    }
    if (!type) {
      throw new Error("Required parameter 'type' is missing");
    }
    if (type !== 'multiplier' && type !== 'costPerLife') {
      throw new Error(`Invalid type '${type}'. Must be 'multiplier' or 'costPerLife'`);
    }

    // Handle special cases for valid inputs in intermediate states
    const valueStr = String(value);
    const isIntermediateState = valueStr === '-' || valueStr === '.' || valueStr.endsWith('.');

    if (value === '' || isIntermediateState) {
      // For empty or intermediate states, remove the override
      const recipientId = combinedAssumptions.findRecipientId(recipientName);
      if (recipientId) {
        setUserAssumptions((prev) => apiHelpers.clearRecipientCategoryOverrides(prev, recipientId, categoryId));
      }
    } else if (!isNaN(Number(value))) {
      const numValue = Number(value);

      // Get the base category effect to use as template
      const baseCategory = combinedAssumptions.getCategoryById(categoryId);
      if (!baseCategory || !baseCategory.effects || baseCategory.effects.length === 0) {
        throw new Error(`Category ${categoryId} has no base effects to override`);
      }

      const effectId = baseCategory.effects[0].effectId;

      if (type === 'costPerLife') {
        // Skip - costPerLife is a calculated value, not a direct parameter
        // The recipients tab will be updated to use actual parameters instead
        return;
      } else if (type === 'multiplier') {
        updateRecipientFieldMultiplier(recipientName, categoryId, effectId, 'costPerQALY', numValue);
      }
    }
  };

  // Update multiple values at once (expects new effects format)
  const updateValues = (newData) => {
    setUserAssumptions(newData);
  };

  // Legacy wrapper: Update a specific global parameter value
  const updateGlobalParameter = (parameterKey, value) => {
    if (value === '' || value === null) {
      resetGlobalParameter(parameterKey);
    } else {
      updateGlobalParameterValue(parameterKey, Number(value));
    }
  };

  // Get global parameter custom value for display
  const getGlobalParameter = (parameterKey) => {
    if (
      !userAssumptions ||
      !userAssumptions.globalParameters ||
      userAssumptions.globalParameters[parameterKey] === undefined
    ) {
      return null;
    }
    return userAssumptions.globalParameters[parameterKey];
  };

  // Get recipient custom value for display (converts from effects back to simple value)
  const getRecipientValue = (recipientName, categoryId, type) => {
    if (!userAssumptions || !userAssumptions.recipients) {
      return null;
    }

    // Find the recipient ID by name
    const recipientId = combinedAssumptions.findRecipientId(recipientName);
    if (!recipientId) {
      return null;
    }

    // Check if this recipient/category has custom effects in user assumptions
    const recipientData = userAssumptions.recipients[recipientId];
    if (
      !recipientData ||
      !recipientData.categories ||
      !recipientData.categories[categoryId] ||
      !recipientData.categories[categoryId].effects ||
      recipientData.categories[categoryId].effects.length === 0
    ) {
      return null;
    }

    if (type === 'costPerLife') {
      // Get the recipient data from combined assumptions (which has proper names and structure)
      const recipient = combinedAssumptions.recipients[recipientId];
      const categoryData = recipient.categories[categoryId];

      // Calculate the actual cost per life for this recipient/category using the combined data
      return getActualCostPerLifeForCategoryDataFromCombined(
        combinedAssumptions,
        recipientId,
        categoryId,
        categoryData
      );
    } else if (type === 'multiplier') {
      // Calculate multiplier by comparing base category vs recipient-specific cost per life
      const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId);

      const recipient = combinedAssumptions.recipients[recipientId];
      const categoryData = recipient.categories[categoryId];
      const recipientCostPerLife = getActualCostPerLifeForCategoryDataFromCombined(
        combinedAssumptions,
        recipientId,
        categoryId,
        categoryData
      );

      // Multiplier is the ratio (inverted because lower cost per life = higher multiplier)
      return baseCostPerLife / recipientCostPerLife;
    }

    return null;
  };

  // Get category custom value for display (converts from effects back to simple cost per life)
  const getCategoryValue = (categoryId) => {
    if (
      !userAssumptions ||
      !userAssumptions.categories ||
      !userAssumptions.categories[categoryId] ||
      !userAssumptions.categories[categoryId].effects
    ) {
      return null;
    }

    const effects = userAssumptions.categories[categoryId].effects;
    if (!effects || effects.length === 0) {
      return null;
    }

    // Use the combined assumptions which has the proper merged data with names
    return getCostPerLifeFromCombined(combinedAssumptions, categoryId);
  };

  // Helper function to check if userAssumptions contains any actual overrides
  const hasCustomValues = (assumptions) => {
    if (!assumptions) return false;

    return (
      (assumptions.globalParameters && Object.keys(assumptions.globalParameters).length > 0) ||
      (assumptions.categories && Object.keys(assumptions.categories).length > 0) ||
      (assumptions.recipients && Object.keys(assumptions.recipients).length > 0)
    );
  };

  // Determine if custom values are being used
  const isUsingCustomValues = hasCustomValues(userAssumptions);

  // Open/close the edit modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Context value - exposing both new API and legacy wrappers
  const contextValue = {
    // Direct data access (read-only by convention)
    defaultAssumptions,
    userAssumptions,
    combinedAssumptions,

    // State flags
    isUsingCustomValues,
    isModalOpen,
    openModal,
    closeModal,

    // New API functions
    updateCategoryFieldValue,
    updateCategoryEffect,
    resetCategoryToDefaults,
    updateRecipientFieldOverride,
    updateRecipientFieldMultiplier,
    resetRecipientToDefaults,
    updateGlobalParameterValue,
    resetGlobalParameter,
    resetAllGlobalParameters,

    // Legacy wrappers for backward compatibility
    resetToDefaults,
    updateCategoryValue,
    updateRecipientValue,
    updateGlobalParameter,
    updateValues,
    getRecipientValue,
    getCategoryValue,
    getGlobalParameter,
  };

  return <AssumptionsContext.Provider value={contextValue}>{children}</AssumptionsContext.Provider>;
};

export default AssumptionsContext;
