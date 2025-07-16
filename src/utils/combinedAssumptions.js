// Combined assumptions utilities
// This creates a unified data structure that combines default data with custom overrides
import { globalParameters, categoriesById, recipientsById } from '../data/generatedData';
import { calculateCategoryBaseCostPerLife } from './effectsCalculation';
import { assertExists } from './dataValidation';

/**
 * Create a combined assumptions object that merges default data with custom overrides
 * @param {Object|null} customData - Custom data from user input in new effects format (can be null)
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
