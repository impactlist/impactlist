import React from 'react';
import PropTypes from 'prop-types';
import { parseScientificNotationDisplay } from '../../utils/scientificNotation';

const FormattedScientificValue = ({ value, className = '', variant = 'default' }) => {
  const scientificParts = parseScientificNotationDisplay(value);

  if (!scientificParts) {
    return className ? <span className={className}>{value}</span> : <>{value}</>;
  }

  const { textValue, mantissa, powerBase, exponentPlain } = scientificParts;

  return (
    <span
      className={`formatted-scientific-value formatted-scientific-value--${variant} ${className}`.trim()}
      aria-label={textValue}
    >
      <span className="formatted-scientific-value__mantissa">{mantissa}</span>
      <span className="formatted-scientific-value__power">{powerBase}</span>
      <sup className="formatted-scientific-value__exponent">{exponentPlain}</sup>
    </span>
  );
};

FormattedScientificValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'card', 'compact']),
};

export default React.memo(FormattedScientificValue);
