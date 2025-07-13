// Helper functions for donation and impact calculations
import { categoriesById, donorsById, recipientsById, donations } from '../data/generatedData';
import {
  calculateDonationImpact,
  calculateCostPerLifeEquivalent,
  calculateRecipientCostPerLife,
} from './effectsCalculation';

// Helper to get category by ID
export const getCategoryById = (categoryId) => {
  if (!categoryId) return null;
  return categoriesById[categoryId] || null;
};

// Helper to get recipient by ID
export const getRecipientById = (recipientId) => {
  if (!recipientId) return null;

  const recipient = recipientsById[recipientId];
  if (!recipient) {
    throw new Error(`Invalid recipient: ${recipientId}. This recipient does not exist in recipientsById.`);
  }
  return recipient;
};

// Helper to get donor by ID
export const getDonorById = (donorId) => {
  if (!donorId) return null;
  return donorsById[donorId] || null;
};

// Helper to get all recipients as an array
export const getAllRecipients = () => Object.values(recipientsById);

// Helper to get all donors as an array
export const getAllDonors = () => Object.values(donorsById);

// Helper to get all categories as an array
export const getAllCategories = () => {
  // Convert to array of objects with id included
  return Object.entries(categoriesById).map(([id, data]) => ({
    ...data,
    id, // Include the ID in the object
  }));
};

// Get primary effect for a recipient (for display purposes)
export const getPrimaryEffectForRecipient = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.effects || recipient.effects.length === 0) {
    throw new Error(`Recipient ${recipientId} has no effects defined. All recipients must use the new effects format.`);
  }

  // Return the first effect as the primary one
  const primaryEffect = recipient.effects[0];
  return {
    effectName: `${primaryEffect.categoryId} impact`,
    categoryId: primaryEffect.categoryId,
  };
};

// Get primary category ID for a recipient
export const getPrimaryCategoryId = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient) return null;

  // Check if recipient has effects (new format)
  if (recipient.effects && recipient.effects.length > 0) {
    return recipient.effects[0].categoryId;
  }

  throw new Error(`Recipient ${recipientId} has no effects defined. All recipients must use the new effects format.`);
};

// Get primary category for a recipient
export const getPrimaryCategoryForRecipient = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient) return { categoryId: null, categoryName: 'Unknown', count: 0 };

  // Check if recipient has effects (new format)
  if (recipient.effects && recipient.effects.length > 0) {
    const primaryCategoryId = recipient.effects[0].categoryId;
    const primaryCategory = getCategoryById(primaryCategoryId);
    return {
      categoryId: primaryCategoryId,
      categoryName: primaryCategory?.name || primaryCategoryId,
      count: recipient.effects.length,
    };
  }

  throw new Error(`Recipient ${recipientId} has no effects defined. All recipients must use the new effects format.`);
};

// Get category breakdown for a recipient
export const getCategoryBreakdown = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient) return [];

  // Handle effects format (new)
  if (recipient.effects && recipient.effects.length > 0) {
    return recipient.effects.map((effect) => ({
      categoryId: effect.categoryId,
      fraction: effect.fraction,
    }));
  }

  throw new Error(`Recipient ${recipientId} has no effects defined. All recipients must use the new effects format.`);
};

// Helper to find an entity's ID by its object reference
export const findEntityId = (entityObj, entitiesById) => {
  return Object.keys(entitiesById).find((id) => entitiesById[id] === entityObj);
};

// Helper to find recipient ID by recipient object
export const getRecipientId = (recipientObj) => {
  return findEntityId(recipientObj, recipientsById);
};

// Helper to find donor ID by donor object
export const getDonorId = (donorObj) => {
  return findEntityId(donorObj, donorsById);
};

// Get a recipient's name by ID
export const getRecipientNameById = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return recipient.name;
};

// Get a donor's name by ID
export const getDonorNameById = (donorId) => {
  const donor = donorsById[donorId];
  if (!donor) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donor.name;
};

// Helper to get donations for a specific donor
export const getDonationsForDonor = (donorId) => {
  if (!donorsById[donorId]) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donations.filter((donation) => donation.donorId === donorId);
};

// Helper to get donations for a specific recipient
export const getDonationsForRecipient = (recipientId) => {
  if (!recipientsById[recipientId]) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return donations.filter((donation) => donation.recipientId === recipientId);
};

// Helper to get total amount received by a recipient
export const getTotalAmountForRecipient = (recipientId) => {
  const recipientDonations = getDonationsForRecipient(recipientId);
  return recipientDonations.reduce((total, donation) => {
    const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
    return total + creditedAmount;
  }, 0);
};

// Helper to get total amount donated by a donor
export const getTotalAmountForDonor = (donorId) => {
  const donorDonations = getDonationsForDonor(donorId);
  if (donorDonations.length === 0) {
    throw new Error(`No donations found for donor: ${donorId}.`);
  }
  return donorDonations.reduce((total, donation) => total + donation.amount, 0);
};

// Helper to calculate total impact for a specific donation
export const calculateLivesSavedForDonation = (donation) => {
  if (!donation || !donation.recipientId || !donation.amount) {
    throw new Error(`Invalid donation data: ${JSON.stringify(donation)}. Missing recipientId or amount.`);
  }

  const recipient = getRecipientById(donation.recipientId);
  const result = calculateDonationImpact(donation, recipient);

  // Convert back to "lives saved" equivalent for compatibility
  // Since impact is now weighted by population type, we return the total weighted impact
  return result.totalImpact;
};

// Helper function to get cost per life for a recipient (wrapper for components)
export const getCostPerLifeForRecipient = (recipientId, customEffectivenessData = null) => {
  return calculateRecipientCostPerLife(recipientId, customEffectivenessData);
};

// Helper function to get cost per life for a category (wrapper for components)
export const getCostPerLifeForCategory = (
  categoryId,
  effectName = null,
  recipientName = null,
  customEffectivenessData = null
) => {
  return calculateCostPerLifeEquivalent(categoryId, effectName, recipientName, customEffectivenessData);
};

// Calculate donor statistics, including donations and impact
export const calculateDonorStats = (customEffectivenessData = null) => {
  const donorStats = getAllDonors().map((donor) => {
    const donorId = Object.keys(donorsById).find((id) => donorsById[id] === donor);
    if (!donorId) {
      throw new Error(`Could not find ID for donor ${donor.name}`);
    }

    const donorData = getDonationsForDonor(donorId);

    let totalDonated = 0;
    let totalImpact = 0;
    let knownDonations = 0;

    // Calculate totals based on actual donations
    for (const donation of donorData) {
      const creditedAmount = donation.amount * donation.credit;
      totalDonated += creditedAmount;
      knownDonations += creditedAmount;

      const recipient = getRecipientById(donation.recipientId);
      const impact = calculateDonationImpact(donation, recipient, customEffectivenessData);
      totalImpact += impact.totalImpact;
    }

    // Handle known totalDonated field if available
    let totalDonatedField = null;
    let unknownImpact = 0;

    if (donor.totalDonated && donor.totalDonated > knownDonations) {
      totalDonatedField = donor.totalDonated;

      // Calculate unknown amount
      const unknownAmount = donor.totalDonated - knownDonations;

      // Estimate impact for unknown donations if there are known donations
      if (knownDonations > 0 && totalImpact !== 0) {
        const avgCostPerImpact = knownDonations / totalImpact;
        unknownImpact = unknownAmount / avgCostPerImpact;
        totalImpact += unknownImpact;
      }

      // Add unknown amount to total
      totalDonated = donor.totalDonated;
    }

    // Calculate cost per impact unit
    const costPerLife = totalImpact !== 0 ? totalDonated / totalImpact : Infinity;

    return {
      name: donor.name,
      id: donorId,
      netWorth: donor.netWorth,
      totalDonated,
      knownDonations,
      totalDonatedField,
      totalLivesSaved: totalImpact, // Keep old name for compatibility
      unknownLivesSaved: unknownImpact, // Keep old name for compatibility
      costPerLife: costPerLife,
    };
  });

  // Filter out donors with no donations and sort by impact
  const filteredStats = donorStats
    .filter((donor) => donor.totalDonated > 0)
    .sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);

  return filteredStats;
};

// Re-export cost per life helpers for easy component access
export { calculateCostPerLifeEquivalent, calculateRecipientCostPerLife };
