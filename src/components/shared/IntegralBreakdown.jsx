import React from 'react';
import PropTypes from 'prop-types';
import { formatLargeNumber } from '../../utils/effectsVisualization';

// Color scheme matching the graph
const SEGMENT_COLORS = {
  historical: '#6366f1', // Indigo (past)
  futureGrowth: '#10b981', // Emerald (growth)
  populationLimit: '#f59e0b', // Amber (limit)
};

/**
 * Component to display numerical breakdown of lives saved by segment
 */
const IntegralBreakdown = ({ breakdown }) => {
  if (!breakdown) {
    return null;
  }

  const segments = [
    {
      key: 'historical',
      label: 'Historical Period',
      color: SEGMENT_COLORS.historical,
      lives: breakdown.historical.lives,
      percentage: breakdown.historical.percentage,
    },
    {
      key: 'futureGrowth',
      label: 'Future Growth',
      color: SEGMENT_COLORS.futureGrowth,
      lives: breakdown.futureGrowth.lives,
      percentage: breakdown.futureGrowth.percentage,
    },
    {
      key: 'populationLimit',
      label: 'Population Limit',
      color: SEGMENT_COLORS.populationLimit,
      lives: breakdown.populationLimit.lives,
      percentage: breakdown.populationLimit.percentage,
    },
  ];

  // Filter out segments with no lives saved
  const activeSegments = segments.filter((s) => s.lives > 0);

  if (activeSegments.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Calculation Breakdown</h4>

      {/* Total lives saved */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Total Lives Saved</span>
          <span className="text-sm font-bold text-gray-900">{formatLargeNumber(breakdown.total, 3)}</span>
        </div>
      </div>

      {/* Segment breakdown */}
      <div className="space-y-2">
        {activeSegments.map((segment) => (
          <div key={segment.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: segment.color }} />
              <span className="text-xs text-gray-600">{segment.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-700">{formatLargeNumber(segment.lives, 2)}</span>
              <span className="text-xs text-gray-500 min-w-[3rem] text-right">({segment.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual percentage bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
          {activeSegments.map((segment) => (
            <div
              key={segment.key}
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: segment.color,
                width: `${segment.percentage}%`,
              }}
              title={`${segment.label}: ${segment.percentage.toFixed(1)}%`}
            />
          ))}
        </div>
      </div>

      {/* Help text for extreme values */}
      {breakdown.total > 1e12 && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Note: Values shown in scientific notation due to large scale
        </p>
      )}
    </div>
  );
};

IntegralBreakdown.propTypes = {
  breakdown: PropTypes.shape({
    historical: PropTypes.shape({
      lives: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    }),
    futureGrowth: PropTypes.shape({
      lives: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    }),
    populationLimit: PropTypes.shape({
      lives: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    }),
    total: PropTypes.number.isRequired,
  }),
};

export default IntegralBreakdown;
