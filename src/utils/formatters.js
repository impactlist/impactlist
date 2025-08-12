import {
  TRILLION,
  BILLION,
  MILLION,
  THOUSAND,
  HUNDRED,
  TEN,
  SMALL_NUMBER_THRESHOLD,
  HUNDRED_LIVES,
  TEN_LIVES,
  ONE_LIFE,
  FRACTION_LIFE_THRESHOLD,
} from './constants';

/**
 * Add one digit after the decimal if the number is < 100 and is a non-integer, otherwise round to integer.
 * @param {number} num - A non-negative number to format
 * @returns {string} - Formatted number
 */
export const formatNumberWithNoMoreThanOneDecimal = (num) => {
  // Round to 1 decimal place first
  const rounded = Math.round(num * 10) / 10;

  // If the rounded value is >= 100 or is effectively an integer, show as integer
  if (rounded >= 100 || Number.isInteger(rounded)) {
    return Math.round(rounded).toString();
  } else {
    return rounded.toFixed(1);
  }
};

/**
 * Format numbers with commas and suffixes for large values
 * @param {number} num - The number to format
 * @returns {string} - Formatted number with commas and optional suffixes
 */
export const formatNumber = (num) => {
  const absNum = Math.abs(num);
  const isNegative = num < 0;
  let formattedValue;

  // Handle extremely large numbers with B/T suffixes
  if (absNum >= TRILLION) {
    // Trillions - use 2 significant digits
    const value = absNum / TRILLION;
    // Format integer or decimal value.
    let valueStr = formatNumberWithNoMoreThanOneDecimal(value);
    // Add commas for large prefix values (e.g., 1,234.5T)
    if (value >= THOUSAND) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `${valueStr}T`;
  } else if (absNum >= BILLION) {
    // Billions - use 2 significant digits
    const value = absNum / BILLION;
    // Format integer or decimal value
    let valueStr = formatNumberWithNoMoreThanOneDecimal(value);
    // Add commas for large prefix values (e.g., 1,234.5B)
    if (value >= THOUSAND) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `${valueStr}B`;
  } else if (absNum >= HUNDRED) {
    // For regular numbers, use standard comma formatting
    formattedValue = Math.round(absNum).toLocaleString('en-US');
  } else {
    // Using toLocaleString would round to 0 for very small numbers, so we use toString instead
    formattedValue = absNum.toString();
  }

  return isNegative ? `-${formattedValue}` : formattedValue;
};

/**
 * Format a number with commas without any suffixes
 * This function accepts any input and preserves non-numeric input
 * Useful for formatting while maintaining cursor position
 *
 * @param {string|number} value - The value to format
 * @returns {string} - The formatted string with commas
 */
export const formatNumberWithCommas = (value) => {
  // Handle non-string values
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    value = String(value);
  }

  // If the value is empty, just return it
  if (value === '') return '';

  // If it's just a minus sign, return it as is
  if (value === '-') return '-';

  // Remove commas and get only valid characters for processing
  const cleanValue = value.replace(/,/g, '');

  // If it's not a valid number format (could be in-progress typing), return as is
  // Allow digits, minus sign, and decimal point
  if (!/^-?\d*\.?\d*$/.test(cleanValue)) {
    return value;
  }

  // If it's empty after cleaning, return empty string
  if (cleanValue === '' || cleanValue === '-' || cleanValue === '.' || cleanValue === '-.') {
    return cleanValue;
  }

  // Parse the numeric value
  const numericValue = parseFloat(cleanValue);

  // If it's NaN, return the clean value (for partial inputs like "1.")
  if (isNaN(numericValue)) {
    return cleanValue;
  }

  // Format with commas - preserve decimal places if present
  const hasDecimal = cleanValue.includes('.');
  if (hasDecimal) {
    // Split on decimal to handle integer and decimal parts separately
    const parts = cleanValue.split('.');
    let integerPart = parts[0];

    // Only format the integer part if it has actual digits
    if (integerPart && integerPart !== '' && integerPart !== '-') {
      const intValue = parseInt(integerPart);
      if (!isNaN(intValue)) {
        integerPart = intValue.toLocaleString('en-US');
      }
    }

    const decimalPart = parts[1] || '';
    return integerPart + '.' + decimalPart;
  } else {
    // No decimal, format normally
    return numericValue.toLocaleString('en-US');
  }
};

/**
 * Calculate the new cursor position after formatting a value with commas
 * This maintains the cursor position relative to the digits, not the commas
 *
 * @param {string} oldValue - The original value before formatting
 * @param {string} newValue - The formatted value with commas
 * @param {number} oldPosition - The cursor position in the original value
 * @returns {number} - The new cursor position in the formatted value
 */
export const calculateCursorPosition = (oldValue, newValue, oldPosition) => {
  if (oldPosition === null || oldPosition === undefined) return null;

  // If values are the same, no adjustment needed
  if (oldValue === newValue) return oldPosition;

  // Extract text before the cursor
  const valueBeforeCursor = oldValue.substring(0, oldPosition);

  // Count digits, decimal points, and determine if there's a minus sign before the cursor
  const digitsBeforeCursor = valueBeforeCursor.replace(/[^\d]/g, '').length;
  const hasMinusBeforeCursor = valueBeforeCursor.includes('-');
  const hasDecimalBeforeCursor = valueBeforeCursor.includes('.');

  // Special case: if cursor is just after the minus sign
  if (hasMinusBeforeCursor && digitsBeforeCursor === 0 && !hasDecimalBeforeCursor) {
    return 1; // Position right after the minus sign
  }

  // Special case: if cursor is just after a decimal point
  if (hasDecimalBeforeCursor && valueBeforeCursor.endsWith('.')) {
    // Find the position of the decimal in the new value
    const decimalPos = newValue.indexOf('.');
    return decimalPos >= 0 ? decimalPos + 1 : newValue.length;
  }

  // Find position in new formatted value with same number of digits
  let newPosition = 0;
  let digitCount = 0;
  let foundDecimal = false;

  // Find corresponding position in formatted value
  for (let i = 0; i < newValue.length; i++) {
    if (newValue[i] === '-') {
      continue;
    }

    if (newValue[i] === '.') {
      foundDecimal = true;
      // If we had a decimal before cursor and we've counted all digits before it
      if (hasDecimalBeforeCursor && digitCount === digitsBeforeCursor) {
        newPosition = i + 1;
        break;
      }
      continue;
    }

    if (/\d/.test(newValue[i])) {
      digitCount++;
      // Check if we've reached the right position
      if (digitCount === digitsBeforeCursor) {
        // If there was a decimal before cursor in old value, we need to be past the decimal in new value
        if (!hasDecimalBeforeCursor || foundDecimal) {
          newPosition = i + 1;
          break;
        }
      }
    }
  }

  // If we didn't find the right position (e.g., cursor was at the end)
  if (newPosition === 0 && (digitsBeforeCursor > 0 || hasDecimalBeforeCursor)) {
    newPosition = newValue.length;
  }

  return newPosition;
};

/**
 * Set the cursor position in an input element
 *
 * @param {HTMLInputElement} inputElement - The input element to set the cursor position in
 * @param {number} position - The position to set the cursor to
 */
export const setCursorPosition = (inputElement, position) => {
  if (!inputElement || position === null || typeof position !== 'number') return;

  // Use setTimeout to ensure the DOM has updated
  setTimeout(() => {
    if (inputElement && document.activeElement === inputElement) {
      try {
        inputElement.setSelectionRange(position, position);
      } catch (e) {
        console.error('Error setting cursor position:', e);
      }
    }
  }, 0);
};

/**
 * Format a value with commas and update cursor position in one operation
 * This is a utility function that combines formatting and cursor position handling
 *
 * @param {string} value - The value to format
 * @param {number} cursorPosition - The current cursor position
 * @param {HTMLInputElement} inputElement - The input element (optional)
 * @returns {Object} - Object containing the formatted value and new cursor position
 */
export const formatWithCursorHandling = (value, cursorPosition, inputElement = null) => {
  // Format the value
  const formattedValue = formatNumberWithCommas(value);

  // Calculate new cursor position
  const newPosition = calculateCursorPosition(value, formattedValue, cursorPosition);

  // Update cursor position if input element is provided
  if (inputElement && newPosition !== null) {
    setCursorPosition(inputElement, newPosition);
  }

  return {
    value: formattedValue,
    cursorPosition: newPosition,
  };
};

/**
 * Format lives saved with appropriate decimal places
 * @param {number} lives - The number of lives saved
 * @returns {string} - Formatted lives saved with appropriate precision
 */
export const formatLives = (lives) => {
  const absLives = Math.abs(lives);
  const isNegative = lives < 0;

  if (Number.isInteger(absLives)) {
    // If it's a whole number, just format with commas
    return formatNumber(lives);
  } else if (absLives >= HUNDRED_LIVES) {
    // For large fractional numbers, round to nearest whole number
    return formatNumber(Math.round(lives));
  } else if (absLives >= TEN_LIVES) {
    // For medium numbers, show 1 decimal place
    const rounded = Math.round(absLives * 10) / 10;
    return isNegative
      ? `-${rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
      : rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  } else if (absLives >= ONE_LIFE) {
    // For small numbers, show 2 decimal places
    const rounded = Math.round(absLives * 100) / 100;
    return isNegative
      ? `-${rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (absLives >= FRACTION_LIFE_THRESHOLD) {
    // For very small numbers, show 2 decimal places
    const rounded = Math.round(absLives * 100) / 100;
    return isNegative
      ? `-${rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // For extremely small numbers, use 3 significant digits
    return isNegative ? `-${absLives.toPrecision(3)}` : absLives.toPrecision(3);
  }
};

/**
 * Format currency values with appropriate formatting based on magnitude
 * - Values ≥ $1B are shown as $1.5B
 * - Values ≥ $1M are shown as $1.5M
 * - Values ≥ $10 are shown as integers
 * - Values < $10 are shown with at most 2 significant digits
 *
 * @param {number} amount - The amount to format
 * @param {number|null} effectivenessRate - Optional parameter for handling special cases
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, effectivenessRate = null) => {
  if (amount === 0) {
    return '$0';
  } else if (effectivenessRate === 0 || amount === null || amount === undefined) {
    return '∞';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formattedValue;
  if (absAmount >= TRILLION) {
    // Trillions
    const value = absAmount / TRILLION;
    // Format integer or decimal value
    let valueStr = formatNumberWithNoMoreThanOneDecimal(value);
    // Add commas for large prefix values (e.g., $1,234.5T)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}T`;
  } else if (absAmount >= BILLION) {
    // Billions
    const value = absAmount / BILLION;
    // Format integer or decimal value
    let valueStr = formatNumberWithNoMoreThanOneDecimal(value);
    // Add commas for large prefix values (e.g., $1,234.5B)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}B`;
  } else if (absAmount >= MILLION) {
    // Millions
    const value = absAmount / MILLION;
    // Format integer or decimal value
    let valueStr = formatNumberWithNoMoreThanOneDecimal(value);
    // Add commas for large prefix values (e.g., $1,234.5M)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}M`;
  } else if (absAmount >= THOUSAND) {
    // For values ≥ 1,000, show with commas but without 'K' abbreviation
    formattedValue = `$${Math.round(absAmount).toLocaleString('en-US')}`;
  } else if (absAmount >= TEN) {
    // For values ≥ 10, show only integer dollars
    formattedValue = `$${Math.round(absAmount).toLocaleString('en-US')}`;
  } else if (absAmount < SMALL_NUMBER_THRESHOLD) {
    // For extremely small values, use scientific notation to avoid showing $0
    // Format as $1.23e-4 for better readability
    formattedValue = `$${absAmount.toExponential(2)}`;
  } else {
    const significantDigits = 2;
    const multiplier = Math.pow(10, significantDigits - Math.floor(Math.log10(absAmount)) - 1);
    const roundedAmount = Math.round(absAmount * multiplier) / multiplier;
    formattedValue = `$${roundedAmount}`;
  }

  return isNegative ? `-${formattedValue}` : formattedValue;
};
