import { useState, useEffect, useMemo } from 'react';
import { formatNumberWithCommas } from '../utils/formatters';
import { validateGlobalField } from '../utils/effectValidation';

/**
 * Custom hook for managing global parameter form state
 * @param {Object} globalParameters - Global parameters from combinedAssumptions
 * @param {Object} defaultGlobalParameters - Default global parameters
 * @param {Function} getGlobalParameter - Function to get custom global parameter value
 * @returns {Object} Form state and handlers
 */
export const useGlobalForm = (globalParameters, defaultGlobalParameters, getGlobalParameter) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form values when active and data is available
  useEffect(() => {
    if (globalParameters && Object.keys(formValues).length === 0) {
      const initialValues = {};

      // Initialize all global parameter fields
      Object.keys(globalParameters).forEach((paramKey) => {
        const customValue = getGlobalParameter(paramKey);
        const value = customValue !== null ? customValue : globalParameters[paramKey];

        initialValues[paramKey] = {
          raw: value,
          formatted: formatValue(value, getParameterFormat(paramKey)),
        };
      });

      setFormValues(initialValues);
      setErrors({}); // Start with no errors - data should be valid
    }
  }, [globalParameters, getGlobalParameter, formValues]);

  // Get the format type for a parameter
  const getParameterFormat = (paramKey) => {
    if (paramKey === 'discountRate' || paramKey === 'populationGrowthRate') {
      return 'percentage';
    }
    return 'number';
  };

  // Format value for display
  const formatValue = (value, format) => {
    if (value === '' || value === null || value === undefined) {
      return '';
    }

    if (format === 'percentage') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // Convert to percentage and round to avoid floating-point precision issues
        // Round to 10 decimal places to preserve precision while removing artifacts
        const percentValue = Math.round(numValue * 100 * 1e10) / 1e10;
        return formatNumberWithCommas(percentValue.toString());
      }
    }

    if (format === 'number') {
      // Format with thousand separators
      return formatNumberWithCommas(value.toString());
    }

    return value.toString();
  };

  // Parse value from user input
  const parseValue = (inputValue, format) => {
    // Remove commas and trim whitespace
    const cleanValue = inputValue.replace(/,/g, '').trim();

    if (cleanValue === '') {
      return '';
    }

    if (format === 'percentage') {
      // Remove % sign if present
      const percentValue = cleanValue.replace('%', '').trim();
      if (percentValue === '') {
        return '';
      }
      const numValue = parseFloat(percentValue);
      if (!isNaN(numValue)) {
        return numValue / 100; // Convert percentage to decimal
      }
    }

    if (format === 'number') {
      const numValue = parseFloat(cleanValue);
      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    return cleanValue;
  };

  // Handle form value changes
  const handleChange = (paramKey, inputValue) => {
    const format = getParameterFormat(paramKey);
    const parsedValue = parseValue(inputValue, format);

    setFormValues((prev) => ({
      ...prev,
      [paramKey]: {
        raw: parsedValue,
        formatted: inputValue,
      },
    }));

    // Validate this field immediately - use the parsed (raw) value for validation
    const error = validateGlobalField(paramKey, parsedValue);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[paramKey] = error;
      } else {
        delete newErrors[paramKey];
      }
      return newErrors;
    });
  };

  // Reset form to default values
  const reset = () => {
    if (!defaultGlobalParameters) {
      throw new Error('defaultGlobalParameters is required for reset functionality');
    }

    const resetValues = {};

    Object.keys(globalParameters).forEach((paramKey) => {
      const defaultValue = defaultGlobalParameters[paramKey];
      resetValues[paramKey] = {
        raw: defaultValue,
        formatted: formatValue(defaultValue, getParameterFormat(paramKey)),
      };
    });

    setFormValues(resetValues);
    setErrors({});
  };

  const hasUnsavedChanges = useMemo(() => {
    if (!globalParameters || Object.keys(formValues).length === 0) {
      return false;
    }

    const getBaselineValue = (paramKey) => {
      const savedValue = getGlobalParameter(paramKey);
      if (savedValue !== null && savedValue !== undefined) {
        return savedValue;
      }
      if (defaultGlobalParameters && defaultGlobalParameters[paramKey] !== undefined) {
        return defaultGlobalParameters[paramKey];
      }
      return globalParameters[paramKey];
    };

    const valuesMatch = (currentValue, baselineValue) => {
      if (currentValue === baselineValue) {
        return true;
      }
      if (typeof currentValue === 'number' && typeof baselineValue === 'number') {
        return Number.isNaN(currentValue) && Number.isNaN(baselineValue);
      }
      return false;
    };

    return Object.keys(globalParameters).some((paramKey) => {
      const baselineValue = getBaselineValue(paramKey);
      const currentRaw = formValues[paramKey]?.raw;
      const currentValue =
        currentRaw === '' || currentRaw === null || currentRaw === undefined
          ? (defaultGlobalParameters?.[paramKey] ?? globalParameters[paramKey])
          : currentRaw;

      return !valuesMatch(currentValue, baselineValue);
    });
  }, [globalParameters, defaultGlobalParameters, getGlobalParameter, formValues]);

  return {
    formValues,
    errors,
    setErrors,
    handleChange,
    reset,
    hasUnsavedChanges,
  };
};
