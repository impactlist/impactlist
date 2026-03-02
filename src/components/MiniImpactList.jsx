import React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber, formatCurrency } from '../utils/formatters';

const MiniImpactList = ({ donorRank, totalLivesSaved, totalDonated, costPerLife, neighboringDonors }) => {
  // Create the three rows to display
  const rows = [];

  // If at the top of the list
  if (!neighboringDonors.above) {
    rows.push(
      {
        rank: 1,
        name: 'You',
        totalLivesSaved: totalLivesSaved,
        totalDonated: totalDonated,
        costPerLife: costPerLife,
        isCurrentUser: true,
      },
      {
        rank: 2,
        name: neighboringDonors.below.name,
        totalLivesSaved: neighboringDonors.below.totalLivesSaved,
        totalDonated: neighboringDonors.below.totalDonated,
        costPerLife: neighboringDonors.below.costPerLife,
        netWorth: neighboringDonors.below.netWorth,
        id: neighboringDonors.below.id,
      },
      {
        rank: 3,
        name: neighboringDonors.twoBelow.name,
        totalLivesSaved: neighboringDonors.twoBelow.totalLivesSaved,
        totalDonated: neighboringDonors.twoBelow.totalDonated,
        costPerLife: neighboringDonors.twoBelow.costPerLife,
        netWorth: neighboringDonors.twoBelow.netWorth,
        id: neighboringDonors.twoBelow.id,
      }
    );
  }
  // If at the bottom of the list
  else if (!neighboringDonors.below) {
    rows.push(
      {
        rank: donorRank - 2,
        name: neighboringDonors.twoAbove.name,
        totalLivesSaved: neighboringDonors.twoAbove.totalLivesSaved,
        totalDonated: neighboringDonors.twoAbove.totalDonated,
        costPerLife: neighboringDonors.twoAbove.costPerLife,
        netWorth: neighboringDonors.twoAbove.netWorth,
        id: neighboringDonors.twoAbove.id,
      },
      {
        rank: donorRank - 1,
        name: neighboringDonors.above.name,
        totalLivesSaved: neighboringDonors.above.totalLivesSaved,
        totalDonated: neighboringDonors.above.totalDonated,
        costPerLife: neighboringDonors.above.costPerLife,
        netWorth: neighboringDonors.above.netWorth,
        id: neighboringDonors.above.id,
      },
      {
        rank: donorRank,
        name: 'You',
        totalLivesSaved: totalLivesSaved,
        totalDonated: totalDonated,
        costPerLife: costPerLife,
        isCurrentUser: true,
      }
    );
  }
  // If in the middle of the list
  else {
    rows.push(
      {
        rank: donorRank - 1,
        name: neighboringDonors.above.name,
        totalLivesSaved: neighboringDonors.above.totalLivesSaved,
        totalDonated: neighboringDonors.above.totalDonated,
        costPerLife: neighboringDonors.above.costPerLife,
        netWorth: neighboringDonors.above.netWorth,
        id: neighboringDonors.above.id,
      },
      {
        rank: donorRank,
        name: 'You',
        totalLivesSaved: totalLivesSaved,
        totalDonated: totalDonated,
        costPerLife: costPerLife,
        isCurrentUser: true,
      },
      {
        rank: donorRank + 1,
        name: neighboringDonors.below.name,
        totalLivesSaved: neighboringDonors.below.totalLivesSaved,
        totalDonated: neighboringDonors.below.totalDonated,
        costPerLife: neighboringDonors.below.costPerLife,
        netWorth: neighboringDonors.below.netWorth,
        id: neighboringDonors.below.id,
      }
    );
  }

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
              <th className="px-3 py-2 text-left">Donated</th>
              <th className="px-3 py-2 text-left">Cost/Life</th>
              <th className="px-3 py-2 text-left">Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rank} className={row.isCurrentUser ? 'impact-mini-row--current' : ''}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">{row.rank}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {row.isPlaceholder ? (
                    <span className="text-muted">—</span>
                  ) : row.isCurrentUser ? (
                    <span className="font-medium text-[var(--accent-strong)]">You</span>
                  ) : (
                    <Link to={`/donor/${encodeURIComponent(row.id)}`} className="impact-link">
                      {row.name}
                    </Link>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={row.totalLivesSaved < 0 ? 'text-danger' : 'text-success'}>
                    {row.isPlaceholder ? '—' : formatNumber(Math.round(row.totalLivesSaved))}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">
                  {row.isPlaceholder ? '—' : formatCurrency(row.totalDonated)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">
                  {row.isPlaceholder ? '—' : row.totalLivesSaved === 0 ? '∞' : formatCurrency(row.costPerLife)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-strong">
                  {row.isPlaceholder ? '—' : row.isCurrentUser ? '???' : formatCurrency(row.netWorth)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiniImpactList;
