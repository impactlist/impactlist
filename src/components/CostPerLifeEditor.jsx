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
  
  // Local state for form values
  const [formValues, setFormValues] = useState({});
  
  // Initialize form values when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const initialValues = {};
      Object.entries(effectivenessCategories).forEach(([key, category]) => {
        // If custom value exists, use it; otherwise use default
        initialValues[key] = customValues && customValues[key] !== undefined 
          ? customValues[key] 
          : category.costPerLife;
      });
      setFormValues(initialValues);
    }
  }, [isModalOpen, customValues]);
  
  // Handle input change
  const handleInputChange = (key, value) => {
    // Remove commas for processing
    const processedValue = value === '' || value === '-' || value === '0.' || value === '-0.' || value === '0' || value === '-0'
      ? value 
      : value.toString().replace(/,/g, '');
    
    // For special intermediate states, keep the string value
    const isIntermediateInput = processedValue === '' || 
                               processedValue === '-' || 
                               processedValue === '0.' || 
                               processedValue === '-0.' ||
                               (processedValue.includes('.') && processedValue.endsWith('.'));
    
    setFormValues(prev => ({
      ...prev,
      [key]: isIntermediateInput ? processedValue : Number(processedValue)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out unchanged values to only store custom ones
    const customized = {};
    
    Object.entries(formValues).forEach(([key, value]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      
      // Process the value - string or number
      let processedValue = value;
      if (typeof value === 'string') {
        // Handle partially entered numbers
        if (value === '' || value === '-' || value === '0.' || value === '-0.') {
          return; // Skip this entry
        }
        
        // Convert string to number, removing commas
        processedValue = Number(value.replace(/,/g, ''));
      }
      
      // Only consider valid number inputs that are not exactly zero
      if (!isNaN(processedValue) && processedValue !== 0) {
        if (processedValue !== defaultValue) {
          customized[key] = Number(processedValue);
        }
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
      defaultValues[key] = category.costPerLife;
    });
    setFormValues(defaultValues);
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
                    const currentValue = formValues[key];
                    const isCustom = currentValue !== defaultValue;
                    
                    // Format the display value with commas if it's a number
                    const displayValue = (currentValue !== '' && !isNaN(currentValue))
                      ? typeof currentValue === 'number' && Math.abs(currentValue) >= 1000 
                          ? currentValue.toLocaleString('en-US')
                          : currentValue
                      : '';
                    
                    return (
                      <div key={key} className={`py-1.5 px-2 rounded border ${isCustom ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 truncate pr-2" title={category.name}>
                            {category.name}
                          </label>
                          {isCustom && (
                            <button 
                              type="button"
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                              onClick={() => handleInputChange(key, defaultValue)}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="flex items-center mt-0.5">
                          <span className="mr-1 text-gray-600 text-sm">$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={displayValue}
                            onChange={(e) => {
                              // Remove commas from input when user is typing
                              const rawValue = e.target.value.replace(/,/g, '');
                              
                              // Allow any input that's valid for number formation including decimal, negative signs, and leading zeros
                              if (rawValue === '' || 
                                  rawValue === '-' || 
                                  rawValue === '0' || 
                                  rawValue === '-0' || 
                                  rawValue === '0.' || 
                                  rawValue === '-0.' || 
                                  /^-?\d*\.?\d*$/.test(rawValue)) {
                                handleInputChange(key, rawValue);
                              }
                            }}
                            onBlur={(e) => {
                              // Format with commas on blur if it's a valid number and not exactly zero
                              const value = e.target.value;
                              // Keep the field as-is if it's still being edited (contains just a decimal point, negative sign, etc.)
                              if (value === '' || value === '-' || value === '0.' || value === '-0.') {
                                return;
                              }
                              
                              const numValue = Number(value);
                              if (!isNaN(numValue)) {
                                // Format with commas but preserve exactly as entered for precision
                                const formattedValue = numValue.toLocaleString('en-US', {
                                  useGrouping: true,
                                  maximumFractionDigits: 20
                                });
                                e.target.value = formattedValue;
                              }
                            }}
                            className={`w-full py-1 px-1.5 text-sm border rounded ${isCustom ? 'border-indigo-300' : 'border-gray-300'}`}
                          />
                        </div>
                        {isCustom && (
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