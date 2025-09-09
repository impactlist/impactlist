import React from 'react';
import PropTypes from 'prop-types';
import { formatWithCursorHandling, formatNumberWithCommas } from '../../utils/formatters';
import Tooltip from './Tooltip';

/**
 * Reusable form field component with consistent styling for custom values
 * Shows indigo styling when value differs from default, with default value displayed below
 */
const FormField = ({
  id,
  label,
  description,
  value,
  defaultValue,
  onChange,
  error,
  placeholder,
  prefix,
  format = 'number', // 'number', 'percentage'
  disabled = false,
}) => {
  // Determine if this is a custom value (different from default, including empty)
  const isCustom = value !== undefined && value !== null && value !== defaultValue;
  const hasError = Boolean(error);

  // Format display value based on type
  const formatDisplayValue = (val) => {
    if (val === null || val === undefined || val === '') {
      return '';
    }

    // If it's already a formatted string, return it as is
    if (typeof val === 'string' && val.includes(',')) {
      return val;
    }

    if (format === 'percentage') {
      // For percentage, multiply by 100 and format with commas
      const percentValue = parseFloat(val) * 100;
      return formatNumberWithCommas(percentValue.toString());
    }

    return formatNumberWithCommas(val.toString());
  };

  // Format default value for display
  const formatDefaultDisplay = (val) => {
    if (val === null || val === undefined) return '0';

    if (format === 'percentage') {
      const percentValue = parseFloat(val) * 100;
      return formatNumberWithCommas(percentValue.toString());
    }

    return formatNumberWithCommas(val.toString());
  };

  // Handle input change
  const handleChange = (e) => {
    const inputElement = e.target;
    const newValue = e.target.value;
    const currentPosition = e.target.selectionStart;

    // Format with commas while preserving cursor position
    const result = formatWithCursorHandling(newValue, currentPosition, inputElement);

    // Pass the formatted value directly to the parent
    // Let the parent component handle any numeric conversion when needed
    onChange(result.value);
  };

  // Handle reset button click
  const handleReset = () => {
    onChange(defaultValue);
  };

  const displayValue = formatDisplayValue(value);
  const placeholderValue = placeholder || formatDefaultDisplay(defaultValue);

  return (
    <div
      className={`py-2 px-3 rounded border ${
        disabled
          ? 'border-gray-200 bg-gray-50 opacity-75'
          : hasError
            ? 'border-red-300 bg-red-50'
            : isCustom
              ? 'border-indigo-300 bg-indigo-50'
              : 'border-gray-200'
      }`}
    >
      {/* Label and Reset button */}
      <div className="flex justify-between items-start mb-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {description && (
            <Tooltip content={description}>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Tooltip>
          )}
        </label>
        {isCustom && !disabled && (
          <button
            type="button"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </div>

      {/* Input field */}
      <div className="relative">
        {prefix && (
          <span
            className={`absolute left-2 top-1/2 -translate-y-1/2 text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}
          >
            {prefix}
          </span>
        )}
        <input
          type="text"
          id={id}
          name={id}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholderValue}
          disabled={disabled}
          className={`
            w-full py-1 text-sm border rounded focus:ring-1 focus:outline-none
            ${prefix ? 'pl-6 pr-2' : 'px-2'}
            ${
              disabled
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                : hasError
                  ? 'border-red-300 text-red-700 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }
          `}
        />
      </div>

      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Default value display */}
      {isCustom && !hasError && (
        <p className="text-xs text-gray-500 mt-0.5">
          Default: {prefix || ''}
          {formatDefaultDisplay(defaultValue)}
        </p>
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  format: PropTypes.oneOf(['number', 'percentage']),
  disabled: PropTypes.bool,
};

export default FormField;
