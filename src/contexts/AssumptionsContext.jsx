import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import {
  createDefaultAssumptions,
  createCombinedAssumptions,
  costPerLifeToEffect,
  getCostPerLifeFromCombined,
  getActualCostPerLifeForCategoryDataFromCombined,
} from '../utils/assumptionsDataHelpers';

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

  // Reset to default values
  const resetToDefaults = () => {
    setUserAssumptions(null);
  };

  // Update a specific category value (converts simple cost per life to effects format)
  const updateCategoryValue = (categoryKey, value) => {
    setUserAssumptions((prev) => {
      const newData = prev ? JSON.parse(JSON.stringify(prev)) : { categories: {}, recipients: {} };

      if (value === '' || isNaN(value) || value === null) {
        // Remove the category override
        if (newData.categories && newData.categories[categoryKey]) {
          delete newData.categories[categoryKey];
        }

        // Clean up empty objects
        if (newData.categories && Object.keys(newData.categories).length === 0) {
          delete newData.categories;
        }
        if (newData.recipients && Object.keys(newData.recipients).length === 0) {
          delete newData.recipients;
        }

        return Object.keys(newData).length > 0 ? newData : null;
      } else {
        // Convert cost per life to effects format
        const costPerLife = Number(value);

        // Get the base category to preserve effectId
        const baseCategory = combinedAssumptions.getCategoryById(categoryKey);
        if (!baseCategory || !baseCategory.effects || baseCategory.effects.length === 0) {
          throw new Error(`Category ${categoryKey} has no base effects to override`);
        }

        const baseEffect = baseCategory.effects[0];
        const effect = {
          ...costPerLifeToEffect(costPerLife, combinedAssumptions.globalParameters),
          effectId: baseEffect.effectId,
        };

        if (!newData.categories) {
          newData.categories = {};
        }

        newData.categories[categoryKey] = {
          effects: [effect],
        };

        return newData;
      }
    });
  };

  // Update a recipient's override values - type can be 'multiplier' or 'costPerLife'
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

    setUserAssumptions((prev) => {
      const newData = prev ? JSON.parse(JSON.stringify(prev)) : { categories: {}, recipients: {} };

      // Find the recipient ID by name
      const recipientId = combinedAssumptions.findRecipientId(recipientName);
      if (!recipientId) {
        throw new Error(`Recipient ${recipientName} not found`);
      }

      // Initialize the recipients field if it doesn't exist
      if (!newData.recipients) {
        newData.recipients = {};
      }

      // Initialize the recipient entry if it doesn't exist
      if (!newData.recipients[recipientId]) {
        newData.recipients[recipientId] = { categories: {} };
      }

      // Initialize the category entry if it doesn't exist
      if (!newData.recipients[recipientId].categories[categoryId]) {
        newData.recipients[recipientId].categories[categoryId] = {};
      }

      // Handle special cases for valid inputs in intermediate states
      const isIntermediateState = value === '-' || value === '.' || value.endsWith('.');

      // Update values
      if (value === '' || isIntermediateState) {
        // For empty or intermediate states, remove the override for now
        // We could handle intermediate states differently if needed
        if (newData.recipients[recipientId].categories[categoryId].effects) {
          delete newData.recipients[recipientId].categories[categoryId].effects;
        }

        // Clean up empty objects
        if (Object.keys(newData.recipients[recipientId].categories[categoryId]).length === 0) {
          delete newData.recipients[recipientId].categories[categoryId];
        }
        if (Object.keys(newData.recipients[recipientId].categories).length === 0) {
          delete newData.recipients[recipientId];
        }
        if (Object.keys(newData.recipients).length === 0) {
          delete newData.recipients;
        }
      } else if (!isNaN(Number(value))) {
        const numValue = Number(value);

        // Get the base category effect to use as template
        const baseCategory = combinedAssumptions.getCategoryById(categoryId);
        if (!baseCategory || !baseCategory.effects || baseCategory.effects.length === 0) {
          throw new Error(`Category ${categoryId} has no base effects to override`);
        }

        const baseEffect = baseCategory.effects[0]; // Use first effect as template

        let newEffect;
        if (type === 'costPerLife') {
          // Create an override structure for cost per life
          const costPerQALY = numValue / combinedAssumptions.globalParameters.yearsPerLife;
          newEffect = {
            effectId: baseEffect.effectId,
            overrides: {
              costPerQALY: costPerQALY,
            },
          };
        } else if (type === 'multiplier') {
          // Create a multiplier structure
          newEffect = {
            effectId: baseEffect.effectId,
            multipliers: {
              costPerQALY: numValue,
            },
          };
        }

        newData.recipients[recipientId].categories[categoryId] = {
          effects: [newEffect],
        };
      }

      // Return updated object
      return Object.keys(newData).length > 0 ? newData : null;
    });
  };

  // Update multiple values at once (expects new effects format)
  const updateValues = (newData) => {
    setUserAssumptions(newData);
  };

  // Update a specific global parameter value
  const updateGlobalParameter = (parameterKey, value) => {
    setUserAssumptions((prev) => {
      const newData = prev ? JSON.parse(JSON.stringify(prev)) : { categories: {}, recipients: {} };

      if (value === '' || value === null) {
        // Remove the parameter override
        if (newData.globalParameters && newData.globalParameters[parameterKey]) {
          delete newData.globalParameters[parameterKey];
        }

        // Clean up empty globalParameters object
        if (newData.globalParameters && Object.keys(newData.globalParameters).length === 0) {
          delete newData.globalParameters;
        }

        // Clean up completely empty objects
        if (Object.keys(newData).length === 0) {
          return null;
        }

        return newData;
      } else {
        // Set the global parameter value
        if (!newData.globalParameters) {
          newData.globalParameters = {};
        }

        newData.globalParameters[parameterKey] = Number(value);
        return newData;
      }
    });
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

  // Determine if custom values are being used
  const isUsingCustomValues = userAssumptions !== null;

  // Open/close the edit modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Context value
  const contextValue = {
    defaultAssumptions,
    userAssumptions,
    combinedAssumptions,
    isUsingCustomValues,
    resetToDefaults,
    updateCategoryValue,
    updateRecipientValue,
    updateGlobalParameter,
    updateValues,
    getRecipientValue,
    getCategoryValue,
    getGlobalParameter,
    isModalOpen,
    openModal,
    closeModal,
  };

  return <AssumptionsContext.Provider value={contextValue}>{children}</AssumptionsContext.Provider>;
};

export default AssumptionsContext;
