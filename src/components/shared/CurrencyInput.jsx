import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../utils/formatters';

/**
 * Specialized input component for handling currency values with formatting.
 * Allows any input text, including minus signs, and maintains cursor position during formatting.
 */
const CurrencyInput = ({
  id,
  value,
  onChange,
  placeholder = '0',
  label,
  className = '',
  error,
  disabled = false,
  validateOnBlur = false, // If true, only validates when input loses focus
}) => {
  const [localValue, setLocalValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  const inputRef = useRef(null);

  // Initialize local value from prop
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Only update local value if we don't have focus
      if (!inputRef.current || document.activeElement !== inputRef.current) {
        setLocalValue(value.toString());
      }
    } else {
      setLocalValue('');
    }
  }, [value]);

  // Maintain cursor position after formatting
  useEffect(() => {
    if (cursorPosition !== null && inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, localValue]);

  // Handle input changes
  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      const currentCursorPosition = e.target.selectionStart;

      // Format the value and handle cursor position in one operation
      const result = formatWithCursorHandling(newValue, currentCursorPosition);

      // Save the cursor position for later restoration
      setCursorPosition(result.cursorPosition);

      // Always update the local state with formatted value for display
      setLocalValue(result.value);

      // Pass the value to parent component
      if (validateOnBlur) {
        // When validating on blur, we pass the original value as is
        onChange(newValue);
      } else {
        // When not validating on blur, we can pass the cleaned value (without commas)
        const cleanValue = newValue.replace(/,/g, '');
        onChange(cleanValue);
      }
    },
    [onChange, validateOnBlur]
  );

  // Handle blur for validation
  const handleBlur = useCallback(() => {
    if (validateOnBlur) {
      // Normalize the value - return only a valid number or empty string
      const value = localValue;

      // Remove commas
      const cleanValue = value.replace(/,/g, '');

      // Empty values are allowed
      if (cleanValue === '' || cleanValue === '-') {
        onChange(cleanValue);
        return;
      }

      // Check if it's a valid number
      const isValidNumber = /^-?\d+$/.test(cleanValue);
      if (isValidNumber) {
        const numericValue = parseInt(cleanValue, 10);
        // Always pass string value to maintain consistency
        onChange(String(numericValue));

        // Format the value with commas
        setLocalValue(formatNumberWithCommas(cleanValue));
      } else {
        // If invalid, just keep the input value as is for the user to correct
        onChange(cleanValue);
      }
    }
  }, [localValue, onChange, validateOnBlur]);

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className={`flex items-center relative ${error ? 'text-red-500' : ''}`}>
        <span className={`text-slate-700 absolute left-2 text-sm ${error ? 'text-red-500' : ''}`}>$</span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-errormessage={error ? `${id}-error` : undefined}
          className={`w-full pl-5 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
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
  validateOnBlur: PropTypes.bool,
};

export default React.memo(CurrencyInput);
