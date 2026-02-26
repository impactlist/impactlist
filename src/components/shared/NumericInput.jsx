import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../utils/formatters';

/**
 * Reusable numeric input component that handles formatting, negative numbers, and decimals.
 * Similar to CurrencyInput but without the dollar sign.
 */
const NumericInput = ({
  id,
  value,
  onChange,
  placeholder = '0',
  label,
  className = '',
  error,
  disabled = false,
  isCustom = false,
  prefix = null, // Optional prefix like "$" or "%"
}) => {
  const [localValue, setLocalValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  const inputRef = useRef(null);

  // Initialize local value from prop
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Only update local value if we don't have focus
      if (!inputRef.current || document.activeElement !== inputRef.current) {
        // If it's a string (partial input), keep as-is
        if (typeof value === 'string') {
          setLocalValue(value);
        } else {
          // Format numeric values with commas
          setLocalValue(formatNumberWithCommas(value));
        }
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

      // Format the value and handle cursor position
      const result = formatWithCursorHandling(newValue, currentCursorPosition);

      // Save cursor position for restoration
      setCursorPosition(result.cursorPosition);

      // Update local display value
      setLocalValue(result.value);

      // Parse and pass to parent
      const cleanValue = result.value.replace(/,/g, '');

      // Allow partial input states
      if (cleanValue === '' || cleanValue === '-' || cleanValue === '.' || cleanValue === '-.') {
        onChange(cleanValue);
        return;
      }

      const numValue = parseFloat(cleanValue);
      onChange(isNaN(numValue) ? cleanValue : numValue);
    },
    [onChange]
  );

  const inputClasses = `
    w-full py-2 text-sm border rounded-lg
    focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none
    transition-colors duration-150
    placeholder:text-slate-400
    ${prefix ? 'pl-6 pr-2' : 'px-2'}
    ${
      error
        ? 'border-red-300 text-red-700 bg-red-50 focus:ring-red-500/20 focus:border-red-400'
        : isCustom
          ? 'border-indigo-300 bg-indigo-50 focus:ring-indigo-500/20 focus:border-indigo-400'
          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
    }
    ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
  `.trim();

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span
            className={`absolute left-2 top-1/2 -translate-y-1/2 text-sm ${error ? 'text-red-500' : 'text-slate-500'}`}
          >
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-errormessage={error ? `${id}-error` : undefined}
          className={inputClasses}
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

NumericInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isCustom: PropTypes.bool,
  prefix: PropTypes.string,
};

export default React.memo(NumericInput);
