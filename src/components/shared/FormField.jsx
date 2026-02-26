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
      className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 ${
        disabled
          ? 'border-slate-200 bg-slate-50 opacity-75'
          : hasError
            ? 'border-red-200 ring-1 ring-red-100 bg-red-50/50'
            : isCustom
              ? 'border-indigo-200 ring-1 ring-indigo-100 bg-indigo-50/40'
              : 'border-slate-200'
      }`}
    >
      {/* Label and Reset button */}
      <div className="flex justify-between items-start mb-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center gap-1">
          {label}
          {description && (
            <Tooltip content={description}>
              <svg
                className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded-md font-medium transition-colors"
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
            className={`absolute left-2 top-1/2 -translate-y-1/2 text-sm ${hasError ? 'text-red-500' : 'text-slate-500'}`}
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
            w-full py-2 text-sm border rounded-lg
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none
            transition-colors duration-150
            placeholder:text-slate-400
            ${prefix ? 'pl-6 pr-2' : 'px-2'}
            ${
              disabled
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                : hasError
                  ? 'border-red-300 text-red-700 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
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
        <p className="text-xs text-slate-500 mt-0.5">
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
