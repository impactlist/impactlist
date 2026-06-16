import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import {
  getPrimaryCategoryId,
  getCategoryBreakdown,
  getCreditedAmount,
  getDonationsForRecipient,
  getCurrentYear,
} from '../utils/donationDataHelpers';
import {
  getCostPerLifeForRecipientFromCombined,
  getCostPerLifeFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import { ImpactChartToggle } from '../components/charts/ImpactBarChart';
import { useAssumptions } from '../contexts/AssumptionsContext';
import EntityStatistics from '../components/entity/EntityStatistics';
import { RECIPIENT_LIVES_SAVED_TOOLTIP, RECIPIENT_COST_PER_LIFE_TOOLTIP } from '../constants/metricTooltips';
import EntityChartSection from '../components/entity/EntityChartSection';
import EntityDonationTable from '../components/entity/EntityDonationTable';
import MarkdownContent from '../components/shared/MarkdownContent';
import SampleDonationCalculator from '../components/shared/SampleDonationCalculator';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';
import NotFound from './NotFound';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCategoryChartData from '../hooks/useCategoryChartData';
import useChartViewTransition from '../hooks/useChartViewTransition';

const EMPTY_DONATIONS = [];

const RecipientDetail = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const { combinedAssumptions } = useAssumptions();

  // Unknown IDs are expected input (stale links); NotFound renders below.
  const recipient = combinedAssumptions.getRecipientById(recipientId);

  const pageData = useMemo(() => {
    if (!recipient) return null;

    const currentYear = getCurrentYear();
    const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, currentYear);

    const primaryCategoryId = getPrimaryCategoryId(combinedAssumptions, recipientId);
    const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId) || { name: 'Other' };
    const categoryCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, primaryCategoryId, currentYear);

    const categoryBreakdown = getCategoryBreakdown(combinedAssumptions, recipientId).map((category) => {
      const categoryInfo = combinedAssumptions.getCategoryById(category.categoryId);
      if (!categoryInfo) {
        throw new Error(`Invalid category ID: ${category.categoryId}. This category does not exist.`);
      }
      return {
        ...category,
        id: category.categoryId,
        name: categoryInfo.name,
        percentage: Math.round(category.fraction * 100),
      };
    });

    const recipientDonations = getDonationsForRecipient(recipientId)
      .map((donation) => ({
        ...donation,
        creditedAmount: getCreditedAmount(donation),
        totalLivesSaved: calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation),
        dateObj: new Date(donation.date),
      }))
      .sort((a, b) => b.dateObj - a.dateObj);

    return {
      recipientInfo: {
        name: recipient.name,
        categoryId: primaryCategoryId,
        categoryName: primaryCategory.name,
        categoryBreakdown,
        costPerLife,
        categoryCostPerLife,
        totalReceived: recipientDonations.reduce((sum, donation) => sum + donation.creditedAmount, 0),
        totalLivesSaved: recipientDonations.reduce((sum, donation) => sum + donation.totalLivesSaved, 0),
      },
      recipientContent: recipient.content,
      recipientDonations,
    };
  }, [recipientId, recipient, combinedAssumptions]);

  const rawChartData = useCategoryChartData(combinedAssumptions, pageData?.recipientDonations ?? EMPTY_DONATIONS);
  const { chartData, chartView, isTransitioning, handleChartViewChange } = useChartViewTransition(rawChartData);
  useDocumentTitle(pageData?.recipientInfo.name);

  if (!recipient) {
    return <NotFound message={`No recipient found with ID "${recipientId}".`} />;
  }

  const { recipientInfo, recipientContent, recipientDonations } = pageData;

  const handleEditRecipientAssumptions = () => {
    navigate(`/assumptions?tab=recipients&recipientId=${recipientId}&activeCategory=${recipientInfo.categoryId}`);
  };

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
        {/* Recipient name */}
        <h1 className="impact-page__title">{recipientInfo.name}</h1>
        <AssumptionsSelector />

        {/* Recipient stats card */}
        <EntityStatistics
          stats={{
            totalLivesSaved: recipientInfo.totalLivesSaved,
            costPerLife: recipientInfo.costPerLife,
            categoryCostPerLife: recipientInfo.categoryCostPerLife,
            totalReceived: recipientInfo.totalReceived,
            categoryBreakdown: recipientInfo.categoryBreakdown,
          }}
          entityType="recipient"
          livesSavedTooltip={RECIPIENT_LIVES_SAVED_TOOLTIP}
          costPerLifeTooltip={RECIPIENT_COST_PER_LIFE_TOOLTIP}
          costPerLifeAction={
            <button
              type="button"
              onClick={handleEditRecipientAssumptions}
              className="impact-btn impact-btn--secondary impact-btn--xs"
            >
              Edit
            </button>
          }
        />

        {/* Sample donation calculator */}
        <SampleDonationCalculator recipientId={recipientId} combinedAssumptions={combinedAssumptions} />

        {/* Cause Areas chart with toggle */}
        {recipientInfo.categoryBreakdown.length > 1 && (
          <EntityChartSection
            chartData={chartData}
            chartView={chartView}
            onViewChange={handleChartViewChange}
            isTransitioning={isTransitioning}
            toggleComponent={
              <ImpactChartToggle chartView={chartView} onToggle={handleChartViewChange} disabled={isTransitioning} />
            }
            entityType="recipient"
            combinedAssumptions={combinedAssumptions}
          />
        )}

        {/* Recipient markdown content */}
        <MarkdownContent content={recipientContent} className="mt-8 mb-8" />

        {/* Donations list */}
        <EntityDonationTable
          donations={recipientDonations}
          entityType="recipient"
          combinedAssumptions={combinedAssumptions}
        />
      </motion.div>
    </motion.div>
  );
};

export default RecipientDetail;
