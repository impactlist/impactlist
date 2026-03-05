import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import { useAssumptions } from '../contexts/AssumptionsContext';
import {
  getCostPerLifeFromCombined,
  createCombinedAssumptions,
  calculateCategoryBreakdownForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../utils/donationDataHelpers';
import EntityStatistics from '../components/entity/EntityStatistics';
import SampleDonationCalculator from '../components/shared/SampleDonationCalculator';
import { donations } from '../data/generatedData';
import MarkdownContent from '../components/shared/MarkdownContent';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const { combinedAssumptions } = useAssumptions();
  const handleEditCategoryAssumptions = () => {
    navigate(`/assumptions?tab=categories&categoryId=${categoryId}`);
  };

  useEffect(() => {
    // Get category info
    const category = combinedAssumptions.getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Invalid category ID: ${categoryId}. This category does not exist.`);
    }

    // Get cost per life for this category using combined assumptions
    const currentYear = getCurrentYear();
    const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId, currentYear);
    // Get default cost per life (without custom values)
    const defaultCombinedAssumptions = createCombinedAssumptions(null);
    const defaultCostPerLife = getCostPerLifeFromCombined(defaultCombinedAssumptions, categoryId, currentYear);

    // Calculate total donated to this category and lives saved
    let totalDonated = 0;
    let totalLivesSaved = 0;

    // Loop through all donations and add up amounts/lives for this category
    donations.forEach((donation) => {
      const categoryBreakdown = calculateCategoryBreakdownForDonationFromCombined(combinedAssumptions, donation);
      const targetCategory = categoryBreakdown.find((entry) => entry.categoryId === categoryId);
      if (!targetCategory) return;

      totalDonated += targetCategory.amount;
      totalLivesSaved += targetCategory.livesSaved;
    });

    setCategoryInfo({
      name: category.name,
      costPerLife,
      defaultCostPerLife,
      totalDonated,
      totalLivesSaved,
      content: category.content,
    });
  }, [categoryId, combinedAssumptions]);

  if (!categoryInfo) {
    return <div className="impact-loading">Loading...</div>;
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

        {/* Category stats card */}
        <EntityStatistics
          stats={{
            totalLivesSaved: categoryInfo.totalLivesSaved,
            costPerLife: categoryInfo.costPerLife,
            defaultCostPerLife: categoryInfo.defaultCostPerLife,
            totalReceived: categoryInfo.totalDonated,
          }}
          entityType="recipient" // Reuse recipient styling
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
