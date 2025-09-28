// Pure helper functions for manipulating user assumptions
// These functions take the current state and return new state
// They handle the complex nested structure of effects with overrides and multipliers

/**
 * Set a custom value for a specific field in a category effect
 * The value is stored directly on the effect field, not in an overrides object
 */
export const setCategoryFieldValue = (userAssumptions, defaultAssumptions, categoryId, effectId, fieldName, value) => {
  // Validate that the effect exists in defaults
  const defaultEffect = defaultAssumptions.categories[categoryId]?.effects?.find((e) => e.effectId === effectId);
  if (!defaultEffect) {
    throw new Error(`Effect ${effectId} not found in category ${categoryId}`);
  }

  // Deep clone or create new structure
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  // Initialize nested structure if needed
  if (!newData.categories) newData.categories = {};
  if (!newData.categories[categoryId]) newData.categories[categoryId] = { effects: [] };

  // Find or create the effect override
  let effectIndex = newData.categories[categoryId].effects.findIndex((e) => e.effectId === effectId);
  if (effectIndex === -1) {
    newData.categories[categoryId].effects.push({ effectId });
    effectIndex = newData.categories[categoryId].effects.length - 1;
  }

  const effect = newData.categories[categoryId].effects[effectIndex];

  // Always store the value to respect user's explicit input
  effect[fieldName] = value;

  return newData;
};

/**
 * Set all custom values for a category effect at once (batch update)
 * Only stores fields that differ from defaults
 */
export const setCategoryEffect = (userAssumptions, defaultAssumptions, categoryId, effectId, effectData) => {
  // Validate that the effect exists in defaults
  const defaultEffect = defaultAssumptions.categories[categoryId]?.effects?.find((e) => e.effectId === effectId);
  if (!defaultEffect) {
    throw new Error(`Effect ${effectId} not found in category ${categoryId}`);
  }

  // Deep clone or create new structure
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  // Initialize nested structure if needed
  if (!newData.categories) newData.categories = {};
  if (!newData.categories[categoryId]) newData.categories[categoryId] = { effects: [] };

  // Find or create the effect
  let effectIndex = newData.categories[categoryId].effects.findIndex((e) => e.effectId === effectId);
  if (effectIndex === -1) {
    newData.categories[categoryId].effects.push({ effectId });
    effectIndex = newData.categories[categoryId].effects.length - 1;
  }

  const userEffect = newData.categories[categoryId].effects[effectIndex];

  // Clear existing fields (except effectId)
  Object.keys(userEffect).forEach((key) => {
    if (key !== 'effectId') {
      delete userEffect[key];
    }
  });

  // Add all provided fields, regardless of default values
  let hasCustomFields = false;
  Object.keys(effectData).forEach((fieldName) => {
    if (fieldName !== 'effectId' && effectData[fieldName] !== undefined) {
      userEffect[fieldName] = effectData[fieldName];
      hasCustomFields = true;
    }
  });

  // Clean up if no custom fields were provided
  if (!hasCustomFields) {
    newData.categories[categoryId].effects.splice(effectIndex, 1);
    if (newData.categories[categoryId].effects.length === 0) {
      delete newData.categories[categoryId];
      if (Object.keys(newData.categories).length === 0) {
        delete newData.categories;
      }
    }
    return Object.keys(newData).length > 0 ? newData : null;
  }

  return newData;
};

/**
 * Clear all custom values for a category (reset to defaults)
 */
export const clearCategoryCustomValues = (userAssumptions, categoryId) => {
  if (!userAssumptions?.categories?.[categoryId]) {
    return userAssumptions;
  }

  const newData = JSON.parse(JSON.stringify(userAssumptions));
  delete newData.categories[categoryId];

  // Clean up empty structures
  if (Object.keys(newData.categories).length === 0) {
    delete newData.categories;
  }

  return Object.keys(newData).length > 0 ? newData : null;
};

/**
 * Set an override for a specific field in a recipient's category effect
 * Removes any existing multiplier for the same field
 */
export const setRecipientFieldOverride = (
  userAssumptions,
  defaultAssumptions,
  recipientId,
  categoryId,
  effectId,
  fieldName,
  value
) => {
  // Validate that the effect exists in defaults
  // First check if recipient has custom effects, otherwise fall back to category defaults
  let defaultEffect = defaultAssumptions.recipients[recipientId]?.categories?.[categoryId]?.effects?.find(
    (e) => e.effectId === effectId
  );

  // If recipient doesn't have custom effects, check the category's default effects
  if (!defaultEffect) {
    defaultEffect = defaultAssumptions.categories[categoryId]?.effects?.find((e) => e.effectId === effectId);
  }

  if (!defaultEffect) {
    throw new Error(`Effect ${effectId} not found for recipient ${recipientId} category ${categoryId}`);
  }

  // Deep clone or create new structure
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  // Initialize deeply nested structure
  if (!newData.recipients) newData.recipients = {};
  if (!newData.recipients[recipientId]) newData.recipients[recipientId] = { categories: {} };
  if (!newData.recipients[recipientId].categories[categoryId]) {
    newData.recipients[recipientId].categories[categoryId] = { effects: [] };
  }

  // Find or create the effect
  const effects = newData.recipients[recipientId].categories[categoryId].effects;
  let effectIndex = effects.findIndex((e) => e.effectId === effectId);
  if (effectIndex === -1) {
    effects.push({ effectId });
    effectIndex = effects.length - 1;
  }

  const effect = effects[effectIndex];

  // Always set the override to respect user's explicit input
  if (!effect.overrides) effect.overrides = {};
  effect.overrides[fieldName] = value;

  // Remove any multiplier for the same field
  if (effect.multipliers && effect.multipliers[fieldName] !== undefined) {
    delete effect.multipliers[fieldName];
    if (Object.keys(effect.multipliers).length === 0) {
      delete effect.multipliers;
    }
  }

  return newData;
};

/**
 * Set a multiplier for a specific field in a recipient's category effect
 * Removes any existing override for the same field
 */
export const setRecipientFieldMultiplier = (
  userAssumptions,
  defaultAssumptions,
  recipientId,
  categoryId,
  effectId,
  fieldName,
  multiplier
) => {
  // Validate that the effect exists in defaults
  // First check if recipient has custom effects, otherwise fall back to category defaults
  let defaultEffect = defaultAssumptions.recipients[recipientId]?.categories?.[categoryId]?.effects?.find(
    (e) => e.effectId === effectId
  );

  // If recipient doesn't have custom effects, check the category's default effects
  if (!defaultEffect) {
    defaultEffect = defaultAssumptions.categories[categoryId]?.effects?.find((e) => e.effectId === effectId);
  }

  if (!defaultEffect) {
    throw new Error(`Effect ${effectId} not found for recipient ${recipientId} category ${categoryId}`);
  }

  // Deep clone or create new structure
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  // Initialize deeply nested structure
  if (!newData.recipients) newData.recipients = {};
  if (!newData.recipients[recipientId]) newData.recipients[recipientId] = { categories: {} };
  if (!newData.recipients[recipientId].categories[categoryId]) {
    newData.recipients[recipientId].categories[categoryId] = { effects: [] };
  }

  // Find or create the effect
  const effects = newData.recipients[recipientId].categories[categoryId].effects;
  let effectIndex = effects.findIndex((e) => e.effectId === effectId);
  if (effectIndex === -1) {
    effects.push({ effectId });
    effectIndex = effects.length - 1;
  }

  const effect = effects[effectIndex];

  // Always set the multiplier to respect user's explicit input
  if (!effect.multipliers) effect.multipliers = {};
  effect.multipliers[fieldName] = multiplier;

  // Remove any override for the same field
  if (effect.overrides && effect.overrides[fieldName] !== undefined) {
    delete effect.overrides[fieldName];
    if (Object.keys(effect.overrides).length === 0) {
      delete effect.overrides;
    }
  }

  return newData;
};

/**
 * Clear all overrides and multipliers for a recipient
 */
export const clearRecipientOverrides = (userAssumptions, recipientId) => {
  if (!userAssumptions?.recipients?.[recipientId]) {
    return userAssumptions;
  }

  const newData = JSON.parse(JSON.stringify(userAssumptions));
  delete newData.recipients[recipientId];

  // Clean up empty structures
  if (Object.keys(newData.recipients).length === 0) {
    delete newData.recipients;
  }

  return Object.keys(newData).length > 0 ? newData : null;
};

/**
 * Clear overrides and multipliers for a specific category within a recipient
 */
export const clearRecipientCategoryOverrides = (userAssumptions, recipientId, categoryId) => {
  if (!userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]) {
    return userAssumptions;
  }

  const newData = JSON.parse(JSON.stringify(userAssumptions));
  delete newData.recipients[recipientId].categories[categoryId];

  // Clean up empty structures
  if (Object.keys(newData.recipients[recipientId].categories).length === 0) {
    delete newData.recipients[recipientId].categories;
    // If recipient has no categories left, remove it entirely
    delete newData.recipients[recipientId];

    if (Object.keys(newData.recipients).length === 0) {
      delete newData.recipients;
    }
  }

  return Object.keys(newData).length > 0 ? newData : null;
};

/**
 * Set a global parameter override
 */
export const setGlobalParameter = (userAssumptions, parameterName, value) => {
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  if (!newData.globalParameters) newData.globalParameters = {};
  newData.globalParameters[parameterName] = value;

  return newData;
};

/**
 * Clear a specific global parameter override
 */
export const clearGlobalParameter = (userAssumptions, parameterName) => {
  if (!userAssumptions?.globalParameters?.[parameterName]) {
    return userAssumptions;
  }

  const newData = JSON.parse(JSON.stringify(userAssumptions));
  delete newData.globalParameters[parameterName];

  // Clean up empty structures
  if (Object.keys(newData.globalParameters).length === 0) {
    delete newData.globalParameters;
  }

  return Object.keys(newData).length > 0 ? newData : null;
};

/**
 * Clear all global parameter overrides
 */
export const clearAllGlobalParameters = (userAssumptions) => {
  if (!userAssumptions?.globalParameters) {
    return userAssumptions;
  }

  const newData = JSON.parse(JSON.stringify(userAssumptions));
  delete newData.globalParameters;

  return Object.keys(newData).length > 0 ? newData : null;
};

/**
 * Clear all user overrides (reset everything to defaults)
 */
export const clearAllOverrides = () => {
  return null;
};
