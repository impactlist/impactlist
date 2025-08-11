import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

/**
 * Shared component for displaying cost per life in effect editors
 */
const EffectCostDisplay = ({ cost, label = 'Cost per life:', showInfinity = true, className = '' }) => {
  const isInvalid = cost === Infinity;
  const formattedCost = isInvalid ? (showInfinity ? '∞' : 'Invalid') : formatCurrency(cost).replace('$', '');

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      <span>{label} </span>
      <span className={`font-medium ${isInvalid ? 'text-red-600' : 'text-green-600'}`}>${formattedCost}</span>
    </div>
  );
};

EffectCostDisplay.propTypes = {
  cost: PropTypes.number.isRequired,
  label: PropTypes.string,
  showInfinity: PropTypes.bool,
  className: PropTypes.string,
};

export default EffectCostDisplay;
