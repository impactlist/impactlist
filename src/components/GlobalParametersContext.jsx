import React, { createContext, useState, useContext, useEffect } from 'react';
import { getGlobalParameters, setGlobalParameters, resetGlobalParameters } from '../config/globalParameters';

/* global localStorage */

// Create context
const GlobalParametersContext = createContext();

// Custom hook to use the context
export const useGlobalParameters = () => {
  const context = useContext(GlobalParametersContext);
  if (!context) {
    throw new Error('useGlobalParameters must be used within a GlobalParametersProvider');
  }
  return context;
};

// Provider component
export const GlobalParametersProvider = ({ children }) => {
  // Initialize global parameters
  const [globalParameters, setGlobalParametersState] = useState(() => getGlobalParameters());

  // Initialize custom effectiveness data from localStorage
  const [customEffectivenessData, setCustomEffectivenessData] = useState(() => {
    const savedData = localStorage.getItem('customEffectivenessData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save custom effectiveness data to localStorage when it changes
  useEffect(() => {
    if (customEffectivenessData) {
      localStorage.setItem('customEffectivenessData', JSON.stringify(customEffectivenessData));
    } else {
      localStorage.removeItem('customEffectivenessData');
    }
  }, [customEffectivenessData]);

  // Update global parameters
  const updateGlobalParameters = (newParams) => {
    const updated = setGlobalParameters(newParams);
    setGlobalParametersState(updated);
  };

  // Reset all parameters to defaults
  const resetToDefaults = () => {
    const defaults = resetGlobalParameters();
    setGlobalParametersState(defaults);
    setCustomEffectivenessData(null);
  };

  // Update category effect parameter
  const updateCategoryEffectParameter = (categoryId, effectName, parameterName, value) => {
    if (!categoryId || !effectName || !parameterName) {
      throw new Error('Missing required parameters');
    }

    setCustomEffectivenessData((prev) => {
      const newData = prev ? { ...prev } : {};

      // Initialize nested structure for categories
      if (!newData.categories) {
        newData.categories = {};
      }
      if (!newData.categories[categoryId]) {
        newData.categories[categoryId] = {};
      }
      if (!newData.categories[categoryId].effects) {
        newData.categories[categoryId].effects = {};
      }
      if (!newData.categories[categoryId].effects[effectName]) {
        newData.categories[categoryId].effects[effectName] = {};
      }

      // Handle clearing values
      if (value === '' || value === null || value === undefined) {
        delete newData.categories[categoryId].effects[effectName][parameterName];

        // Clean up empty objects
        if (Object.keys(newData.categories[categoryId].effects[effectName]).length === 0) {
          delete newData.categories[categoryId].effects[effectName];
        }
        if (Object.keys(newData.categories[categoryId].effects).length === 0) {
          delete newData.categories[categoryId].effects;
        }
        if (Object.keys(newData.categories[categoryId]).length === 0) {
          delete newData.categories[categoryId];
        }
        if (Object.keys(newData.categories).length === 0) {
          delete newData.categories;
        }
      } else {
        // Set the value
        newData.categories[categoryId].effects[effectName][parameterName] = value;
      }

      return Object.keys(newData).length === 0 ? null : newData;
    });
  };

  // Update recipient effect override
  const updateRecipientEffectOverride = (recipientName, categoryId, effectName, parameterName, value) => {
    if (!recipientName || !categoryId || !effectName || !parameterName) {
      throw new Error('Missing required parameters');
    }

    setCustomEffectivenessData((prev) => {
      const newData = prev ? { ...prev } : {};

      // Initialize nested structure for recipients
      if (!newData.recipients) {
        newData.recipients = {};
      }
      if (!newData.recipients[recipientName]) {
        newData.recipients[recipientName] = {};
      }
      if (!newData.recipients[recipientName][categoryId]) {
        newData.recipients[recipientName][categoryId] = {};
      }
      if (!newData.recipients[recipientName][categoryId].effects) {
        newData.recipients[recipientName][categoryId].effects = {};
      }
      if (!newData.recipients[recipientName][categoryId].effects[effectName]) {
        newData.recipients[recipientName][categoryId].effects[effectName] = {};
      }

      // Handle clearing values
      if (value === '' || value === null || value === undefined) {
        delete newData.recipients[recipientName][categoryId].effects[effectName][parameterName];

        // Clean up empty objects
        if (Object.keys(newData.recipients[recipientName][categoryId].effects[effectName]).length === 0) {
          delete newData.recipients[recipientName][categoryId].effects[effectName];
        }
        if (Object.keys(newData.recipients[recipientName][categoryId].effects).length === 0) {
          delete newData.recipients[recipientName][categoryId].effects;
        }
        if (Object.keys(newData.recipients[recipientName][categoryId]).length === 0) {
          delete newData.recipients[recipientName][categoryId];
        }
        if (Object.keys(newData.recipients[recipientName]).length === 0) {
          delete newData.recipients[recipientName];
        }
        if (Object.keys(newData.recipients).length === 0) {
          delete newData.recipients;
        }
      } else {
        // Set the value
        newData.recipients[recipientName][categoryId].effects[effectName][parameterName] = value;
      }

      return Object.keys(newData).length === 0 ? null : newData;
    });
  };

  // Get category effect parameter
  const getCategoryEffectParameter = (categoryId, effectName, parameterName) => {
    if (
      !customEffectivenessData ||
      !customEffectivenessData.categories ||
      !customEffectivenessData.categories[categoryId] ||
      !customEffectivenessData.categories[categoryId].effects ||
      !customEffectivenessData.categories[categoryId].effects[effectName] ||
      customEffectivenessData.categories[categoryId].effects[effectName][parameterName] === undefined
    ) {
      return null;
    }

    return customEffectivenessData.categories[categoryId].effects[effectName][parameterName];
  };

  // Get recipient effect override
  const getRecipientEffectOverride = (recipientName, categoryId, effectName, parameterName) => {
    if (
      !customEffectivenessData ||
      !customEffectivenessData.recipients ||
      !customEffectivenessData.recipients[recipientName] ||
      !customEffectivenessData.recipients[recipientName][categoryId] ||
      !customEffectivenessData.recipients[recipientName][categoryId].effects ||
      !customEffectivenessData.recipients[recipientName][categoryId].effects[effectName] ||
      customEffectivenessData.recipients[recipientName][categoryId].effects[effectName][parameterName] === undefined
    ) {
      return null;
    }

    return customEffectivenessData.recipients[recipientName][categoryId].effects[effectName][parameterName];
  };

  // Determine if custom values are being used
  const isUsingCustomValues =
    customEffectivenessData !== null || JSON.stringify(globalParameters) !== JSON.stringify(getGlobalParameters());

  // Open/close the edit modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Context value
  const contextValue = {
    globalParameters,
    updateGlobalParameters,
    customEffectivenessData,
    updateCategoryEffectParameter,
    getCategoryEffectParameter,
    updateRecipientEffectOverride,
    getRecipientEffectOverride,
    isUsingCustomValues,
    resetToDefaults,
    isModalOpen,
    openModal,
    closeModal,
  };

  return <GlobalParametersContext.Provider value={contextValue}>{children}</GlobalParametersContext.Provider>;
};
