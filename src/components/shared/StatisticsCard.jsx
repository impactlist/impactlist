import React from 'react';
import PropTypes from 'prop-types';
import FormattedScientificValue from './FormattedScientificValue';

/**
 * A reusable card component for displaying statistics with consistent styling.
 */
const StatisticsCard = ({
  label,
  value,
  subtext,
  valueClassName = 'text-strong',
  className = '',
  icon = null,
  valueAction = null,
  valueTestId = undefined,
}) => {
  return (
    <div className={`impact-stat-card flex flex-col items-center p-4 ${className}`}>
      <span className="text-sm font-semibold uppercase text-muted">{label}</span>
      <div className="flex items-center mt-1 space-x-2">
        {icon && <span>{icon}</span>}
        <span data-testid={valueTestId} className={`text-3xl font-bold ${valueClassName}`}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <FormattedScientificValue value={value} variant="card" />
          ) : (
            value
          )}
        </span>
        {valueAction && <div className="flex-shrink-0">{valueAction}</div>}
      </div>
      {subtext && <span className="mt-1 text-xs text-muted">{subtext}</span>}
    </div>
  );
};

StatisticsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  subtext: PropTypes.node,
  valueClassName: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
  valueAction: PropTypes.node,
  valueTestId: PropTypes.string,
};

export default React.memo(StatisticsCard);
