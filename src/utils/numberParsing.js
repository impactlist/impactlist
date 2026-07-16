const DECIMAL_NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const GROUPED_NUMBER_PATTERN = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d*)?(?:[eE][+-]?\d+)?$/;

const FORMATTER_SAFE_INPUT_TYPES = new Set([
  'insertText',
  'insertCompositionText',
  'deleteContentBackward',
  'deleteContentForward',
  'deleteByCut',
]);

/**
 * Parse the decimal syntax accepted by the site's formatted number inputs.
 * Unlike JavaScript's Number(), this accepts only complete decimal/scientific
 * notation: hex, suffix junk, incomplete exponents, and malformed grouping
 * are rejected rather than silently reinterpreted.
 */
export const parseFiniteDecimal = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string') {
    return null;
  }

  if (value.includes(',') && !GROUPED_NUMBER_PATTERN.test(value)) {
    return null;
  }

  const normalizedValue = value.replace(/,/g, '');
  if (!DECIMAL_NUMBER_PATTERN.test(normalizedValue)) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

/**
 * Normalize decimal text without guessing what malformed grouping meant.
 * Plain decimals and conventionally grouped commas are accepted, along with
 * the partial values a user can legitimately pass through while typing.
 */
export const normalizeFormattedDecimalInput = (
  value,
  { allowNegative = true, allowLeadingCurrencySign = false } = {}
) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const originalText = String(value);
  const displayText = allowLeadingCurrencySign && originalText.startsWith('$') ? originalText.slice(1) : originalText;
  const signPattern = allowNegative ? '[+-]?' : '\\+?';
  const expectedPartials = allowNegative ? new Set(['', '.', '-', '-.', '+', '+.']) : new Set(['', '.', '+', '+.']);
  const exponentPattern = '(?:[eE][+-]?\\d+)?';
  const hasValidCommas = new RegExp(`^${signPattern}\\d{1,3}(?:,\\d{3})+(?:\\.\\d*)?${exponentPattern}$`).test(
    displayText
  );
  const hasPlainNumericShape = new RegExp(`^${signPattern}(?:\\d+(?:\\.\\d*)?|\\.\\d+)${exponentPattern}$`).test(
    displayText
  );

  if (!expectedPartials.has(displayText) && !hasValidCommas && !hasPlainNumericShape) {
    return null;
  }

  const rawText = displayText.replace(/,/g, '');
  if (!expectedPartials.has(rawText)) {
    const parsed = Number(rawText);
    if (!Number.isFinite(parsed)) {
      return null;
    }
  }

  return { displayText, rawText };
};

const differsByOneCharacterEdit = (previous, next) => {
  if (previous === next || Math.abs(previous.length - next.length) > 1) return false;

  if (previous.length === next.length) {
    let differences = 0;
    for (let index = 0; index < previous.length; index += 1) {
      if (previous[index] !== next[index]) differences += 1;
    }
    return differences === 1;
  }

  const longer = previous.length > next.length ? previous : next;
  const shorter = previous.length > next.length ? next : previous;
  let mismatchIndex = 0;
  while (mismatchIndex < shorter.length && longer[mismatchIndex] === shorter[mismatchIndex]) {
    mismatchIndex += 1;
  }
  return longer.slice(0, mismatchIndex) + longer.slice(mismatchIndex + 1) === shorter;
};

/**
 * Whether temporarily invalid commas came from an ordinary edit of text the
 * formatter already owned. Explicit paste/drop/replacement input types never
 * take this path, even if they happen to differ by one character.
 */
export const isFormatterOwnedNumberEdit = (previousValue, nextValue, inputType) => {
  if (inputType) {
    return FORMATTER_SAFE_INPUT_TYPES.has(inputType);
  }
  return differsByOneCharacterEdit(previousValue, nextValue);
};

export const normalizeFormattedNumberEdit = (previousValue, nextValue, inputType, options = {}) => {
  const normalized = normalizeFormattedDecimalInput(nextValue, options);
  if (normalized) {
    return normalized;
  }

  const numericCharacters = options.allowNegative === false ? /^[0-9.,]*$/ : /^[0-9.,-]*$/;
  if (!numericCharacters.test(nextValue) || !isFormatterOwnedNumberEdit(previousValue, nextValue, inputType)) {
    return null;
  }

  const regrouped = normalizeFormattedDecimalInput(nextValue.replace(/,/g, ''), {
    ...options,
    allowLeadingCurrencySign: false,
  });
  return regrouped ? { displayText: regrouped.rawText, rawText: regrouped.rawText } : null;
};

export const getSanitizedInputCaretPosition = (originalValue, sanitizedValue, originalCaret) => {
  if (originalCaret === null || originalCaret === undefined) {
    return sanitizedValue.length;
  }

  let textBeforeCaret = originalValue.slice(0, originalCaret);
  if (originalValue.startsWith('$')) {
    textBeforeCaret = textBeforeCaret.slice(1);
  }
  if (!sanitizedValue.includes(',')) {
    textBeforeCaret = textBeforeCaret.replace(/,/g, '');
  }
  return Math.min(textBeforeCaret.length, sanitizedValue.length);
};
