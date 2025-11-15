import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import StatisticsCard from '../shared/StatisticsCard';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import AdjustAssumptionsButton from '../shared/AdjustAssumptionsButton';

/**
 * Displays key statistics for donors or recipients with consistent styling.
 */
const EntityStatistics = ({
  stats,
  entityType,
  className = '',
  customValuesIndicator = null,
  onAdjustAssumptions = null,
  currentYear = null,
  costPerLifeAction = null,
}) => {
  const isDonor = entityType === 'donor';

  // Determine if we need to show the default cost per life
  const showDefaultCostPerLife =
    stats.defaultCostPerLife !== undefined && stats.costPerLife !== stats.defaultCostPerLife;

  const defaultCostPerLifeText = showDefaultCostPerLife
    ? `Default: ${stats.defaultCostPerLife === 0 ? '∞' : formatCurrency(stats.defaultCostPerLife)}`
    : undefined;

  return (
    <>
      {(customValuesIndicator || onAdjustAssumptions) && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-3">
            {customValuesIndicator}
            {onAdjustAssumptions && <AdjustAssumptionsButton onClick={onAdjustAssumptions} />}
          </div>
        </div>
      )}

      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200 ${className}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div
          className={`grid grid-cols-1 ${
            (stats.categoryBreakdown?.length === 1 && !isDonor) || isDonor ? 'md:grid-cols-4' : 'md:grid-cols-3'
          } gap-6`}
        >
          {/* Common statistics for both donors and recipients */}
          <StatisticsCard
            label={'Lives Saved'}
            value={formatNumber(Math.round(stats.totalLivesSaved))}
            valueClassName={stats.totalLivesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}
          />

          <StatisticsCard
            label={currentYear && !isDonor ? `Cost Per Life (${currentYear})` : 'Cost Per Life'}
            value={stats.costPerLife === 0 ? '∞' : formatCurrency(stats.costPerLife)}
            valueClassName={stats.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}
            valueAction={costPerLifeAction}
            subtext={
              defaultCostPerLifeText ||
              (stats.categoryCostPerLife !== undefined
                ? `Category avg: ${stats.categoryCostPerLife === 0 ? '∞' : formatCurrency(stats.categoryCostPerLife)}`
                : undefined)
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
    </>
  );
};

EntityStatistics.propTypes = {
  stats: PropTypes.shape({
    // Common properties
    totalLivesSaved: PropTypes.number.isRequired,
    costPerLife: PropTypes.number.isRequired,
    categoryCostPerLife: PropTypes.number,
    defaultCostPerLife: PropTypes.number,

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
  currentYear: PropTypes.number,
  costPerLifeAction: PropTypes.node,
};

export default React.memo(EntityStatistics);
