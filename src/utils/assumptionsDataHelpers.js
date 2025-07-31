// Assumptions data helpers
// Utilities for managing default, user, and combined assumption data structures
import { globalParameters, categoriesById, recipientsById, donorsById } from '../data/generatedData';
import {
  calculateCategoryBaseCostPerLife,
  applyRecipientEffectToBase,
  effectToCostPerLife as effectToCostPerLifeWithEffects,
} from './effectsCalculation';
import {
  assertExists,
  assertPositiveNumber,
  assertNonZeroNumber,
  validateRecipient,
  crashInsteadOfFallback,
} from './dataValidation';
import { SIMULATION_AMOUNT, WEIGHT_NORMALIZATION_TOLERANCE } from './constants';
import { getAllDonors, getDonationsForDonor } from './donationDataHelpers';

/**
 * Create a default assumptions object from the base data
 * @returns {Object} Default assumptions object with all data in unified format
 */
export const createDefaultAssumptions = () => {
  const defaults = {
    globalParameters: { ...globalParameters },
    categories: {},
    recipients: {},
  };

  // Process categories - use default effects data
  Object.entries(categoriesById).forEach(([categoryId, categoryData]) => {
    defaults.categories[categoryId] = { ...categoryData };
  });

  // Process recipients - use default category data
  Object.entries(recipientsById).forEach(([recipientId, recipientData]) => {
    const recipientCategories = {};

    Object.entries(recipientData.categories).forEach(([categoryId, categoryData]) => {
      recipientCategories[categoryId] = { ...categoryData };
    });

    defaults.recipients[recipientId] = {
      ...recipientData,
      categories: recipientCategories,
    };
  });

  return defaults;
};

/**
 * Merge recipient effect with user overrides, applying precedence rules
 * @param {Object} defaultEffect - Default recipient effect (with overrides/multipliers structure)
 * @param {Object} userEffect - User effect override
 * @returns {Object} Merged effect with proper precedence
 */
const mergeRecipientEffectWithUser = (defaultEffect, userEffect) => {
  if (!userEffect) {
    return defaultEffect;
  }

  // Start with a copy of the default effect
  const merged = { ...defaultEffect };

  // If user has overrides, they completely replace default overrides/multipliers
  if (userEffect.overrides) {
    merged.overrides = { ...userEffect.overrides };
    // Remove any default multipliers for fields that now have user overrides
    if (merged.multipliers) {
      Object.keys(userEffect.overrides).forEach((field) => {
        delete merged.multipliers[field];
      });
    }
  }

  // If user has multipliers, they completely replace default overrides/multipliers
  if (userEffect.multipliers) {
    if (!merged.multipliers) {
      merged.multipliers = {};
    }
    // Add user multipliers
    Object.entries(userEffect.multipliers).forEach(([field, value]) => {
      merged.multipliers[field] = value;
      // Remove any override for this field since user specified a multiplier
      if (merged.overrides) {
        delete merged.overrides[field];
      }
    });
  }

  return merged;
};

/**
 * Merge recipient effects arrays (handles overrides/multipliers structure)
 * @param {Array} defaultEffects - Default recipient effects array
 * @param {Array} userEffects - User effect overrides (can be null/undefined)
 * @returns {Array} Merged effects array
 */
const mergeRecipientEffects = (defaultEffects, userEffects) => {
  if (!defaultEffects || defaultEffects.length === 0) {
    throw new Error('Default effects are required but not provided');
  }

  if (!userEffects || userEffects.length === 0) {
    return defaultEffects;
  }

  // Create a map of user effects by effectId
  const userEffectsMap = {};
  userEffects.forEach((effect) => {
    if (effect.effectId) {
      userEffectsMap[effect.effectId] = effect;
    }
  });

  // Merge each default effect with corresponding user effect
  return defaultEffects
    .map((defaultEffect) => {
      const userEffect = userEffectsMap[defaultEffect.effectId];
      if (userEffect && userEffect.windowLength === 0) {
        return null; // Remove this effect
      }
      return mergeRecipientEffectWithUser(defaultEffect, userEffect);
    })
    .filter(Boolean);
};

/**
 * Merge user effect overrides with default effects
 * @param {Array} defaultEffects - Default effects array
 * @param {Array} userEffects - User effect overrides (can be null/undefined)
 * @returns {Array} Merged effects array
 */
const mergeEffects = (defaultEffects, userEffects) => {
  // Default effects should always exist
  if (!defaultEffects || defaultEffects.length === 0) {
    throw new Error('Default effects are required but not provided');
  }

  // If no user effects, return defaults
  if (!userEffects || userEffects.length === 0) {
    return defaultEffects;
  }

  // Create a map of user effects by effectId for easy lookup
  const userEffectsMap = {};
  userEffects.forEach((effect) => {
    if (effect.effectId) {
      userEffectsMap[effect.effectId] = effect;
    }
  });

  // Merge effects: for each default effect, use user override if available
  const mergedEffects = defaultEffects
    .map((defaultEffect) => {
      const userOverride = userEffectsMap[defaultEffect.effectId];

      if (userOverride) {
        // If user set windowLength to 0, remove this effect
        if (userOverride.windowLength === 0) {
          return null;
        }

        // Merge user fields with default fields (user values take precedence)
        return {
          ...defaultEffect,
          ...userOverride,
        };
      }

      return defaultEffect;
    })
    .filter(Boolean); // Remove null entries (effects with windowLength 0)

  // Add any user effects that don't exist in defaults (unless windowLength is 0)
  userEffects.forEach((userEffect) => {
    if (!defaultEffects.find((def) => def.effectId === userEffect.effectId) && userEffect.windowLength !== 0) {
      mergedEffects.push(userEffect);
    }
  });

  return mergedEffects;
};

/**
 * Create a combined assumptions object that merges default data with custom overrides
 * @param {Object|null} defaultAssumptions - Default assumptions (if null, will be created)
 * @param {Object|null} userAssumptions - User's custom overrides in effects format (can be null)
 * @returns {Object} Combined assumptions object with all raw data unified
 */
export const createCombinedAssumptions = (defaultAssumptions = null, userAssumptions = null) => {
  // If no default assumptions provided, create them
  const defaults = defaultAssumptions || createDefaultAssumptions();

  // Start with default global parameters, applying any user overrides
  const combined = {
    globalParameters: {
      ...defaults.globalParameters,
      ...(userAssumptions?.globalParameters || {}),
    },
    categories: {},
    recipients: {},
  };

  // Process categories - combine default effects data with user effect overrides
  Object.entries(defaults.categories).forEach(([categoryId, categoryData]) => {
    const userCategoryData = userAssumptions?.categories?.[categoryId];

    combined.categories[categoryId] = {
      ...categoryData,
      // Merge user effects with default effects
      effects: mergeEffects(categoryData.effects, userCategoryData?.effects),
    };
  });

  // Process recipients - combine default category data with user effect overrides
  Object.entries(defaults.recipients).forEach(([recipientId, recipientData]) => {
    const userRecipientData = userAssumptions?.recipients?.[recipientId];
    const recipientCategories = {};

    Object.entries(recipientData.categories).forEach(([categoryId, categoryData]) => {
      const userRecipientCategoryData = userRecipientData?.categories?.[categoryId];

      // Start with default category data
      let processedCategoryData = { ...categoryData };

      // Merge user effects with default effects (use recipient-specific merge)
      if (userRecipientCategoryData?.effects && categoryData.effects) {
        processedCategoryData.effects = mergeRecipientEffects(categoryData.effects, userRecipientCategoryData.effects);
      }

      recipientCategories[categoryId] = processedCategoryData;
    });

    combined.recipients[recipientId] = {
      ...recipientData,
      categories: recipientCategories,
    };
  });

  // Add helper functions to avoid direct access to raw data
  combined.findRecipientId = (recipientName) => {
    if (!recipientName) return null;
    return Object.keys(combined.recipients).find((id) => combined.recipients[id].name === recipientName);
  };

  combined.getCategoryById = (categoryId) => {
    return combined.categories[categoryId] || null;
  };

  combined.getRecipientById = (recipientId) => {
    return combined.recipients[recipientId] || null;
  };

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
  return calculateCategoryBaseCostPerLife(category, categoryId, combinedAssumptions.globalParameters);
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

/**
 * Convert a simple cost per life value to effects format
 * @param {number} costPerLife - The cost per life value
 * @param {Object} globalParams - Global parameters object
 * @returns {Object} Effect object in new format
 */
export const costPerLifeToEffect = (costPerLife, globalParams) => {
  assertExists(costPerLife, 'costPerLife');
  assertExists(globalParams, 'globalParams');
  assertExists(globalParams.yearsPerLife, 'globalParams.yearsPerLife');

  return {
    effectId: 'user-override',
    startTime: 0,
    windowLength: 1,
    costPerQALY: costPerLife / globalParams.yearsPerLife,
  };
};

/**
 * Calculate weighted cost per life for a recipient using combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} recipientId - Recipient ID
 * @returns {number} Cost per life for the recipient
 */
export const getCostPerLifeForRecipientFromCombined = (combinedAssumptions, recipientId) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(recipientId, 'recipientId');

  const recipient = getRecipientFromCombined(combinedAssumptions, recipientId);
  validateRecipient(recipient, recipientId);

  let totalWeight = 0;
  let totalLivesSaved = 0;
  const spendingTotal = SIMULATION_AMOUNT;

  Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
    const weight = assertPositiveNumber(
      categoryData.fraction,
      'categoryData.fraction',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    totalWeight += weight;

    const category = combinedAssumptions.categories[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found in combined assumptions`);
    }

    let costPerLife;

    // If recipient has effect modifications, apply them to all effects
    if (categoryData.effects && category.effects && category.effects.length > 0) {
      // Apply recipient modifications to all effects
      const modifiedEffects = category.effects.map((categoryEffect) => {
        const recipientEffect = categoryData.effects.find((e) => e.effectId === categoryEffect.effectId);
        if (recipientEffect) {
          const context = `for recipient ${recipient.name} category ${categoryId}`;
          return applyRecipientEffectToBase(categoryEffect, recipientEffect, context);
        }
        return categoryEffect;
      });

      // Calculate cost per life from all modified effects
      costPerLife = calculateCategoryBaseCostPerLife(
        {
          name: category.name,
          effects: modifiedEffects,
        },
        categoryId,
        combinedAssumptions.globalParameters
      );
    } else {
      // No recipient effect modifications, use base calculation
      costPerLife = calculateCategoryBaseCostPerLife(category, categoryId, combinedAssumptions.globalParameters);
    }

    const validCostPerLife = assertNonZeroNumber(
      costPerLife,
      'costPerLife',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    totalLivesSaved += (spendingTotal * weight) / validCostPerLife;
  });

  if (Math.abs(totalWeight - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }

  if (totalWeight === 0) {
    crashInsteadOfFallback(`No valid categories with positive weights found for recipient ${recipient.name}`);
  }

  if (totalLivesSaved === 0) {
    crashInsteadOfFallback(`Total lives saved calculation resulted in zero for recipient ${recipient.name}`);
  }

  return spendingTotal / totalLivesSaved;
};

/**
 * Calculate lives saved for a donation using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {Object} donation - Donation record
 * @returns {number} Lives saved for this donation
 */
export const calculateLivesSavedForDonationFromCombined = (combinedAssumptions, donation) => {
  assertExists(donation, 'donation');
  assertExists(donation.recipientId, 'donation.recipientId');
  assertPositiveNumber(donation.amount, 'donation.amount');

  const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, donation.recipientId);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for recipient ${donation.recipientId}`);

  let credit = 1;
  if (donation.credit !== undefined) {
    credit = assertPositiveNumber(donation.credit, 'donation.credit');
  }

  const creditedAmount = donation.amount * credit;
  return creditedAmount / validCostPerLife;
};

/**
 * Calculate lives saved for a category donation using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {string} categoryId - Category ID
 * @param {number} amount - Donation amount
 * @returns {number} Lives saved for this category donation
 */
export const calculateLivesSavedForCategoryFromCombined = (combinedAssumptions, categoryId, amount) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(categoryId, 'categoryId');
  assertPositiveNumber(amount, 'amount');

  const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for category ${categoryId}`);

  return amount / validCostPerLife;
};

/**
 * Calculate donor statistics using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @returns {Array} Array of donor statistics
 */
export const calculateDonorStatsFromCombined = (combinedAssumptions) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');

  const donorStats = getAllDonors().map((donor) => {
    const donorId = Object.keys(donorsById).find((id) => donorsById[id] === donor);
    if (!donorId) {
      throw new Error(`Could not find ID for donor ${donor.name}`);
    }

    const donorData = getDonationsForDonor(donorId);

    let totalDonated = 0;
    let totalLivesSaved = 0;
    let knownDonations = 0;

    // Calculate totals based on actual donations using combined assumptions
    for (const donation of donorData) {
      const creditedAmount = donation.amount * donation.credit;
      totalDonated += creditedAmount;
      knownDonations += creditedAmount;

      const livesSaved = calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation);
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
    .sort((a, b) => b.totalLivesSaved - a.totalLivesSaved)
    .map((donor, index) => ({
      ...donor,
      rank: index + 1,
    }));

  return filteredStats;
};

/**
 * Get actual cost per life for a specific category within a recipient using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {string} recipientId - Recipient ID
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Category data from recipient
 * @returns {number} Cost per life for this category
 */
export const getActualCostPerLifeForCategoryDataFromCombined = (
  combinedAssumptions,
  recipientId,
  categoryId,
  categoryData
) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(recipientId, 'recipientId');
  assertExists(categoryId, 'categoryId');
  assertExists(categoryData, 'categoryData', `for category ${categoryId} in recipient ${recipientId}`);
  assertPositiveNumber(
    categoryData.fraction,
    'categoryData.fraction',
    `for category ${categoryId} in recipient ${recipientId}`
  );

  // Get the category and check for recipient-specific effect modifications
  const category = combinedAssumptions.categories[categoryId];
  if (!category || !category.effects || category.effects.length === 0) {
    return getCostPerLifeFromCombined(combinedAssumptions, categoryId);
  }

  const recipient = combinedAssumptions.recipients[recipientId];
  if (
    recipient &&
    recipient.categories &&
    recipient.categories[categoryId] &&
    recipient.categories[categoryId].effects
  ) {
    const recipientCategoryData = recipient.categories[categoryId];
    const categoryEffect = category.effects[0];
    const recipientEffect = recipientCategoryData.effects.find((re) => re.effectId === categoryEffect.effectId);

    if (recipientEffect) {
      // Apply recipient modifications to the category effect
      const context = `for recipient ${recipientId} category ${categoryId}`;
      const modifiedEffect = applyRecipientEffectToBase(categoryEffect, recipientEffect, context);

      // Convert the modified effect to cost per life
      return effectToCostPerLifeWithEffects(modifiedEffect, combinedAssumptions.globalParameters);
    }
  }

  // No recipient modifications, use base calculation
  return getCostPerLifeFromCombined(combinedAssumptions, categoryId);
};

/**
 * Get the effective cost per life for any entity using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {Object} entity - The entity to calculate cost per life for
 * @returns {number} The effective cost per life
 */
export const getEffectiveCostPerLifeFromCombined = (combinedAssumptions, entity) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');

  if (!entity) {
    return 0;
  }

  // If entity has a direct costPerLife field, use it
  if (entity.costPerLife !== undefined) {
    return entity.costPerLife;
  }

  // If entity has recipientId, calculate for recipient
  if (entity.recipientId) {
    return getCostPerLifeForRecipientFromCombined(combinedAssumptions, entity.recipientId);
  }

  // If entity has categoryId, get cost per life for category
  if (entity.categoryId) {
    return getCostPerLifeFromCombined(combinedAssumptions, entity.categoryId);
  }

  throw new Error('No valid calculation method found for cost per life.');
};

/**
 * Check if a category has custom user values
 * @param {Object|null} userAssumptions - User's custom overrides
 * @param {string} categoryId - Category ID to check
 * @returns {boolean} True if category has custom values
 */
export const isCategoryCustomized = (userAssumptions, categoryId) => {
  return !!userAssumptions?.categories?.[categoryId]?.effects;
};

/**
 * Check if a recipient category has custom user values
 * @param {Object|null} userAssumptions - User's custom overrides
 * @param {string} recipientId - Recipient ID
 * @param {string} categoryId - Category ID
 * @returns {boolean} True if recipient category has custom values
 */
export const isRecipientCategoryCustomized = (userAssumptions, recipientId, categoryId) => {
  return !!userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
};

/**
 * Check if a global parameter has custom user value
 * @param {Object|null} userAssumptions - User's custom overrides
 * @param {string} parameterKey - Parameter key to check
 * @returns {boolean} True if parameter has custom value
 */
export const isGlobalParameterCustomized = (userAssumptions, parameterKey) => {
  return !!userAssumptions?.globalParameters?.[parameterKey];
};

/**
 * Get all customized categories
 * @param {Object|null} userAssumptions - User's custom overrides
 * @returns {string[]} Array of customized category IDs
 */
export const getCustomizedCategories = (userAssumptions) => {
  if (!userAssumptions?.categories) return [];
  return Object.keys(userAssumptions.categories).filter(
    (categoryId) => userAssumptions.categories[categoryId]?.effects
  );
};

/**
 * Get all customized recipients
 * @param {Object|null} userAssumptions - User's custom overrides
 * @returns {string[]} Array of customized recipient IDs
 */
export const getCustomizedRecipients = (userAssumptions) => {
  if (!userAssumptions?.recipients) return [];
  return Object.keys(userAssumptions.recipients);
};

/**
 * Get all customized global parameters
 * @param {Object|null} userAssumptions - User's custom overrides
 * @returns {string[]} Array of customized parameter keys
 */
export const getCustomizedGlobalParameters = (userAssumptions) => {
  if (!userAssumptions?.globalParameters) return [];
  return Object.keys(userAssumptions.globalParameters);
};
