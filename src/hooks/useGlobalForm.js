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

// A form entry ({raw, formatted}) for a known-valid parameter value.
const buildFormEntry = (paramKey, value) => ({
  raw: value,
  formatted: formatValue(value, getParameterFormat(paramKey)),
});

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
        next[paramKey] = shouldHydrate ? buildFormEntry(paramKey, nextHydrated[paramKey]) : previous[paramKey];
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

  // How many parameters the draft would change if applied right now.
  // hasUnsavedChanges derives from this so the two can never disagree.
  const unappliedChangeCount = useMemo(() => {
    if (!globalParameters || Object.keys(formValues).length === 0) {
      return 0;
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

    return Object.keys(globalParameters).filter((paramKey) => {
      const baselineValue = getBaselineValue(paramKey);
      const currentRaw = formValues[paramKey]?.raw;
      const currentValue =
        currentRaw === '' || currentRaw === null || currentRaw === undefined
          ? (defaultGlobalParameters?.[paramKey] ?? globalParameters[paramKey])
          : currentRaw;

      return !valuesMatch(currentValue, baselineValue);
    }).length;
  }, [globalParameters, defaultGlobalParameters, userGlobalParameters, formValues]);

  const hasUnsavedChanges = unappliedChangeCount > 0;

  // Throw the whole draft away: reset every field to the value the site is
  // currently using. hydratedValuesRef holds exactly that baseline — the
  // last applied values the form hydrated from.
  const discardDraft = () => {
    const hydrated = hydratedValuesRef.current;
    if (!hydrated) {
      return;
    }

    setFormValues(
      Object.keys(hydrated).reduce((next, paramKey) => {
        next[paramKey] = buildFormEntry(paramKey, hydrated[paramKey]);
        return next;
      }, {})
    );
    setErrors({});
  };

  return {
    formValues,
    errors,
    setErrors,
    handleChange,
    hasUnsavedChanges,
    unappliedChangeCount,
    discardDraft,
  };
};
