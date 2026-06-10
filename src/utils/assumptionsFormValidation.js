/**
 * Form validation utilities for the assumptions editor
 * This handles user input validation with friendly error messages,
 * as opposed to dataValidation.js which does runtime data structure validation
 */

import { cleanAndParseValue, isPartialInput, validateGlobalField } from './effectValidation';

/**
 * Validates global parameter form values
 * @param {Object} formValues - The form values to validate
 * @param {Object} globalParameters - Global parameters with default values
 * @returns {Object} - { errors: Object, hasErrors: boolean }
 */
export const validateGlobalParameterValues = (formValues, globalParameters) => {
  const errors = {};
  let hasErrors = false;

  Object.entries(formValues).forEach(([paramKey, valueObj]) => {
    const defaultValue = globalParameters[paramKey];
    const rawValue = valueObj.raw;

    // Skip validation if value is the same as default or if empty (empty = use default)
    if (Number(rawValue) === defaultValue) return;

    // Empty values are valid - they'll use the default value
    if (rawValue === null || rawValue === undefined || (typeof rawValue === 'string' && rawValue.trim() === '')) {
      return;
    }

    const { cleanValue } = cleanAndParseValue(rawValue);
    if (typeof cleanValue === 'string' && isPartialInput(cleanValue)) {
      errors[paramKey] = 'Please enter a complete number';
      hasErrors = true;
      return;
    }

    // Use validateGlobalField for consistent validation
    const validationError = validateGlobalField(paramKey, rawValue);
    if (validationError) {
      errors[paramKey] = validationError;
      hasErrors = true;
    }
  });

  return { errors, hasErrors };
};

/**
 * Scrolls to the first error element if any errors exist
 */
export const scrollToFirstError = () => {
  setTimeout(() => {
    const errorElement = document.querySelector('.border-red-300');
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};
