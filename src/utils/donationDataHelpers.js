// Helper functions for donation and impact calculations
import { effectivenessCategories,donations, donors, charities } from '../data/donationData';

// Get the effective costPerLife for a given category, considering custom values if they exist
export const getEffectiveCostPerLife = (categoryKey, customValues = null) => {
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

// Calculate weighted average cost per life for a charity
export const getCharityCostPerLife = (charity, customValues = null) => {
  if (!charity || !charity.categories) throw new Error(`Invalid charity.`);
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Go through each category and calculate weighted costs
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in charity ${charity.name}.`);
    }
    
    const weight = categoryData.fraction;
    totalWeight += weight;
    
    // If weight is 0, skip this category to avoid NaN issues
    if (weight > 0) {
      const baseCostPerLife = getEffectiveCostPerLife(categoryId, customValues);
      const multiplier = categoryData.multiplier !== undefined ? categoryData.multiplier : 1;
      weightedSum += (baseCostPerLife * multiplier) * weight;
    }
  }
  
  // Ensure total weight is normalized
  if (Math.abs(totalWeight - 1) > 0.01) {
    console.warn(`Warning: Category weights for charity "${charity.name}" do not sum to 1 (total: ${totalWeight}).`);
  }
  
  // If no valid weights found, return null or a default
  if (totalWeight === 0) {
    return null;
  }
  
  return weightedSum / totalWeight;
};

// Get the cost per life for a specific category in a charity
export const getCategoryCostPerLife = (charity, customValues = null) => {
  if (!charity || !charity.categories) throw new Error(`Invalid charity.`);
  
  const result = {};
  
  // Calculate cost per life for each category
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in charity ${charity.name}.`);
    }
    
    const weight = categoryData.fraction;
    
    // Only include categories with some weight
    if (weight > 0) {
      const baseCostPerLife = getEffectiveCostPerLife(categoryId, customValues);
      const multiplier = categoryData.multiplier !== undefined ? categoryData.multiplier : 1;
      result[categoryId] = baseCostPerLife * multiplier;
    }
  }
  
  return result;
};

// Calculate how much more/less effective this charity is compared to a direct human life-saving intervention
export const getCostPerLifeMultiplier = (charity, customValues = null) => {
  //const categoryCostPerLife = getCategoryCostPerLife(charity, customValues, effectivenessCategories); wtf is this?
  const charityCostPerLife = getCharityCostPerLife(charity, customValues);
  
  return charityCostPerLife ? charityCostPerLife / 5000 : null; // 5000 is the benchmark global health cost per life // wtf is this
};

// Get the primary (highest weight) category for a charity
export const getPrimaryCategory = (charity) => {
  if (!charity || !charity.categories) return null;
  
  let maxWeight = -1;
  let primaryCategory = null;
  
  // Find the category with the highest weight
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    const weight = categoryData.fraction;
    
    if (weight > maxWeight) {
      maxWeight = weight;
      primaryCategory = categoryId;
    }
  }
  
  return primaryCategory;
};

// Get a breakdown of categories for a charity
export const getCategoryBreakdown = (charity) => {
  if (!charity || !charity.categories) return [];
  
  // Convert categories object to an array with categoryId included
  const categories = Object.entries(charity.categories).map(([categoryId, categoryData]) => {
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
      // Find charity for this donation
      const charity = charities.find(c => c.name === donation.charity);
      if (!charity) continue;
      
      const donationAmount = donation.amount;
      totalDonated += donationAmount;
      knownDonations += donationAmount;
      
      // Calculate cost per life for this charity
      const costPerLife = getCharityCostPerLife(charity, customValues);
      
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