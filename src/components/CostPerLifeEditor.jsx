import React, { useState, useEffect, useMemo } from 'react';
import { useCostPerLife } from './CostPerLifeContext';
import { effectivenessCategories, recipients } from '../data/donationData';
import { motion, AnimatePresence } from 'framer-motion';

const CostPerLifeEditor = () => {
  const { 
    customValues, 
    isUsingCustomValues, 
    resetToDefaults, 
    updateValues,
    updateRecipientValue,
    getRecipientValue,
    isModalOpen,
    closeModal
  } = useCostPerLife();
  
  // Local state for form values and errors
  const [categoryFormValues, setCategoryFormValues] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});
  const [recipientFormValues, setRecipientFormValues] = useState({});
  const [recipientErrors, setRecipientErrors] = useState({});
  const [activeTab, setActiveTab] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [showOnlyCustom, setShowOnlyCustom] = useState(true);
  
  // Get recipients with non-default values (multiplier or costPerLife)
  const recipientsWithOverrides = useMemo(() => {
    return recipients.filter(recipient => {
      if (!recipient.categories) return false;
      
      return Object.entries(recipient.categories).some(([categoryId, categoryData]) => {
        return categoryData.multiplier !== undefined || categoryData.costPerLife !== undefined;
      });
    });
  }, []);
  
  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'recipients') {
      // Initialize filtered recipients based on current filter settings
      filterRecipients(searchTerm, showOnlyCustom);
    }
  };
  
  // Filter recipients based on search term and showOnlyCustom flag
  const filterRecipients = React.useCallback((term, onlyCustom) => {
    let filtered = recipients;
    
    // Filter by search term if provided
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(recipient => 
        recipient.name.toLowerCase().includes(lowerTerm)
      );
      
      // Sort alphabetically
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      
      // Limit to first 10 results when searching
      if (filtered.length > 10) {
        filtered = filtered.slice(0, 10);
      }
    } else if (onlyCustom) {
      // When no search term, filter to only show recipients with custom values
      filtered = filtered.filter(recipient => {
        // Check if recipient has built-in overrides
        const hasBuiltInOverrides = Object.values(recipient.categories || {}).some(
          cat => cat.multiplier !== undefined || cat.costPerLife !== undefined
        );
        
        // Check if recipient has custom overrides from context
        const hasCustomOverrides = customValues && 
          customValues.recipients && 
          customValues.recipients[recipient.name] !== undefined;
        
        // Check if recipient has custom values in the current form
        const hasFormCustomValues = Object.keys(recipientFormValues).some(fieldKey => {
          // Check if this field key belongs to this recipient
          if (fieldKey.startsWith(`${recipient.name}__`)) {
            const value = recipientFormValues[fieldKey];
            if (value && value.raw !== '') {
              // Get the parts from the field key
              const [_, categoryId, type] = fieldKey.split('__');
              
              // Get default value from recipient data if it exists
              let defaultValue;
              if (recipient.categories && recipient.categories[categoryId] && recipient.categories[categoryId][type] !== undefined) {
                defaultValue = recipient.categories[categoryId][type];
              }
              
              // If there's no default value, or if the form value is different from the default
              if (defaultValue === undefined || Number(value.raw) !== defaultValue) {
                return true;
              }
            }
          }
          return false;
        });
        
        return hasBuiltInOverrides || hasCustomOverrides || hasFormCustomValues;
      });
      
      // Sort alphabetically
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredRecipients(filtered);
  }, [customValues, recipientFormValues]); // Include both customValues and recipientFormValues in dependencies
  
  // Handle search term changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Update showOnlyCustom based on whether search is empty
    const shouldShowOnlyCustom = term === '';
    setShowOnlyCustom(shouldShowOnlyCustom);
    // Filter recipients accordingly
    filterRecipients(term, shouldShowOnlyCustom);
  };
  
  // Note: showOnlyCustom state is still used but is now controlled by the searchTerm
  // We set it to true when searchTerm is empty, false otherwise
  
  // Format a number with commas
  const formatWithCommas = (value) => {
    // If value is null or undefined, return empty string
    if (value === null || value === undefined) return '';
    
    // If value is empty string, just return it
    if (value === '') return '';
    
    try {
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
      
      return displayValue;
    } catch (error) {
      console.error("Error in formatWithCommas:", error, "Value was:", value);
      return '';
    }
  };
  
  // Generic function to handle number input changes
  const handleNumberInputChange = (key, value, setFormValues, clearError) => {
    // Store the raw value (without commas) internally
    const rawValue = value.toString().replace(/,/g, '');
    
    // Get the current cursor position from the active element
    const input = document.activeElement;
    let selectionStart = null;
    
    // Only track cursor position if the active element is an input
    if (input && input.tagName === 'INPUT') {
      selectionStart = input.selectionStart;
    }
    
    // Format display value
    const displayValue = formatWithCommas(rawValue);
    
    // Store both the raw value (for calculations) and display value (for UI)
    setFormValues(prev => ({
      ...prev,
      [key]: {
        raw: rawValue,
        display: displayValue
      }
    }));
    
    // Restore cursor position in the next tick if we have a position to restore
    if (selectionStart !== null) {
      // Track how many commas were before the cursor position in the old value
      const oldValue = value.toString();
      const commasBefore = (oldValue.substring(0, selectionStart).match(/,/g) || []).length;
      
      // Calculate how many commas are before the cursor in the new value
      const newCommasBefore = (displayValue.substring(0, selectionStart).match(/,/g) || []).length;
      
      // Adjust cursor position for added or removed commas
      const newPosition = selectionStart + (newCommasBefore - commasBefore);
      
      // Use setTimeout to ensure the DOM has updated with the new value
      setTimeout(() => {
        if (input && input.tagName === 'INPUT') {
          input.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
    
    // Clear error if needed
    if (clearError) {
      clearError(key);
    }
  };
  
  // Generic function to clear category errors
  const clearCategoryError = (key) => {
    if (categoryErrors[key]) {
      setCategoryErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };
  
  // Generic function to clear recipient errors
  const clearRecipientError = (fieldKey) => {
    const [recipientName, categoryId, type] = fieldKey.split('__');
    
    if (recipientErrors[recipientName]?.[categoryId]?.[type]) {
      setRecipientErrors(prev => {
        const newErrors = {...prev};
        if (newErrors[recipientName] && newErrors[recipientName][categoryId]) {
          delete newErrors[recipientName][categoryId][type];
          
          // Clean up empty objects
          if (Object.keys(newErrors[recipientName][categoryId]).length === 0) {
            delete newErrors[recipientName][categoryId];
          }
          if (Object.keys(newErrors[recipientName]).length === 0) {
            delete newErrors[recipientName];
          }
        }
        return newErrors;
      });
    }
  };
  
  // Generic function to get form value with fallback
  const getFormValue = (formValues, key, fallbackValue) => {
    const formValue = formValues[key];
    
    // If we have a form value, return its display value
    if (formValue) {
      return formValue.display;
    }
    
    // Otherwise check if there's a fallback value
    if (fallbackValue !== undefined && fallbackValue !== null && fallbackValue !== '') {
      return formatWithCommas(fallbackValue);
    }
    
    // Return empty string if no value found
    return '';
  };
  
  // Initialize form values when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Only initialize form values if they haven't been set already
      if (Object.keys(categoryFormValues).length === 0) {
        const categoryEntries = Object.entries(effectivenessCategories).map(([key, category]) => {
          // If custom value exists, use it; otherwise use default
          const value = customValues && customValues[key] !== undefined 
            ? customValues[key] 
            : category.costPerLife;
          return [key, value];
        });
        
        const initialCategoryValues = initializeFormValues(
          categoryEntries, 
          value => value.toLocaleString()
        );
        
        setCategoryFormValues(initialCategoryValues);
      }
      
      setCategoryErrors({});
      
      // Initialize recipient form values from customValues if they exist
      if (customValues?.recipients && Object.keys(recipientFormValues).length === 0) {
        const recipientEntries = [];
        
        Object.entries(customValues.recipients).forEach(([recipientName, recipientData]) => {
          Object.entries(recipientData).forEach(([categoryId, categoryData]) => {
            // Handle multiplier
            if (categoryData.multiplier !== undefined) {
              const fieldKey = `${recipientName}__${categoryId}__multiplier`;
              recipientEntries.push([fieldKey, categoryData.multiplier]);
            }
            
            // Handle costPerLife
            if (categoryData.costPerLife !== undefined) {
              const fieldKey = `${recipientName}__${categoryId}__costPerLife`;
              recipientEntries.push([fieldKey, categoryData.costPerLife]);
            }
          });
        });
        
        if (recipientEntries.length > 0) {
          const initialRecipientValues = initializeFormValues(
            recipientEntries,
            value => typeof value === 'number' ? formatWithCommas(value) : value
          );
          
          setRecipientFormValues(initialRecipientValues);
        }
      }
      
      setRecipientErrors({});
      
      // Initialize filtered recipients if we're on the recipients tab
      if (activeTab === 'recipients') {
        filterRecipients(searchTerm, searchTerm === '');
      }
    }
    // Remove filterRecipients, searchTerm, showOnlyCustom from dependencies to avoid infinite loops
  }, [isModalOpen, customValues]);
  
  // Update filtered recipients when customValues changes or tab changes
  useEffect(() => {
    if (activeTab === 'recipients') {
      // Avoid excessive logging
      // console.log("Filtering recipients with customValues");
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [customValues, activeTab]);
  
  // Separate effect for search and filter changes to avoid dependency loops
  useEffect(() => {
    if (activeTab === 'recipients') {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [searchTerm]);
  
  // Get value for recipient form field
  const getRecipientFormValue = (recipientName, categoryId, type) => {
    const fieldKey = `${recipientName}__${categoryId}__${type}`;
    const formValue = recipientFormValues[fieldKey];
    
    // If we have a form value, return its display value
    if (formValue) {
      return formValue.display;
    }
    
    // Otherwise check if there's a custom value in context
    const customValue = getCustomRecipientValueForUI(recipientName, categoryId, type);
    if (customValue !== '' && customValue !== null && customValue !== undefined) {
      return formatWithCommas(customValue);
    }
    
    // Return empty string if no value found
    return '';
  };
  
  // Validate all values before submission
  const validateAllValues = () => {
    // Validate category values
    const newCategoryErrors = {};
    let hasErrors = false;
    
    Object.entries(categoryFormValues).forEach(([key, valueObj]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      const rawValue = valueObj.raw;
      
      // Skip validation if value is the same as default
      if (Number(rawValue) === defaultValue) return;
      
      // Check if blank
      if (rawValue.trim() === '') {
        newCategoryErrors[key] = 'Invalid number';
        hasErrors = true;
        return;
      }
      
      // Convert to number
      const numValue = Number(rawValue);
        
      // Check if it's a valid number
      if (isNaN(numValue)) {
        newCategoryErrors[key] = 'Invalid number';
        hasErrors = true;
      }
    });
    
    setCategoryErrors(newCategoryErrors);
    
    // Validate recipient form values
    const newRecipientErrors = {};
    
    // Check recipientFormValues first (current form state)
    Object.entries(recipientFormValues).forEach(([fieldKey, valueObj]) => {
      const [recipientName, categoryId, type] = fieldKey.split('__');
      const rawValue = valueObj.raw;
      
      // Skip empty values - for recipients, empty is allowed
      if (rawValue === '') return;
      
      // Check for intermediate states or invalid numbers
      if (rawValue === '-' || rawValue === '.' || rawValue.endsWith('.') || isNaN(Number(rawValue))) {
        if (!newRecipientErrors[recipientName]) {
          newRecipientErrors[recipientName] = {};
        }
        if (!newRecipientErrors[recipientName][categoryId]) {
          newRecipientErrors[recipientName][categoryId] = {};
        }
        newRecipientErrors[recipientName][categoryId][type] = 'Invalid number';
        hasErrors = true;
      }
    });
    
    // Also check customValues.recipients for any values not in form
    if (customValues && customValues.recipients && Object.keys(customValues.recipients).length > 0) {
      Object.entries(customValues.recipients).forEach(([recipientName, recipientData]) => {
        Object.entries(recipientData).forEach(([categoryId, categoryData]) => {
          // Check multiplier values
          if (categoryData.multiplier !== undefined) {
            const multiplier = categoryData.multiplier;
            const fieldKey = `${recipientName}__${categoryId}__multiplier`;
            
            // Skip if already in form values
            if (recipientFormValues[fieldKey]) return;
            
            // Skip empty values
            if (multiplier === '') return;
            
            // Skip intermediate values
            if (typeof multiplier === 'string' && 
                (multiplier === '-' || multiplier === '.' || multiplier.endsWith('.'))) {
              if (!newRecipientErrors[recipientName]) {
                newRecipientErrors[recipientName] = {};
              }
              if (!newRecipientErrors[recipientName][categoryId]) {
                newRecipientErrors[recipientName][categoryId] = {};
              }
              newRecipientErrors[recipientName][categoryId].multiplier = 'Invalid number';
              hasErrors = true;
            }
          }
          
          // Check costPerLife values
          if (categoryData.costPerLife !== undefined) {
            const costPerLife = categoryData.costPerLife;
            const fieldKey = `${recipientName}__${categoryId}__costPerLife`;
            
            // Skip if already in form values
            if (recipientFormValues[fieldKey]) return;
            
            // Skip empty values
            if (costPerLife === '') return;
            
            // Skip intermediate values
            if (typeof costPerLife === 'string' && 
                (costPerLife === '-' || costPerLife === '.' || costPerLife.endsWith('.'))) {
              if (!newRecipientErrors[recipientName]) {
                newRecipientErrors[recipientName] = {};
              }
              if (!newRecipientErrors[recipientName][categoryId]) {
                newRecipientErrors[recipientName][categoryId] = {};
              }
              newRecipientErrors[recipientName][categoryId].costPerLife = 'Invalid number';
              hasErrors = true;
            }
          }
        });
      });
    }
    
    setRecipientErrors(newRecipientErrors);
    
    return !hasErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all values
    if (!validateAllValues()) {
      return; // Stop if there are errors
    }
    
    // Initialize customized - if customValues is null, start with empty object
    const customized = customValues ? {...customValues} : {};
    
    // Start with a clean copy but preserve recipients data if it exists
    const categoryOnlyCustomized = {};
    
    Object.entries(categoryFormValues).forEach(([key, valueObj]) => {
      const defaultValue = effectivenessCategories[key].costPerLife;
      const rawValue = valueObj.raw;
      
      // Process the value - convert string to number
      const processedValue = rawValue.trim() === '' ? 0 : Number(rawValue);
      
      // Only consider valid number inputs that are different from default
      if (!isNaN(processedValue) && processedValue !== defaultValue) {
        categoryOnlyCustomized[key] = processedValue;
      }
    });
    
    // Process recipient form values
    if (recipientFormValues && Object.keys(recipientFormValues).length > 0) {
      // Initialize recipients object if needed
      if (!customized.recipients) {
        customized.recipients = {};
      }
      
      // Process each recipient form value
      Object.entries(recipientFormValues).forEach(([fieldKey, valueObj]) => {
        // Extract the parts from the field key
        const [recipientName, categoryId, type] = fieldKey.split('__');
        const rawValue = valueObj.raw;
        
        // Skip empty values
        if (rawValue === '') return;
        
        // Process valid numbers
        if (rawValue !== '-' && rawValue !== '.' && !rawValue.endsWith('.') && !isNaN(Number(rawValue))) {
          // Initialize nested objects if needed
          if (!customized.recipients[recipientName]) {
            customized.recipients[recipientName] = {};
          }
          if (!customized.recipients[recipientName][categoryId]) {
            customized.recipients[recipientName][categoryId] = {};
          }
          
          // Store numeric value
          const numValue = Number(rawValue);
          customized.recipients[recipientName][categoryId][type] = numValue;
          
          // When setting multiplier, ensure costPerLife is cleared and vice versa
          if (type === 'multiplier') {
            delete customized.recipients[recipientName][categoryId].costPerLife;
          } else if (type === 'costPerLife') {
            delete customized.recipients[recipientName][categoryId].multiplier;
          }
        }
      });
    }
    
    // If there are any category customizations, update the object
    if (Object.keys(categoryOnlyCustomized).length > 0) {
      Object.assign(customized, categoryOnlyCustomized);
      updateValues(customized);
    } else if (customized.recipients && Object.keys(customized.recipients).length > 0) {
      // If we have no category customizations but do have recipients, just keep recipients
      updateValues(customized);
    } else {
      // If no customizations at all, reset to defaults
      resetToDefaults();
    }
    
    closeModal();
  };
  
  // Reset a specific form to default values
  const resetFormToDefaults = (formType) => {
    if (formType === 'categories') {
      const categoryEntries = Object.entries(effectivenessCategories).map(([key, category]) => {
        return [key, category.costPerLife];
      });
      
      const defaultCategoryValues = initializeFormValues(
        categoryEntries, 
        value => value >= 1000 ? value.toLocaleString() : value.toString()
      );
      
      setCategoryFormValues(defaultCategoryValues);
      setCategoryErrors({});
    } else if (formType === 'recipients') {
      // Just clear the form values for recipients
      setRecipientFormValues({});
      setRecipientErrors({});
      
      if (customValues) {
        // Create a new customValues object without recipients
        const newCustomValues = {...customValues};
        delete newCustomValues.recipients;
        
        // Only update if there are remaining category customizations
        if (Object.keys(newCustomValues).length > 0) {
          updateValues(newCustomValues);
        } else {
          // If there were only recipient customizations, we'll need to reset to null
          // but then immediately repopulate with any category values
          resetToDefaults();
          
          // Check if we have custom category values in the form
          const categoryCustomValues = {};
          Object.entries(categoryFormValues).forEach(([key, valueObj]) => {
            const defaultValue = effectivenessCategories[key].costPerLife;
            const rawValue = valueObj.raw;
            
            // Skip if value is default
            if (Number(rawValue) === defaultValue) return;
            
            // Only consider valid number inputs
            const processedValue = Number(rawValue);
            if (!isNaN(processedValue)) {
              categoryCustomValues[key] = processedValue;
            }
          });
          
          // If we have category customizations, update with those
          if (Object.keys(categoryCustomValues).length > 0) {
            updateValues(categoryCustomValues);
          }
        }
      }
    }
  };
  
  // Handle reset button for categories
  const handleCategoryReset = () => {
    resetFormToDefaults('categories');
  };
  
  // Handle reset button for recipients - only resets recipient data, preserves category values
  const handleResetRecipients = () => {
    resetFormToDefaults('recipients');
  };
  
  // Initialize form values from custom values or defaults
  const initializeFormValues = (sourceValues, formatValue, createFormState = true) => {
    const initialValues = {};
    
    if (Array.isArray(sourceValues)) {
      // Convert array of [key, value] pairs
      sourceValues.forEach(([key, value]) => {
        if (createFormState) {
          const formattedValue = formatValue(value);
          initialValues[key] = {
            raw: value.toString(),
            display: formattedValue
          };
        } else {
          initialValues[key] = value;
        }
      });
    } else if (typeof sourceValues === 'object' && sourceValues !== null) {
      // Convert object of key: value pairs
      Object.entries(sourceValues).forEach(([key, value]) => {
        if (createFormState) {
          const formattedValue = formatValue(value);
          initialValues[key] = {
            raw: value.toString(),
            display: formattedValue
          };
        } else {
          initialValues[key] = value;
        }
      });
    }
    
    return initialValues;
  };
  
  // Get custom value for a recipient's category
  const getCustomRecipientValueForUI = (recipientName, categoryId, type) => {
    try {
      // Manual check to see if the value exists
      if (customValues && 
          customValues.recipients && 
          customValues.recipients[recipientName] && 
          customValues.recipients[recipientName][categoryId] &&
          customValues.recipients[recipientName][categoryId][type] !== undefined) {
        return customValues.recipients[recipientName][categoryId][type];
      }
    } catch (error) {
      console.error("Error in getCustomRecipientValueForUI:", error);
    }
    
    return '';
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
              {activeTab === 'categories' 
                ? "Customize the cost per life values for different cause categories. These values represent the estimated cost in dollars to save one life."
                : "Customize how specific recipients' cost per life values differ from their category defaults. You can set a multiplier or specify a direct cost per life value."
              }
            </p>
            <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
              <div className="order-2 sm:order-1 flex space-x-4 border-b">
                <button
                  type="button"
                  onClick={() => handleTabChange('categories')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'categories' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Categories
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('recipients')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'recipients' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recipients
                </button>
              </div>
              <div className="order-1 sm:order-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={activeTab === 'categories' ? handleCategoryReset : handleResetRecipients}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {activeTab === 'categories' ? 'Reset Categories' : 'Reset Recipients'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto p-3 flex-grow h-[calc(100vh-15rem)] min-h-[400px]">
            {activeTab === 'categories' ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(effectivenessCategories)
                    .sort((a, b) => a[1].name.localeCompare(b[1].name))
                    .map(([key, category]) => {
                      const defaultValue = category.costPerLife;
                      const valueObj = categoryFormValues[key] || { raw: '', display: '' };
                      const hasError = categoryErrors[key];
                      
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
                                  
                                  handleNumberInputChange(key, formattedValue, setCategoryFormValues, clearCategoryError);
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
                              value={getFormValue(categoryFormValues, key, defaultValue)}
                              onChange={(e) => handleNumberInputChange(key, e.target.value, setCategoryFormValues, clearCategoryError)}
                              className={`w-full py-1 px-1.5 text-sm border rounded ${
                                hasError ? 'border-red-300 text-red-700' : 
                                isCustom ? 'border-indigo-300' : 
                                'border-gray-300'
                              }`}
                            />
                          </div>
                          {hasError && (
                            <div className="text-xs text-red-600 mt-0.5">
                              {categoryErrors[key]}
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
            ) : (
              <div>
                <div className="mb-4 flex flex-col space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search recipients..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    {searchTerm === '' ? 
                      "Showing only recipients with custom values. Use search to find others." :
                      filteredRecipients.length >= 10 ? 
                        "Showing first 10 matching recipients." : 
                        `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`
                    }
                  </div>
                </div>
                
                {filteredRecipients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm 
                      ? "No recipients found matching your search" 
                      : "No recipients with custom values found. Uncheck the filter or search for a specific recipient."}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecipients
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((recipient, index) => {
                      const recipientCategories = Object.entries(recipient.categories || {});
                      if (recipientCategories.length === 0) return null;
                      
                      // Alternate between two background colors
                      const isEven = index % 2 === 0;
                      const bgColorClass = isEven ? 'bg-white' : 'bg-gray-100';
                      
                      return (
                        <div key={recipient.name} className={`border border-gray-200 rounded-md p-3 ${bgColorClass}`}>
                          <h3 className="font-medium text-gray-800 mb-2">{recipient.name}</h3>
                          <div className="space-y-3">
                            {recipientCategories.map(([categoryId, categoryData]) => {
                              const categoryName = effectivenessCategories[categoryId]?.name || categoryId;
                              const baseCostPerLife = customValues && customValues[categoryId] !== undefined 
                                ? customValues[categoryId] 
                                : effectivenessCategories[categoryId]?.costPerLife || 0;
                                
                              // Get existing values (with null checks)
                              const defaultMultiplier = categoryData?.multiplier;
                              const defaultCostPerLife = categoryData?.costPerLife;
                              
                              // Get custom values if they exist
                              const customMultiplier = getCustomRecipientValueForUI(recipient.name, categoryId, 'multiplier');
                              const customCostPerLife = getCustomRecipientValueForUI(recipient.name, categoryId, 'costPerLife');
                              
                              // Determine if this category has any custom or default override values
                              const hasOverrides = defaultMultiplier !== undefined || 
                                                  defaultCostPerLife !== undefined ||
                                                  (customMultiplier !== undefined && customMultiplier !== '') ||
                                                  (customCostPerLife !== undefined && customCostPerLife !== '');
                              
                              // Check for form values specific to this category
                              const hasFormValues = recipientFormValues[`${recipient.name}__${categoryId}__multiplier`] !== undefined ||
                                                   recipientFormValues[`${recipient.name}__${categoryId}__costPerLife`] !== undefined;
                                                 
                              // If we're showing only custom values, and this category has no overrides or form values, skip it
                              if (!hasOverrides && !hasFormValues && showOnlyCustom) return null;
                              
                              return (
                                <div key={categoryId} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-2 rounded">
                                  <div className="text-sm text-gray-700">
                                    <span>{categoryName}</span> 
                                    <div className="text-xs text-gray-500">
                                      Category: ${baseCostPerLife.toLocaleString()}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Multiplier
                                    </label>
                                    <input
                                      type="text"
                                      inputMode="text"
                                      placeholder={
                                        // If the cost per life field has a value, show "None" instead of default
                                        customCostPerLife !== '' || getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__costPerLife`, '') !== '' ? "None" :
                                        // Otherwise show default if it exists
                                        defaultMultiplier !== undefined ? defaultMultiplier.toString() : "None"
                                      }
                                      value={getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__multiplier`, defaultMultiplier)}
                                      onChange={(e) => {
                                        const fieldKey = `${recipient.name}__${categoryId}__multiplier`;
                                        // First clear the other field if this field has a value
                                        if (e.target.value.trim() !== '') {
                                          const otherFieldKey = `${recipient.name}__${categoryId}__costPerLife`;
                                          // Set empty string in the other field instead of deleting it
                                          handleNumberInputChange(otherFieldKey, '', setRecipientFormValues, clearRecipientError);
                                        }
                                        // Then update this field
                                        handleNumberInputChange(fieldKey, e.target.value, setRecipientFormValues, clearRecipientError);
                                      }}
                                      className={`w-full py-1 px-1.5 text-sm border rounded ${
                                        recipientErrors[recipient.name]?.[categoryId]?.multiplier 
                                          ? 'border-red-300 text-red-700 bg-red-50' 
                                          : getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__multiplier`, defaultMultiplier) !== ''
                                            ? 'border-indigo-300 bg-indigo-50' 
                                            : 'border-gray-300'
                                      }`}
                                    />
                                    {recipientErrors[recipient.name]?.[categoryId]?.multiplier && (
                                      <div className="text-xs text-red-600 mt-0.5">
                                        {recipientErrors[recipient.name][categoryId].multiplier}
                                      </div>
                                    )}
                                    {/* Show default label when the value is different from the default or the other field has a value */}
                                    {defaultMultiplier !== undefined && (
                                      // Check if either:
                                      // 1. Current value exists and is different from default
                                      (recipientFormValues[`${recipient.name}__${categoryId}__multiplier`]?.raw && 
                                       Number(recipientFormValues[`${recipient.name}__${categoryId}__multiplier`].raw) !== Number(defaultMultiplier)) ||
                                      // 2. Other field has a value
                                      getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__costPerLife`, defaultCostPerLife) !== ''
                                     ) && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        Default: {defaultMultiplier}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Direct Cost Per Life
                                    </label>
                                    <div className="flex items-center">
                                      <span className="mr-1 text-gray-600 text-xs">$</span>
                                      <input
                                        type="text"
                                        inputMode="text"
                                        placeholder={
                                          // If the other field has a value, show "None" instead of default
                                          customMultiplier !== '' || getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__multiplier`, '') !== '' ? "None" :
                                          // Otherwise show default if it exists
                                          defaultCostPerLife !== undefined ? (Math.abs(defaultCostPerLife) >= 1000 ? defaultCostPerLife.toLocaleString() : defaultCostPerLife.toString()) : "None"
                                        }
                                        value={getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__costPerLife`, defaultCostPerLife)}
                                        onChange={(e) => {
                                          const fieldKey = `${recipient.name}__${categoryId}__costPerLife`;
                                          // First clear the other field if this field has a value
                                          if (e.target.value.trim() !== '') {
                                            const otherFieldKey = `${recipient.name}__${categoryId}__multiplier`;
                                            // Set empty string in the other field instead of deleting it
                                            handleNumberInputChange(otherFieldKey, '', setRecipientFormValues, clearRecipientError);
                                          }
                                          // Then update this field
                                          handleNumberInputChange(fieldKey, e.target.value, setRecipientFormValues, clearRecipientError);
                                        }}
                                        className={`w-full py-1 px-1.5 text-sm border rounded ${
                                          recipientErrors[recipient.name]?.[categoryId]?.costPerLife 
                                            ? 'border-red-300 text-red-700 bg-red-50' 
                                            : getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__costPerLife`, defaultCostPerLife) !== ''
                                              ? 'border-indigo-300 bg-indigo-50' 
                                              : 'border-gray-300'
                                        }`}
                                      />
                                    </div>
                                    {recipientErrors[recipient.name]?.[categoryId]?.costPerLife && (
                                      <div className="text-xs text-red-600 mt-0.5">
                                        {recipientErrors[recipient.name][categoryId].costPerLife}
                                      </div>
                                    )}
                                    {/* Show default label when the value is different from the default or the other field has a value */}
                                    {defaultCostPerLife !== undefined && (
                                      // Check if either:
                                      // 1. Current value exists and is different from default
                                      (recipientFormValues[`${recipient.name}__${categoryId}__costPerLife`]?.raw && 
                                       Number(recipientFormValues[`${recipient.name}__${categoryId}__costPerLife`].raw) !== Number(defaultCostPerLife)) ||
                                      // 2. Other field has a value
                                      getFormValue(recipientFormValues, `${recipient.name}__${categoryId}__multiplier`, defaultMultiplier) !== ''
                                     ) && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        Default: ${defaultCostPerLife.toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CostPerLifeEditor;