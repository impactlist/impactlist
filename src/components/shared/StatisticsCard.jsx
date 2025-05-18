import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable card component for displaying statistics with consistent styling.
 */
const StatisticsCard = ({ label, value, subtext, valueClassName = 'text-slate-900', className = '', icon = null }) => {
  return (
    <div className={`flex flex-col items-center p-4 bg-slate-50 rounded-lg ${className}`}>
      <span className="text-sm text-slate-600 uppercase font-semibold">{label}</span>
      <div className="flex items-center mt-1">
        {icon && <span className="mr-2">{icon}</span>}
        <span className={`text-3xl font-bold ${valueClassName}`}>{value}</span>
      </div>
      {subtext && <span className="text-xs text-slate-500 mt-1">{subtext}</span>}
    </div>
  );
};

StatisticsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  subtext: PropTypes.string,
  valueClassName: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
};

export default React.memo(StatisticsCard);
