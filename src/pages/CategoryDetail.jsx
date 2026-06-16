import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import { useAssumptions } from '../contexts/AssumptionsContext';
import {
  getCostPerLifeFromCombined,
  getDefaultCombinedAssumptions,
  calculateCategoryBreakdownForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../utils/donationDataHelpers';
import EntityStatistics from '../components/entity/EntityStatistics';
import { CATEGORY_LIVES_SAVED_TOOLTIP, CATEGORY_COST_PER_LIFE_TOOLTIP } from '../constants/metricTooltips';
import SampleDonationCalculator from '../components/shared/SampleDonationCalculator';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';
import { donations } from '../data/generatedData';
import MarkdownContent from '../components/shared/MarkdownContent';
import NotFound from './NotFound';
import useDocumentTitle from '../hooks/useDocumentTitle';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { combinedAssumptions } = useAssumptions();

  // Unknown IDs are expected input (stale links); NotFound renders below.
  const category = combinedAssumptions.getCategoryById(categoryId);

  const categoryInfo = useMemo(() => {
    if (!category) return null;

    const currentYear = getCurrentYear();
    const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId, currentYear);
    // The default (non-customized) cost per life, shown for comparison.
    const defaultCostPerLife = getCostPerLifeFromCombined(getDefaultCombinedAssumptions(), categoryId, currentYear);

    // Total donated to this category and lives saved, across all donations
    let totalDonated = 0;
    let totalLivesSaved = 0;
    donations.forEach((donation) => {
      const categoryBreakdown = calculateCategoryBreakdownForDonationFromCombined(combinedAssumptions, donation);
      const targetCategory = categoryBreakdown.find((entry) => entry.categoryId === categoryId);
      if (!targetCategory) return;

      totalDonated += targetCategory.amount;
      totalLivesSaved += targetCategory.livesSaved;
    });

    return {
      name: category.name,
      costPerLife,
      defaultCostPerLife,
      totalDonated,
      totalLivesSaved,
      content: category.content,
    };
  }, [categoryId, category, combinedAssumptions]);

  useDocumentTitle(categoryInfo?.name);

  const handleEditCategoryAssumptions = () => {
    navigate(`/assumptions?tab=categories&categoryId=${categoryId}`);
  };

  if (!category) {
    return <NotFound message={`No cause area found with ID "${categoryId}".`} />;
  }

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
        {/* Category name */}
        <h1 className="impact-page__title">{categoryInfo.name}</h1>
        <AssumptionsSelector />

        {/* Category stats card */}
        <EntityStatistics
          stats={{
            totalLivesSaved: categoryInfo.totalLivesSaved,
            costPerLife: categoryInfo.costPerLife,
            defaultCostPerLife: categoryInfo.defaultCostPerLife,
            totalReceived: categoryInfo.totalDonated,
          }}
          entityType="recipient" // Reuse recipient styling
          livesSavedTooltip={CATEGORY_LIVES_SAVED_TOOLTIP}
          costPerLifeTooltip={CATEGORY_COST_PER_LIFE_TOOLTIP}
          costPerLifeAction={
            <button
              type="button"
              onClick={handleEditCategoryAssumptions}
              className="impact-btn impact-btn--secondary impact-btn--xs"
            >
              Edit
            </button>
          }
        />

        {/* Sample donation calculator */}
        <SampleDonationCalculator categoryId={categoryId} combinedAssumptions={combinedAssumptions} />

        {/* Category markdown content */}
        <MarkdownContent content={categoryInfo.content} className="mt-8 mb-8" />
      </motion.div>
    </motion.div>
  );
};

export default CategoryDetail;
