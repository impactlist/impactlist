/**
 * Helper functions for computing effective field values from default and user data
 */

/**
 * Get the effective value for a field following the precedence chain
 * @param {string} fieldName - The field name to get value for
 * @param {Object} options - Object containing the various effect sources
 * @param {Object} options.defaultCategoryEffect - Default category effect
 * @param {Object} options.userCategoryEffect - User's category customization
 * @param {Object} options.defaultRecipientEffect - Default recipient effect
 * @param {Object} options.userRecipientEffect - User's recipient customization
 * @returns {*} The effective value for the field
 */
export const getEffectiveFieldValue = (
  fieldName,
  { defaultCategoryEffect, userCategoryEffect, defaultRecipientEffect, userRecipientEffect }
) => {
  // 1. Check user recipient override
  if (userRecipientEffect?.overrides?.[fieldName] !== undefined) {
    return userRecipientEffect.overrides[fieldName];
  }

  // 2. Check default recipient override
  if (defaultRecipientEffect?.overrides?.[fieldName] !== undefined) {
    return defaultRecipientEffect.overrides[fieldName];
  }

  // 3. Check user category value
  if (userCategoryEffect?.[fieldName] !== undefined) {
    return userCategoryEffect[fieldName];
  }

  // 4. Return default category value
  return defaultCategoryEffect?.[fieldName] ?? null;
};

/**
 * Get the effective multiplier for a field
 * @param {string} fieldName - The field name to get multiplier for
 * @param {Object} options - Object containing the effect sources
 * @param {Object} options.defaultRecipientEffect - Default recipient effect
 * @param {Object} options.userRecipientEffect - User's recipient customization
 * @returns {number|null} The effective multiplier or null if none exists
 */
export const getEffectiveMultiplier = (fieldName, { defaultRecipientEffect, userRecipientEffect }) => {
  // 1. Check user recipient multiplier
  if (userRecipientEffect?.multipliers?.[fieldName] !== undefined) {
    return userRecipientEffect.multipliers[fieldName];
  }

  // 2. Check default recipient multiplier
  if (defaultRecipientEffect?.multipliers?.[fieldName] !== undefined) {
    return defaultRecipientEffect.multipliers[fieldName];
  }

  return null;
};

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

/**
 * Get the placeholder value for a multiplier field
 * This shows the default multiplier if one exists
 * @param {string} fieldName - The field name
 * @param {Object} options - Object containing the effect sources
 * @returns {number|null} The default multiplier or null
 */
export const getMultiplierPlaceholderValue = (fieldName, { defaultRecipientEffect }) => {
  // Only show default recipient multiplier
  return defaultRecipientEffect?.multipliers?.[fieldName] ?? null;
};
