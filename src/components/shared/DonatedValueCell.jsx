import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { percentOfNetWorthDonated } from '../../utils/donationDataHelpers';

/**
 * The Donated table cell shared by the donor list and the calculator's
 * mini list: the amount donated, followed by the share of the donor's net
 * worth that represents (the parenthetical the Donated-column tooltip
 * describes).
 *
 * The percentage only renders when `percentOfNetWorthDonated` yields one —
 * donated-over-net-worth is meaningless for a zero, negative, or unknown
 * net worth (the mini list's "You" row), so the parenthetical is omitted
 * entirely rather than shown as a placeholder.
 *
 * `emphasizePercent` swaps the visual weight of the two values (percentage
 * strong, amount muted) while the donor list is sorted by percent of net
 * worth, so the value driving the ranking reads first.
 */
const DonatedValueCell = ({ totalDonated, netWorth, emphasizePercent = false }) => {
  const percentDonated = percentOfNetWorthDonated(totalDonated, netWorth);

  return (
    <div className="text-sm">
      <span
        className={`transition-colors ${emphasizePercent && percentDonated !== null ? 'text-muted' : 'text-strong'}`}
      >
        {formatCurrency(totalDonated)}
      </span>
      {percentDonated !== null && (
        <span className={`transition-colors ${emphasizePercent ? 'text-strong' : 'text-muted'}`}>
          {' '}
          ({formatPercentage(percentDonated)})
        </span>
      )}
    </div>
  );
};

DonatedValueCell.propTypes = {
  totalDonated: PropTypes.number.isRequired,
  netWorth: PropTypes.number,
  emphasizePercent: PropTypes.bool,
};

export default DonatedValueCell;
