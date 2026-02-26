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
      <div className="text-sm text-slate-500">
        <span className="text-xs uppercase tracking-wide">{label} </span>
        <span className={`tabular-nums font-semibold ${isInvalid || cost < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          ${formattedCost}
        </span>
      </div>
      {showBaseCost && formattedBaseCost && (
        <div className="text-xs text-slate-400 mt-0.5">(Base cost/life: ${formattedBaseCost})</div>
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
