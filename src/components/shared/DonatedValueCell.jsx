import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * The Donated table cell shared by the donor list and the calculator's
 * mini list: the amount donated, followed by the share of the donor's net
 * worth that represents (the parenthetical the Donated-column tooltip
 * describes).
 *
 * The percentage only renders when netWorth is a positive finite number —
 * donated-over-net-worth is meaningless for a zero, negative, or unknown
 * net worth (the mini list's "You" row), so the parenthetical is omitted
 * entirely rather than shown as a placeholder.
 */
const DonatedValueCell = ({ totalDonated, netWorth }) => {
  const showPercentage = Number.isFinite(netWorth) && netWorth > 0;

  return (
    <div className="text-sm text-strong">
      {formatCurrency(totalDonated)}
      {showPercentage && <span className="text-muted"> ({formatPercentage(totalDonated / netWorth)})</span>}
    </div>
  );
};

DonatedValueCell.propTypes = {
  totalDonated: PropTypes.number.isRequired,
  netWorth: PropTypes.number,
};

export default DonatedValueCell;
