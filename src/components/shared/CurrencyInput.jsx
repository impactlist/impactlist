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
  isCustom = false, // If true, highlights field to show custom value
  rightElement = null, // Optional element to render on the right side inside the input
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

  const state = error ? 'error' : isCustom ? 'custom' : 'default';

  return (
    <div className={`impact-field ${className}`.trim()} data-state={state}>
      {label && (
        <label htmlFor={id} className="impact-field__label">
          {label}
        </label>
      )}
      <div className="impact-field__control">
        <span
          className="impact-field__prefix"
          style={error ? { color: 'var(--danger)' } : undefined}
          aria-hidden={true}
        >
          $
        </span>
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
          className={`impact-field__input impact-field__input--with-prefix ${
            rightElement ? 'impact-field__input--with-right' : ''
          }`.trim()}
        />
        {rightElement && <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && (
        <p id={`${id}-error`} className="impact-field__error">
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
  isCustom: PropTypes.bool,
  rightElement: PropTypes.node,
};

export default React.memo(CurrencyInput);
