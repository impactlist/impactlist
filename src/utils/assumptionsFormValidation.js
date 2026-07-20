/**
 * Form validation utilities for the assumptions editor
 * This handles user input validation with friendly error messages,
 * as opposed to dataValidation.js which does runtime data structure validation
 */

import { cleanAndParseValue, isPartialInput, validateGlobalField } from './effectValidation';
import { parseFiniteDecimal } from './numberParsing';
import { getMotionSafeScrollBehavior } from './scrollHelpers';

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

    // Only a value that passes the control's strict numeric grammar can take
    // the equality shortcut. Scientific notation and a leading plus are
    // supported, but coercible JavaScript-only syntax such as `0x64` must not
    // bypass final validation just because Number('0x64') equals the default.
    const strictlyParsedValue = parseFiniteDecimal(rawValue);
    if (strictlyParsedValue !== null && strictlyParsedValue === defaultValue) return;

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
 * Scrolls to the first invalid form field if any errors exist.
 * NumericInput/CurrencyInput/FormField all mark erroring inputs with
 * aria-invalid, so that attribute — not a styling class — is the stable hook.
 */
export const scrollToFirstError = () => {
  setTimeout(() => {
    const errorElement = document.querySelector('[aria-invalid="true"]');
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: getMotionSafeScrollBehavior(), block: 'center' });
    }
  }, 100);
};
