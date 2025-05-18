import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import StatisticsCard from '../shared/StatisticsCard';
import { formatNumber, formatCurrency } from '../../utils/formatters';

/**
 * Displays key statistics for donors or recipients with consistent styling.
 */
const EntityStatistics = ({
  stats,
  entityType,
  className = '',
  customValuesIndicator = null,
  onAdjustAssumptions = null,
}) => {
  const isDonor = entityType === 'donor';

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200 ${className}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {(customValuesIndicator || onAdjustAssumptions) && (
        <div className="flex justify-end mb-2">
          <div className="flex items-center space-x-3">
            {customValuesIndicator}
            {onAdjustAssumptions && (
              <button
                onClick={onAdjustAssumptions}
                className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 bg-white rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Adjust Assumptions
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          (stats.categoryBreakdown?.length === 1 && !isDonor) || isDonor ? 'md:grid-cols-4' : 'md:grid-cols-3'
        } gap-6`}
      >
        {/* Common statistics for both donors and recipients */}
        <StatisticsCard
          label={isDonor ? 'Lives Saved' : 'Total Lives Saved'}
          value={formatNumber(Math.round(stats.totalLivesSaved))}
          valueClassName={stats.totalLivesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}
        />

        <StatisticsCard
          label="Cost Per Life"
          value={stats.costPerLife === 0 ? '∞' : formatCurrency(stats.costPerLife)}
          valueClassName={stats.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}
          subtext={
            stats.categoryCostPerLife !== undefined
              ? `Category avg: ${stats.categoryCostPerLife === 0 ? '∞' : formatCurrency(stats.categoryCostPerLife)}`
              : undefined
          }
        />

        {/* Donor-specific statistics */}
        {isDonor ? (
          <>
            <StatisticsCard
              label="Total Donated"
              value={formatCurrency(stats.totalDonatedField || stats.totalDonated)}
              subtext={stats.totalDonatedField ? `${formatCurrency(stats.knownDonations)} known` : undefined}
            />

            <StatisticsCard
              label={stats.rank ? 'Impact Rank' : 'Net Worth'}
              value={stats.rank ? `#${stats.rank}` : formatCurrency(stats.netWorth)}
            />
          </>
        ) : (
          <>
            <StatisticsCard label="Total Received" value={formatCurrency(stats.totalReceived)} />

            {/* Focus Area - Only shown for recipients with a single category */}
            {stats.categoryBreakdown?.length === 1 && (
              <StatisticsCard label="Focus Area" value={stats.categoryBreakdown[0].name} />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

EntityStatistics.propTypes = {
  stats: PropTypes.shape({
    totalLivesSaved: PropTypes.number.isRequired,
    costPerLife: PropTypes.number.isRequired,
    categoryCostPerLife: PropTypes.number,
    // Donor-specific properties
    totalDonated: PropTypes.number,
    totalDonatedField: PropTypes.number,
    knownDonations: PropTypes.number,
    rank: PropTypes.number,
    netWorth: PropTypes.number,
    // Recipient-specific properties
    totalReceived: PropTypes.number,
    categoryBreakdown: PropTypes.array,
  }).isRequired,
  entityType: PropTypes.oneOf(['donor', 'recipient']).isRequired,
  className: PropTypes.string,
  customValuesIndicator: PropTypes.node,
  onAdjustAssumptions: PropTypes.func,
};

export default React.memo(EntityStatistics);
