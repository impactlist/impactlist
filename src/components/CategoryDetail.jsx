import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import { getCategoryById, getDefaultCostPerLifeForCategory, getRecipientById } from '../utils/donationDataHelpers';
import { useCostPerLife } from './CostPerLifeContext';
import { getCostPerLifeFromCombined } from '../utils/combinedAssumptions';
import CustomValuesIndicator from './CustomValuesIndicator';
import EntityStatistics from './entity/EntityStatistics';
import { donations } from '../data/generatedData';
import MarkdownContent from './MarkdownContent';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const { combinedAssumptions, openModal } = useCostPerLife();

  useEffect(() => {
    // Get category info
    const category = getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Invalid category ID: ${categoryId}. This category does not exist.`);
    }

    // Get cost per life for this category using combined assumptions
    const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId);
    // Get default cost per life (without custom values)
    const defaultCostPerLife = getDefaultCostPerLifeForCategory(categoryId, null);

    // Calculate total donated to this category and lives saved
    let totalDonated = 0;
    let totalLivesSaved = 0;

    // Loop through all donations and add up amounts for this category
    donations.forEach((donation) => {
      const recipientId = donation.recipientId;
      const recipient = getRecipientById(recipientId);

      if (recipient && recipient.categories && recipient.categories[categoryId]) {
        // This recipient donates to our category
        const categoryData = recipient.categories[categoryId];
        const fraction = categoryData.fraction || 0;

        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;

        // Calculate amount that goes to this category
        const amountToCategory = creditedAmount * fraction;
        totalDonated += amountToCategory;

        // Calculate lives saved
        const categorySpecificCostPerLife = costPerLife;
        if (categorySpecificCostPerLife !== 0) {
          totalLivesSaved += amountToCategory / categorySpecificCostPerLife;
        }
      }
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
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Category name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{categoryInfo.name}</h1>

        {/* Category stats card */}
        <EntityStatistics
          stats={{
            totalLivesSaved: categoryInfo.totalLivesSaved,
            costPerLife: categoryInfo.costPerLife,
            defaultCostPerLife: categoryInfo.defaultCostPerLife,
            totalReceived: categoryInfo.totalDonated,
          }}
          entityType="recipient" // Reuse recipient styling
          customValuesIndicator={<CustomValuesIndicator />}
          onAdjustAssumptions={openModal}
        />

        {/* Category markdown content */}
        <MarkdownContent content={categoryInfo.content} className="mt-8 mb-8" />
      </motion.div>
    </motion.div>
  );
};

export default CategoryDetail;
