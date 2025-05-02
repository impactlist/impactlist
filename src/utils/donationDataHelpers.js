// Helper functions for donation and impact calculations
import { effectivenessCategories,donations, donors, recipients } from '../data/donationData';

// From the category data within a recipient, get the actual cost per life, taking into account custom values if they exist
const getActualCostPerLifeForCategoryData = (categoryId, categoryData, customValues = null) => {
  if (!categoryData || typeof categoryData.fraction !== 'number') {
    throw new Error(`Invalid category data for ${categoryId}.`);
  }
  let baseCostPerLife = 0;
  let multiplier = 1;
  if (categoryData.costPerLife !== undefined) {
    baseCostPerLife = categoryData.costPerLife;
  } else {
    baseCostPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);
    if (categoryData.multiplier !== undefined) {
      multiplier = categoryData.multiplier;
    }
  }
  return baseCostPerLife * multiplier;
}

// Get the effective costPerLife for a given category, considering custom values if they exist
export const getDefaultCostPerLifeForCategory = (categoryKey, customValues = null) => {
  // If we have custom values for this category, use them
  if (customValues && customValues[categoryKey] !== undefined) {
    return customValues[categoryKey];
  }
  
  // Use default category values if available
  if (effectivenessCategories[categoryKey]) {
    return effectivenessCategories[categoryKey].costPerLife;
  }
  
  // Throw an error for invalid category keys to make debugging easier
  throw new Error(`Invalid category key: "${categoryKey}". This category does not exist in effectivenessCategories.`);
};

// Calculate weighted average cost per life for a recipient
export const getCostPerLifeForRecipient = (recipient, customValues = null) => {
  if (!recipient || !recipient.categories) throw new Error(`Invalid recipient.`);
  
  let totalWeight = 0;

  const spendingTotal = 1e9; // simulate spending a billion dollars to get the cost per life
  let totalLivesSaved = 0;
  
  // Go through each category and calculate weighted costs
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in recipient ${recipient.name}.`);
    }
    
    const weight = categoryData.fraction;
    totalWeight += weight;
    
    if (weight <= 0) throw new Error(`Weight for category ${categoryId} in recipient ${recipient.name} is not positive. This should not happen.`);

    const costPerLife = getActualCostPerLifeForCategoryData(categoryId, categoryData, customValues);

    totalLivesSaved += (spendingTotal * weight) / (costPerLife);
  }
  
  // Ensure total weight is normalized
  if (Math.abs(totalWeight - 1) > 0.01) {
    throw new Error(`Warning: Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }
    
    // If no valid weights found, return null or a default
    if (totalWeight === 0) {
      throw new Error(`No valid weights found for recipient ${recipient.name}.`);
  }
  
  return spendingTotal / totalLivesSaved;
};

// Get the cost per life for all categories in a recipient
export const getAllCategoryCostsPerLifeWithinRecipient = (recipient, customValues = null) => {
  if (!recipient || !recipient.categories) throw new Error(`Invalid recipient.`);
  
  const result = {};
  
  // Calculate cost per life for each category
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in recipient ${recipient.name}.`);
    }
 
    result[categoryId] = getActualCostPerLifeForCategoryData(categoryId, categoryData, customValues);
  }
  
  return result;
};

// Get the primary (highest weight) category for a recipient
export const getPrimaryCategoryId = (recipient) => {
  if (!recipient || !recipient.categories) return null;
  
  let maxWeight = -1;
  let primaryCategoryId = null;
  
  // Find the category with the highest weight
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    const weight = categoryData.fraction;
    
    if (weight > maxWeight) {
      maxWeight = weight;
      primaryCategoryId = categoryId;
    }
  }
  
  if (primaryCategoryId === null) throw new Error(`No primary category found for recipient ${recipient.name}.`);

  return primaryCategoryId;
};

// Get a breakdown of categories for a recipient
export const getCategoryBreakdown = (recipient) => {
  if (!recipient || !recipient.categories) return [];
  
  // Convert categories object to an array with categoryId included
  const categories = Object.entries(recipient.categories).map(([categoryId, categoryData]) => {
    return {
      categoryId,
      ...categoryData
    };
  });
  
  // Sort by fraction (weight) in descending order
  return categories.sort((a, b) => b.fraction - a.fraction);
};

// Calculate donor statistics, including donations and lives saved
export const calculateDonorStats = (customValues = null) => {
  // Group donations by donor
  const donorDonations = {};
  
  for (const donation of donations) {
    if (!donorDonations[donation.donor]) {
      donorDonations[donation.donor] = [];
    }
    donorDonations[donation.donor].push(donation);
  }
  
  // Calculate stats for each donor
  const donorStats = donors.map(donor => {
    const donorName = donor.name;
    const donorData = donorDonations[donorName] || [];
    
    let totalDonated = 0;
    let totalLivesSaved = 0;
    let knownDonations = 0;
    
    // Calculate totals based on actual donations
    for (const donation of donorData) {
      // Find recipient for this donation
      const recipient = recipients.find(r => r.name === donation.recipient);
      if (!recipient) throw new Error(`Recipient not found: ${donation.recipient} for donor ${donorName}. This recipient needs to be added to the recipients array.`);
      
      const donationAmount = donation.amount;
      totalDonated += donationAmount;
      knownDonations += donationAmount;
      
      // Calculate cost per life for this recipient
      const costPerLife = getCostPerLifeForRecipient(recipient, customValues);
      
      // Apply credit multiplier if it exists
      const creditedAmount = donation.credit !== undefined ? 
        donationAmount * donation.credit : donationAmount;
      
      // Calculate lives saved
      let livesSaved;
      if (costPerLife === 0) {
        // Handle zero cost (infinite lives)
        livesSaved = 0;
      } else {
        // Normal case
        livesSaved = creditedAmount / costPerLife;
      }
      
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
    const costPerLifeSaved = totalLivesSaved !== 0 ? totalDonated / totalLivesSaved : Infinity;
    
    return {
      name: donorName,
      netWorth: donor.netWorth,
      totalDonated,
      knownDonations,
      totalDonatedField,
      livesSaved: totalLivesSaved,
      unknownLivesSaved,
      costPerLifeSaved: costPerLifeSaved
    };
  });
  
  // Filter out donors with no donations and sort by lives saved
  const filteredStats = donorStats
    .filter(donor => donor.totalDonated > 0)
    .sort((a, b) => b.livesSaved - a.livesSaved);
  
  // Add rank
  return filteredStats.map((donor, index) => ({
    ...donor,
    rank: index + 1
  }));
};