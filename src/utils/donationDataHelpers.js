// Helper functions for donation and impact calculations
import { donorsById, recipientsById, donations } from '../data/generatedData';

// Helper to get donor by ID
export const getDonorById = (donorId) => {
  if (!donorId) return null;
  return donorsById[donorId] || null;
};

// Helper to get all donors as an array
export const getAllDonors = () => Object.entries(donorsById).map(([id, donor]) => ({ ...donor, id }));

// Get primary category for a recipient
export const getPrimaryCategoryForRecipient = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    return { categoryId: null, categoryName: 'Unknown', count: 0 };
  }

  const categories = recipient.categories;
  const categoryCount = Object.keys(categories).length;

  if (categoryCount === 0) {
    return { categoryId: null, categoryName: 'None', count: 0 };
  } else if (categoryCount === 1) {
    // Single category
    const categoryId = Object.keys(categories)[0];
    const category = combinedAssumptions.getCategoryById(categoryId);
    return {
      categoryId,
      categoryName: category?.name || categoryId,
      count: 1,
    };
  } else {
    // Multiple categories - find primary (highest fraction)
    let primaryCategoryId = null;
    let maxWeight = -1;

    for (const [catId, catData] of Object.entries(categories)) {
      if (catData.fraction > maxWeight) {
        maxWeight = catData.fraction;
        primaryCategoryId = catId;
      }
    }

    const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId);
    return {
      categoryId: primaryCategoryId,
      categoryName: primaryCategory?.name || primaryCategoryId,
      count: categoryCount,
    };
  }
};

// Helper to find recipient ID by recipient object
export const getRecipientId = (recipientObj) => {
  return recipientObj?.id;
};

// Helper to find donor ID by donor object
export const getDonorId = (donorObj) => {
  return donorObj?.id;
};

// Get the primary (highest weight) category for a recipient
export const getPrimaryCategoryId = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }

  let maxWeight = -1;
  let primaryCategoryId = null;

  // Find the category with the highest weight
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    const weight = categoryData.fraction;

    if (weight > maxWeight) {
      maxWeight = weight;
      primaryCategoryId = categoryId;
    }
  }

  if (primaryCategoryId === null) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }

  return primaryCategoryId;
};

// Get a breakdown of categories for a recipient
export const getCategoryBreakdown = (combinedAssumptions, recipientId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }

  // Convert categories object to an array with categoryId included
  const categories = Object.entries(recipient.categories).map(([categoryId, categoryData]) => {
    return {
      categoryId,
      ...categoryData,
    };
  });

  if (categories.length === 0) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }

  // Sort by fraction (weight) in descending order
  return categories.sort((a, b) => b.fraction - a.fraction);
};

// Helper to get donations for a specific donor
export const getDonationsForDonor = (donorId) => {
  if (!donorsById[donorId]) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donations.filter((donation) => donation.donorId === donorId);
};

// Helper to get donations for a specific recipient
export const getDonationsForRecipient = (recipientId) => {
  if (!recipientsById[recipientId]) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return donations.filter((donation) => donation.recipientId === recipientId);
};

// Helper to get total amount received by a recipient
export const getTotalAmountForRecipient = (recipientId) => {
  const recipientDonations = getDonationsForRecipient(recipientId);
  return recipientDonations.reduce((total, donation) => {
    const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
    return total + creditedAmount;
  }, 0);
};

/**
 * Extract year from donation date string
 * @param {Object} donation - Donation object with date field
 * @returns {number} Year as integer
 */
export const extractYearFromDonation = (donation) => {
  if (!donation || !donation.date) {
    throw new Error(`Donation missing date: ${JSON.stringify(donation)}`);
  }

  // Handle both "YYYY-MM-DD" and "YYYY" formats
  const dateStr = donation.date.toString();
  const year = parseInt(dateStr.substring(0, 4), 10);

  if (isNaN(year)) {
    throw new Error(`Could not extract valid year from donation date "${donation.date}"`);
  }

  return year;
};

/**
 * Get current year for UI calculations
 * @returns {number} Current year
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Check if a recipient has effect overrides for a specific category
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} recipientId - The recipient ID
 * @param {string} categoryId - The category ID
 * @returns {boolean} True if the recipient has effect overrides for this category
 */
export const recipientHasEffectOverrides = (combinedAssumptions, recipientId, categoryId) => {
  const recipient = combinedAssumptions.getRecipientById(recipientId);
  if (!recipient || !recipient.categories) {
    return false;
  }

  const categoryData = recipient.categories[categoryId];
  if (!categoryData || !categoryData.effects || !Array.isArray(categoryData.effects)) {
    return false;
  }

  // Check if any effect has overrides or multipliers
  return categoryData.effects.some((effect) => {
    const hasOverrides =
      effect.overrides && typeof effect.overrides === 'object' && Object.keys(effect.overrides).length > 0;
    const hasMultipliers =
      effect.multipliers && typeof effect.multipliers === 'object' && Object.keys(effect.multipliers).length > 0;
    return hasOverrides || hasMultipliers;
  });
};
