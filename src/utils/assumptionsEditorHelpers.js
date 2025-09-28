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
 * @param {number} donationYear - Year to calculate for (required)
 * @returns {number} Cost per life
 */
export const calculateCategoryEffectCostPerLife = (
  categoryId,
  defaultAssumptions,
  userAssumptions,
  globalParameters,
  donationYear
) => {
  const defaultCategory = defaultAssumptions?.categories?.[categoryId];
  if (!defaultCategory) {
    throw new Error(`Category ${categoryId} not found in default assumptions`);
  }

  // Get user effects if they exist
  const userEffects = userAssumptions?.categories?.[categoryId]?.effects;

  // If user has custom effects, merge them with defaults; otherwise use defaults
  let effectsToUse = defaultCategory.effects;
  if (userEffects && userEffects.length > 0) {
    // Merge user effects with defaults to ensure all required fields are present
    effectsToUse = defaultCategory.effects.map((defaultEffect) => {
      const userEffect = userEffects.find((e) => e.effectId === defaultEffect.effectId);
      if (userEffect) {
        // Start with default effect and overlay user values
        return { ...defaultEffect, ...userEffect };
      }
      return defaultEffect;
    });
  }

  if (!effectsToUse || effectsToUse.length === 0) {
    throw new Error(`No effects found for category ${categoryId}`);
  }

  return calculateCostPerLife(effectsToUse, globalParameters, donationYear);
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

/**
 * Check if a recipient's user-defined effects are meaningfully different from its defaults.
 * @param {Array|undefined} userEffects - The user's effect overrides for a recipient category.
 * @param {Array|undefined} defaultEffects - The default effects for a recipient category.
 * @returns {boolean} True if there is a meaningful difference.
 */
export const recipientHasMeaningfulCustomValues = (userEffects, defaultEffects) => {
  // Normalize to empty arrays if undefined/null
  userEffects = userEffects || [];
  defaultEffects = defaultEffects || [];

  // If user has no effects but default has effects, no custom values
  if (userEffects.length === 0 && defaultEffects.length > 0) {
    return false;
  }

  // If user has effects but default doesn't, check if they're meaningful
  if (userEffects.length > 0 && defaultEffects.length === 0) {
    return userEffects.some((e) => e.disabled || e.multipliers || e.overrides);
  }

  // If the number of effect overrides is different (and both non-empty), check for meaningful content
  if (userEffects.length !== defaultEffects.length) {
    // Check if userEffects has meaningful content
    return userEffects.some((e) => e.disabled || e.multipliers || e.overrides);
  }

  // If lengths are the same (and > 0), we need to compare the content.
  if (userEffects.length === 0) {
    return false; // No custom values
  }

  // Create maps for easy lookup
  const userEffectMap = new Map(userEffects.map((e) => [e.effectId, e]));
  const defaultEffectMap = new Map(defaultEffects.map((e) => [e.effectId, e]));

  for (const [effectId, userEffect] of userEffectMap.entries()) {
    const defaultEffect = defaultEffectMap.get(effectId);

    // If a user effect doesn't have a corresponding default, that's a difference.
    if (!defaultEffect) {
      return true;
    }

    // Compare disabled status (treat undefined as false)
    if ((userEffect.disabled || false) !== (defaultEffect.disabled || false)) {
      return true;
    }

    // Compare multipliers and overrides using JSON.stringify for a deep-enough comparison.
    // This is simpler and safer than a manual deep compare, and key order should be consistent.
    const userMultipliers = JSON.stringify(userEffect.multipliers || {});
    const defaultMultipliers = JSON.stringify(defaultEffect.multipliers || {});
    if (userMultipliers !== defaultMultipliers) {
      return true;
    }

    const userOverrides = JSON.stringify(userEffect.overrides || {});
    const defaultOverrides = JSON.stringify(defaultEffect.overrides || {});
    if (userOverrides !== defaultOverrides) {
      return true;
    }
  }

  return false;
};
