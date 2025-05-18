import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCostPerLife } from './CostPerLifeContext';
import { getAllRecipients, getAllCategories } from '../utils/donationDataHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';

// Import shared components
import DefaultValuesSection from './costperlife/DefaultValuesSection';
import RecipientValuesSection from './costperlife/RecipientValuesSection';

const CostPerLifeEditor = () => {
  const { customValues, resetToDefaults, updateValues, isModalOpen, closeModal } = useCostPerLife();

  // Local state for form values and errors
  const [categoryFormValues, setCategoryFormValues] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});
  const [recipientFormValues, setRecipientFormValues] = useState({});
  const [recipientErrors, setRecipientErrors] = useState({});
  const [activeTab, setActiveTab] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [showOnlyCustom, setShowOnlyCustom] = useState(true);

  const allRecipients = useMemo(() => getAllRecipients(), []);
  const allCategories = useMemo(() => {
    // Convert to format expected by the component
    const categories = {};
    getAllCategories().forEach((category) => {
      categories[category.id] = {
        name: category.name,
        costPerLife: category.costPerLife,
      };
    });
    return categories;
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
  const filterRecipients = useCallback(
    (term, onlyCustom) => {
      let filtered = allRecipients;

      // Filter by search term if provided
      if (term) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter((recipient) => recipient.name.toLowerCase().includes(lowerTerm));

        // Sort alphabetically
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));

        // Limit to first N results when searching
        if (filtered.length > DEFAULT_RESULTS_LIMIT) {
          filtered = filtered.slice(0, DEFAULT_RESULTS_LIMIT);
        }
      } else if (onlyCustom) {
        // When no search term, filter to only show recipients with custom values
        filtered = filtered.filter((recipient) => {
          // Check if recipient has built-in overrides
          const hasBuiltInOverrides = Object.values(recipient.categories || {}).some(
            (cat) => cat.multiplier !== undefined || cat.costPerLife !== undefined
          );

          // Check if recipient has meaningful custom overrides from context
          let hasCustomOverrides = false;
          if (customValues && customValues.recipients && customValues.recipients[recipient.name]) {
            // Check each category to see if there's at least one with a non-default value
            hasCustomOverrides = Object.entries(customValues.recipients[recipient.name]).some(
              ([categoryId, categoryData]) => {
                // If we have a multiplier value
                if (categoryData.multiplier !== undefined) {
                  // Check if it's different from default
                  const defaultMultiplier =
                    recipient.categories &&
                    recipient.categories[categoryId] &&
                    recipient.categories[categoryId].multiplier;

                  return defaultMultiplier === undefined || categoryData.multiplier !== defaultMultiplier;
                }

                // If we have a costPerLife value
                if (categoryData.costPerLife !== undefined) {
                  // Check if it's different from default
                  const defaultCostPerLife =
                    recipient.categories &&
                    recipient.categories[categoryId] &&
                    recipient.categories[categoryId].costPerLife;

                  return defaultCostPerLife === undefined || categoryData.costPerLife !== defaultCostPerLife;
                }

                return false;
              }
            );
          }

          // Check if recipient has custom values in the current form that differ from defaults
          const hasFormCustomValues = Object.keys(recipientFormValues).some((fieldKey) => {
            // Check if this field key belongs to this recipient
            if (fieldKey.startsWith(`${recipient.name}__`)) {
              const value = recipientFormValues[fieldKey];
              if (value && value.raw !== '') {
                // Get the parts from the field key
                const [, categoryId, type] = fieldKey.split('__');

                // Get default value from recipient data if it exists
                let defaultValue;
                if (
                  recipient.categories &&
                  recipient.categories[categoryId] &&
                  recipient.categories[categoryId][type] !== undefined
                ) {
                  defaultValue = recipient.categories[categoryId][type];
                }

                // Check if we have a saved custom value in context
                const savedCustomValue =
                  customValues &&
                  customValues.recipients &&
                  customValues.recipients[recipient.name] &&
                  customValues.recipients[recipient.name][categoryId] &&
                  customValues.recipients[recipient.name][categoryId][type];

                // If there's a saved custom value, check if the form value is different from it
                if (savedCustomValue !== undefined) {
                  // Only include if form value is different from both default AND saved value
                  if (
                    Number(value.raw) !== savedCustomValue &&
                    (defaultValue === undefined || Number(value.raw) !== defaultValue)
                  ) {
                    return true;
                  }
                }
                // Otherwise check against the default
                else if (defaultValue === undefined || Number(value.raw) !== defaultValue) {
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
    },
    [allRecipients, customValues, recipientFormValues]
  );

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

  // Format a number with commas
  const formatWithCommas = (value) => {
    // If value is null or undefined, return empty string
    if (value === null || value === undefined) return '';

    // If value is empty string, just return it
    if (value === '') return '';

    try {
      const rawValue = value.toString().replace(/,/g, '');

      // Check if it's a valid number and not in an intermediate state
      const isValidNumber =
        rawValue !== '' && rawValue !== '-' && rawValue !== '.' && !rawValue.endsWith('.') && !isNaN(Number(rawValue));

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
      console.error('Error in formatWithCommas:', error, 'Value was:', value);
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
    setFormValues((prev) => ({
      ...prev,
      [key]: {
        raw: rawValue,
        display: displayValue,
      },
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
      setCategoryErrors((prev) => ({
        ...prev,
        [key]: null,
      }));
    }
  };

  // Generic function to clear recipient errors
  const clearRecipientError = (fieldKey) => {
    const [recipientName, categoryId, type] = fieldKey.split('__');

    if (recipientErrors[recipientName]?.[categoryId]?.[type]) {
      setRecipientErrors((prev) => {
        const newErrors = { ...prev };
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

  // Initialize form values when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Only initialize form values if they haven't been set already
      if (Object.keys(categoryFormValues).length === 0) {
        const categoryEntries = Object.entries(allCategories).map(([key, category]) => {
          // If custom value exists, use it; otherwise use default
          const value = customValues && customValues[key] !== undefined ? customValues[key] : category.costPerLife;
          return [key, value];
        });

        const initialCategoryValues = initializeFormValues(categoryEntries, formatWithCommas);

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
          const initialRecipientValues = initializeFormValues(recipientEntries, formatWithCommas);

          setRecipientFormValues(initialRecipientValues);
        }
      }

      setRecipientErrors({});

      // Initialize filtered recipients if we're on the recipients tab
      if (activeTab === 'recipients') {
        filterRecipients(searchTerm, searchTerm === '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, customValues, allCategories, activeTab, searchTerm, filterRecipients]);

  // Update filtered recipients when customValues changes or tab changes
  useEffect(() => {
    if (activeTab === 'recipients') {
      // Avoid excessive logging
      // console.log("Filtering recipients with customValues");
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [customValues, activeTab, filterRecipients, searchTerm]);

  // Separate effect for search and filter changes to avoid dependency loops
  useEffect(() => {
    if (activeTab === 'recipients') {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [searchTerm, activeTab, filterRecipients]);

  // Validate all values before submission
  const validateAllValues = () => {
    // Validate category values
    const newCategoryErrors = {};
    let hasErrors = false;

    Object.entries(categoryFormValues).forEach(([key, valueObj]) => {
      const defaultValue = allCategories[key].costPerLife;
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
      // Check if value is zero
      else if (numValue === 0) {
        newCategoryErrors[key] = 'Cost per life cannot be zero';
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
      // Check if value is zero for cost per life fields
      else if (type === 'costPerLife' && Number(rawValue) === 0) {
        if (!newRecipientErrors[recipientName]) {
          newRecipientErrors[recipientName] = {};
        }
        if (!newRecipientErrors[recipientName][categoryId]) {
          newRecipientErrors[recipientName][categoryId] = {};
        }
        newRecipientErrors[recipientName][categoryId][type] = 'Cost per life cannot be zero';
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
            if (
              typeof multiplier === 'string' &&
              (multiplier === '-' || multiplier === '.' || multiplier.endsWith('.'))
            ) {
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
            if (
              typeof costPerLife === 'string' &&
              (costPerLife === '-' || costPerLife === '.' || costPerLife.endsWith('.'))
            ) {
              if (!newRecipientErrors[recipientName]) {
                newRecipientErrors[recipientName] = {};
              }
              if (!newRecipientErrors[recipientName][categoryId]) {
                newRecipientErrors[recipientName][categoryId] = {};
              }
              newRecipientErrors[recipientName][categoryId].costPerLife = 'Invalid number';
              hasErrors = true;
            }
            // Check if value is zero
            else if (costPerLife === 0) {
              if (!newRecipientErrors[recipientName]) {
                newRecipientErrors[recipientName] = {};
              }
              if (!newRecipientErrors[recipientName][categoryId]) {
                newRecipientErrors[recipientName][categoryId] = {};
              }
              newRecipientErrors[recipientName][categoryId].costPerLife = 'Cost per life cannot be zero';
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
    const customized = customValues ? { ...customValues } : {};

    // Start with a clean copy but preserve recipients data if it exists
    const categoryOnlyCustomized = {};

    Object.entries(categoryFormValues).forEach(([key, valueObj]) => {
      const defaultValue = allCategories[key].costPerLife;
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

        // Check if this is an empty value
        if (rawValue === '') {
          // If there's already a saved value for this recipient+category+type, we need to explicitly remove it
          if (
            customized &&
            customized.recipients &&
            customized.recipients[recipientName] &&
            customized.recipients[recipientName][categoryId] &&
            customized.recipients[recipientName][categoryId][type] !== undefined
          ) {
            delete customized.recipients[recipientName][categoryId][type];

            // Clean up empty objects
            if (Object.keys(customized.recipients[recipientName][categoryId]).length === 0) {
              delete customized.recipients[recipientName][categoryId];
            }
            if (
              customized.recipients[recipientName] &&
              Object.keys(customized.recipients[recipientName]).length === 0
            ) {
              delete customized.recipients[recipientName];
            }
            if (customized.recipients && Object.keys(customized.recipients).length === 0) {
              delete customized.recipients;
            }
          }
          return;
        }

        // Process valid numbers
        if (rawValue !== '-' && rawValue !== '.' && !rawValue.endsWith('.') && !isNaN(Number(rawValue))) {
          // Get default value if it exists
          let defaultValue;
          try {
            const recipient = allRecipients.find((r) => r.name === recipientName);
            if (recipient && recipient.categories && recipient.categories[categoryId]) {
              defaultValue = recipient.categories[categoryId][type];
            }
          } catch (e) {
            // If anything goes wrong, just proceed without a default value
            console.error('Error getting default value:', e);
          }

          // Skip if the value matches the default
          const numValue = Number(rawValue);
          if (defaultValue !== undefined && numValue === defaultValue) {
            // If there's already a saved value, we need to explicitly remove it
            if (
              customized &&
              customized.recipients &&
              customized.recipients[recipientName] &&
              customized.recipients[recipientName][categoryId] &&
              customized.recipients[recipientName][categoryId][type] !== undefined
            ) {
              delete customized.recipients[recipientName][categoryId][type];

              // Clean up empty objects
              if (Object.keys(customized.recipients[recipientName][categoryId]).length === 0) {
                delete customized.recipients[recipientName][categoryId];
              }
              if (
                customized.recipients[recipientName] &&
                Object.keys(customized.recipients[recipientName]).length === 0
              ) {
                delete customized.recipients[recipientName];
              }
              if (customized.recipients && Object.keys(customized.recipients).length === 0) {
                delete customized.recipients;
              }
            }
            return;
          }

          // Initialize recipients object if it doesn't exist anymore
          if (!customized.recipients) {
            customized.recipients = {};
          }

          // Initialize nested objects if needed
          if (!customized.recipients[recipientName]) {
            customized.recipients[recipientName] = {};
          }
          if (!customized.recipients[recipientName][categoryId]) {
            customized.recipients[recipientName][categoryId] = {};
          }

          // Store numeric value
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
      const categoryEntries = Object.entries(allCategories).map(([key, category]) => {
        return [key, category.costPerLife];
      });

      const defaultCategoryValues = initializeFormValues(categoryEntries, (value) =>
        value >= 1000 ? value.toLocaleString() : value.toString()
      );

      setCategoryFormValues(defaultCategoryValues);
      setCategoryErrors({});
    } else if (formType === 'recipients') {
      // Just clear the form values for recipients
      setRecipientFormValues({});
      setRecipientErrors({});

      if (customValues) {
        // Create a new customValues object without recipients
        const newCustomValues = { ...customValues };
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
            const defaultValue = allCategories[key].costPerLife;
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
          // Ensure value is a number for formatting
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          const formattedValue = formatValue(numValue);
          initialValues[key] = {
            raw: numValue.toString(),
            display: formattedValue,
          };
        } else {
          initialValues[key] = value;
        }
      });
    } else if (typeof sourceValues === 'object' && sourceValues !== null) {
      // Convert object of key: value pairs
      Object.entries(sourceValues).forEach(([key, value]) => {
        if (createFormState) {
          // Ensure value is a number for formatting
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          const formattedValue = formatValue(numValue);
          initialValues[key] = {
            raw: numValue.toString(),
            display: formattedValue,
          };
        } else {
          initialValues[key] = value;
        }
      });
    }

    return initialValues;
  };

  // Helper function to handle category form value change
  const handleCategoryFormChange = (key, value) => {
    handleNumberInputChange(key, value, setCategoryFormValues, clearCategoryError);
  };

  // Helper function to handle recipient form value change
  const handleRecipientFormChange = (key, value) => {
    handleNumberInputChange(key, value, setRecipientFormValues, clearRecipientError);
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
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {activeTab === 'categories'
                ? 'Customize the cost per life values for different cause categories. These values represent the estimated cost in dollars to save one life.'
                : "Customize how specific recipients' cost per life values differ from their category defaults. You can set a multiplier or specify a direct cost per life value."}
            </p>
            <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
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
              <div className="order-2 sm:order-1 flex space-x-4 border-b mt-3 sm:mt-0">
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
            </div>
          </div>

          {/* Tab content container */}
          <div className="overflow-y-auto p-3 flex-grow h-[calc(100vh-15rem)] min-h-[400px]">
            {activeTab === 'categories' ? (
              <form onSubmit={handleSubmit}>
                <DefaultValuesSection
                  allCategories={allCategories}
                  formValues={categoryFormValues}
                  errors={categoryErrors}
                  onChange={handleCategoryFormChange}
                />
              </form>
            ) : (
              <RecipientValuesSection
                filteredRecipients={filteredRecipients}
                formValues={recipientFormValues}
                errors={recipientErrors}
                allCategories={allCategories}
                customValues={customValues}
                onChange={handleRecipientFormChange}
                onSearch={handleSearchChange}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CostPerLifeEditor;
