import { useState, useEffect, useMemo, useRef } from 'react';
import { formatNumberWithCommas } from '../utils/formatters';
import { cleanAndParseValue, isPartialInput, validateGlobalField } from '../utils/effectValidation';

const valuesMatch = (valueA, valueB) => {
  if (valueA === valueB) {
    return true;
  }
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return Number.isNaN(valueA) && Number.isNaN(valueB);
  }
  return false;
};

/**
 * Custom hook for managing global parameter form state
 * @param {Object} globalParameters - Global parameters from combinedAssumptions
 * @param {Object} defaultGlobalParameters - Default global parameters
 * @param {Object} userGlobalParameters - User overrides for global parameters
 * @returns {Object} Form state and handlers
 */
export const useGlobalForm = (globalParameters, defaultGlobalParameters, userGlobalParameters) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  // Per-parameter values as of the last hydration. The inputs to this hook
  // get fresh object identities on EVERY assumptions change (normalization
  // deep-copies), so identity alone can't tell "this parameter's value
  // changed" from "something unrelated changed elsewhere in userAssumptions".
  const hydratedValuesRef = useRef(null);

  // Rehydrate form values whenever the underlying assumptions VALUES change
  // (applying edits, loading a saved set, importing a shared link, reverting
  // a change). Only the parameters whose values actually changed rehydrate —
  // un-applied drafts on other parameters must survive unrelated mutations
  // like reverting a cause change or loading a set that leaves them alone.
  useEffect(() => {
    if (!globalParameters) {
      return;
    }

    const nextHydrated = {};
    Object.keys(globalParameters).forEach((paramKey) => {
      const customValue = userGlobalParameters?.[paramKey];
      nextHydrated[paramKey] = customValue !== undefined ? customValue : globalParameters[paramKey];
    });

    const previousHydrated = hydratedValuesRef.current;
    hydratedValuesRef.current = nextHydrated;

    const isFirstHydration = previousHydrated === null;
    const changedKeys = new Set(
      Object.keys(nextHydrated).filter(
        (paramKey) => isFirstHydration || !valuesMatch(nextHydrated[paramKey], previousHydrated[paramKey])
      )
    );

    if (changedKeys.size === 0) {
      return;
    }

    setFormValues((previous) => {
      const next = {};
      Object.keys(nextHydrated).forEach((paramKey) => {
        const shouldHydrate = changedKeys.has(paramKey) || !previous[paramKey];
        next[paramKey] = shouldHydrate
          ? {
              raw: nextHydrated[paramKey],
              formatted: formatValue(nextHydrated[paramKey], getParameterFormat(paramKey)),
            }
          : previous[paramKey];
      });
      return next;
    });

    // A hydrated parameter shows a known-valid value; drop only its error.
    setErrors((previous) => {
      const next = { ...previous };
      changedKeys.forEach((paramKey) => {
        delete next[paramKey];
      });
      return next;
    });
  }, [globalParameters, userGlobalParameters]);

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

    const normalizedValue = format === 'percentage' ? cleanValue.replace('%', '').trim() : cleanValue;
    if (normalizedValue === '') {
      return '';
    }

    const { cleanValue: parsedCleanValue, numValue } = cleanAndParseValue(normalizedValue);

    if (typeof parsedCleanValue === 'string' && isPartialInput(parsedCleanValue)) {
      return parsedCleanValue;
    }

    if (!isNaN(numValue)) {
      return format === 'percentage' ? numValue / 100 : numValue;
    }

    // Preserve invalid input so validation can surface an explicit error instead of truncating via parseFloat.
    return normalizedValue;
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

  const hasUnsavedChanges = useMemo(() => {
    if (!globalParameters || Object.keys(formValues).length === 0) {
      return false;
    }

    const getBaselineValue = (paramKey) => {
      const savedValue = userGlobalParameters?.[paramKey];
      if (savedValue !== undefined) {
        return savedValue;
      }
      if (defaultGlobalParameters && defaultGlobalParameters[paramKey] !== undefined) {
        return defaultGlobalParameters[paramKey];
      }
      return globalParameters[paramKey];
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
  }, [globalParameters, defaultGlobalParameters, userGlobalParameters, formValues]);

  return {
    formValues,
    errors,
    setErrors,
    handleChange,
    hasUnsavedChanges,
  };
};
