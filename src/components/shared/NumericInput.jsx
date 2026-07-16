import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useFormattedNumberInput from '../../hooks/useFormattedNumberInput';
import { getSanitizedInputCaretPosition, normalizeFormattedNumberEdit } from '../../utils/numberParsing';

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
  // 'decimal' brings up a numeric keypad on mobile, but iOS's decimal pad
  // has NO minus key — negative values are legitimate for several fields
  // (domain rule), so only positive-only call sites should opt in.
  inputMode = 'text',
}) => {
  const emitChange = useCallback(
    (formattedValue) => {
      const cleanValue = formattedValue.replace(/,/g, '');

      // Allow partial input states
      if (cleanValue === '' || cleanValue === '-' || cleanValue === '.' || cleanValue === '-.') {
        onChange(cleanValue);
        return;
      }

      // Keep the user's exact decimal spelling until the owning domain parser
      // validates it. Coercing a long ordinary decimal to Number here can
      // turn it into exponent notation (1e-51); a stricter parent then sees a
      // different syntax than the user entered and reports the wrong error.
      onChange(cleanValue);
    },
    [onChange]
  );

  const { inputRef, localValue, setLocalValue, handleChange } = useFormattedNumberInput(value, emitChange);

  const handleGuardedChange = (event) => {
    const raw = event.target.value;
    const normalizedValue = normalizeFormattedNumberEdit(localValue, raw, event.nativeEvent?.inputType, {
      allowNegative: true,
    });

    if (!normalizedValue) {
      // Preserve invalid text for inline validation. Running malformed comma
      // placement through the formatter would silently reinterpret `12,34`
      // as 1234; dropping an exponent marker would turn `1e3` into 13.
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

  const state = error ? 'error' : isCustom ? 'custom' : 'default';

  return (
    <div className={`impact-field ${className}`.trim()} data-state={state}>
      {label && (
        <label htmlFor={id} className="impact-field__label">
          {label}
        </label>
      )}
      <div className="impact-field__control">
        {prefix && (
          <span className="impact-field__prefix" aria-hidden={true}>
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode={inputMode}
          value={localValue}
          onChange={handleGuardedChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-errormessage={error ? `${id}-error` : undefined}
          className={`impact-field__input ${prefix ? 'impact-field__input--with-prefix' : ''}`.trim()}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="impact-field__error">
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
  inputMode: PropTypes.oneOf(['text', 'decimal', 'numeric']),
};

export default React.memo(NumericInput);
