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
  if (absNum >= 1000000000000) {
    // Trillions - use 2 significant digits
    const value = absNum / 1000000000000;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., 1,234.5T)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `${valueStr}T`;
  } else if (absNum >= 1000000000) {
    // Billions - use 2 significant digits
    const value = absNum / 1000000000;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., 1,234.5B)
    if (value >= 1000) {
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
  if (absAmount >= 1000000000000) {
    // Trillions
    const value = absAmount / 1000000000000;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., $1,234.5T)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}T`;
  } else if (absAmount >= 1000000000) {
    // Billions
    const value = absAmount / 1000000000;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., $1,234.5B)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}B`;
  } else if (absAmount >= 1000000) {
    // Millions
    const value = absAmount / 1000000;
    // Format integer or decimal value
    let valueStr = Number.isInteger(value) ? value.toString() : value.toFixed(1);
    // Add commas for large prefix values (e.g., $1,234.5M)
    if (value >= 1000) {
      valueStr = Number(valueStr).toLocaleString('en-US');
    }
    formattedValue = `$${valueStr}M`;
  } else if (absAmount >= 1000) {
    // For values ≥ 1,000, show with commas but without 'K' abbreviation
    formattedValue = `$${Math.round(absAmount).toLocaleString('en-US')}`;
  } else if (absAmount >= 10) {
    // For values ≥ 10, show only integer dollars
    formattedValue = `$${Math.round(absAmount).toLocaleString('en-US')}`;
  } else if (absAmount < 0.0001) {
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