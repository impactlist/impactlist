// Assumptions data helpers
// Utilities for managing default, user, and combined assumption data structures
import { globalParameters, categoriesById, recipientsById } from '../data/generatedData.js';
import {
  calculateCostPerLife,
  applyRecipientEffectToBase,
  effectToCostPerLife as effectToCostPerLifeWithEffects,
  selectEffectsForYear,
} from './effectsCalculation.js';
import {
  assertExists,
  assertPositiveNumber,
  assertNonZeroNumber,
  validateRecipient,
  crashInsteadOfFallback,
} from './dataValidation.js';
import { SIMULATION_AMOUNT, WEIGHT_NORMALIZATION_TOLERANCE } from './constants.js';
import { getAllDonors, getDonationsForDonor, getDonorId, extractYearFromDonation } from './donationDataHelpers.js';

/**
 * Create a default assumptions object from the base data
 * @returns {Object} Default assumptions object with all data in unified format
 */
export const createDefaultAssumptions = () => {
  // Create a deep copy of the imported data to prevent mutations
  const defaults = {
    globalParameters: { ...globalParameters },
    categories: {},
    recipients: {},
  };

  // Process categories - use deep copies of default effects data
  Object.entries(categoriesById).forEach(([categoryId, categoryData]) => {
    // Deep copy to prevent mutation of shared references
    defaults.categories[categoryId] = JSON.parse(JSON.stringify(categoryData));
  });

  // Process recipients - use deep copies of default category data
  Object.entries(recipientsById).forEach(([recipientId, recipientData]) => {
    // Deep copy to prevent mutation of shared references
    defaults.recipients[recipientId] = JSON.parse(JSON.stringify(recipientData));
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
    // Return a deep copy to avoid mutation
    return JSON.parse(JSON.stringify(defaultEffect));
  }

  // Start with a DEEP copy of the default effect to avoid mutations
  const merged = JSON.parse(JSON.stringify(defaultEffect));

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

  // Copy the disabled field if present
  if (userEffect.disabled !== undefined) {
    merged.disabled = userEffect.disabled;
  }

  return merged;
};

/**
 * Merge recipient effects arrays (handles overrides/multipliers structure)
 * @param {Array} defaultEffects - Default recipient effects array
 * @param {Array} userEffects - User effect overrides (can be null/undefined)
 * @returns {Array} Merged effects array
 */
export const mergeRecipientEffects = (defaultEffects, userEffects) => {
  if (!defaultEffects || defaultEffects.length === 0) {
    throw new Error('Default effects are required but not provided');
  }

  if (!userEffects || userEffects.length === 0) {
    // Return a deep copy to avoid mutation
    return JSON.parse(JSON.stringify(defaultEffects));
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
      return mergeRecipientEffectWithUser(defaultEffect, userEffect);
    })
    .filter(Boolean);
};

/**
 * Merge user effect overrides with default effects
 * For categories: User values directly replace default field values
 * @param {Array} defaultEffects - Default effects array
 * @param {Array} userEffects - User effect overrides (can be null/undefined)
 * @returns {Array} Merged effects array
 */
export const mergeEffects = (defaultEffects, userEffects) => {
  // Default effects should always exist
  if (!defaultEffects || defaultEffects.length === 0) {
    throw new Error('Default effects are required but not provided');
  }

  // If no user effects, return a deep copy of defaults to avoid mutation
  if (!userEffects || userEffects.length === 0) {
    return JSON.parse(JSON.stringify(defaultEffects));
  }

  // Create a map of user effects by effectId for easy lookup
  const userEffectsMap = {};
  userEffects.forEach((effect) => {
    if (effect.effectId) {
      userEffectsMap[effect.effectId] = effect;
    }
  });

  // Merge effects: for each default effect, merge with user values if available
  const mergedEffects = defaultEffects
    .map((defaultEffect) => {
      const userEffect = userEffectsMap[defaultEffect.effectId];

      if (userEffect) {
        // Start with a deep copy of the default effect
        const merged = JSON.parse(JSON.stringify(defaultEffect));

        // For categories, user values are stored directly as field values
        // Simply overlay all user field values onto the default
        Object.entries(userEffect).forEach(([fieldName, value]) => {
          // Skip effectId as it's just an identifier
          if (fieldName !== 'effectId') {
            merged[fieldName] = value;
          }
        });

        return merged;
      }

      // Return a deep copy to avoid mutations
      return JSON.parse(JSON.stringify(defaultEffect));
    })
    .filter(Boolean); // Remove null entries

  // Add any user effects that don't exist in defaults
  userEffects.forEach((userEffect) => {
    if (!defaultEffects.find((def) => def.effectId === userEffect.effectId)) {
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

      // Merge user effects with default effects
      if (userRecipientCategoryData?.effects) {
        // User has overrides for this recipient+category
        let baseEffects;

        if (categoryData.effects) {
          // Recipient has custom default effects - use those as base
          baseEffects = categoryData.effects;
        } else {
          // Recipient doesn't have custom effects - use category defaults as base
          baseEffects = combined.categories[categoryId]?.effects || [];
        }

        // Merge user overrides with the base effects
        processedCategoryData.effects = mergeRecipientEffects(baseEffects, userRecipientCategoryData.effects);
      } else if (categoryData.effects) {
        // No user overrides but recipient has custom default effects
        processedCategoryData.effects = categoryData.effects;
      }
      // If neither user overrides nor custom defaults, effects remain undefined (uses category defaults)

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

  // Get all recipients as an array with id included
  combined.getAllRecipients = () => {
    return Object.entries(combined.recipients).map(([id, data]) => ({
      ...data,
      id, // Include the ID in the object
    }));
  };

  // Get all categories as an array with id included
  combined.getAllCategories = () => {
    return Object.entries(combined.categories).map(([id, data]) => ({
      ...data,
      id, // Include the ID in the object
    }));
  };

  return combined;
};

/**
 * Get the effective cost per life for a category from combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} categoryId - The category ID
 * @param {number} donationYear - Year when the donation was made (required)
 * @returns {number} The effective cost per life calculated from effects
 */
export const getCostPerLifeFromCombined = (combinedAssumptions, categoryId, donationYear) => {
  if (typeof donationYear !== 'number' || !Number.isInteger(donationYear)) {
    throw new Error(`donationYear must be an integer for getCostPerLifeFromCombined`);
  }

  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(categoryId, 'categoryId');

  const category = combinedAssumptions.categories[categoryId];
  if (!category) {
    throw new Error(`Category ${categoryId} not found in combined assumptions`);
  }

  // Calculate cost per life from the effects data
  return calculateCostPerLife(category.effects, combinedAssumptions.globalParameters, donationYear);
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
 * Calculate weighted cost per life for a recipient using combined assumptions
 * @param {Object} combinedAssumptions - The combined assumptions object
 * @param {string} recipientId - Recipient ID
 * @param {number} donationYear - Year when the donation was made (required)
 * @returns {number} Cost per life for the recipient
 */
export const getCostPerLifeForRecipientFromCombined = (combinedAssumptions, recipientId, donationYear) => {
  if (typeof donationYear !== 'number' || !Number.isInteger(donationYear)) {
    throw new Error(`donationYear must be an integer for recipient ${recipientId}`);
  }
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

    // Check if recipient has effect modifications (overrides or multipliers)
    if (categoryData.effects && categoryData.effects.length > 0) {
      // Recipient has custom effects - apply them to the category's base effects
      const baseEffects = category.effects || [];

      if (baseEffects.length > 0) {
        // Get base effects applicable for this year
        const applicableBaseEffects = selectEffectsForYear(baseEffects, donationYear);

        // Apply recipient modifications to matching base effects
        const modifiedEffects = applicableBaseEffects.map((categoryEffect) => {
          const recipientEffect = categoryData.effects.find((e) => e.effectId === categoryEffect.effectId);
          if (recipientEffect) {
            const context = `for recipient ${recipient.name} category ${categoryId}`;
            return applyRecipientEffectToBase(categoryEffect, recipientEffect, context);
          }
          return categoryEffect;
        });

        // Calculate cost per life from modified effects
        costPerLife = calculateCostPerLife(modifiedEffects, combinedAssumptions.globalParameters, donationYear);
      } else {
        // No base effects to modify - this shouldn't happen in practice
        throw new Error(`Category ${categoryId} has no base effects to apply recipient modifications to`);
      }
    } else {
      // No recipient effect modifications, use base category calculation
      if (!category.effects || category.effects.length === 0) {
        throw new Error(`Category ${categoryId} has no effects defined`);
      }
      costPerLife = calculateCostPerLife(category.effects, combinedAssumptions.globalParameters, donationYear);
    }

    const validCostPerLife = assertNonZeroNumber(
      costPerLife,
      'costPerLife',
      `for category ${categoryId} in recipient ${recipient.name}`
    );

    // Skip categories with infinite cost (no lives can be saved)
    if (validCostPerLife === Infinity) {
      return; // Skip this category
    }

    totalLivesSaved += (spendingTotal * weight) / validCostPerLife;
  });

  if (Math.abs(totalWeight - 1) > WEIGHT_NORMALIZATION_TOLERANCE) {
    throw new Error(`Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }

  if (totalWeight === 0) {
    crashInsteadOfFallback(`No valid categories with positive weights found for recipient ${recipient.name}`);
  }

  if (totalLivesSaved === 0) {
    // All categories have infinite cost (no lives can be saved within time limit)
    return Infinity;
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

  // Extract year from donation date
  const donationYear = extractYearFromDonation(donation);

  const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, donation.recipientId, donationYear);
  const validCostPerLife = assertNonZeroNumber(costPerLife, 'costPerLife', `for recipient ${donation.recipientId}`);

  let credit = 1;
  if (donation.credit !== undefined) {
    credit = assertPositiveNumber(donation.credit, 'donation.credit');
  }

  const creditedAmount = donation.amount * credit;

  // If cost per life is infinite, no lives can be saved
  if (validCostPerLife === Infinity) {
    return 0;
  }

  return creditedAmount / validCostPerLife;
};

/**
 * Calculate lives saved for a category donation using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {string} categoryId - Category ID
 * @param {number} amount - Donation amount
 * @param {number} donationYear - Year when the donation was made (required)
 * @returns {number} Lives saved for this category donation
 */
export const calculateLivesSavedForCategoryFromCombined = (combinedAssumptions, categoryId, amount, donationYear) => {
  assertExists(combinedAssumptions, 'combinedAssumptions');
  assertExists(categoryId, 'categoryId');
  assertPositiveNumber(amount, 'amount');

  const costPerLife = getCostPerLifeFromCombined(combinedAssumptions, categoryId, donationYear);
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
    const donorId = getDonorId(donor);
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
 * @param {number} donationYear - Year when the donation was made (required)
 * @returns {number} Cost per life for this category
 */
export const getActualCostPerLifeForCategoryDataFromCombined = (
  combinedAssumptions,
  recipientId,
  categoryId,
  categoryData,
  donationYear
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
    return getCostPerLifeFromCombined(combinedAssumptions, categoryId, donationYear);
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
      return effectToCostPerLifeWithEffects(modifiedEffect, combinedAssumptions.globalParameters, donationYear);
    }
  }

  // No recipient modifications, use base calculation
  return getCostPerLifeFromCombined(combinedAssumptions, categoryId, donationYear);
};

/**
 * Get the effective cost per life for any entity using combined assumptions
 * @param {Object} combinedAssumptions - Combined assumptions object
 * @param {Object} entity - The entity to calculate cost per life for
 * @param {number} donationYear - Year when the donation was made (required)
 * @returns {number} The effective cost per life
 */
export const getEffectiveCostPerLifeFromCombined = (combinedAssumptions, entity, donationYear) => {
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
    return getCostPerLifeForRecipientFromCombined(combinedAssumptions, entity.recipientId, donationYear);
  }

  // If entity has categoryId, get cost per life for category
  if (entity.categoryId) {
    return getCostPerLifeFromCombined(combinedAssumptions, entity.categoryId, donationYear);
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
