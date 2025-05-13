// Helper functions for donation and impact calculations
import { categoriesById, donorsById, recipientsById, donations } from '../data/generatedData';

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

// Get primary category for a recipient
export const getPrimaryCategoryForRecipient = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    return { categoryId: null, categoryName: "Unknown", count: 0 };
  }

  const categories = recipient.categories;
  const categoryCount = Object.keys(categories).length;

  if (categoryCount === 0) {
    return { categoryId: null, categoryName: "None", count: 0 };
  } else if (categoryCount === 1) {
    // Single category
    const categoryId = Object.keys(categories)[0];
    const category = getCategoryById(categoryId);
    return {
      categoryId,
      categoryName: category?.name || categoryId,
      count: 1
    };
  } else {
    // Multiple categories - find primary (highest fraction)
    let primaryCategoryId = null;
    let maxWeight = -1;

    for (const [catId, catData] of Object.entries(categories)) {
      if (catData.fraction > maxWeight) {
        maxWeight = catData.fraction;
        primaryCategoryId = catId;
      }
    }

    const primaryCategory = getCategoryById(primaryCategoryId);
    return {
      categoryId: primaryCategoryId,
      categoryName: primaryCategory?.name || primaryCategoryId,
      count: categoryCount
    };
  }
};

// Helper to get all categories as an array
export const getAllCategories = () => {
  // Convert to array of objects with id included
  return Object.entries(categoriesById).map(([id, data]) => ({
    ...data,
    id // Include the ID in the object
  }));
};

// Helper to find an entity's ID by its object reference
export const findEntityId = (entityObj, entitiesById) => {
  return Object.keys(entitiesById).find(id => entitiesById[id] === entityObj);
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

// Get the effective costPerLife for a given category, considering custom values if they exist
export const getDefaultCostPerLifeForCategory = (categoryId, customValues = null) => {
  // If we have custom values for this category, use them
  if (customValues && customValues[categoryId] !== undefined) {
    return customValues[categoryId];
  }
  
  // Use default category values if available
  const category = categoriesById[categoryId];
  if (category) {
    return category.costPerLife;
  }
  
  // Throw an error for invalid category IDs to make debugging easier
  throw new Error(`Invalid category ID: "${categoryId}". This category does not exist in categoriesById.`);
};

// From the category data within a recipient, get the actual cost per life, taking into account custom values if they exist
export const getActualCostPerLifeForCategoryData = (recipientId, categoryId, categoryData, customValues = null) => {
  if (!categoryData || typeof categoryData.fraction !== 'number') {
    throw new Error(`Invalid category data for ${categoryId}.`);
  }
  
  const recipientName = getRecipientNameById(recipientId);
  
  // First check if we have custom values for this specific recipient and category
  if (customValues && 
      customValues.recipients && 
      customValues.recipients[recipientName] && 
      customValues.recipients[recipientName][categoryId]) {
    
    const recipientCustomData = customValues.recipients[recipientName][categoryId];
    
    // If there's a custom costPerLife value, use that directly
    if (recipientCustomData.costPerLife !== undefined) {
      // Check if it's a valid number (not in intermediate state)
      const costPerLife = recipientCustomData.costPerLife;
      if (typeof costPerLife === 'string') {
        // Ignore intermediate inputs like '-', '.', or '3.'
        if (costPerLife === '-' || costPerLife === '.' || costPerLife.endsWith('.')) {
          // Fall back to default behavior
        } else if (!isNaN(Number(costPerLife))) {
          return Number(costPerLife);
        }
      } else if (typeof costPerLife === 'number') {
        return costPerLife;
      }
    }
    
    // If there's a custom multiplier value, apply it to the base cost
    if (recipientCustomData.multiplier !== undefined) {
      // Check if it's a valid number (not in intermediate state)
      const multiplier = recipientCustomData.multiplier;
      if (typeof multiplier === 'string') {
        // Ignore intermediate inputs like '-', '.', or '3.'
        if (multiplier === '-' || multiplier === '.' || multiplier.endsWith('.')) {
          // Fall back to default behavior
        } else if (!isNaN(Number(multiplier))) {
          // Get the appropriate base cost per life
          const baseCostPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);
          // Note: Higher multiplier means more lives saved per dollar, so it DIVIDES the cost
          return baseCostPerLife / Number(multiplier);
        }
      } else if (typeof multiplier === 'number') {
        // Get the appropriate base cost per life
        const baseCostPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);
        // Note: Higher multiplier means more lives saved per dollar, so it DIVIDES the cost
        return baseCostPerLife / multiplier;
      }
    }
  }
  
  // Otherwise fall back to the original logic
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
  
  // Since multiplier increases effectiveness, we divide the cost per life
  const result = baseCostPerLife / multiplier;
  return result;
};

// Get the primary (highest weight) category for a recipient
export const getPrimaryCategoryId = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }
  
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
  
  if (primaryCategoryId === null) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }

  return primaryCategoryId;
};

// Calculate weighted average cost per life for a recipient
export const getCostPerLifeForRecipient = (recipientId, customValues = null) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }
  
  let totalWeight = 0;
  const spendingTotal = 1e9; // simulate spending a billion dollars to get the cost per life
  let totalLivesSaved = 0;
  
  // Go through each category and calculate weighted costs
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in recipient ${recipient.name}. Missing fraction or not a number.`);
    }
    
    const weight = categoryData.fraction;
    totalWeight += weight;
    
    if (weight <= 0) {
      throw new Error(`Weight for category ${categoryId} in recipient ${recipient.name} is not positive.`);
    }

    const costPerLife = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
    totalLivesSaved += (spendingTotal * weight) / (costPerLife);
  }
  
  // Ensure total weight is normalized
  if (Math.abs(totalWeight - 1) > 0.01) {
    throw new Error(`Category weights for recipient "${recipient.name}" do not sum to 1 (total: ${totalWeight}).`);
  }
    
  // If no valid weights found, return a default value
  if (totalWeight === 0) {
    throw new Error(`No valid categories with positive weights found for recipient ${recipient.name}.`);
  }
  
  return spendingTotal / totalLivesSaved;
};

// Get the cost per life for all categories in a recipient
export const getAllCategoryCostsPerLifeWithinRecipient = (recipientId, customValues = null) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}`);
  }
  
  const result = {};
  
  // Calculate cost per life for each category
  for (const [categoryId, categoryData] of Object.entries(recipient.categories)) {
    if (!categoryData || typeof categoryData.fraction !== 'number') {
      throw new Error(`Invalid category data for ${categoryId} in recipient ${recipient.name}.`);
    }
 
    result[categoryId] = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
  }
  
  return result;
};

// Get a breakdown of categories for a recipient
export const getCategoryBreakdown = (recipientId) => {
  const recipient = recipientsById[recipientId];
  if (!recipient || !recipient.categories) {
    throw new Error(`Invalid recipient: ${recipientId}. Recipient not found or missing categories.`);
  }
  
  // Convert categories object to an array with categoryId included
  const categories = Object.entries(recipient.categories).map(([categoryId, categoryData]) => {
    return {
      categoryId,
      ...categoryData
    };
  });
  
  if (categories.length === 0) {
    throw new Error(`No categories found for recipient ${recipient.name}.`);
  }
  
  // Sort by fraction (weight) in descending order
  return categories.sort((a, b) => b.fraction - a.fraction);
};

// Helper to get donations for a specific donor
export const getDonationsForDonor = (donorId) => {
  if (!donorsById[donorId]) {
    throw new Error(`Invalid donor ID: ${donorId}. This donor does not exist.`);
  }
  return donations.filter(donation => donation.donorId === donorId);
};

// Helper to get donations for a specific recipient
export const getDonationsForRecipient = (recipientId) => {
  if (!recipientsById[recipientId]) {
    throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
  }
  return donations.filter(donation => donation.recipientId === recipientId);
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

// Helper to calculate lives saved for a specific donation
export const calculateLivesSavedForDonation = (donation, customValues = null) => {
  if (!donation || !donation.recipientId || !donation.amount) {
    throw new Error(`Invalid donation data: ${JSON.stringify(donation)}. Missing recipientId or amount.`);
  }
  
  const costPerLife = getCostPerLifeForRecipient(donation.recipientId, customValues);
  
  // Apply credit multiplier if it exists
  const creditedAmount = donation.credit !== undefined ? 
    donation.amount * donation.credit : donation.amount;
  
  // Calculate lives saved
  if (costPerLife === 0) {
    throw new Error(`Cost per life for recipient ${donation.recipientId} is zero, which would result in infinite lives saved.`);
  } else {
    // Normal case
    return creditedAmount / costPerLife;
  }
};

// Helper to calculate lives saved for a direct donation to a category
export const calculateLivesSavedForCategory = (categoryId, amount, customValues = null) => {
  if (!categoryId || !amount || isNaN(Number(amount))) {
    return 0;
  }
  
  // Get the cost per life for this category
  const costPerLife = getDefaultCostPerLifeForCategory(categoryId, customValues);
  
  // Calculate lives saved
  if (costPerLife === 0) {
    throw new Error(`Cost per life for category ${categoryId} is zero, which would result in infinite lives saved.`);
  } else {
    // Normal case
    return Number(amount) / costPerLife;
  }
};

// Calculate donor statistics, including donations and lives saved
export const calculateDonorStats = (customValues = null) => {
  const donorStats = getAllDonors().map(donor => {
    const donorId = Object.keys(donorsById).find(id => donorsById[id] === donor);
    if (!donorId) {
      throw new Error(`Could not find ID for donor ${donor.name}`);
    }
    
    const donorData = getDonationsForDonor(donorId);
    
    let totalDonated = 0;
    let totalLivesSaved = 0;
    let knownDonations = 0;
    
    // Calculate totals based on actual donations
    for (const donation of donorData) {
      const creditedAmount = donation.amount * donation.credit;
      totalDonated += creditedAmount;
      knownDonations += creditedAmount;
      
      const livesSaved = calculateLivesSavedForDonation(donation, customValues);
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
      livesSaved: totalLivesSaved,
      unknownLivesSaved,
      costPerLife: costPerLife
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