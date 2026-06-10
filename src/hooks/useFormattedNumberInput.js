import { useCallback, useEffect, useRef, useState } from 'react';
import { formatWithCursorHandling } from '../utils/formatters';

/**
 * The formatted-number input core shared by CurrencyInput and NumericInput
 * (previously ~80% duplicated): local display state with thousands
 * separators, cursor preservation across reformatting, and prop→display
 * syncing that formats programmatically-set values identically to typed ones.
 *
 * `emitChange(formattedValue, rawValue)` receives the comma-formatted result
 * and the raw input text; each component owns its parsing/emit contract.
 */
const useFormattedNumberInput = (value, emitChange) => {
  const [localValue, setLocalValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  const inputRef = useRef(null);

  // Initialize local value from prop
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Only update local value if we don't have focus. Run the value through
      // the same formatter typing uses so programmatically-set values display
      // identically to typed ones (thousands separators included).
      if (!inputRef.current || document.activeElement !== inputRef.current) {
        const text = value.toString();
        setLocalValue(formatWithCursorHandling(text, text.length).value);
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

  const handleChange = useCallback(
    (event) => {
      const rawValue = event.target.value;

      // Format the value and handle cursor position in one operation
      const result = formatWithCursorHandling(rawValue, event.target.selectionStart);
      setCursorPosition(result.cursorPosition);
      setLocalValue(result.value);

      emitChange(result.value, rawValue);
    },
    [emitChange]
  );

  return { inputRef, localValue, setLocalValue, handleChange };
};

export default useFormattedNumberInput;
