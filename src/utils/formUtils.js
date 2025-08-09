import { formatNumberWithCommas } from './formatters';

/**
 * Get form value with formatting, with fallback to default value
 * @param {Object} formValues - Form values object
 * @param {string} key - Field key
 * @param {*} defaultValue - Default value if no form value exists
 * @returns {string} Formatted display value
 */
export const getFormValue = (formValues, key, defaultValue) => {
  const formValue = formValues[key];

  // If we have a form value, return its display value
  if (formValue) {
    return formValue.display || formValue.formatted || '';
  }

  // Otherwise check if there's a fallback value
  if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
    return formatNumberWithCommas(defaultValue);
  }

  // Return empty string if no value found
  return '';
};

/**
 * Format a parameter value based on its type
 * @param {*} value - The value to format
 * @param {string} format - Format type ('percentage', 'number', etc.)
 * @returns {string} Formatted value
 */
export const formatParameterValue = (value, format = 'number') => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (format === 'percentage') {
    // For percentage, multiply by 100 and format with commas
    const percentValue = parseFloat(value) * 100;
    return formatNumberWithCommas(percentValue.toString());
  }

  if (format === 'number') {
    // Format numbers with commas
    return formatNumberWithCommas(value.toString());
  }

  return value.toString();
};

/**
 * Check if a value is custom (different from default)
 * @param {*} currentValue - Current value
 * @param {*} defaultValue - Default value to compare against
 * @returns {boolean} True if value is custom
 */
export const isCustomValue = (currentValue, defaultValue) => {
  // Handle empty values
  if (currentValue === '' || currentValue === null || currentValue === undefined) {
    return false;
  }

  // Convert to numbers for comparison if possible
  const current = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
  const defaultNum = typeof defaultValue === 'string' ? parseFloat(defaultValue) : defaultValue;

  // Check if they're different
  return current !== defaultNum;
};
