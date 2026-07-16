import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatNumberWithCommas } from '../../utils/formatters';
import useFormattedNumberInput from '../../hooks/useFormattedNumberInput';
import { getSanitizedInputCaretPosition, normalizeFormattedNumberEdit } from '../../utils/numberParsing';

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

  const handleGuardedChange = (event) => {
    const raw = event.target.value;
    const normalizedValue = normalizeFormattedNumberEdit(localValue, raw, event.nativeEvent?.inputType, {
      allowNegative: true,
      allowLeadingCurrencySign: true,
    });

    if (!normalizedValue) {
      // Keep unsupported text visible so the parent can report it as invalid;
      // dropping one character from a typed exponent would turn `1e999` into
      // the very different valid amount `1999`.
      setLocalValue(raw);
      onChange(raw);
      return;
    }

    const { displayText } = normalizedValue;
    if (displayText !== raw) {
      const caret = event.target.selectionStart ?? displayText.length;
      const keptBeforeCaret = getSanitizedInputCaretPosition(raw, displayText, caret);
      event.target.value = displayText;
      event.target.setSelectionRange(keptBeforeCaret, keptBeforeCaret);
    }
    handleChange(event);
  };

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
          inputMode={inputMode}
          value={localValue}
          onChange={handleGuardedChange}
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
  inputMode: PropTypes.oneOf(['text', 'decimal', 'numeric']),
};

export default React.memo(CurrencyInput);
