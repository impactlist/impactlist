/**
 * Helper functions for computing effective field values from default and user data
 */

/**
 * Get the placeholder value for an override field
 * This shows what value would be used if no override was specified
 * @param {string} fieldName - The field name
 * @param {Object} options - Object containing the effect sources
 * @returns {*} The value that would be used without an override
 */
export const getOverridePlaceholderValue = (
  fieldName,
  { defaultCategoryEffect, userCategoryEffect, defaultRecipientEffect }
) => {
  // Skip user recipient override in the chain since we want to show
  // what value would be used WITHOUT the override

  // 1. Check default recipient override
  if (defaultRecipientEffect?.overrides?.[fieldName] !== undefined) {
    return defaultRecipientEffect.overrides[fieldName];
  }

  // 2. Check user category value
  if (userCategoryEffect?.[fieldName] !== undefined) {
    return userCategoryEffect[fieldName];
  }

  // 3. Return default category value
  return defaultCategoryEffect?.[fieldName] ?? null;
};
