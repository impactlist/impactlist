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
      <div className="text-sm text-[var(--text-muted)]">
        <span className="font-bold">{label} </span>
        <span className={`font-medium ${isInvalid || cost < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
          ${formattedCost}
        </span>
      </div>
      {showBaseCost && formattedBaseCost && (
        <div className="mt-0.5 text-xs text-[var(--text-muted)] opacity-85">(Base cost/life: ${formattedBaseCost})</div>
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
