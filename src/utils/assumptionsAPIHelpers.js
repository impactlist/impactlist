// Pure helper functions for manipulating user assumptions
// These functions take the current state and return new state
// They handle the complex nested structure of effects with overrides and multipliers

/**
 * Prune empty category structures from data object.
 * Removes categoryId if effects array is empty, removes categories if empty.
 * Returns the pruned data or null if completely empty.
 */
const pruneCategoryStructure = (data, categoryId) => {
  if (data.categories?.[categoryId]?.effects?.length === 0) {
    delete data.categories[categoryId];
  }
  if (data.categories && Object.keys(data.categories).length === 0) {
    delete data.categories;
  }
  return Object.keys(data).length > 0 ? data : null;
};

/**
 * Prune empty recipient structures from data object.
 * Removes category if effects array is empty, removes recipient if no categories, removes recipients if empty.
 * Returns the pruned data or null if completely empty.
 */
const pruneRecipientStructure = (data, recipientId, categoryId) => {
  if (data.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.length === 0) {
    delete data.recipients[recipientId].categories[categoryId];
  }
  if (data.recipients?.[recipientId]?.categories && Object.keys(data.recipients[recipientId].categories).length === 0) {
    delete data.recipients[recipientId];
  }
  if (data.recipients && Object.keys(data.recipients).length === 0) {
    delete data.recipients;
  }
  return Object.keys(data).length > 0 ? data : null;
};

/**
 * Set a custom value for a specific field in a category effect
 * The value is stored directly on the effect field, not in an overrides object
 * If value matches default, removes the field instead
 */
export const setCategoryFieldValue = (userAssumptions, defaultAssumptions, categoryId, effectId, fieldName, value) => {
  // Validate that the effect exists in defaults
  const defaultEffect = defaultAssumptions.categories[categoryId]?.effects?.find((e) => e.effectId === effectId);
  if (!defaultEffect) {
    throw new Error(`Effect ${effectId} not found in category ${categoryId}`);
  }

  // Check if value matches default - if so, remove instead of storing
  const defaultValue = defaultEffect[fieldName];
  if (areValuesEqual(value, defaultValue)) {
    if (!userAssumptions?.categories?.[categoryId]?.effects) {
      return userAssumptions;
    }
    const newData = JSON.parse(JSON.stringify(userAssumptions));
    const effectIndex = newData.categories[categoryId].effects.findIndex((e) => e.effectId === effectId);
    if (effectIndex !== -1) {
      delete newData.categories[categoryId].effects[effectIndex][fieldName];
      // Prune empty effect (only has effectId)
      if (Object.keys(newData.categories[categoryId].effects[effectIndex]).length === 1) {
        newData.categories[categoryId].effects.splice(effectIndex, 1);
      }
    }
    return pruneCategoryStructure(newData, categoryId);
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
  effect[fieldName] = value;

  return newData;
};

/**
 * Helper to check if two values are equal (handles arrays and NaN)
 */
const areValuesEqual = (valueA, valueB) => {
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    if (valueA.length !== valueB.length) {
      return false;
    }
    return valueA.every((item, idx) => areValuesEqual(item, valueB[idx]));
  }

  if (Array.isArray(valueA) || Array.isArray(valueB)) {
    return false;
  }

  if (valueA === valueB) {
    return true;
  }

  return typeof valueA === 'number' && typeof valueB === 'number' && Number.isNaN(valueA) && Number.isNaN(valueB);
};

/**
 * Set all custom values for a category effect at once (batch update)
 * Only stores fields that differ from defaults
 */
const normalizeFieldValue = (fieldName, value) => {
  if (fieldName === 'disabled') {
    return value === undefined ? false : Boolean(value);
  }
  return value;
};

const shouldSkipField = (fieldName) => {
  return fieldName === 'effectId' || fieldName.startsWith('_');
};

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

  // Add only provided fields that differ from defaults
  let hasCustomFields = false;
  Object.keys(effectData).forEach((fieldName) => {
    if (shouldSkipField(fieldName)) {
      return;
    }

    const value = effectData[fieldName];
    if (value === undefined) {
      return;
    }

    const normalizedValue = normalizeFieldValue(fieldName, value);
    const defaultValue = normalizeFieldValue(fieldName, defaultEffect[fieldName]);

    if (!areValuesEqual(normalizedValue, defaultValue)) {
      userEffect[fieldName] = normalizedValue;
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
 * Replace all custom effects for a category in one operation.
 * Stores only fields that differ from defaults.
 */
export const setCategoryEffects = (userAssumptions, defaultAssumptions, categoryId, effectsData) => {
  if (!defaultAssumptions?.categories?.[categoryId]?.effects) {
    throw new Error(`Category ${categoryId} not found in defaults`);
  }

  const defaultEffects = defaultAssumptions.categories[categoryId].effects;
  const nextCustomEffects = [];

  (effectsData || []).forEach((effectData) => {
    if (!effectData?.effectId) {
      return;
    }

    const defaultEffect = defaultEffects.find((entry) => entry.effectId === effectData.effectId);
    if (!defaultEffect) {
      throw new Error(`Effect ${effectData.effectId} not found in category ${categoryId}`);
    }

    const nextEffect = { effectId: effectData.effectId };

    Object.keys(effectData).forEach((fieldName) => {
      if (shouldSkipField(fieldName)) {
        return;
      }

      const value = effectData[fieldName];
      if (value === undefined) {
        return;
      }

      const normalizedValue = normalizeFieldValue(fieldName, value);
      const defaultValue = normalizeFieldValue(fieldName, defaultEffect[fieldName]);

      if (!areValuesEqual(normalizedValue, defaultValue)) {
        nextEffect[fieldName] = normalizedValue;
      }
    });

    if (Object.keys(nextEffect).length > 1) {
      nextCustomEffects.push(nextEffect);
    }
  });

  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  if (nextCustomEffects.length > 0) {
    if (!newData.categories) newData.categories = {};
    newData.categories[categoryId] = { effects: nextCustomEffects };
  } else if (newData.categories?.[categoryId]) {
    delete newData.categories[categoryId];
  }

  if (newData.categories && Object.keys(newData.categories).length === 0) {
    delete newData.categories;
  }

  return Object.keys(newData).length > 0 ? newData : null;
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

  return pruneCategoryStructure(newData, categoryId);
};

/**
 * Set an override for a specific field in a recipient's category effect
 * Removes any existing multiplier for the same field
 * If value matches default, removes the override instead
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

  // Check if value matches default - if so, remove instead of storing
  const defaultValue = defaultEffect[fieldName];
  if (areValuesEqual(value, defaultValue)) {
    if (!userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects) {
      return userAssumptions;
    }
    const newData = JSON.parse(JSON.stringify(userAssumptions));
    const effects = newData.recipients[recipientId].categories[categoryId].effects;
    const effectIndex = effects.findIndex((e) => e.effectId === effectId);
    if (effectIndex !== -1 && effects[effectIndex].overrides) {
      delete effects[effectIndex].overrides[fieldName];
      if (Object.keys(effects[effectIndex].overrides).length === 0) {
        delete effects[effectIndex].overrides;
      }
      // Prune empty effect (only has effectId)
      if (Object.keys(effects[effectIndex]).length === 1) {
        effects.splice(effectIndex, 1);
      }
    }
    return pruneRecipientStructure(newData, recipientId, categoryId);
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
 * If multiplier is 1 (no change), removes the multiplier instead
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

  // A multiplier of 1 means "no change" - remove instead of storing
  if (multiplier === 1) {
    if (!userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects) {
      return userAssumptions;
    }
    const newData = JSON.parse(JSON.stringify(userAssumptions));
    const effects = newData.recipients[recipientId].categories[categoryId].effects;
    const effectIndex = effects.findIndex((e) => e.effectId === effectId);
    if (effectIndex !== -1 && effects[effectIndex].multipliers) {
      delete effects[effectIndex].multipliers[fieldName];
      if (Object.keys(effects[effectIndex].multipliers).length === 0) {
        delete effects[effectIndex].multipliers;
      }
      // Prune empty effect (only has effectId)
      if (Object.keys(effects[effectIndex]).length === 1) {
        effects.splice(effectIndex, 1);
      }
    }
    return pruneRecipientStructure(newData, recipientId, categoryId);
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

  return pruneRecipientStructure(newData, recipientId, categoryId);
};

const sanitizeNumericMap = (map) => {
  if (!map) return null;

  const cleaned = Object.entries(map).reduce((acc, [fieldName, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[fieldName] = value;
    }
    return acc;
  }, {});

  return Object.keys(cleaned).length > 0 ? cleaned : null;
};

const sanitizeRecipientEffects = (effectsData = []) => {
  const cleanedEffects = [];

  effectsData.forEach((effect) => {
    if (!effect?.effectId) {
      return;
    }

    const cleanedEffect = { effectId: effect.effectId };

    const overrides = sanitizeNumericMap(effect.overrides);
    if (overrides) {
      cleanedEffect.overrides = overrides;
    }

    const multipliers = sanitizeNumericMap(effect.multipliers);
    if (multipliers) {
      cleanedEffect.multipliers = multipliers;
    }

    if (effect.disabled !== undefined) {
      cleanedEffect.disabled = Boolean(effect.disabled);
    }

    if (
      cleanedEffect.disabled !== undefined ||
      cleanedEffect.overrides !== undefined ||
      cleanedEffect.multipliers !== undefined
    ) {
      cleanedEffects.push(cleanedEffect);
    }
  });

  return cleanedEffects;
};

/**
 * Replace all custom effects for a specific recipient category in one operation.
 */
export const setRecipientCategoryEffects = (
  userAssumptions,
  defaultAssumptions,
  recipientId,
  categoryId,
  effectsData
) => {
  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};
  const cleanedEffects = sanitizeRecipientEffects(effectsData);

  if (cleanedEffects.length > 0) {
    if (!newData.recipients) newData.recipients = {};
    if (!newData.recipients[recipientId]) newData.recipients[recipientId] = { categories: {} };
    if (!newData.recipients[recipientId].categories) newData.recipients[recipientId].categories = {};

    newData.recipients[recipientId].categories[categoryId] = {
      effects: cleanedEffects,
    };
  } else if (newData.recipients?.[recipientId]?.categories?.[categoryId]) {
    delete newData.recipients[recipientId].categories[categoryId];

    if (Object.keys(newData.recipients[recipientId].categories).length === 0) {
      delete newData.recipients[recipientId];
    }
    if (newData.recipients && Object.keys(newData.recipients).length === 0) {
      delete newData.recipients;
    }
  }

  return normalizeUserAssumptions(newData, defaultAssumptions);
};

/**
 * Replace custom effects for multiple categories of one recipient in one operation.
 */
export const setRecipientEffectsByCategory = (
  userAssumptions,
  defaultAssumptions,
  recipientId,
  effectsByCategory = {}
) => {
  const categoryEntries = Object.entries(effectsByCategory);

  if (categoryEntries.length === 0) {
    return userAssumptions;
  }

  // Intentionally composes per-category updates for clarity and reuse.
  // Current recipients have few categories, so repeated normalization cost is acceptable.
  let nextData = userAssumptions;
  categoryEntries.forEach(([categoryId, effects]) => {
    nextData = setRecipientCategoryEffects(nextData, defaultAssumptions, recipientId, categoryId, effects);
  });

  return nextData;
};

/**
 * Set a global parameter override
 * If value matches the default, clears the override instead
 */
export const setGlobalParameter = (userAssumptions, defaultAssumptions, parameterName, value) => {
  // Check if value matches the default
  const defaultValue = defaultAssumptions?.globalParameters?.[parameterName];
  if (areValuesEqual(value, defaultValue)) {
    // Value matches default, clear the override
    return clearGlobalParameter(userAssumptions, parameterName);
  }

  const newData = userAssumptions ? JSON.parse(JSON.stringify(userAssumptions)) : {};

  if (!newData.globalParameters) newData.globalParameters = {};
  newData.globalParameters[parameterName] = value;

  return newData;
};

/**
 * Clear a specific global parameter override
 */
export const clearGlobalParameter = (userAssumptions, parameterName) => {
  if (!userAssumptions?.globalParameters || !Object.hasOwn(userAssumptions.globalParameters, parameterName)) {
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

/**
 * Remove keys from obj where predicate(key, value) returns true.
 * Deletes the obj key from parent if obj becomes empty.
 */
const pruneObject = (parent, key, predicate) => {
  const obj = parent[key];
  if (!obj) return;
  for (const k of Object.keys(obj)) {
    if (predicate(k, obj[k])) {
      delete obj[k];
    }
  }
  if (Object.keys(obj).length === 0) {
    delete parent[key];
  }
};

/**
 * Normalize an effects array in place, removing effects that match defaults.
 * Returns true if the effects array is now empty.
 */
const normalizeEffects = (effects, getDefaultEffect, isRecipientEffect = false) => {
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    const defaultEffect = getDefaultEffect(effect.effectId);

    if (isRecipientEffect) {
      // Recipient effects have overrides/multipliers structure
      if (effect.overrides && defaultEffect) {
        pruneObject(effect, 'overrides', (field, val) => areValuesEqual(val, defaultEffect[field]));
      }
      pruneObject(effect, 'multipliers', (_, val) => val === 1);

      if (Object.hasOwn(effect, 'disabled')) {
        const defaultDisabled = defaultEffect ? Boolean(defaultEffect.disabled) : false;
        if (Boolean(effect.disabled) === defaultDisabled) {
          delete effect.disabled;
        } else {
          effect.disabled = Boolean(effect.disabled);
        }
      }
    } else if (defaultEffect) {
      // Category effects store values directly
      for (const field of Object.keys(effect)) {
        if (field !== 'effectId' && areValuesEqual(effect[field], defaultEffect[field])) {
          delete effect[field];
        }
      }
    }

    // Remove effect if only effectId remains
    if (Object.keys(effect).length === 1) {
      effects.splice(i, 1);
    }
  }
  return effects.length === 0;
};

/**
 * Normalize user assumptions by removing any values that match defaults.
 * This cleans up legacy saved data where defaults were stored.
 * Returns the pruned data or null if completely empty.
 */
export const normalizeUserAssumptions = (userAssumptions, defaultAssumptions) => {
  if (!userAssumptions) {
    return null;
  }

  const data = JSON.parse(JSON.stringify(userAssumptions));

  // Normalize global parameters
  pruneObject(data, 'globalParameters', (param, val) =>
    areValuesEqual(val, defaultAssumptions.globalParameters?.[param])
  );

  // Normalize categories
  if (data.categories) {
    for (const categoryId of Object.keys(data.categories)) {
      const cat = data.categories[categoryId];
      if (cat.effects) {
        const isEmpty = normalizeEffects(cat.effects, (effectId) =>
          defaultAssumptions.categories?.[categoryId]?.effects?.find((e) => e.effectId === effectId)
        );
        if (isEmpty) delete data.categories[categoryId];
      } else {
        delete data.categories[categoryId];
      }
    }
    if (Object.keys(data.categories).length === 0) {
      delete data.categories;
    }
  }

  // Normalize recipients
  if (data.recipients) {
    for (const recipientId of Object.keys(data.recipients)) {
      const recipient = data.recipients[recipientId];
      if (recipient.categories) {
        for (const categoryId of Object.keys(recipient.categories)) {
          const cat = recipient.categories[categoryId];
          if (cat.effects) {
            const isEmpty = normalizeEffects(
              cat.effects,
              (effectId) =>
                defaultAssumptions.recipients?.[recipientId]?.categories?.[categoryId]?.effects?.find(
                  (e) => e.effectId === effectId
                ) || defaultAssumptions.categories?.[categoryId]?.effects?.find((e) => e.effectId === effectId),
              true
            );
            if (isEmpty) delete recipient.categories[categoryId];
          } else {
            delete recipient.categories[categoryId];
          }
        }
        if (Object.keys(recipient.categories).length === 0) {
          delete data.recipients[recipientId];
        }
      }
    }
    if (Object.keys(data.recipients).length === 0) {
      delete data.recipients;
    }
  }

  return Object.keys(data).length > 0 ? data : null;
};
