import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatRoundedLives, formatCurrency } from '../utils/formatters';
import FormattedScientificValue from './shared/FormattedScientificValue';
import DonatedValueCell from './shared/DonatedValueCell';
import InfoTooltipIcon from './shared/InfoTooltipIcon';
import { DONOR_DONATED_TOOLTIP } from '../constants/metricTooltips';

const MiniImpactList = ({ donorRank, totalLivesSaved, totalDonated, costPerLife, neighboringDonors }) => {
  const currentUserRow = {
    rank: donorRank,
    name: 'You',
    totalLivesSaved,
    totalDonated,
    costPerLife,
    isCurrentUser: true,
  };
  const donorRow = (donor, rank) =>
    donor
      ? {
          rank,
          name: donor.name,
          totalLivesSaved: donor.totalLivesSaved,
          totalDonated: donor.totalDonated,
          costPerLife: donor.costPerLife,
          netWorth: donor.netWorth,
          id: donor.id,
        }
      : null;

  let rows;
  if (!neighboringDonors.above) {
    rows = [
      currentUserRow,
      donorRow(neighboringDonors.below, donorRank + 1),
      donorRow(neighboringDonors.twoBelow, donorRank + 2),
    ];
  } else if (!neighboringDonors.below) {
    rows = [
      donorRow(neighboringDonors.twoAbove, donorRank - 2),
      donorRow(neighboringDonors.above, donorRank - 1),
      currentUserRow,
    ];
  } else {
    rows = [
      donorRow(neighboringDonors.above, donorRank - 1),
      currentUserRow,
      donorRow(neighboringDonors.below, donorRank + 1),
    ];
  }
  rows = rows.filter(Boolean);

  return (
    <div className="impact-surface p-4 shadow-sm">
      <div className="mb-3 text-sm font-bold text-strong">Your potential rank on Impact List</div>
      <div className="overflow-x-auto">
        <table className="impact-table">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left">Rank</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Lives Saved</th>
              <th className="px-3 py-2 text-left">
                <span className="impact-table__header-inner">
                  Donated
                  <InfoTooltipIcon content={DONOR_DONATED_TOOLTIP} iconClassName="h-3.5 w-3.5 text-muted" />
                </span>
              </th>
              <th className="px-3 py-2 text-left">Cost/Life</th>
              <th className="px-3 py-2 text-left">Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.isCurrentUser ? 'current-user' : row.id || `${row.rank}-${row.name}`}
                className={row.isCurrentUser ? 'impact-mini-row--current' : ''}
              >
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">{row.rank}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {row.isCurrentUser ? (
                    <span className="font-medium text-[var(--accent-strong)]">You</span>
                  ) : (
                    <Link to={`/donor/${encodeURIComponent(row.id)}`} className="impact-link">
                      {row.name}
                    </Link>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={row.totalLivesSaved < 0 ? 'text-danger' : 'text-success'}>
                    <FormattedScientificValue value={formatRoundedLives(row.totalLivesSaved)} variant="compact" />
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <DonatedValueCell totalDonated={row.totalDonated} netWorth={row.netWorth} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">
                  {row.totalLivesSaved === 0 ? (
                    '∞'
                  ) : (
                    <FormattedScientificValue value={formatCurrency(row.costPerLife)} variant="compact" />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">
                  {row.isCurrentUser ? '???' : formatCurrency(row.netWorth)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

MiniImpactList.propTypes = {
  donorRank: PropTypes.number.isRequired,
  totalLivesSaved: PropTypes.number.isRequired,
  totalDonated: PropTypes.number.isRequired,
  costPerLife: PropTypes.number.isRequired,
  neighboringDonors: PropTypes.shape({
    above: PropTypes.object,
    below: PropTypes.object,
    twoBelow: PropTypes.object,
    twoAbove: PropTypes.object,
  }).isRequired,
};

export default MiniImpactList;
