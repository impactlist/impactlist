// Helper functions for donation and impact calculations
import { categoriesById, donorsById, recipientsById, donations } from '../data/generatedData';
import { SIMULATION_AMOUNT, WEIGHT_NORMALIZATION_TOLERANCE } from './constants';
import {
  assertExists,
  assertPositiveNumber,
  assertNonZeroNumber,
  validateRecipient,
  crashInsteadOfFallback,
} from './dataValidation';
import { calculateCategoryBaseCostPerLife, applyRecipientEffectModifications } from './effectsCalculation';

// Helper to get category by ID
export const getCategoryById = (categoryId) => {
  if (!categoryId) return null;
  return categoriesById[categoryId] || null;
};

// Helper to get recipient by ID
export const getRecipientById = (recipientId) => {
  if (!recipientId) return null;

  const recipient = recipientsById[recipientId];
  if (!recipient) {
    throw new Error(`Invalid recipient: ${recipientId}. This recipient does not exist in recipientsById.`);
  }
  return recipient;
};

// Helper to get donor by ID
export const getDonorById = (donorId) => {
  if (!donorId) return null;
  return donorsById[donorId] || null;
};

// Helper to get all recipients as an array
export const getAllRecipients = () => Object.values(recipientsById);

// Helper to get all donors as an array
export const getAllDonors = () => Object.values(donorsById);

// Get primary category for a recipient
export const getPrimaryCategoryForRecipient = (recipientId) => {
  const recipient = recipientsById[recipientId];
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
    const category = getCategoryById(categoryId);
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

    const primaryCategory = getCategoryById(primaryCategoryId);
    return {
      categoryId: primaryCategoryId,
      categoryName: primaryCategory?.name || primaryCategoryId,
      count: categoryCount,
    };
  }
};

// Helper to get all categories as an array
export const getAllCategories = () => {
  // Convert to array of objects with id included
  return Object.entries(categoriesById).map(([id, data]) => ({
    ...data,
    id, // Include the ID in the object
  }));
};

// Helper to find an entity's ID by its object reference
export const findEntityId = (entityObj, entitiesById) => {
  return Object.keys(entitiesById).find((id) => entitiesById[id] === entityObj);
};

// Helper to find recipient ID by recipient object
export const getRecipientId = (recipientObj) => {
  return findEntityId(recipientObj, recipientsById);
};

// Helper to find donor ID by donor object
export const getDonorId = (donorObj) => {
  return findEntityId(donorObj, donorsById);
};

// Get a recipient's name by ID
export const getRecipientNameById = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return recipient.name;
};

// Get a donor's name by ID
export const getDonorNameById = (donorId) => {
  const donor = donorsById[donorId];
  if (!donor) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donor.name;
};

// Get the effective costPerLife for a given category, considering custom values if they exist
export const getDefaultCostPerLifeForCategory = (categoryId, customValues = null) => {
  // Validate inputs
  assertExists(categoryId, 'categoryId');

  // If we have custom values for this category, use them
  if (customValues && customValues[categoryId] !== undefined) {
    return assertNonZeroNumber(customValues[categoryId], `customValues[${categoryId}]`);
  }

  // Get category from data
  const category = categoriesById[categoryId];
  if (!category) {
    throw new Error(`Invalid category ID: "${categoryId}". This category does not exist in categoriesById.`);
  }

  // Calculate cost per life from effects (replaces old category.costPerLife access)
  return calculateCategoryBaseCostPerLife(category, categoryId);
};

// From the category data within a recipient, get the actual cost per life, taking into account custom values if they exist
export const getActualCostPerLifeForCategoryData = (recipientId, categoryId, categoryData, customValues = null) => {
  // Validate inputs
  assertExists(recipientId, 'recipientId');
  assertExists(categoryId, 'categoryId');
  assertExists(categoryData, 'categoryData', `for category ${categoryId} in recipient ${recipientId}`);
  assertPositiveNumber(
    categoryData.fraction,
    'categoryData.fraction',
    `for category ${categoryId} in recipient ${recipientId}`
  );

  const recipientName = getRecipientNameById(recipientId);

  // Get base cost per life from category (using new effects-based calculation)
  let baseCostPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);

  // Check for recipient-specific effect modifications in the new format
  if (categoryData.effects && Array.isArray(categoryData.effects)) {
    // Apply recipient effect modifications
    const category = categoriesById[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found when processing recipient effects`);
    }

    // For now, apply modifications from the first effect that matches the category's first effect
    // TODO: Implement proper multi-effect handling
    if (category.effects && category.effects.length > 0 && categoryData.effects.length > 0) {
      const categoryEffect = category.effects[0];
      const recipientEffect = categoryData.effects.find((re) => re.effectId === categoryEffect.effectId);

      if (recipientEffect) {
        const context = `for recipient ${recipientName} category ${categoryId}`;
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

// Get the primary (highest weight) category for a recipient
export const getPrimaryCategoryId = (recipientId) => {
  const recipient = recipientsById[recipientId];
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

// Calculate weighted average cost per life for a recipient
export const getCostPerLifeForRecipient = (recipientId, customValues = null) => {
  // Validate inputs
  assertExists(recipientId, 'recipientId');

  const recipient = recipientsById[recipientId];
  if (!recipient) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found in recipientsById.`);
  }

  // Validate recipient structure
  validateRecipient(recipient, recipientId);

  let totalWeight = 0;
  const spendingTotal = assertPositiveNumber(SIMULATION_AMOUNT, 'SIMULATION_AMOUNT');
  let totalLivesSaved = 0;

  // Go through each category and calculate weighted costs
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    const weight = assertPositiveNumber(
      categoryData.fraction,
      'categoryData.fraction',
      `for category ${categoryId} in recipient ${recipient.name}`
    );
    totalWeight += weight;

    const costPerLife = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
    const validCostPerLife = assertNonZeroNumber(
      costPerLife,
      'costPerLife',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    totalLivesSaved += (spendingTotal * weight) / validCostPerLife;
  }

  // Ensure total weight is normalized
  if (Math.abs(totalWeight - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }

  // This should never happen after validation, but check anyway
  if (totalWeight === 0) {
    crashInsteadOfFallback(`No valid categories with positive weights found for recipient ${recipient.name}`);
  }

  if (totalLivesSaved === 0) {
    crashInsteadOfFallback(`Total lives saved calculation resulted in zero for recipient ${recipient.name}`);
  }

  return spendingTotal / totalLivesSaved;
};

// Get the cost per life for all categories in a recipient
export const getAllCategoryCostsPerLifeWithinRecipient = (recipientId, customValues = null) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}`);
  }

  const result = {};

  // Calculate cost per life for each category
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in recipient ${recipient.name}.`);
    }

    result[categoryId] = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
  }

  return result;
};

// Get a breakdown of categories for a recipient
export const getCategoryBreakdown = (recipientId) => {
  const recipient = recipientsById[recipientId];
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

// Helper to get total amount donated by a donor
export const getTotalAmountForDonor = (donorId) => {
  const donorDonations = getDonationsForDonor(donorId);
  if (donorDonations.length === 0) {
    throw new Error(`No donations found for donor: ${donorId}.`);
  }
  return donorDonations.reduce((total, donation) => total + donation.amount, 0);
};

// Helper to calculate lives saved for a specific donation
export const calculateLivesSavedForDonation = (donation, customValues = null) => {
  // Validate donation structure
  assertExists(donation, 'donation');
  assertExists(donation.recipientId, 'donation.recipientId');
  assertPositiveNumber(donation.amount, 'donation.amount');

  const costPerLife = getCostPerLifeForRecipient(donation.recipientId, customValues);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for recipient ${donation.recipientId}`);

  // Apply credit multiplier if it exists
  let credit = 1;
  if (donation.credit !== undefined) {
    credit = assertPositiveNumber(donation.credit, 'donation.credit');
  }

  const creditedAmount = donation.amount * credit;

  // Calculate lives saved
  return creditedAmount / validCostPerLife;
};

// Helper to calculate lives saved for a direct donation to a category
export const calculateLivesSavedForCategory = (categoryId, amount, customValues = null) => {
  // Validate inputs
  assertExists(categoryId, 'categoryId');
  assertExists(amount, 'amount');

  const validAmount = assertPositiveNumber(Number(amount), 'amount', `for category ${categoryId}`);

  // Get the cost per life for this category
  const costPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for category ${categoryId}`);

  // Calculate lives saved
  return validAmount / validCostPerLife;
};

// Calculate donor statistics, including donations and lives saved
export const calculateDonorStats = (customValues = null) => {
  const donorStats = getAllDonors().map((donor) => {
    const donorId = Object.keys(donorsById).find((id) => donorsById[id] === donor);
    if (!donorId) {
      throw new Error(`Could not find ID for donor ${donor.name}`);
    }

    const donorData = getDonationsForDonor(donorId);

    let totalDonated = 0;
    let totalLivesSaved = 0;
    let knownDonations = 0;

    // Calculate totals based on actual donations
    for (const donation of donorData) {
      const creditedAmount = donation.amount * donation.credit;
      totalDonated += creditedAmount;
      knownDonations += creditedAmount;

      const livesSaved = calculateLivesSavedForDonation(donation, customValues);
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

  // Add rank
  return filteredStats.map((donor, index) => ({
    ...donor,
    rank: index + 1,
  }));
};

/**
 * Get the effective cost per life for any entity (donation, recipient, category, etc.)
 * This is a centralized function that handles all cost per life calculations
 * and can be extended in the future to support more complex impact calculations.
 *
 * @param {Object} entity - The entity to calculate cost per life for
 * @param {Object|null} customValues - Custom values for cost per life calculations
 * @returns {number} The effective cost per life
 */
export const getEffectiveCostPerLife = (entity, customValues = null) => {
  if (!entity) {
    return 0;
  }

  // If entity has a direct costPerLife field, use it
  if (entity.costPerLife !== undefined) {
    return entity.costPerLife;
  }

  // If entity has recipientId, calculate for recipient
  if (entity.recipientId) {
    return getCostPerLifeForRecipient(entity.recipientId, customValues);
  }

  // If entity has categoryId, get default for category
  if (entity.categoryId) {
    return getDefaultCostPerLifeForCategory(entity.categoryId, customValues);
  }

  throw new Error('No valid calculation method found for cost per life.');
};
