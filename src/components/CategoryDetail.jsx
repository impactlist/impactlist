import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import { getRecipientById, calculateLivesSavedForDonation } from '../utils/donationDataHelpers';
import { useGlobalParameters } from './GlobalParametersContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import EntityStatistics from './entity/EntityStatistics';
import { donations, categoriesById } from '../data/generatedData';
import MarkdownContent from './MarkdownContent';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const { customEffectivenessData, openModal } = useGlobalParameters();

  useEffect(() => {
    // Get category info directly from generated data
    const category = categoriesById[categoryId];

    if (!category) {
      throw new Error(`Invalid category ID: ${categoryId}. This category does not exist.`);
    }

    // Calculate total donated to this category and lives saved
    let totalDonated = 0;
    let totalLivesSaved = 0;

    // Process donations and calculate impact using the new effects system
    donations.forEach((donation) => {
      const recipientId = donation.recipientId;
      const recipient = getRecipientById(recipientId);

      if (recipient && recipient.effects) {
        // Check if recipient has effects in this category
        const hasEffectInCategory = recipient.effects.some((effect) => effect.categoryId === categoryId);

        if (hasEffectInCategory) {
          const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;

          // For category totals, we need to calculate the fraction that goes to this category
          const categoryEffects = recipient.effects.filter((effect) => effect.categoryId === categoryId);
          const totalFraction = categoryEffects.reduce((sum, effect) => sum + effect.fraction, 0);

          totalDonated += creditedAmount * totalFraction;

          // Calculate lives saved using the new effects system
          totalLivesSaved += calculateLivesSavedForDonation(donation) * totalFraction;
        }
      }
    });

    setCategoryInfo({
      name: category.name,
      totalDonated,
      totalLivesSaved,
      content: category.content,
    });
  }, [categoryId, customEffectivenessData]);

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
