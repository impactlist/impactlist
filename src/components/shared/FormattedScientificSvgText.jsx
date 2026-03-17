import React from 'react';
import PropTypes from 'prop-types';
import { parseScientificNotationDisplay } from '../../utils/scientificNotation';

const FormattedScientificSvgText = ({
  value,
  suffix = '',
  x,
  y,
  fill = 'currentColor',
  fontSize = 12,
  fontWeight = 400,
  textAnchor = 'start',
  dominantBaseline = 'middle',
  className = '',
}) => {
  const scientificParts = parseScientificNotationDisplay(value);

  if (!scientificParts) {
    return (
      <text
        x={x}
        y={y}
        fill={fill}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        className={className}
      >
        <tspan>{value}</tspan>
        {suffix ? <tspan>{suffix}</tspan> : null}
      </text>
    );
  }

  const { textValue, mantissa, powerBase, exponentPlain } = scientificParts;

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      className={className}
      aria-label={textValue}
    >
      <tspan>{mantissa}</tspan>
      <tspan fontWeight={Math.max(400, Number(fontWeight) - 80) || 500} opacity="0.8">
        {powerBase}
      </tspan>
      <tspan dx="0.03em" dy="-0.42em" fontSize="0.72em" fontWeight="600">
        {exponentPlain}
      </tspan>
      {suffix ? <tspan dy="0.42em">{suffix}</tspan> : null}
    </text>
  );
};

FormattedScientificSvgText.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  fill: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  textAnchor: PropTypes.string,
  dominantBaseline: PropTypes.string,
  className: PropTypes.string,
};

export default React.memo(FormattedScientificSvgText);
