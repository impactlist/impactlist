import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatisticsCard from '../shared/StatisticsCard';
import { formatRoundedLives, formatCurrency } from '../../utils/formatters';
import { buildCausePath } from '../../utils/causeRoutes';

const parseBirthDate = (birthDate) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalizedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    normalizedDate.getUTCFullYear() !== year ||
    normalizedDate.getUTCMonth() !== month - 1 ||
    normalizedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
};

const getAgeFromBirthDate = (birthDate, today = new Date()) => {
  const parsedBirthDate = parseBirthDate(birthDate);
  if (!parsedBirthDate) {
    return null;
  }

  const { year, month, day } = parsedBirthDate;
  let age = today.getFullYear() - year;
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

/**
 * Displays key statistics for donors or recipients with consistent styling.
 */
const EntityStatistics = ({ stats, entityType, className = '', costPerLifeAction = null, photoComponent = null }) => {
  const isDonor = entityType === 'donor';
  const hasPhoto = photoComponent !== null;

  // Determine if we need to show the default cost per life
  const showDefaultCostPerLife =
    stats.defaultCostPerLife !== undefined && stats.costPerLife !== stats.defaultCostPerLife;

  const defaultCostPerLifeText = showDefaultCostPerLife
    ? `Default: ${stats.defaultCostPerLife === 0 ? '∞' : formatCurrency(stats.defaultCostPerLife)}`
    : undefined;
  const formattedCostPerLife = stats.costPerLife === 0 ? '∞' : formatCurrency(stats.costPerLife);
  const formattedCategoryCostPerLife =
    stats.categoryCostPerLife === undefined
      ? undefined
      : stats.categoryCostPerLife === 0
        ? '∞'
        : formatCurrency(stats.categoryCostPerLife);

  const costPerLifeSubtext =
    defaultCostPerLifeText ||
    (formattedCategoryCostPerLife !== undefined && formattedCategoryCostPerLife !== formattedCostPerLife
      ? `Cause avg: ${formattedCategoryCostPerLife}`
      : undefined);

  // Shared stat card definitions (defined once, used in multiple layouts)
  const livesSavedCard = (
    <StatisticsCard
      label="Lives Saved"
      value={formatRoundedLives(stats.totalLivesSaved)}
      valueClassName={stats.totalLivesSaved < 0 ? 'text-danger' : 'text-success'}
    />
  );

  const costPerLifeCard = (
    <StatisticsCard
      label="Cost Per Life"
      value={formattedCostPerLife}
      valueClassName={stats.costPerLife < 0 ? 'text-danger' : 'text-strong'}
      valueAction={costPerLifeAction}
      subtext={costPerLifeSubtext}
    />
  );

  const totalDonatedCard = (
    <StatisticsCard
      label="Total Donated"
      value={formatCurrency(stats.totalDonatedField || stats.totalDonated)}
      subtext={stats.totalDonatedField ? `${formatCurrency(stats.knownDonations)} known` : undefined}
    />
  );

  const impactRankCard = <StatisticsCard label="Impact Rank" value={`#${stats.rank}`} />;

  const netWorthCard = <StatisticsCard label="Net Worth" value={formatCurrency(stats.netWorth)} />;

  const age = isDonor && stats.birthDate ? getAgeFromBirthDate(stats.birthDate) : null;
  const ageCard = age !== null ? <StatisticsCard label="Age" value={age} /> : null;

  // For banner layout: shows rank OR net worth (not both)
  const impactRankOrNetWorthCard = (
    <StatisticsCard
      label={stats.rank ? 'Impact Rank' : 'Net Worth'}
      value={stats.rank ? `#${stats.rank}` : formatCurrency(stats.netWorth)}
    />
  );

  const totalReceivedCard = <StatisticsCard label="Total Received" value={formatCurrency(stats.totalReceived)} />;

  const focusAreaCard =
    stats.categoryBreakdown?.length === 1 ? (
      <StatisticsCard
        label="Cause Area"
        value={
          <Link to={buildCausePath(stats.categoryBreakdown[0].id)} className="impact-link">
            {stats.categoryBreakdown[0].name}
          </Link>
        }
      />
    ) : null;

  // Stats grid for donor with photo layout (6 stats: 3 top, 3 bottom)
  const renderDonorPhotoStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {impactRankCard}
      {livesSavedCard}
      {costPerLifeCard}
      {totalDonatedCard}
      {netWorthCard}
      {ageCard}
    </div>
  );

  // Original stats grid (banner layout without photo)
  const renderBannerStats = () => (
    <div
      className={`grid grid-cols-1 ${
        (stats.categoryBreakdown?.length === 1 && !isDonor) || isDonor ? 'md:grid-cols-4' : 'md:grid-cols-3'
      } gap-6`}
    >
      {livesSavedCard}
      {costPerLifeCard}
      {isDonor ? (
        <>
          {totalDonatedCard}
          {impactRankOrNetWorthCard}
        </>
      ) : (
        <>
          {totalReceivedCard}
          {focusAreaCard}
        </>
      )}
    </div>
  );

  return (
    <motion.div
      className={`impact-surface p-6 mb-8 ${className}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {hasPhoto && isDonor ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {photoComponent}
          <div className="flex-1">{renderDonorPhotoStats()}</div>
        </div>
      ) : (
        renderBannerStats()
      )}
    </motion.div>
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
    birthDate: PropTypes.string,

    // Recipient-specific properties
    totalReceived: PropTypes.number,
    categoryBreakdown: PropTypes.array,
  }).isRequired,
  entityType: PropTypes.oneOf(['donor', 'recipient']).isRequired,
  className: PropTypes.string,
  costPerLifeAction: PropTypes.node,
  photoComponent: PropTypes.node,
};

export default React.memo(EntityStatistics);
