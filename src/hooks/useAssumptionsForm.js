import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { formatNumber, formatNumberWithCommas, formatWithCursorHandling } from '../utils/formatters';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';
import { getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import {
  recipientHasEffectOverrides as recipientHasOverrides,
  calculateCategoryEffectCostPerLife,
} from '../utils/assumptionsEditorHelpers';
import { calculateCostPerLife } from '../utils/effectsCalculation';

/**
 * Custom hook for managing category form state
 */
export const useCategoryForm = (defaultAssumptions, userAssumptions, getCategoryValue, isModalOpen) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // Calculate category data from defaultAssumptions
  const categoriesData = useMemo(() => {
    const result = {};
    if (!defaultAssumptions?.categories) return result;

    Object.entries(defaultAssumptions.categories).forEach(([categoryId, category]) => {
      // Calculate current cost per life (with user overrides if any)
      const currentCostPerLife = calculateCategoryEffectCostPerLife(
        categoryId,
        defaultAssumptions,
        userAssumptions,
        defaultAssumptions.globalParameters,
        getCurrentYear()
      );

      result[categoryId] = {
        name: category.name,
        costPerLife: currentCostPerLife,
      };
    });

    return result;
  }, [defaultAssumptions, userAssumptions]);

  // Initialize form values when modal opens, clear when it closes
  useEffect(() => {
    if (!isModalOpen) {
      // Clear form state when modal closes to discard unsaved changes
      setFormValues({});
      setErrors({});
    } else if (isModalOpen) {
      const initialValues = {};
      Object.entries(categoriesData).forEach(([key, category]) => {
        const customValue = getCategoryValue(key);
        const value = customValue !== null ? customValue : category.costPerLife;
        const formattedValue = formatNumber(value);
        initialValues[key] = {
          raw: value.toString(),
          display: formattedValue,
        };
      });
      setFormValues(initialValues);
      setErrors({});
    }
  }, [isModalOpen, categoriesData, getCategoryValue]);

  const clearError = useCallback(
    (key) => {
      if (errors[key]) {
        setErrors((prev) => ({
          ...prev,
          [key]: null,
        }));
      }
    },
    [errors]
  );

  const handleChange = useCallback(
    (key, value) => {
      const input = document.activeElement;
      let selectionStart = null;

      if (input && input.tagName === 'INPUT') {
        selectionStart = input.selectionStart;
      }

      const rawValue = value;
      const result = formatWithCursorHandling(value, selectionStart, input);
      const displayValue = result.value;

      setFormValues((prev) => ({
        ...prev,
        [key]: {
          raw: rawValue,
          display: displayValue,
        },
      }));

      clearError(key);
    },
    [clearError]
  );

  const reset = useCallback(() => {
    if (!defaultAssumptions?.categories) {
      throw new Error('defaultAssumptions is required for reset functionality');
    }
    const defaultValues = {};
    Object.entries(defaultAssumptions.categories).forEach(([categoryId, category]) => {
      // Calculate default cost per life from effects
      const defaultCostPerLife = calculateCostPerLife(
        category.effects,
        defaultAssumptions.globalParameters,
        getCurrentYear()
      );

      defaultValues[categoryId] = {
        raw: defaultCostPerLife.toString(),
        display: formatNumberWithCommas(defaultCostPerLife),
      };
    });
    setFormValues(defaultValues);
    setErrors({});
  }, [defaultAssumptions]);

  return {
    formValues,
    errors,
    setErrors,
    handleChange,
    reset,
  };
};

/**
 * Custom hook for managing recipient form state
 */
export const useRecipientForm = (isModalOpen) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // Clear form state when modal closes to discard unsaved changes
  useEffect(() => {
    if (!isModalOpen) {
      setFormValues({});
      setErrors({});
    }
  }, [isModalOpen]);

  const clearError = useCallback(
    (fieldKey) => {
      const [recipientName, categoryId, type] = fieldKey.split('__');

      if (errors[recipientName]?.[categoryId]?.[type]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors[recipientName] && newErrors[recipientName][categoryId]) {
            delete newErrors[recipientName][categoryId][type];

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
    },
    [errors]
  );

  const handleChange = useCallback(
    (key, value) => {
      const input = document.activeElement;
      let selectionStart = null;

      if (input && input.tagName === 'INPUT') {
        selectionStart = input.selectionStart;
      }

      const rawValue = value;
      const result = formatWithCursorHandling(value, selectionStart, input);
      const displayValue = result.value;

      setFormValues((prev) => ({
        ...prev,
        [key]: {
          raw: rawValue,
          display: displayValue,
        },
      }));

      clearError(key);
    },
    [clearError]
  );

  const reset = useCallback(() => {
    setFormValues({});
    setErrors({});
  }, []);

  return {
    formValues,
    errors,
    setErrors,
    handleChange,
    reset,
  };
};

/**
 * Custom hook for managing recipient search and filtering
 */
export const useRecipientSearch = (
  allRecipients,
  defaultAssumptions,
  userAssumptions,
  recipientFormValues,
  getRecipientValue,
  isModalOpen,
  searchTerm,
  setSearchTerm
) => {
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [showOnlyCustom, setShowOnlyCustom] = useState(true);

  // Use a ref to store recipientFormValues to avoid dependency issues
  const recipientFormValuesRef = useRef(recipientFormValues);
  useEffect(() => {
    recipientFormValuesRef.current = recipientFormValues;
  }, [recipientFormValues]);

  // Clear search state when modal closes (but keep searchTerm)
  useEffect(() => {
    if (!isModalOpen) {
      // Don't clear searchTerm - it's now managed in context
      setFilteredRecipients([]);
      setShowOnlyCustom(true);
    }
  }, [isModalOpen]);

  const filterRecipients = useCallback(
    (term, onlyCustom) => {
      let filtered = allRecipients;

      if (term) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter((recipient) => recipient.name.toLowerCase().includes(lowerTerm));
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));

        if (filtered.length > DEFAULT_RESULTS_LIMIT) {
          filtered = filtered.slice(0, DEFAULT_RESULTS_LIMIT);
        }
      } else if (onlyCustom) {
        filtered = filtered.filter((recipient) => {
          const recipientId = getRecipientId(recipient);
          const hasBuiltInOverrides =
            recipientId &&
            Object.keys(recipient.categories || {}).some((categoryId) =>
              recipientHasOverrides(defaultAssumptions, userAssumptions, recipientId, categoryId)
            );

          let hasCustomOverrides = false;
          if (recipient.categories) {
            hasCustomOverrides = Object.keys(recipient.categories).some((categoryId) => {
              const customMultiplier = getRecipientValue(recipient.name, categoryId, 'multiplier');
              const customCostPerLife = getRecipientValue(recipient.name, categoryId, 'costPerLife');
              return customMultiplier !== null || customCostPerLife !== null;
            });
          }

          const hasFormCustomValues = Object.keys(recipientFormValuesRef.current).some((fieldKey) => {
            if (fieldKey.startsWith(`${recipient.name}__`)) {
              const value = recipientFormValuesRef.current[fieldKey];
              if (value && value.raw !== '') {
                const [, categoryId, type] = fieldKey.split('__');

                let defaultValue;
                if (
                  recipient.categories &&
                  recipient.categories[categoryId] &&
                  recipient.categories[categoryId][type] !== undefined
                ) {
                  defaultValue = recipient.categories[categoryId][type];
                }

                // Check if there's a saved custom value in userAssumptions
                // Note: userAssumptions uses recipient IDs, not names
                const recipientIdForSaved = getRecipientId(recipient);
                const savedCustomValue =
                  userAssumptions &&
                  userAssumptions.recipients &&
                  userAssumptions.recipients[recipientIdForSaved] &&
                  userAssumptions.recipients[recipientIdForSaved].categories &&
                  userAssumptions.recipients[recipientIdForSaved].categories[categoryId] &&
                  userAssumptions.recipients[recipientIdForSaved].categories[categoryId][type];

                if (savedCustomValue !== undefined) {
                  if (
                    Number(value.raw) !== savedCustomValue &&
                    (defaultValue === undefined || Number(value.raw) !== defaultValue)
                  ) {
                    return true;
                  }
                } else if (defaultValue === undefined || Number(value.raw) !== defaultValue) {
                  return true;
                }
              }
            }
            return false;
          });

          return hasBuiltInOverrides || hasCustomOverrides || hasFormCustomValues;
        });

        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredRecipients(filtered);
    },
    [allRecipients, defaultAssumptions, userAssumptions, getRecipientValue]
  );

  const handleSearchChange = useCallback(
    (value) => {
      const term = value && value.target ? value.target.value : value;
      setSearchTerm(term);
      const shouldShowOnlyCustom = term === '';
      setShowOnlyCustom(shouldShowOnlyCustom);
      filterRecipients(term, shouldShowOnlyCustom);
    },
    [filterRecipients, setSearchTerm]
  );

  return {
    searchTerm,
    filteredRecipients,
    showOnlyCustom,
    filterRecipients,
    handleSearchChange,
  };
};
