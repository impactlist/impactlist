import React, { createContext, useState, useContext, useEffect } from 'react';
import { effectivenessCategories } from '../data/donationData';

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
    setCustomValues(prev => {
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

  // Update multiple values at once
  const updateValues = (newValues) => {
    setCustomValues(newValues);
  };

  // Determine if custom values are being used
  const isUsingCustomValues = customValues !== null;

  // Open/close the edit modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Context value
  const contextValue = {
    customValues,
    isUsingCustomValues,
    resetToDefaults,
    updateCategoryValue,
    updateValues,
    isModalOpen,
    openModal,
    closeModal,
  };

  return (
    <CostPerLifeContext.Provider value={contextValue}>
      {children}
    </CostPerLifeContext.Provider>
  );
};

export default CostPerLifeContext;