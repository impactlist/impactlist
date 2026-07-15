import { useMemo } from 'react';
import { extractYearFromDonation } from '../utils/donationDataHelpers';
import { getCostPerLifeForRecipientCategoryFromCombined } from '../utils/assumptionsDataHelpers';

export const OTHER_CAUSES_NAME = 'Other Causes';

const formatDonationPercentage = (value, total) => (total > 0 ? ((value / total) * 100).toFixed(1) : '0.0');

// grossTotal is the sum of absolute per-category values: against a signed net
// total, mixed-sign categories inflate past 100% (and a deadly category reads
// as a positive share of a shrunken denominator).
const formatLivesSavedPercentage = (value, grossTotal) =>
  grossTotal > 0 ? ((Math.abs(value) / grossTotal) * 100).toFixed(1) : '0.0';

const buildCategoryChartData = (combinedAssumptions, donations, maxCategories) => {
  // Accumulate per category NAME (multiple recipients can share a category).
  const entriesByCategoryName = {};
  let donationsTotal = 0;

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
    });
  });

  const entries = Object.values(entriesByCategoryName);
  const livesSavedAbsTotal = entries.reduce((total, entry) => total + Math.abs(entry.livesSavedValue), 0);

  const rows = entries.map((entry) => ({
    name: entry.name,
    categoryId: entry.categoryId,
    donationValue: entry.donationValue,
    livesSavedValue: entry.livesSavedValue,
    effectiveCostPerLife: entry.livesSavedValue !== 0 ? entry.donationValue / entry.livesSavedValue : Infinity,
    donationPercentage: formatDonationPercentage(entry.donationValue, donationsTotal),
    livesSavedPercentage: formatLivesSavedPercentage(entry.livesSavedValue, livesSavedAbsTotal),
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
      // The share describes THE BAR (the collapsed rows' net), like every
      // other row. When mixed-sign rows cancel inside Other, the visible
      // shares deliberately total less than 100% — the alternative (counting
      // collapsed magnitudes) could label a zero-length bar "50%".
      livesSavedPercentage: formatLivesSavedPercentage(otherLivesSavedTotal, livesSavedAbsTotal),
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
