import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

/**
 * Shared component for displaying cost per life in effect editors
 */
const EffectCostDisplay = ({ cost, baseCost, label = 'Cost per life:', showInfinity = true, className = '' }) => {
  const isInvalid = cost === Infinity;
  const formattedCost = isInvalid ? (showInfinity ? '∞' : 'Invalid') : formatCurrency(cost).replace('$', '');

  // Format base cost if provided and different from current cost
  const showBaseCost = baseCost !== undefined && baseCost !== cost && !isInvalid;
  const formattedBaseCost =
    baseCost !== undefined && baseCost !== Infinity ? formatCurrency(baseCost).replace('$', '') : null;

  return (
    <div className={`${className}`}>
      <div className="text-sm text-gray-600">
        <span className="font-bold">{label} </span>
        <span className={`font-medium ${isInvalid ? 'text-red-600' : 'text-green-600'}`}>${formattedCost}</span>
      </div>
      {showBaseCost && formattedBaseCost && (
        <div className="text-xs text-gray-400 mt-0.5">(Base cost/life: ${formattedBaseCost})</div>
      )}
    </div>
  );
};

EffectCostDisplay.propTypes = {
  cost: PropTypes.number.isRequired,
  baseCost: PropTypes.number,
  label: PropTypes.string,
  showInfinity: PropTypes.bool,
  className: PropTypes.string,
};

export default EffectCostDisplay;
