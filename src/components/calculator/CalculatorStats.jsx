import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import StatisticsCard from '../shared/StatisticsCard';
import MiniImpactList from '../MiniImpactList';
import { formatCurrency, formatLives } from '../../utils/formatters';

/**
 * Displays impact summary statistics for the donation calculator.
 */
const CalculatorStats = ({
  totalDonated,
  totalLivesSaved,
  costPerLife,
  donorRank,
  neighboringDonors,
  className = '',
}) => {
  return (
    <motion.div
      className={`assumptions-shell p-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="mb-4 text-xl font-bold text-strong">Your Impact Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <StatisticsCard
          label="Total Donated"
          value={formatCurrency(totalDonated)}
          valueTestId="calculator-total-donated-value"
          className="shadow-sm"
        />

        <StatisticsCard
          label="Lives Saved"
          value={totalLivesSaved < 0 ? `-${formatLives(Math.abs(totalLivesSaved))}` : formatLives(totalLivesSaved)}
          valueClassName={totalLivesSaved < 0 ? 'text-danger' : 'text-success'}
          valueTestId="calculator-lives-saved-value"
          className="shadow-sm"
        />

        <StatisticsCard
          label="Average Cost Per Life"
          value={totalLivesSaved !== 0 ? formatCurrency(costPerLife) : '—'}
          valueClassName={costPerLife < 0 ? 'text-danger' : 'text-strong'}
          valueTestId="calculator-cost-per-life-value"
          className="shadow-sm"
        />
      </div>

      {donorRank !== null && (
        <MiniImpactList
          donorRank={donorRank}
          totalLivesSaved={totalLivesSaved}
          totalDonated={totalDonated}
          costPerLife={costPerLife}
          neighboringDonors={neighboringDonors}
        />
      )}
    </motion.div>
  );
};

CalculatorStats.propTypes = {
  totalDonated: PropTypes.number.isRequired,
  totalLivesSaved: PropTypes.number.isRequired,
  costPerLife: PropTypes.number.isRequired,
  donorRank: PropTypes.number,
  neighboringDonors: PropTypes.shape({
    above: PropTypes.object,
    below: PropTypes.object,
    twoBelow: PropTypes.object,
    twoAbove: PropTypes.object,
  }),
  className: PropTypes.string,
};

export default React.memo(CalculatorStats);
