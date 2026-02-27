import React from 'react';
import PropTypes from 'prop-types';
import { formatWithCursorHandling, formatNumberWithCommas } from '../../utils/formatters';
import InfoTooltipIcon from './InfoTooltipIcon';
import IconActionButton from './IconActionButton';

/**
 * Reusable form field component with consistent styling for custom values
 * Shows contextual styling when value differs from default, with default value displayed below
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
  const fieldState = hasError ? 'error' : isCustom ? 'custom' : 'default';

  return (
    <div
      className="impact-field rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
      data-state={fieldState}
    >
      {/* Label and Reset action */}
      <div className="mb-2 flex items-start justify-between">
        <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-[var(--text-strong)]">
          {label}
          {description && <InfoTooltipIcon content={description} iconClassName="h-4 w-4 text-[var(--text-muted)]" />}
        </label>
        {isCustom && !disabled && (
          <IconActionButton icon="reset" label="Reset" onClick={handleReset} className="shrink-0" />
        )}
      </div>

      {/* Input field */}
      <div className="impact-field__control">
        {prefix && <span className="impact-field__prefix">{prefix}</span>}
        <input
          type="text"
          id={id}
          name={id}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholderValue}
          disabled={disabled}
          className={`impact-field__input h-8 text-sm ${prefix ? 'impact-field__input--with-prefix pl-6 pr-2' : 'px-2'}`}
        />
      </div>

      {/* Error message */}
      {hasError && (
        <p className="impact-field__error" role="alert">
          {error}
        </p>
      )}

      {/* Default value display */}
      {isCustom && !hasError && (
        <p className="impact-field__helper">
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
