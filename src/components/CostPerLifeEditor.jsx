import React, { useState, useEffect } from 'react';
import { useCostPerLife } from './CostPerLifeContext';
import { effectivenessCategories } from '../data/donationData';
import { motion, AnimatePresence } from 'framer-motion';

const CostPerLifeEditor = () => {
  const { 
    customValues, 
    isUsingCustomValues, 
    resetToDefaults, 
    updateValues,
    isModalOpen,
    closeModal
  } = useCostPerLife();
  
  // Local state for form values and errors
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  
  // Handle input change - allow any input
  const handleInputChange = (key, value) => {
    // Store the raw value (without commas) internally
    const rawValue = value.toString().replace(/,/g, '');
    
    // Check if it's a valid number and not in an intermediate state
    const isValidNumber = rawValue !== '' && 
                         rawValue !== '-' && 
                         rawValue !== '.' && 
                         !rawValue.endsWith('.') && 
                         !isNaN(Number(rawValue));
    
    // Format with commas if it's a valid number and large enough
    let displayValue = rawValue;
    if (isValidNumber) {
      const numValue = Number(rawValue);
      if (Math.abs(numValue) >= 1000) {
        // Split into integer and decimal parts to preserve decimal precision
        const parts = rawValue.split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        
        // Format integer part with commas
        const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        displayValue = integerWithCommas + decimalPart;
      }
    }
    
    // Store both the raw value (for calculations) and display value (for UI)
    setFormValues(prev => ({
      ...prev,
      [key]: {
        raw: rawValue,
        display: displayValue
      }
    }));
    
    // Clear error when user starts typing again
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };
  
  // Initialize form values when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const initialValues = {};
      Object.entries(effectivenessCategories).forEach(([key, category]) => {
        // If custom value exists, use it; otherwise use default
        const value = customValues && customValues[key] !== undefined 
          ? customValues[key] 
          : category.costPerLife;
        
        // Format initial values
        const formattedValue = value.toLocaleString();
        
        initialValues[key] = {
          raw: value.toString(),
          display: formattedValue
        };
      });
      
      setFormValues(initialValues);
      setErrors({});
    }
  }, [isModalOpen, customValues]);
  
  // Validate all values before submission
  const validateValues = () => {
    const newErrors = {};
    let hasErrors = false;
    
    Object.entries(formValues).forEach(([key, valueObj]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      const rawValue = valueObj.raw;
      
      // Skip validation if value is the same as default
      if (Number(rawValue) === defaultValue) return;
      
      // Convert to number
      const numValue = rawValue.trim() === '' ? 0 : Number(rawValue);
        
      // Check if it's a valid number
      if (isNaN(numValue)) {
        newErrors[key] = 'Invalid number';
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all values
    if (!validateValues()) {
      return; // Stop if there are errors
    }
    
    // Filter out unchanged values to only store custom ones
    const customized = {};
    
    Object.entries(formValues).forEach(([key, valueObj]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      const rawValue = valueObj.raw;
      
      // Process the value - convert string to number
      const processedValue = rawValue.trim() === '' ? 0 : Number(rawValue);
      
      // Only consider valid number inputs that are different from default
      if (!isNaN(processedValue) && processedValue !== defaultValue) {
        customized[key] = processedValue;
      }
    });
    
    // If any values are customized, save them; otherwise reset to defaults
    if (Object.keys(customized).length > 0) {
      updateValues(customized);
    } else {
      resetToDefaults();
    }
    
    closeModal();
  };
  
  // Handle reset button
  const handleReset = () => {
    const defaultValues = {};
    Object.entries(effectivenessCategories).forEach(([key, category]) => {
      const value = category.costPerLife;
      const formattedValue = value >= 1000 
        ? value.toLocaleString() 
        : value.toString();
      
      defaultValues[key] = {
        raw: value.toString(),
        display: formattedValue
      };
    });
    setFormValues(defaultValues);
    setErrors({});
  };
  
  if (!isModalOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Cost Per Life Values</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Customize the cost per life values for different recipient categories. These values represent the estimated cost in dollars to save one life.
            </p>
            <div className="mt-4 flex items-center justify-end">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto p-3 flex-grow">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(effectivenessCategories)
                  .sort((a, b) => a[1].name.localeCompare(b[1].name))
                  .map(([key, category]) => {
                    const defaultValue = category.costPerLife;
                    const valueObj = formValues[key] || { raw: '', display: '' };
                    const hasError = errors[key];
                    
                    // Check if value is custom (different from default)
                    const isCustom = Number(valueObj.raw) !== defaultValue;
                    
                    return (
                      <div key={key} className={`py-1.5 px-2 rounded border ${
                        hasError ? 'border-red-300 bg-red-50' : 
                        isCustom ? 'border-indigo-300 bg-indigo-50' : 
                        'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 truncate pr-2" title={category.name}>
                            {category.name}
                          </label>
                          {isCustom && (
                            <button 
                              type="button"
                              className={`text-xs ${hasError ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}
                              onClick={() => {
                                const value = defaultValue;
                                const formattedValue = value >= 1000 
                                  ? value.toLocaleString() 
                                  : value.toString();
                                
                                handleInputChange(key, formattedValue);
                              }}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="flex items-center mt-0.5">
                          <span className="mr-1 text-gray-600 text-sm">$</span>
                          <input
                            type="text"
                            inputMode="text"
                            value={valueObj.display}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className={`w-full py-1 px-1.5 text-sm border rounded ${
                              hasError ? 'border-red-300 text-red-700' : 
                              isCustom ? 'border-indigo-300' : 
                              'border-gray-300'
                            }`}
                          />
                        </div>
                        {hasError && (
                          <div className="text-xs text-red-600 mt-0.5">
                            {errors[key]}
                          </div>
                        )}
                        {isCustom && !hasError && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Default: ${defaultValue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CostPerLifeEditor;