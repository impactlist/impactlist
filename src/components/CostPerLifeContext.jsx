import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { createCombinedAssumptions } from '../utils/combinedAssumptions';

/* global localStorage */

// Create context
const CostPerLifeContext = createContext();

// Custom hook to use the context
export const useCostPerLife = () => {
  const context = useContext(CostPerLifeContext);
  if (!context) {
    throw new Error('useCostPerLife must be used within a CostPerLifeProvider');
  }
  return context;
};

// Provider component
export const CostPerLifeProvider = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [customValues, setCustomValues] = useState(() => {
    const savedValues = localStorage.getItem('customCostPerLifeValues');
    return savedValues ? JSON.parse(savedValues) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create combined assumptions whenever customValues change
  // For now, pass null since we're in transition from old to new format
  const combinedAssumptions = useMemo(() => {
    return createCombinedAssumptions(null);
  }, []);

  // Save to localStorage when customValues change
  useEffect(() => {
    if (customValues) {
      localStorage.setItem('customCostPerLifeValues', JSON.stringify(customValues));
    } else {
      localStorage.removeItem('customCostPerLifeValues');
    }
  }, [customValues]);

  // Reset to default values
  const resetToDefaults = () => {
    setCustomValues(null);
  };

  // Update a specific category value
  const updateCategoryValue = (categoryKey, value) => {
    setCustomValues((prev) => {
      const newValues = prev ? { ...prev } : {};
      if (value === '' || isNaN(value) || value === null) {
        delete newValues[categoryKey];
        return Object.keys(newValues).length > 0 ? newValues : null;
      } else {
        newValues[categoryKey] = Number(value);
        return newValues;
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

    setCustomValues((prev) => {
      const newValues = prev ? { ...prev } : {};

      // Initialize the recipients field if it doesn't exist
      if (!newValues.recipients) {
        newValues.recipients = {};
      }

      // Initialize the recipient entry if it doesn't exist
      if (!newValues.recipients[recipientName]) {
        newValues.recipients[recipientName] = {};
      }

      // Initialize the category entry if it doesn't exist
      if (!newValues.recipients[recipientName][categoryId]) {
        newValues.recipients[recipientName][categoryId] = {};
      }

      // Handle special cases for valid inputs in intermediate states
      const isIntermediateState = value === '-' || value === '.' || value.endsWith('.');

      // Update values
      if (value === '') {
        // If both values are being cleared, remove the category
        if (type === 'multiplier' && !newValues.recipients[recipientName][categoryId].costPerLife) {
          delete newValues.recipients[recipientName][categoryId];
        } else if (type === 'costPerLife' && !newValues.recipients[recipientName][categoryId].multiplier) {
          delete newValues.recipients[recipientName][categoryId];
        } else {
          // Just clear this specific value
          delete newValues.recipients[recipientName][categoryId][type];
        }

        // Clean up empty objects - using safe checks
        if (
          newValues.recipients?.[recipientName]?.[categoryId] &&
          Object.keys(newValues.recipients[recipientName][categoryId]).length === 0
        ) {
          delete newValues.recipients[recipientName][categoryId];
        }
        if (newValues.recipients?.[recipientName] && Object.keys(newValues.recipients[recipientName]).length === 0) {
          delete newValues.recipients[recipientName];
        }
        if (newValues.recipients && Object.keys(newValues.recipients).length === 0) {
          delete newValues.recipients;
        }
      } else if (isIntermediateState) {
        // For intermediate states, store the string value temporarily
        // These won't be used in calculations until they're valid numbers
        newValues.recipients[recipientName][categoryId][type] = value;
      } else if (!isNaN(Number(value))) {
        // Only clear the other field if we're setting a valid number
        // When setting a multiplier, clear costPerLife and vice versa
        if (type === 'multiplier') {
          delete newValues.recipients[recipientName][categoryId].costPerLife;
        } else if (type === 'costPerLife') {
          delete newValues.recipients[recipientName][categoryId].multiplier;
        }

        // Store numeric value
        newValues.recipients[recipientName][categoryId][type] = Number(value);
      }

      // Return updated object
      return Object.keys(newValues).length > 0 ? newValues : null;
    });
  };

  // Update multiple values at once
  const updateValues = (newValues) => {
    setCustomValues(newValues);
  };

  // Get recipient custom value
  const getRecipientValue = (recipientName, categoryId, type) => {
    if (
      !customValues ||
      !customValues.recipients ||
      !customValues.recipients[recipientName] ||
      !customValues.recipients[recipientName][categoryId] ||
      customValues.recipients[recipientName][categoryId][type] === undefined
    ) {
      return null;
    }

    return customValues.recipients[recipientName][categoryId][type];
  };

  // Determine if custom values are being used
  const isUsingCustomValues = customValues !== null;

  // Open/close the edit modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Context value
  const contextValue = {
    customValues,
    combinedAssumptions,
    isUsingCustomValues,
    resetToDefaults,
    updateCategoryValue,
    updateRecipientValue,
    updateValues,
    getRecipientValue,
    isModalOpen,
    openModal,
    closeModal,
  };

  return <CostPerLifeContext.Provider value={contextValue}>{children}</CostPerLifeContext.Provider>;
};

export default CostPerLifeContext;
