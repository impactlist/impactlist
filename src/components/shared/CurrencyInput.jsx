import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Specialized input component for handling currency values with formatting.
 */
const CurrencyInput = ({ id, value, onChange, placeholder = '0', label, className = '', error, disabled = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Format for display
  const formatDisplayValue = useCallback((val) => {
    if (!val) return '';
    // Remove non-numeric characters except decimal point
    const numericValue = val.toString().replace(/[^0-9.]/g, '');
    // Format with commas for thousands
    const num = Number(numericValue);
    return isNaN(num) ? numericValue : num.toLocaleString();
  }, []);

  // Parse input value
  const handleChange = useCallback(
    (e) => {
      const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
      onChange(sanitizedValue);
    },
    [onChange]
  );

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className={`flex items-center relative ${error ? 'text-red-500' : ''}`}>
        <span className={`text-slate-700 absolute left-3 ${error ? 'text-red-500' : ''}`}>$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={isFocused ? value : formatDisplayValue(value)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-errormessage={error ? `${id}-error` : undefined}
          className={`w-full pl-7 py-2 border rounded focus:ring-2 focus:outline-none ${
            error
              ? 'border-red-300 text-red-700 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
          } ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

CurrencyInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default React.memo(CurrencyInput);
