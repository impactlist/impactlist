import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatNumberWithCommas } from '../../utils/formatters';
import useFormattedNumberInput from '../../hooks/useFormattedNumberInput';

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
  displayOnly = false, // If true, render a read-only display surface instead of a disabled input
  ariaLabel,
  displayValue = null,
  // 'decimal' brings up a numeric keypad on mobile, but iOS's decimal pad
  // has NO minus key — negative values are legitimate for cost fields
  // (domain rule), so only positive-only call sites should opt in.
  inputMode = 'text',
}) => {
  const emitChange = useCallback(
    (formattedValue, rawValue) => {
      if (validateOnBlur) {
        // When validating on blur, we pass the original value as is
        onChange(rawValue);
      } else {
        // When not validating on blur, we can pass the cleaned value (without commas)
        onChange(rawValue.replace(/,/g, ''));
      }
    },
    [onChange, validateOnBlur]
  );

  const { inputRef, localValue, setLocalValue, handleChange } = useFormattedNumberInput(value, emitChange);

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
  }, [localValue, onChange, setLocalValue, validateOnBlur]);

  const state = error ? 'error' : isCustom ? 'custom' : 'default';
  const hasDisplayOverlay = displayOnly && displayValue && localValue;

  return (
    <div className={`impact-field ${className}`.trim()} data-state={state} data-display={displayOnly || undefined}>
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
        {displayOnly ? (
          <>
            <input
              id={id}
              aria-label={ariaLabel || label}
              type="text"
              inputMode="text"
              value={localValue}
              placeholder={placeholder}
              readOnly={true}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              className={`impact-field__input impact-field__input--with-prefix impact-field__input--display ${
                hasDisplayOverlay ? 'impact-field__input--display-rendered' : ''
              }`.trim()}
            />
            {hasDisplayOverlay && (
              <div className="impact-field__display-overlay impact-field__display-overlay--with-prefix">
                {displayValue}
              </div>
            )}
          </>
        ) : (
          <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode={inputMode}
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
        )}
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
  displayOnly: PropTypes.bool,
  ariaLabel: PropTypes.string,
  displayValue: PropTypes.node,
  inputMode: PropTypes.oneOf(['text', 'decimal', 'numeric']),
};

export default React.memo(CurrencyInput);
