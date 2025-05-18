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
        livesSaved: totalLivesSaved,
        totalDonated: totalDonated,
        costPerLife: costPerLife,
        isCurrentUser: true,
      },
      {
        rank: 2,
        name: neighboringDonors.below.name,
        livesSaved: neighboringDonors.below.livesSaved,
        totalDonated: neighboringDonors.below.totalDonated,
        costPerLife: neighboringDonors.below.costPerLife,
        netWorth: neighboringDonors.below.netWorth,
        id: neighboringDonors.below.id,
      },
      {
        rank: 3,
        name: neighboringDonors.twoBelow.name,
        livesSaved: neighboringDonors.twoBelow.livesSaved,
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
        livesSaved: neighboringDonors.twoAbove.livesSaved,
        totalDonated: neighboringDonors.twoAbove.totalDonated,
        costPerLife: neighboringDonors.twoAbove.costPerLife,
        netWorth: neighboringDonors.twoAbove.netWorth,
        id: neighboringDonors.twoAbove.id,
      },
      {
        rank: donorRank - 1,
        name: neighboringDonors.above.name,
        livesSaved: neighboringDonors.above.livesSaved,
        totalDonated: neighboringDonors.above.totalDonated,
        costPerLife: neighboringDonors.above.costPerLife,
        netWorth: neighboringDonors.above.netWorth,
        id: neighboringDonors.above.id,
      },
      {
        rank: donorRank,
        name: 'You',
        livesSaved: totalLivesSaved,
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
        livesSaved: neighboringDonors.above.livesSaved,
        totalDonated: neighboringDonors.above.totalDonated,
        costPerLife: neighboringDonors.above.costPerLife,
        netWorth: neighboringDonors.above.netWorth,
        id: neighboringDonors.above.id,
      },
      {
        rank: donorRank,
        name: 'You',
        livesSaved: totalLivesSaved,
        totalDonated: totalDonated,
        costPerLife: costPerLife,
        isCurrentUser: true,
      },
      {
        rank: donorRank + 1,
        name: neighboringDonors.below.name,
        livesSaved: neighboringDonors.below.livesSaved,
        totalDonated: neighboringDonors.below.totalDonated,
        costPerLife: neighboringDonors.below.costPerLife,
        netWorth: neighboringDonors.below.netWorth,
        id: neighboringDonors.below.id,
      }
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-slate-500 mb-3">Your potential rank on Impact List</div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Lives Saved
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Donated
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cost/Life
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Net Worth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.rank} className={row.isCurrentUser ? 'bg-indigo-50' : ''}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">{row.rank}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {row.isPlaceholder ? (
                    <span className="text-slate-400">—</span>
                  ) : row.isCurrentUser ? (
                    <span className="font-medium text-indigo-600">You</span>
                  ) : (
                    <Link
                      to={`/donor/${encodeURIComponent(row.id)}`}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {row.name}
                    </Link>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={row.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}>
                    {row.isPlaceholder ? '—' : formatNumber(Math.round(row.livesSaved))}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">
                  {row.isPlaceholder ? '—' : formatCurrency(row.totalDonated)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">
                  {row.isPlaceholder ? '—' : row.livesSaved === 0 ? '∞' : formatCurrency(row.costPerLife)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">
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
