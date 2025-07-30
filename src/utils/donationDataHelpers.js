// Helper functions for donation and impact calculations
import { globalParameters, categoriesById, donorsById, recipientsById, donations } from '../data/generatedData';
import { calculateCategoryBaseCostPerLife, applyRecipientEffectToBase } from './effectsCalculation';

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

// Helper to find recipient ID by recipient object
export const getRecipientId = (recipientObj) => {
  return Object.keys(recipientsById).find((id) => recipientsById[id] === recipientObj);
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

/**
 * Check if a recipient has effect overrides for a specific category
 * @param {string} recipientId - The recipient ID
 * @param {string} categoryId - The category ID
 * @returns {boolean} True if the recipient has effect overrides for this category
 */
export const recipientHasEffectOverrides = (recipientId, categoryId) => {
  const recipient = recipientsById[recipientId];
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

/**
 * Get the default multiplier for a recipient category from effects
 * @param {string} recipientId - The recipient ID
 * @param {string} categoryId - The category ID
 * @returns {number|null} The effective multiplier, or null if none
 */
export const getRecipientDefaultMultiplier = (recipientId, categoryId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    return null;
  }

  const categoryData = recipient.categories[categoryId];
  if (!categoryData || !categoryData.effects || !Array.isArray(categoryData.effects)) {
    return null;
  }

  // Get the category's base effects to compare against
  const category = categoriesById[categoryId];
  if (!category || !category.effects || category.effects.length === 0) {
    return null;
  }

  // Check if any of the recipient effects have multipliers
  const hasMultipliers = categoryData.effects.some(
    (effect) => effect.multipliers && Object.keys(effect.multipliers).length > 0
  );

  if (!hasMultipliers) {
    return null;
  }

  // Calculate base cost per life for the category
  const baseCostPerLife = calculateCategoryBaseCostPerLife(category, categoryId, globalParameters);

  // Apply recipient modifications to all effects
  const modifiedEffects = category.effects.map((baseEffect) => {
    const recipientEffect = categoryData.effects.find((e) => e.effectId === baseEffect.effectId);
    if (recipientEffect) {
      const context = `for recipient ${recipient.name} category ${categoryId}`;
      return applyRecipientEffectToBase(baseEffect, recipientEffect, context);
    }
    return baseEffect;
  });

  // Calculate modified cost per life
  const modifiedCategory = {
    name: category.name,
    effects: modifiedEffects,
  };
  const modifiedCostPerLife = calculateCategoryBaseCostPerLife(modifiedCategory, categoryId, globalParameters);

  // Multiplier is the ratio (inverted because lower cost per life = higher multiplier)
  return baseCostPerLife / modifiedCostPerLife;
};

/**
 * Get the default cost per life for a recipient category from effects
 * @param {string} recipientId - The recipient ID
 * @param {string} categoryId - The category ID
 * @returns {number|null} The effective cost per life override, or null if none
 */
export const getRecipientDefaultCostPerLife = (recipientId, categoryId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    return null;
  }

  const categoryData = recipient.categories[categoryId];
  if (!categoryData || !categoryData.effects || !Array.isArray(categoryData.effects)) {
    return null;
  }

  // Get the category's base effects
  const category = categoriesById[categoryId];
  if (!category || !category.effects || category.effects.length === 0) {
    return null;
  }

  // Check if any of the recipient effects have overrides
  const hasOverrides = categoryData.effects.some(
    (effect) => effect.overrides && Object.keys(effect.overrides).length > 0
  );

  if (!hasOverrides) {
    return null;
  }

  // Apply recipient modifications to all effects
  const modifiedEffects = category.effects.map((baseEffect) => {
    const recipientEffect = categoryData.effects.find((e) => e.effectId === baseEffect.effectId);
    if (recipientEffect && recipientEffect.overrides) {
      const context = `for recipient ${recipient.name} category ${categoryId}`;
      return applyRecipientEffectToBase(baseEffect, recipientEffect, context);
    }
    return baseEffect;
  });

  // Calculate cost per life from all modified effects
  const modifiedCategory = {
    name: category.name,
    effects: modifiedEffects,
  };
  return calculateCategoryBaseCostPerLife(modifiedCategory, categoryId, globalParameters);
};
