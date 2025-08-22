/**
 * Form validation utilities for the assumptions editor
 * This handles user input validation with friendly error messages,
 * as opposed to dataValidation.js which does runtime data structure validation
 */

import { cleanAndParseValue, validateGlobalField } from './effectValidation';
import { calculateCostPerLife } from './effectsCalculation';
import { getCurrentYear } from './donationDataHelpers';

/**
 * Validates category form values
 * @param {Object} formValues - The form values to validate
 * @param {Object} defaultAssumptions - Default assumptions with category data
 * @returns {Object} - { errors: Object, hasErrors: boolean }
 */
export const validateCategoryValues = (formValues, defaultAssumptions) => {
  const errors = {};
  let hasErrors = false;

  Object.entries(formValues).forEach(([key, valueObj]) => {
    const category = defaultAssumptions?.categories?.[key];
    if (!category) return;

    // Calculate default cost per life from effects
    const defaultValue = calculateCostPerLife(category.effects, defaultAssumptions.globalParameters, getCurrentYear());
    const rawValue = valueObj.raw;

    // Skip validation if value is the same as default or if empty (empty = use default)
    if (Number(rawValue) === defaultValue) return;

    // Empty values are valid - they'll use the default value
    if (rawValue === null || rawValue === undefined || (typeof rawValue === 'string' && rawValue.trim() === '')) {
      return;
    }

    // Allow minus sign only during input, not for saving
    if (rawValue === '-') {
      errors[key] = 'Please enter a complete number';
      hasErrors = true;
      return;
    }

    // Use cleanAndParseValue to properly validate the entire string
    const { numValue } = cleanAndParseValue(rawValue);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      errors[key] = 'Invalid number';
      hasErrors = true;
    }
    // Check if value is zero
    else if (numValue === 0) {
      errors[key] = 'Value cannot be zero';
      hasErrors = true;
    }
  });

  return { errors, hasErrors };
};

/**
 * Validates recipient form values
 * @param {Object} formValues - The form values to validate
 * @returns {Object} - { errors: Object, hasErrors: boolean }
 */
export const validateRecipientValues = (formValues) => {
  const errors = {};
  let hasErrors = false;

  Object.entries(formValues).forEach(([fieldKey, valueObj]) => {
    const [recipientName, categoryId, type] = fieldKey.split('__');
    const rawValue = valueObj.raw;

    // Skip empty values - for recipients, empty is allowed
    if (rawValue === null || rawValue === undefined || rawValue === '') return;

    // Use cleanAndParseValue to properly validate the entire string
    const { cleanValue, numValue } = cleanAndParseValue(rawValue);

    // Check for intermediate states or invalid numbers
    if (cleanValue === '-' || cleanValue === '.' || cleanValue.endsWith('.') || isNaN(numValue)) {
      if (!errors[recipientName]) {
        errors[recipientName] = {};
      }
      if (!errors[recipientName][categoryId]) {
        errors[recipientName][categoryId] = {};
      }

      const errorMessage = cleanValue === '-' ? 'Please enter a complete number' : 'Invalid number';
      errors[recipientName][categoryId][type] = errorMessage;
      hasErrors = true;
    }
    // Check if value is zero (neither costPerLife nor multiplier can be zero)
    else if (numValue === 0) {
      if (!errors[recipientName]) {
        errors[recipientName] = {};
      }
      if (!errors[recipientName][categoryId]) {
        errors[recipientName][categoryId] = {};
      }
      errors[recipientName][categoryId][type] = 'Value cannot be zero';
      hasErrors = true;
    }
  });

  return { errors, hasErrors };
};

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
