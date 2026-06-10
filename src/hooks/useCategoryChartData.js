import { useMemo } from 'react';
import { extractYearFromDonation } from '../utils/donationDataHelpers';
import { getCostPerLifeForRecipientCategoryFromCombined } from '../utils/assumptionsDataHelpers';

export const OTHER_CAUSES_NAME = 'Other Causes';

const formatDonationPercentage = (value, total) => (total > 0 ? ((value / total) * 100).toFixed(1) : '0.0');

const formatLivesSavedPercentage = (value, total) =>
  total !== 0 ? ((Math.abs(value) / Math.abs(total)) * 100).toFixed(1) : '0.0';

const buildCategoryChartData = (combinedAssumptions, donations, maxCategories) => {
  // Accumulate per category NAME (multiple recipients can share a category).
  const entriesByCategoryName = {};
  let donationsTotal = 0;
  let livesSavedTotal = 0;

  donations.forEach((donation) => {
    const recipient = combinedAssumptions.getRecipientById(donation.recipientId);
    if (!recipient) {
      throw new Error(`Recipient not found: ${donation.recipientId}. This recipient needs to be added.`);
    }

    const donationYear = extractYearFromDonation(donation);

    Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
      const category = combinedAssumptions.getCategoryById(categoryId);
      if (!category) {
        throw new Error(`Invalid category ID: ${categoryId}. This category does not exist.`);
      }

      const costPerLife = getCostPerLifeForRecipientCategoryFromCombined(
        combinedAssumptions,
        donation.recipientId,
        categoryId,
        donationYear
      );

      const categoryAmount = donation.creditedAmount * categoryData.fraction;
      const livesSaved = costPerLife !== 0 ? categoryAmount / costPerLife : 0;

      const entry = (entriesByCategoryName[category.name] ??= {
        name: category.name,
        categoryId,
        donationValue: 0,
        livesSavedValue: 0,
      });
      entry.donationValue += categoryAmount;
      entry.livesSavedValue += livesSaved;
      donationsTotal += categoryAmount;
      livesSavedTotal += livesSaved;
    });
  });

  const rows = Object.values(entriesByCategoryName).map((entry) => ({
    name: entry.name,
    categoryId: entry.categoryId,
    donationValue: entry.donationValue,
    livesSavedValue: entry.livesSavedValue,
    effectiveCostPerLife: entry.livesSavedValue !== 0 ? entry.donationValue / entry.livesSavedValue : Infinity,
    donationPercentage: formatDonationPercentage(entry.donationValue, donationsTotal),
    livesSavedPercentage: formatLivesSavedPercentage(entry.livesSavedValue, livesSavedTotal),
  }));

  rows.sort((a, b) => b.donationValue - a.donationValue);

  if (rows.length <= maxCategories) {
    return rows;
  }

  // Keep the largest categories and collapse the tail into one "Other" row
  // (which deliberately has no categoryId — it isn't a linkable cause).
  const topRows = rows.slice(0, maxCategories - 1);
  const otherRows = rows.slice(maxCategories - 1);
  const otherDonationTotal = otherRows.reduce((total, row) => total + row.donationValue, 0);
  const otherLivesSavedTotal = otherRows.reduce((total, row) => total + row.livesSavedValue, 0);

  if (otherDonationTotal > 0 || otherLivesSavedTotal !== 0) {
    topRows.push({
      name: OTHER_CAUSES_NAME,
      donationValue: otherDonationTotal,
      livesSavedValue: otherLivesSavedTotal,
      effectiveCostPerLife: otherLivesSavedTotal !== 0 ? otherDonationTotal / otherLivesSavedTotal : Infinity,
      donationPercentage: formatDonationPercentage(otherDonationTotal, donationsTotal),
      livesSavedPercentage: formatLivesSavedPercentage(otherLivesSavedTotal, livesSavedTotal),
    });
  }

  return topRows;
};

/**
 * Aggregate donations into per-category chart rows showing both donation
 * amounts and lives saved (the two views of the entity category chart).
 *
 * Each donation is split across its recipient's categories by fraction, with
 * lives saved computed from the recipient+category cost per life for the
 * donation's year. Rows are sorted by donation amount; when there are more
 * than `maxCategories` rows the tail collapses into an "Other Causes" row.
 *
 * Pass only real donations (no synthesized "unknown amount" rows).
 */
const useCategoryChartData = (combinedAssumptions, donations, { maxCategories = Infinity } = {}) =>
  useMemo(
    () => buildCategoryChartData(combinedAssumptions, donations, maxCategories),
    [combinedAssumptions, donations, maxCategories]
  );

export default useCategoryChartData;
