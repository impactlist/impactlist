import React from 'react';
import PropTypes from 'prop-types';
import { formatLives } from '../../utils/formatters';
import { parseScientificNotationDisplay } from '../../utils/scientificNotation';
import FormattedScientificValue from './FormattedScientificValue';

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
  const usesScientificNotation =
    Boolean(parseScientificNotationDisplay(formatLives(breakdown.total))) ||
    activeSegments.some((segment) => Boolean(parseScientificNotationDisplay(formatLives(segment.lives))));

  if (activeSegments.length === 0) {
    return null;
  }

  return (
    <div className="impact-surface--muted rounded-lg p-4">
      <h4 className="mb-3 text-sm font-semibold text-strong">Calculation Breakdown</h4>

      {/* Total lives saved */}
      <div className="mb-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-strong">Total Lives Saved</span>
          <span className="text-sm font-bold text-strong">
            <FormattedScientificValue value={formatLives(breakdown.total)} variant="compact" />
          </span>
        </div>
      </div>

      {/* Segment breakdown */}
      <div className="space-y-2">
        {activeSegments.map((segment) => (
          <div key={segment.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: segment.color }} />
              <span className="text-xs text-muted">{segment.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-strong">
                <FormattedScientificValue value={formatLives(segment.lives)} variant="compact" />
              </span>
              <span className="min-w-[3rem] text-right text-xs text-muted">({segment.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual percentage bar */}
      <div className="mt-4">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
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
      {usesScientificNotation && (
        <p className="mt-3 text-xs italic text-muted">Note: Values shown in scientific notation due to large scale</p>
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
