import { useState, useEffect, useCallback } from 'react';
import { formatNumber, formatNumberWithCommas, formatWithCursorHandling } from '../utils/formatters';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';
import { getRecipientId, recipientHasEffectOverrides } from '../utils/donationDataHelpers';

/**
 * Custom hook for managing category form state
 */
export const useCategoryForm = (allCategories, getCategoryValue, isModalOpen, defaultCategories) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form values when modal opens or categories change
  useEffect(() => {
    if (isModalOpen) {
      const initialValues = {};
      Object.entries(allCategories).forEach(([key, category]) => {
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
  }, [isModalOpen, allCategories, getCategoryValue]);

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
    if (!defaultCategories) {
      throw new Error('defaultCategories is required for reset functionality');
    }
    const defaultValues = {};
    Object.entries(defaultCategories).forEach(([key, category]) => {
      defaultValues[key] = {
        raw: category.costPerLife.toString(),
        display: formatNumberWithCommas(category.costPerLife),
      };
    });
    setFormValues(defaultValues);
    setErrors({});
  }, [defaultCategories]);

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
export const useRecipientForm = () => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

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
export const useRecipientSearch = (allRecipients, combinedAssumptions, recipientFormValues, getRecipientValue) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [showOnlyCustom, setShowOnlyCustom] = useState(true);

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
              recipientHasEffectOverrides(combinedAssumptions, recipientId, categoryId)
            );

          let hasCustomOverrides = false;
          if (recipient.categories) {
            hasCustomOverrides = Object.keys(recipient.categories).some((categoryId) => {
              const customMultiplier = getRecipientValue(recipient.name, categoryId, 'multiplier');
              const customCostPerLife = getRecipientValue(recipient.name, categoryId, 'costPerLife');
              return customMultiplier !== null || customCostPerLife !== null;
            });
          }

          const hasFormCustomValues = Object.keys(recipientFormValues).some((fieldKey) => {
            if (fieldKey.startsWith(`${recipient.name}__`)) {
              const value = recipientFormValues[fieldKey];
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

                const savedCustomValue =
                  combinedAssumptions &&
                  combinedAssumptions.recipients &&
                  combinedAssumptions.recipients[recipient.name] &&
                  combinedAssumptions.recipients[recipient.name][categoryId] &&
                  combinedAssumptions.recipients[recipient.name][categoryId][type];

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
    [allRecipients, combinedAssumptions, recipientFormValues, getRecipientValue]
  );

  const handleSearchChange = useCallback(
    (value) => {
      const term = value && value.target ? value.target.value : value;
      setSearchTerm(term);
      const shouldShowOnlyCustom = term === '';
      setShowOnlyCustom(shouldShowOnlyCustom);
      filterRecipients(term, shouldShowOnlyCustom);
    },
    [filterRecipients]
  );

  return {
    searchTerm,
    filteredRecipients,
    showOnlyCustom,
    filterRecipients,
    handleSearchChange,
  };
};
