// Helper functions for the assumptions editor that work directly with
// defaultAssumptions and userAssumptions without needing combinedAssumptions

import { calculateCostPerLife } from './effectsCalculation';
import { mergeRecipientEffects } from './assumptionsDataHelpers';

/**
 * Get all categories from default assumptions
 * @param {Object} defaultAssumptions - Default assumptions object
 * @returns {Array} Array of category objects with id and name
 */
export const getAllCategoriesFromDefaults = (defaultAssumptions) => {
  if (!defaultAssumptions?.categories) return [];

  return Object.entries(defaultAssumptions.categories).map(([id, category]) => ({
    id,
    name: category.name,
    effects: category.effects,
    content: category.content,
  }));
};

/**
 * Get all recipients from default assumptions
 * @param {Object} defaultAssumptions - Default assumptions object
 * @returns {Array} Array of recipient objects with id, name, and categories
 */
export const getAllRecipientsFromDefaults = (defaultAssumptions) => {
  if (!defaultAssumptions?.recipients) return [];

  return Object.entries(defaultAssumptions.recipients).map(([id, recipient]) => ({
    id,
    name: recipient.name,
    categories: recipient.categories,
    content: recipient.content,
  }));
};

/**
 * Merge global parameters from default and user assumptions
 * @param {Object} defaultGlobalParams - Default global parameters
 * @param {Object|null} userGlobalParams - User's custom global parameters
 * @returns {Object} Merged global parameters
 */
export const mergeGlobalParameters = (defaultGlobalParams, userGlobalParams) => {
  if (!userGlobalParams) return { ...defaultGlobalParams };

  return {
    ...defaultGlobalParams,
    ...userGlobalParams,
  };
};

/**
 * Get category by ID from default assumptions
 * @param {Object} defaultAssumptions - Default assumptions object
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null if not found
 */
export const getCategoryFromDefaults = (defaultAssumptions, categoryId) => {
  if (!defaultAssumptions?.categories?.[categoryId]) return null;

  const category = defaultAssumptions.categories[categoryId];
  return {
    id: categoryId,
    name: category.name,
    effects: category.effects,
    content: category.content,
  };
};

/**
 * Find recipient ID by name from default assumptions
 * @param {Object} defaultAssumptions - Default assumptions object
 * @param {string} recipientName - Recipient name to search for
 * @returns {string|null} Recipient ID or null if not found
 */
export const findRecipientIdFromDefaults = (defaultAssumptions, recipientName) => {
  if (!defaultAssumptions?.recipients) return null;

  for (const [id, recipient] of Object.entries(defaultAssumptions.recipients)) {
    if (recipient.name === recipientName) {
      return id;
    }
  }
  return null;
};

/**
 * Calculate cost per life for a category, merging user and default effects
 * @param {string} categoryId - Category ID
 * @param {Object} defaultAssumptions - Default assumptions
 * @param {Object|null} userAssumptions - User assumptions
 * @param {Object} globalParameters - Merged global parameters
 * @returns {number} Cost per life
 */
export const calculateCategoryEffectCostPerLife = (
  categoryId,
  defaultAssumptions,
  userAssumptions,
  globalParameters
) => {
  const defaultCategory = defaultAssumptions?.categories?.[categoryId];
  if (!defaultCategory) {
    throw new Error(`Category ${categoryId} not found in default assumptions`);
  }

  // Get user effects if they exist
  const userEffects = userAssumptions?.categories?.[categoryId]?.effects;

  // If user has custom effects, use them; otherwise use defaults
  const effectsToUse = userEffects || defaultCategory.effects;

  if (!effectsToUse || effectsToUse.length === 0) {
    throw new Error(`No effects found for category ${categoryId}`);
  }

  return calculateCostPerLife(effectsToUse, globalParameters, categoryId);
};

/**
 * Check if a recipient has effect overrides (either default or user)
 * @param {Object} defaultAssumptions - Default assumptions
 * @param {Object|null} userAssumptions - User assumptions
 * @param {string} recipientId - Recipient ID
 * @param {string} categoryId - Category ID
 * @returns {boolean} True if recipient has overrides for this category
 */
export const recipientHasEffectOverrides = (defaultAssumptions, userAssumptions, recipientId, categoryId) => {
  // Check default overrides
  const defaultRecipient = defaultAssumptions?.recipients?.[recipientId];
  const defaultCategoryData = defaultRecipient?.categories?.[categoryId];
  if (defaultCategoryData?.effects && defaultCategoryData.effects.length > 0) {
    return true;
  }

  // Check user overrides
  const userRecipient = userAssumptions?.recipients?.[recipientId];
  const userCategoryData = userRecipient?.categories?.[categoryId];
  if (userCategoryData?.effects && userCategoryData.effects.length > 0) {
    return true;
  }

  return false;
};

/**
 * Get merged recipient data (combining default and user)
 * @param {Object} defaultAssumptions - Default assumptions
 * @param {Object|null} userAssumptions - User assumptions
 * @param {string} recipientId - Recipient ID
 * @returns {Object|null} Merged recipient data
 */
export const getMergedRecipient = (defaultAssumptions, userAssumptions, recipientId) => {
  const defaultRecipient = defaultAssumptions?.recipients?.[recipientId];
  if (!defaultRecipient) return null;

  const userRecipient = userAssumptions?.recipients?.[recipientId];
  if (!userRecipient) {
    return { ...defaultRecipient, id: recipientId };
  }

  // Merge categories
  const mergedCategories = { ...defaultRecipient.categories };

  if (userRecipient.categories) {
    Object.entries(userRecipient.categories).forEach(([categoryId, userCategoryData]) => {
      if (!mergedCategories[categoryId]) {
        mergedCategories[categoryId] = userCategoryData;
      } else {
        // Merge the category data
        mergedCategories[categoryId] = {
          ...mergedCategories[categoryId],
          ...userCategoryData,
        };

        // If both have effects, merge them properly
        if (mergedCategories[categoryId].effects && userCategoryData.effects) {
          const defaultEffects = defaultRecipient.categories?.[categoryId]?.effects || [];
          mergedCategories[categoryId].effects = mergeRecipientEffects(defaultEffects, userCategoryData.effects);
        }
      }
    });
  }

  return {
    ...defaultRecipient,
    ...userRecipient,
    id: recipientId,
    categories: mergedCategories,
  };
};
