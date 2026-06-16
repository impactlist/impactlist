import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import {
  getPrimaryCategoryId,
  getCreditedAmount,
  getDonorById,
  getDonationsForDonor,
  extractYearFromDonation,
} from '../utils/donationDataHelpers';
import {
  calculateDonorStatsFromCombined,
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import { ImpactChartToggle } from '../components/charts/ImpactBarChart';
import { useAssumptions } from '../contexts/AssumptionsContext';
import DonorPhoto from '../components/shared/DonorPhoto';
import EntityStatistics from '../components/entity/EntityStatistics';
import { DONOR_LIVES_SAVED_TOOLTIP, DONOR_COST_PER_LIFE_TOOLTIP } from '../constants/metricTooltips';
import EntityChartSection from '../components/entity/EntityChartSection';
import EntityDonationTable from '../components/entity/EntityDonationTable';
import MarkdownContent from '../components/shared/MarkdownContent';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';
import NotFound from './NotFound';
import { DONATION_FEEDBACK_NOTE } from '../utils/constants';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCategoryChartData from '../hooks/useCategoryChartData';
import useChartViewTransition from '../hooks/useChartViewTransition';

const EMPTY_DONATIONS = [];

const DonorDetail = () => {
  const { donorId } = useParams();
  const { combinedAssumptions } = useAssumptions();

  // Unknown IDs are expected input (stale links); NotFound renders below.
  const donorData = getDonorById(donorId);

  const pageData = useMemo(() => {
    if (!donorData) return null;

    const stats = calculateDonorStatsFromCombined(combinedAssumptions);
    const currentDonor = stats.find((donor) => donor.id === donorId);
    if (!currentDonor) {
      throw new Error(`Donor with ID "${donorId}" not found. Please check that this donor exists in the database.`);
    }

    // The donor's recorded donations, most recent first.
    const knownDonations = getDonationsForDonor(donorId)
      .map((donation) => {
        const recipientId = donation.recipientId;
        const recipient = combinedAssumptions.getRecipientById(recipientId);
        if (!recipient) {
          throw new Error(
            `Recipient not found: ${donation.recipient} for donor ${donorId}. This recipient needs to be added to the recipients array.`
          );
        }

        const donationYear = extractYearFromDonation(donation);
        const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, donationYear);
        const primaryCategoryId = getPrimaryCategoryId(combinedAssumptions, recipientId);
        const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId) || { name: 'Other' };

        return {
          ...donation,
          creditedAmount: getCreditedAmount(donation),
          categoryId: primaryCategoryId,
          categoryName: primaryCategory.name,
          totalLivesSaved: calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation),
          costPerLife,
          dateObj: donation.date ? new Date(donation.date) : new Date(0),
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);

    const tableDonations = [...knownDonations];

    // If the donor's documented total exceeds the recorded donations, add a
    // synthetic "Unknown" row carrying the remainder at the donor's average
    // cost per life (table only — the category chart shows real data).
    const knownDonationsTotal = knownDonations.reduce((total, donation) => total + donation.creditedAmount, 0);
    if (donorData.totalDonated && donorData.totalDonated > knownDonationsTotal) {
      const unknownAmount = donorData.totalDonated - knownDonationsTotal;
      const knownLivesSaved = knownDonations.reduce((total, donation) => total + donation.totalLivesSaved, 0);
      const avgCostPerLife = knownLivesSaved !== 0 ? knownDonationsTotal / knownLivesSaved : 0;
      const unknownLivesSaved = avgCostPerLife !== 0 ? unknownAmount / avgCostPerLife : 0;

      tableDonations.unshift({
        date: 'Unknown',
        donorId: donorId,
        donor: donorData.name,
        recipientId: 'unknown',
        recipient: 'Unknown',
        amount: unknownAmount,
        categoryId: 'other',
        categoryName: 'Unknown',
        totalLivesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0),
        source: '',
        isUnknown: true,
      });
    }

    const donationsWithCategoryCount = tableDonations.map((donation) => {
      if (donation.isUnknown) return donation;
      const recipient = combinedAssumptions.getRecipientById(donation.recipientId);
      return { ...donation, categoryCount: Object.keys(recipient.categories).length };
    });

    return {
      donorStats: { ...currentDonor, about: donorData.about || '' },
      donorContent: donorData.content,
      donorDonations: donationsWithCategoryCount,
      chartDonations: knownDonations,
    };
  }, [donorId, donorData, combinedAssumptions]);

  const rawChartData = useCategoryChartData(combinedAssumptions, pageData?.chartDonations ?? EMPTY_DONATIONS, {
    maxCategories: 12,
  });
  const { chartData, chartView, isTransitioning, handleChartViewChange } = useChartViewTransition(rawChartData);
  useDocumentTitle(pageData?.donorStats.name);

  if (!donorData) {
    return <NotFound message={`No donor found with ID "${donorId}".`} />;
  }

  const { donorStats, donorContent, donorDonations } = pageData;
  const donorAboutContent = donorStats.about ? `## About\n\n${donorStats.about}` : null;

  return (
    <motion.div
      className="impact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton />

      <motion.div
        className="impact-page__container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Donor name */}
        <h1 className="impact-page__title">{donorStats.name}</h1>
        <AssumptionsSelector />

        {/* Donor stats card with photo */}
        <EntityStatistics
          stats={donorStats}
          entityType="donor"
          livesSavedTooltip={DONOR_LIVES_SAVED_TOOLTIP}
          costPerLifeTooltip={DONOR_COST_PER_LIFE_TOOLTIP}
          photoComponent={<DonorPhoto donorId={donorId} donorName={donorStats.name} size="large" />}
        />

        {/* Donor about section */}
        <MarkdownContent content={donorAboutContent} className="mt-8 mb-0" />

        {/* Donation categories visualization */}
        <EntityChartSection
          chartData={chartData}
          chartView={chartView}
          onViewChange={handleChartViewChange}
          isTransitioning={isTransitioning}
          toggleComponent={
            <ImpactChartToggle chartView={chartView} onToggle={handleChartViewChange} disabled={isTransitioning} />
          }
          entityType="donor"
          className="mt-8"
          combinedAssumptions={combinedAssumptions}
        />

        {/* Donor markdown content */}
        <MarkdownContent content={donorContent} className="mt-8 mb-8" />

        {/* Donations list */}
        <EntityDonationTable donations={donorDonations} entityType="donor" combinedAssumptions={combinedAssumptions} />

        {/* Feedback note */}
        <p className="mb-8 mt-4 text-center italic text-muted">
          {DONATION_FEEDBACK_NOTE.text}{' '}
          <a href={DONATION_FEEDBACK_NOTE.formUrl} className="impact-link" target="_blank" rel="noopener noreferrer">
            {DONATION_FEEDBACK_NOTE.formLinkText}
          </a>{' '}
          {DONATION_FEEDBACK_NOTE.middleText}{' '}
          <a
            href={DONATION_FEEDBACK_NOTE.contributingUrl}
            className="impact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {DONATION_FEEDBACK_NOTE.contributingLinkText}
          </a>
          .
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DonorDetail;
