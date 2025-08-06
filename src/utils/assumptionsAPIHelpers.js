// Pure helper functions for manipulating user assumptions
// These functions take the current state and return new state
// They handle the complex nested structure of effects with overrides and multipliers

/**
 * Set a custom value for a specific field in a category effect
 * The value is stored directly on the effect field, not in an overrides object
 */
export const setCategoryFieldOverride = (
  userAssumptions,
  defaultAssumptions,
  categoryId,
  effectId,
  fieldName,
  value
) => {
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

  // Check if the value matches the default field value
  const defaultFieldValue = defaultEffect[fieldName];

  if (defaultFieldValue !== undefined && value === defaultFieldValue) {
    // Value matches default - remove the custom value entirely
    // Check if this field exists in the user effect
    if (effect[fieldName] !== undefined) {
      delete effect[fieldName];
    }

    // Clean up empty effect if needed (only keep effectId and actual field values)
    const hasCustomFields = Object.keys(effect).some((key) => key !== 'effectId');
    if (!hasCustomFields) {
      newData.categories[categoryId].effects.splice(effectIndex, 1);
    }

    // Clean up empty structures
    if (newData.categories[categoryId].effects.length === 0) {
      delete newData.categories[categoryId];
      if (Object.keys(newData.categories).length === 0) {
        delete newData.categories;
      }
    }

    return Object.keys(newData).length > 0 ? newData : null;
  } else {
    // Value differs from default - store directly as field value
    effect[fieldName] = value;

    return newData;
  }
};

/**
 * Set a multiplier for a specific field in a category effect
 * Removes any existing override for the same field
 */
export const setCategoryFieldMultiplier = (
  userAssumptions,
  defaultAssumptions,
  categoryId,
  effectId,
  fieldName,
  multiplier
) => {
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

  const effect = newData.categories[categoryId].effects[effectIndex];

  // Set multiplier
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
 * Clear all overrides and multipliers for a category
 */
export const clearCategoryOverrides = (userAssumptions, categoryId) => {
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
  const defaultEffect = defaultAssumptions.recipients[recipientId]?.categories?.[categoryId]?.effects?.find(
    (e) => e.effectId === effectId
  );
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

  // Check if the value matches the default override
  const defaultOverrideValue = defaultEffect.overrides?.[fieldName];

  if (defaultOverrideValue !== undefined && value === defaultOverrideValue) {
    // Value matches default - remove the override entirely
    if (effect.overrides && effect.overrides[fieldName] !== undefined) {
      delete effect.overrides[fieldName];
      if (Object.keys(effect.overrides).length === 0) {
        delete effect.overrides;
      }
    }

    // Clean up empty effect if needed
    if (!effect.overrides && !effect.multipliers) {
      effects.splice(effectIndex, 1);
    }

    // Clean up empty structures
    if (effects.length === 0) {
      delete newData.recipients[recipientId].categories[categoryId];
      if (Object.keys(newData.recipients[recipientId].categories).length === 0) {
        delete newData.recipients[recipientId];
        if (Object.keys(newData.recipients).length === 0) {
          delete newData.recipients;
        }
      }
    }

    return Object.keys(newData).length > 0 ? newData : null;
  } else {
    // Value differs from default - set the override
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
  }
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
  const defaultEffect = defaultAssumptions.recipients[recipientId]?.categories?.[categoryId]?.effects?.find(
    (e) => e.effectId === effectId
  );
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

  // Check if the multiplier matches the default multiplier
  const defaultMultiplierValue = defaultEffect.multipliers?.[fieldName];

  if (defaultMultiplierValue !== undefined && multiplier === defaultMultiplierValue) {
    // Value matches default - remove the multiplier entirely
    if (effect.multipliers && effect.multipliers[fieldName] !== undefined) {
      delete effect.multipliers[fieldName];
      if (Object.keys(effect.multipliers).length === 0) {
        delete effect.multipliers;
      }
    }

    // Clean up empty effect if needed
    if (!effect.overrides && !effect.multipliers) {
      effects.splice(effectIndex, 1);
    }

    // Clean up empty structures
    if (effects.length === 0) {
      delete newData.recipients[recipientId].categories[categoryId];
      if (Object.keys(newData.recipients[recipientId].categories).length === 0) {
        delete newData.recipients[recipientId];
        if (Object.keys(newData.recipients).length === 0) {
          delete newData.recipients;
        }
      }
    }

    return Object.keys(newData).length > 0 ? newData : null;
  } else {
    // Value differs from default - set the multiplier
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
  }
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
