import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import FormattedScientificValue from './FormattedScientificValue';

/**
 * Shared component for displaying cost per life in effect editors
 */
const EffectCostDisplay = ({ cost, baseCost, label = 'Cost per life:', showInfinity = true, className = '' }) => {
  const isInvalid = cost === Infinity;
  const formattedCost = isInvalid ? (showInfinity ? '∞' : 'Invalid') : formatCurrency(cost);

  // Format base cost if provided and different from current cost
  const showBaseCost = baseCost !== undefined && baseCost !== cost && !isInvalid;
  const formattedBaseCost = baseCost !== undefined && baseCost !== Infinity ? formatCurrency(baseCost) : null;

  return (
    <div className={`${className}`}>
      <div className="text-sm text-muted">
        <span className="font-bold">{label} </span>
        <span className={`font-medium ${isInvalid || cost < 0 ? 'text-danger' : 'text-success'}`}>
          {isInvalid ? formattedCost : <FormattedScientificValue value={formattedCost} variant="compact" />}
        </span>
      </div>
      {showBaseCost && formattedBaseCost && (
        <div className="mt-0.5 text-xs text-muted opacity-85">
          (Base cost/life: <FormattedScientificValue value={formattedBaseCost} variant="compact" />)
        </div>
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
