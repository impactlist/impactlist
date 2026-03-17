const SCIENTIFIC_NOTATION_PATTERN = /^(.*?)( × 10)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/;

const SUPERSCRIPT_TO_PLAIN = {
  '⁻': '−',
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
};

export const parseScientificNotationDisplay = (value) => {
  const textValue = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  const match = textValue.match(SCIENTIFIC_NOTATION_PATTERN);

  if (!match) {
    return null;
  }

  const [, mantissa, powerBase, exponentSuperscript] = match;
  const exponentPlain = exponentSuperscript
    .split('')
    .map((character) => SUPERSCRIPT_TO_PLAIN[character] || character)
    .join('');

  return {
    textValue,
    mantissa,
    powerBase,
    exponentSuperscript,
    exponentPlain,
  };
};
