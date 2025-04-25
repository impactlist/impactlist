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
    setFormValues(prev => ({
      ...prev,
      [key]: value === '' ? '' : Number(value)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out unchanged values to only store custom ones
    const defaults = {};
    const customized = {};
    
    Object.entries(formValues).forEach(([key, value]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      
      // Only consider valid number inputs
      if (value !== '' && !isNaN(value)) {
        if (value !== defaultValue) {
          customized[key] = Number(value);
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
              Customize the cost per life values for different charity categories. These values represent the estimated cost in dollars to save one life.
            </p>
            {isUsingCustomValues && (
              <div className="mt-2 text-sm text-indigo-600 font-medium">
                You are currently using custom values
              </div>
            )}
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(effectivenessCategories).map(([key, category]) => {
                  const defaultValue = category.costPerLife;
                  const currentValue = formValues[key];
                  const isCustom = currentValue !== defaultValue;
                  
                  return (
                    <div key={key} className={`p-4 rounded-lg border ${isCustom ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                      <label className="block mb-2 font-medium text-gray-700">
                        {category.name}
                      </label>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-600">$</span>
                        <input
                          type="number"
                          min="0"
                          value={currentValue || ''}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className={`w-full p-2 border rounded ${isCustom ? 'border-indigo-300' : 'border-gray-300'}`}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500 flex justify-between">
                        <span>Default: ${defaultValue.toLocaleString()}</span>
                        {isCustom && (
                          <span className="text-indigo-600">
                            Custom value
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reset to Defaults
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CostPerLifeEditor;