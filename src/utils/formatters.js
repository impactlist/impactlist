import {
  TRILLION,
  BILLION,
  MILLION,
  THOUSAND,
  TEN,
  SMALL_NUMBER_THRESHOLD,
  HUNDRED_LIVES,
  TEN_LIVES,
  ONE_LIFE,
  FRACTION_LIFE_THRESHOLD,
} from './constants';

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
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., 1,234.5T)
    if (value >= THOUSAND) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `${valueStr}T`;
  } else if (absNum >= BILLION) {
    // Billions - use 2 significant digits
    const value = absNum / BILLION;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., 1,234.5B)
    if (value >= THOUSAND) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `${valueStr}B`;
  } else {
    // For regular numbers, use standard comma formatting
    formattedValue = absNum.toLocaleString('en-US');
  }

  return isNegative ? `-${formattedValue}` : formattedValue;
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
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., $1,234.5T)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}T`;
  } else if (absAmount >= BILLION) {
    // Billions
    const value = absAmount / BILLION;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., $1,234.5B)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}B`;
  } else if (absAmount >= MILLION) {
    // Millions
    const value = absAmount / MILLION;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
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
    // For values < 10 but >= 0.0001, show at most 2 significant digits
    const significantDigits = absAmount < 1 ? 1 : 2;
    const multiplier = Math.pow(10, significantDigits - Math.floor(Math.log10(absAmount)) - 1);
    const roundedAmount = Math.round(absAmount * multiplier) / multiplier;
    formattedValue = `$${roundedAmount}`;
  }

  return isNegative ? `-${formattedValue}` : formattedValue;
};
