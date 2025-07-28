// Combined assumptions utilities
// This creates a unified data structure that combines default data with custom overrides
import { globalParameters, categoriesById, recipientsById, donorsById } from '../data/generatedData';
import { calculateCategoryBaseCostPerLife, applyRecipientEffectModifications } from './effectsCalculation';
import {
  assertExists,
  assertPositiveNumber,
  assertNonZeroNumber,
  validateRecipient,
  crashInsteadOfFallback,
} from './dataValidation';
import { SIMULATION_AMOUNT, WEIGHT_NORMALIZATION_TOLERANCE } from './constants';
import { getAllDonors, getDonationsForDonor } from './donationDataHelpers';

/**
 * Create a combined assumptions object that merges default data with custom overrides
 * @param {Object|null} customData - Custom data from user input in effects format (can be null)
 * @returns {Object} Combined assumptions object with all raw data unified
 */
export const createCombinedAssumptions = (customData = null) => {
  // Start with global parameters, applying any custom overrides
  const combined = {
    globalParameters: {
      ...globalParameters,
      ...(customData?.globalParameters || {}),
    },
    categories: {},
    recipients: {},
  };

  // Process categories - combine default effects data with custom effect overrides
  Object.entries(categoriesById).forEach(([categoryId, categoryData]) => {
    const customCategoryData = customData?.categories?.[categoryId];

    combined.categories[categoryId] = {
      ...categoryData,
      // Apply custom effects if they exist, otherwise keep default effects
      effects: customCategoryData?.effects || categoryData.effects,
    };
  });

  // Process recipients - combine default category data with custom effect overrides
  Object.entries(recipientsById).forEach(([recipientId, recipientData]) => {
    const customRecipientData = customData?.recipients?.[recipientId];
    const recipientCategories = {};

    Object.entries(recipientData.categories).forEach(([categoryId, categoryData]) => {
      const customRecipientCategoryData = customRecipientData?.categories?.[categoryId];

      // Start with default category data
      let processedCategoryData = { ...categoryData };

      // Apply custom effects if they exist
      if (customRecipientCategoryData?.effects) {
        processedCategoryData.effects = customRecipientCategoryData.effects;
      }

      recipientCategories[categoryId] = processedCategoryData;
    });

    combined.recipients[recipientId] = {
      ...recipientData,
      categories: recipientCategories,
    };
  });

  return combined;
};

/**
 * Get the effective cost per life for a category from combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} categoryId - The category ID
 * @returns {number} The effective cost per life calculated from effects
 */
export const getCostPerLifeFromCombined = (combinedAssumptions, categoryId) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(categoryId, 'categoryId');

  const category = combinedAssumptions.categories[categoryId];
  if (!category) {
    throw new Error(`Category ${categoryId} not found in combined assumptions`);
  }

  // Calculate cost per life from the effects data
  return calculateCategoryBaseCostPerLife(category, categoryId);
};

/**
 * Get recipient data from combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} recipientId - The recipient ID
 * @returns {Object} The recipient data with processed categories
 */
export const getRecipientFromCombined = (combinedAssumptions, recipientId) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(recipientId, 'recipientId');

  const recipient = combinedAssumptions.recipients[recipientId];
  if (!recipient) {
    throw new Error(`Recipient ${recipientId} not found in combined assumptions`);
  }

  return recipient;
};

/**
 * Convert a simple cost per life value to effects format
 * @param {number} costPerLife - The cost per life value
 * @returns {Object} Effect object in new format
 */
export const costPerLifeToEffect = (costPerLife) => {
  assertExists(costPerLife, 'costPerLife');
  assertExists(globalParameters, 'globalParameters');
  assertExists(globalParameters.yearsPerLife, 'globalParameters.yearsPerLife');

  return {
    effectId: 'user-override',
    startTime: 0,
    windowLength: 1,
    costPerQALY: costPerLife / globalParameters.yearsPerLife,
  };
};

/**
 * Convert an effects object back to simple cost per life for display
 * @param {Object} effect - The effect object
 * @returns {number} Cost per life value
 */
export const effectToCostPerLife = (effect) => {
  assertExists(effect, 'effect');
  assertExists(effect.costPerQALY, 'effect.costPerQALY');
  assertExists(globalParameters, 'globalParameters');
  assertExists(globalParameters.yearsPerLife, 'globalParameters.yearsPerLife');

  return effect.costPerQALY * globalParameters.yearsPerLife;
};

/**
 * Calculate weighted cost per life for a recipient using combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} recipientId - Recipient ID
 * @returns {number} Cost per life for the recipient
 */
export const getCostPerLifeForRecipientFromCombined = (combinedAssumptions, recipientId) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(recipientId, 'recipientId');

  const recipient = getRecipientFromCombined(combinedAssumptions, recipientId);
  validateRecipient(recipient, recipientId);

  let totalWeight = 0;
  let totalLivesSaved = 0;
  const spendingTotal = SIMULATION_AMOUNT;

  Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
    const weight = assertPositiveNumber(
      categoryData.fraction,
      'categoryData.fraction',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    totalWeight += weight;

    const category = combinedAssumptions.categories[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found in combined assumptions`);
    }

    let costPerLife = calculateCategoryBaseCostPerLife(category, categoryId);

    if (categoryData.effects && category.effects && category.effects.length > 0) {
      const categoryEffect = category.effects[0];
      const recipientEffect = categoryData.effects.find((e) => e.effectId === categoryEffect.effectId);
      if (recipientEffect) {
        const context = `for recipient ${recipient.name} category ${categoryId}`;
        costPerLife = applyRecipientEffectModifications(costPerLife, recipientEffect, categoryEffect.effectId, context);
      }
    }

    const validCostPerLife = assertNonZeroNumber(
      costPerLife,
      'costPerLife',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    totalLivesSaved += (spendingTotal * weight) / validCostPerLife;
  });

  if (Math.abs(totalWeight - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }

  if (totalWeight === 0) {
    crashInsteadOfFallback(`No valid categories with positive weights found for recipient ${recipient.name}`);
  }

  if (totalLivesSaved === 0) {
    crashInsteadOfFallback(`Total lives saved calculation resulted in zero for recipient ${recipient.name}`);
  }

  return spendingTotal / totalLivesSaved;
};

/**
 * Calculate lives saved for a donation using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {Object} donation - Donation record
 * @returns {number} Lives saved for this donation
 */
export const calculateLivesSavedForDonationFromCombined = (combinedAssumptions, donation) => {
  assertExists(donation, 'donation');
  assertExists(donation.recipientId, 'donation.recipientId');
  assertPositiveNumber(donation.amount, 'donation.amount');

  const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, donation.recipientId);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for recipient ${donation.recipientId}`);

  let credit = 1;
  if (donation.credit !== undefined) {
    credit = assertPositiveNumber(donation.credit, 'donation.credit');
  }

  const creditedAmount = donation.amount * credit;
  return creditedAmount / validCostPerLife;
};

/**
 * Calculate lives saved for a category donation using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {string} categoryId - Category ID
 * @param {number} amount - Donation amount
 * @returns {number} Lives saved for this category donation
 */
export const calculateLivesSavedForCategoryFromCombined = (combinedAssumptions, categoryId, amount) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(categoryId, 'categoryId');
  assertPositiveNumber(amount, 'amount');

  const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for category ${categoryId}`);

  return amount / validCostPerLife;
};

/**
 * Calculate donor statistics using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @returns {Array} Array of donor statistics
 */
export const calculateDonorStatsFromCombined = (combinedAssumptions) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');

  const donorStats = getAllDonors().map((donor) => {
    const donorId = Object.keys(donorsById).find((id) => donorsById[id] === donor);
    if (!donorId) {
      throw new Error(`Could not find ID for donor ${donor.name}`);
    }

    const donorData = getDonationsForDonor(donorId);

    let totalDonated = 0;
    let totalLivesSaved = 0;
    let knownDonations = 0;

    // Calculate totals based on actual donations using combined assumptions
    for (const donation of donorData) {
      const creditedAmount = donation.amount * donation.credit;
      totalDonated += creditedAmount;
      knownDonations += creditedAmount;

      const livesSaved = calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation);
      totalLivesSaved += livesSaved;
    }

    // Handle known totalDonated field if available
    let totalDonatedField = null;
    let unknownLivesSaved = 0;

    if (donor.totalDonated && donor.totalDonated > knownDonations) {
      totalDonatedField = donor.totalDonated;

      // Calculate unknown amount
      const unknownAmount = donor.totalDonated - knownDonations;

      // Estimate lives saved for unknown donations if there are known donations
      if (knownDonations > 0 && totalLivesSaved !== 0) {
        const avgCostPerLife = knownDonations / totalLivesSaved;
        unknownLivesSaved = unknownAmount / avgCostPerLife;
        totalLivesSaved += unknownLivesSaved;
      }

      // Add unknown amount to total
      totalDonated = donor.totalDonated;
    }

    // Calculate cost per life saved
    const costPerLife = totalLivesSaved !== 0 ? totalDonated / totalLivesSaved : Infinity;

    return {
      name: donor.name,
      id: donorId,
      netWorth: donor.netWorth,
      totalDonated,
      knownDonations,
      totalDonatedField,
      totalLivesSaved,
      unknownLivesSaved,
      costPerLife: costPerLife,
    };
  });

  // Filter out donors with no donations and sort by lives saved
  const filteredStats = donorStats
    .filter((donor) => donor.totalDonated > 0)
    .sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);

  return filteredStats;
};

/**
 * Get actual cost per life for a specific category within a recipient using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {string} recipientId - Recipient ID
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Category data from recipient
 * @returns {number} Cost per life for this category
 */
export const getActualCostPerLifeForCategoryDataFromCombined = (
  combinedAssumptions,
  recipientId,
  categoryId,
  categoryData
) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(recipientId, 'recipientId');
  assertExists(categoryId, 'categoryId');
  assertExists(categoryData, 'categoryData', `for category ${categoryId} in recipient ${recipientId}`);
  assertPositiveNumber(
    categoryData.fraction,
    'categoryData.fraction',
    `for category ${categoryId} in recipient ${recipientId}`
  );

  // Get base cost per life from combined assumptions
  let baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId);

  // Check for recipient-specific effect modifications
  const recipient = combinedAssumptions.recipients[recipientId];
  if (
    recipient &&
    recipient.categories &&
    recipient.categories[categoryId] &&
    recipient.categories[categoryId].effects
  ) {
    const recipientCategoryData = recipient.categories[categoryId];
    const category = combinedAssumptions.categories[categoryId];

    if (category && category.effects && category.effects.length > 0 && recipientCategoryData.effects.length > 0) {
      const categoryEffect = category.effects[0];
      const recipientEffect = recipientCategoryData.effects.find((re) => re.effectId === categoryEffect.effectId);

      if (recipientEffect) {
        const context = `for recipient ${recipientId} category ${categoryId}`;
        baseCostPerLife = applyRecipientEffectModifications(
          baseCostPerLife,
          recipientEffect,
          categoryEffect.effectId,
          context
        );
      }
    }
  }

  return baseCostPerLife;
};
