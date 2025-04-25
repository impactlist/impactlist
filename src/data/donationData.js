// Charity focus areas with cost to save a life (in dollars)
export const effectivenessCategories = {
  'ai_risk': { name: 'AI Existential Risk', costPerLife: 50 },             
  'pandemics': { name: 'Pandemics', costPerLife: 500 },                    
  'nuclear': { name: 'Nuclear', costPerLife: 2000 },                      
  'global_health': { name: 'Global Health', costPerLife: 5000},            
  'global_development': { name: 'Global Development / Poverty', costPerLife: 5000 },
  'animal_welfare': { name: 'Animal Welfare', costPerLife: 30000 },       
  'global_priorities': { name: 'Global Priorities Research', costPerLife: 5000 },
  'meta_theory': { name: 'Meta and Theory', costPerLife: 5000 },           
  'decision_making': { name: 'Improving Decision Making', costPerLife: 1000 },
  'institutions': { name: 'Improving Institutions', costPerLife: 50000 },
  'climate_change': { name: 'Climate Change', costPerLife: 50000 },        
  'health_medicine': { name: 'Health / Medicine', costPerLife: 20000 },       
  'education': { name: 'Education', costPerLife: 20000 },                  
  'political': { name: 'Political', costPerLife: 10000 },    
  'science_tech': { name: 'Science and Tech', costPerLife: 20000 },         
  'local_community': { name: 'Local Community', costPerLife: 50000 },     
  'arts_culture': { name: 'Arts, Culture, Heritage', costPerLife: 100000 }, 
  'religious': { name: 'Religious', costPerLife: 100000 },                  
  'environmental': { name: 'General Environmental', costPerLife: 100000 },  
  'disaster_relief': { name: 'Disaster Relief', costPerLife: 30000 },      
  'human_rights': { name: 'Human Rights and Justice', costPerLife: 50000 },
  'social_justice': { name: 'Social Justice', costPerLife: 500000 },
  'housing': { name: 'Homelessness and Housing', costPerLife: 50000 },     
  'longevity': { name: 'Longevity', costPerLife: 10000 },                 
  'population': { name: 'Population', costPerLife: 50000 },
  'conflict_mitigation': { name: 'Conflict Mitigation', costPerLife: 50000 },
  'other': { name: 'Other', costPerLife: 100000 }
};

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

  // First check if charity has a direct costPerLife property
  if (charity.costPerLife !== undefined) return charity.costPerLife;
  
  // Also check if costPerLife is directly in the categories object (special case)
  if (charity.categories.costPerLife !== undefined) return charity.categories.costPerLife;
  
  // If no direct costPerLife, calculate from categories
  if (Object.keys(charity.categories).length === 0) throw new Error(`Charity has no categories.`); 
  
  let totalWeight = 0;
  let weightedCost = 0;
  
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    // Skip non-category properties (like costPerLife)
    if (!effectivenessCategories[categoryId]) throw new Error(`Found non-existant category.`);
    
    const weight = categoryData.fraction;
    totalWeight += weight;
    
    // If the charity category has a specific costPerLife, use that directly
    let categoryCost;
    if (categoryData.costPerLife !== undefined) {
      categoryCost = categoryData.costPerLife;
    } else {
      // Otherwise calculate it from the base category value with multiplier
      const baseCostPerLife = getEffectiveCostPerLife(categoryId, customValues);
      const multiplier = categoryData.multiplier !== undefined ? categoryData.multiplier : 1;
      categoryCost = baseCostPerLife / multiplier;
    }
    
    weightedCost += categoryCost * weight;
  }
  
  // If no valid categories were processed, return default
  if (totalWeight === 0) throw new Error(`No categories were processed.`);
  
  return weightedCost / totalWeight;
};

// Calculate weighted average of base category costs (without multipliers)
export const getCategoryCostPerLife = (charity, customValues = null) => {
  if (!charity || !charity.categories) throw new Error(`Invalid charity.`); // Default for invalid charities
  
  // If costPerLife is directly in the categories object (special case), use it as the base
  if (charity.categories.costPerLife !== undefined) return charity.categories.costPerLife;
  
  // If no categories, return default
  if (Object.keys(charity.categories).length === 0) throw new Error(`Charity has no categories.`);
  
  let totalWeight = 0;
  let weightedCost = 0;
  
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    // Skip non-category properties (like costPerLife)
    if (!effectivenessCategories[categoryId]) throw new Error(`Found non-existant category.`);
    
    const weight = categoryData.fraction;
    totalWeight += weight;
    
    // If the charity category has a specific costPerLife, use that directly
    if (categoryData.costPerLife !== undefined) {
      weightedCost += categoryData.costPerLife * weight;
    } else {
      // Otherwise use the category default
      weightedCost += getEffectiveCostPerLife(categoryId, customValues) * weight;
    }
  }
  
  // If no valid categories were processed, return default
  if (totalWeight === 0) throw new Error(`No categories were processed.`);
  
  return weightedCost / totalWeight;
};

// Calculate how much more/less effective a charity is compared to the base category
export const getCostPerLifeMultiplier = (charity, customValues = null) => {
  const categoryCostPerLife = getCategoryCostPerLife(charity, customValues);
  const charityCostPerLife = getCharityCostPerLife(charity, customValues);
  
  if (charityCostPerLife === 0) return 0;
  return categoryCostPerLife / charityCostPerLife;
};

// Get the primary category for a charity based on weighting
export const getPrimaryCategory = (charity) => {
  if (!charity.categories || Object.keys(charity.categories).length === 0) {
    throw new Error(`Charity has no categories.`);
  }
  
  let maxWeight = 0;
  let primaryCategoryId = null;
  
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    const weight = categoryData.fraction;
    if (weight > maxWeight) {
      maxWeight = weight;
      primaryCategoryId = categoryId;
    }
  }
  
  return { 
    id: primaryCategoryId, 
    name: effectivenessCategories[primaryCategoryId].name
  };
};

// Get a breakdown of all categories for a charity
export const getCategoryBreakdown = (charity) => {
  if (!charity.categories || Object.keys(charity.categories).length === 0) {
    throw new Error(`Charity has no categories.`);
  }
  
  const breakdownList = [];
  let totalFraction = 0;
  
  for (const [categoryId, categoryData] of Object.entries(charity.categories)) {
    totalFraction += categoryData.fraction;
    
    breakdownList.push({
      id: categoryId,
      key: categoryId,
      name: effectivenessCategories[categoryId].name,
      fraction: categoryData.fraction,
      percentage: Math.round(categoryData.fraction * 100),
      multiplier: categoryData.multiplier
    });
  }
  
  if (Math.abs(totalFraction - 1) > 0.00001) 
    throw new Error(`Category fractions for charity "${charity.name}" sum to ${totalFraction}, should be 1.0`);
  
  // Sort by percentage (highest first)
  return breakdownList.sort((a, b) => b.percentage - a.percentage);
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

// Donor data with net worth
export const donors = [
  //  { name: 'Amancio Ortega', netWorth: 1.21e11 },
    { name: 'Bill Gates', netWorth: 1.08e11, totalDonated: 5.9e10 },
  //  { name: 'Bernard Arnault', netWorth: 1.45e11 },
  //  { name: 'Dustin Moskovitz', netWorth: 1.4e10 },
    { name: 'Elon Musk', netWorth: 3.64e11 },
    { name: 'Jaan Tallinn', netWorth: 1.0e9 },
  //  { name: 'Jack Dorsey', netWorth: 3.6e9 },
  //  { name: 'Jack Ma', netWorth: 2.6e10 },
    { name: 'Jeff Bezos', netWorth: 1.91e11 },
  //  { name: 'Jensen Huang', netWorth: 9.2e10 },
  //  { name: 'Larry Ellison', netWorth: 1.63e11 },
    { name: 'Larry Page', netWorth: 1.28e11, totalDonated: 1.6e9 },
    { name: 'Mackenzie Scott', netWorth: 2.5e10 },
    { name: 'Mark Zuckerberg', netWorth: 1.7e11 },
    { name: 'Michael Bloomberg', netWorth: 1.1e11 },
  //  { name: 'Sergey Brin', netWorth: 1.23e11 },
  //  { name: 'Steve Ballmer', netWorth: 1.13e11 },
    { name: 'Vitalik Buterin', netWorth: 6e8 },
    { name: 'Warren Buffett', netWorth: 1.61e11 },
  ];
  
// Charity and organization data with categories and effectiveness multipliers
export const charities = [
  { name: 'Against Malaria Foundation', categories: { global_health: { fraction: 1.0 } } },
  { name: 'GiveDirectly', categories: { global_development: { fraction: 1.0 } } },
  { name: 'Malaria Consortium', categories: { global_health: { fraction: 1.0 } } },
  { name: 'GiveWell Maximum Impact Fund', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Evidence Action', categories: { global_health: { fraction: 1.0 } } },
  { name: 'Helen Keller International', categories: { global_health: { fraction: 1.0 } } },
  { name: 'SCI Foundation', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'The END Fund', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'New Incentives', categories: { global_health: { fraction: 1.0 } } },
  { name: 'Development Media International', categories: { education: { fraction: 1.0 } } },
  { name: 'Anthropic', categories: { ai_risk: { fraction: 1.0, costPerLife: -50 } } },
  { name: 'Center for Human-Compatible AI', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Coalition for Epidemic Preparedness', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'Nuclear Threat Initiative', categories: { nuclear: { fraction: 1.0 } } },
  { name: 'Mercy For Animals', categories: { animal_welfare: { fraction: 1.0 } } },
  { name: 'Global Priorities Institute', categories: { global_priorities: { fraction: 1.0 } } },
  { name: 'Climate Works', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'Wikimedia Foundation', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Habitat for Humanity', categories: { housing: { fraction: 1.0 } } },
  { name: 'SENS Research Foundation', categories: { longevity: { fraction: 1.0 } } },
  { name: 'University of Washington (research)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'University of Washington', categories: { education: { fraction: 1.0 } } },
  { name: 'Stanford University', categories: { education: { fraction: 1.0 } } },
  { name: 'Harvard University', categories: { education: { fraction: 1.0 } } },
  { name: 'Harvard University (tech research)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Gates Library Foundation', categories: { education: { fraction: 1.0 } } },
  { name: 'Seattle Public Libraries', categories: { education: { fraction: 1.0 } } },
  { name: 'Bill & Melinda Gates Foundation', categories: {
      global_health: { fraction: 0.4 },
      global_development: { fraction: 0.30 },
      climate_change: { fraction: 0.07 },
      education: { fraction: 0.08 },
      pandemics: { fraction: 0.07 },
      science_tech: { fraction: 0.05 },
      human_rights: { fraction: 0.03 },
      } },
  { name: 'United Negro College Fund', categories: { education: { fraction: 1.0 } } },
  { name: 'Dementia Discovery Fund', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'OpenAI', categories: { ai_risk: { fraction: 1.0, costPerLife: -5 } } },
  { name: 'Sierra Club', categories: { environmental: { fraction: 1.0 } } },
  { name: 'Future of Life Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'California Covid Response', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'XPrize, Climate Change', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'Cameron County Schools, TX', categories: { education: { fraction: 1.0 } } },
  { name: 'City of Brownsville, TX', categories: { local_community: { fraction: 1.0 } } },
  { name: 'St. Jude Children\'s Hospital', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Khan Academy', categories: { education: { fraction: 1.0, multiplier: 10 } } },
  { name: 'Arbor Day Foundation', categories: { environmental: { fraction: 1.0 } } },
  { name: 'Bayou La Batre Hurricane Response Center', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Soma City, Fukushima (tech)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Tesla Science Center at Wardenclyffe', categories: { arts_culture: { fraction: 1.0 } } },
  { name: 'ACLU', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'Art of Elysium', categories: { arts_culture: { fraction: 1.0 } } },
  { name: 'Flint Public Schools (Water Filtration)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Ad Astra School', categories: { education: { fraction: 1.0 } } },
  { name: 'Crossroads School', categories: { education: { fraction: 1.0 } } },
  { name: 'Windward School', categories: { education: { fraction: 1.0 } } },
  { name: 'University of Texas Population Initiative', categories: { population: { fraction: 1.0 } } },
  { name: 'MIT', categories: { education: { fraction: 1.0 } } },
  { name: 'Unknown', categories: { other: { fraction: 1.0 } } },
  { name: 'Starlink in Ukraine', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Museum of History & Industry (Seattle)', categories: { arts_culture: { fraction: 1.0 } } },
  { name: 'Princeton University (science)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Washington United for Marriage (Referendum 74 campaign)', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'Reporters Committee for Freedom of the Press', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'TheDream.US', categories: { education: { fraction: 1.0 } } },
  { name: 'With Honor Fund', categories: { political: { fraction: 1.0 } } },
  { name: 'Bezos Day One Fund', categories: {
      housing: { fraction: 0.5 },
      education: {fraction: 0.5} } },
  { name: 'Bezos Earth Fund', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'Feeding America (COVID-19 Response Fund)', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'All In Washington (COVID-19 relief effort)', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Smithsonian Institution', categories: { arts_culture: { fraction: 1.0 } } },
  { name: 'Van Jones (Bezos Courage & Civility Award)', categories: { other: { fraction: 1.0 } } },
  { name: 'José Andrés (Bezos Courage & Civility Award)', categories: { other: { fraction: 1.0 } } },
  { name: 'Obama Foundation', categories: { 
      local_community: { fraction: 0.5 },
      social_justice: { fraction: 0.5 } } },
  { name: 'Dolly Parton (Bezos Courage & Civility Award)', categories: { other: { fraction: 1.0 } } },
  { name: 'Eva Longoria (Bezos Courage & Civility Award)', categories: { other: { fraction: 1.0 } } },
  { name: 'Bill McRaven (Bezos Courage & Civility Award)', categories: { other: { fraction: 1.0 } } },
  { name: 'University of California, Davis (Medicine)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Ellison Medical Foundation', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Sderot Community Center (Israel)', categories: { local_community: { fraction: 1.0 } } },
  { name: 'Global Polio Eradication Initiative', categories: { global_health: { fraction: 1.0 } } },
  { name: 'Friends of the Israel Defense Forces', categories: { conflict_mitigation: { fraction: 1.0 } } },
  { name: 'University of Southern California (Medicine)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'University of Oxford (Science)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'GAVI Alliance (The Vaccine Fund)', categories: { global_health: { fraction: 1.0 } } },
  { name: 'PATH', categories: { global_health: { fraction: 1.0 } } },
  { name: 'The Foundation (Musk)', categories: { education: { fraction: 1.0, multiplier: 10.0 } } },
  { name: 'IAEA Nuclear Fuel Bank', categories: { nuclear: { fraction: 1.0 } } },
  { name: 'Susan Thompson Buffett Foundation', categories: {
      health_medicine: { fraction: 0.65 },
      global_health: { fraction: 0.15 },
      education: { fraction: 0.10 },
      social_justice: { fraction: 0.05 },
      human_rights: { fraction: 0.05 } } },
  { name: 'Howard G. Buffett Foundation', categories: {
      conflict_mitigation: { fraction: 0.25 },
      human_rights: { fraction: 0.15 },
      global_development: { fraction: 0.6 } } },
  { name: 'Sherwood Foundation', categories: {
      education: { fraction: 0.5 },
      social_justice: { fraction: 0.25 },
      housing: { fraction: 0.05 },
      health_medicine: { fraction: 0.05 },
      local_community: { fraction: 0.15 } } },
  { name: 'NoVo Foundation', categories: {
      human_rights: { fraction: 0.15 },
      education: { fraction: 0.1 },
      local_community: { fraction: 0.1 },
      environmental: { fraction: 0.05 },
      social_justice: { fraction: 0.6 } } },
  { name: 'GLIDE Foundation', categories: {
      local_community: { fraction: 0.2 },
      housing: { fraction: 0.4 },
      health_medicine: { fraction: 0.1 },
      social_justice: { fraction: 0.3 } } },
  { name: 'Californians for Clean Alternative Energy', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'No on Proposition 8 Campaign', categories: { social_justice: { fraction: 1.0 } } },
  { name: 'President Barack Obama Inaugural Committee', categories: { political: { fraction: 1.0 } } },
  { name: 'Ebola Relief Efforts', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Shoo the Flu', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Oakland Unified School District (Flu Shots)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Regents of the University of California (vaccine delivery study)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Oakland Unified School District (flu study)', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'New Venture Fund', categories: { social_justice: { fraction: 1.0 } } },
  { name: 'American Cancer Society', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Stichting European Climate Foundation', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'RF Catalytic Capital Inc (community project)', categories: { local_community: { fraction: 1.0 } } },
  { name: 'Instituto Clima e Sociedade', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'World Resources Institute', categories: { environmental: { fraction: 1.0 } } },
  { name: 'The Energy Foundation', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'Global Fishing Watch', categories: { environmental: { fraction: 1.0 } } },
  { name: 'The Tides Center', categories: { social_justice: { fraction: 1.0 } } },
  { name: 'People\'s Courage International Inc', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'University Of California Berkeley Foundation (science)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Upstream USA', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Think Of Us', categories: { social_justice: { fraction: 1.0 } } },
  { name: 'Sierra Club (climate change)', categories: { climate_change: { fraction: 1.0 } } },
  { name: 'Johns Hopkins University (science)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'Johns Hopkins University (education)', categories: { education: { fraction: 1.0 } } },
  { name: 'Bloomberg Philanthropies', categories: { 
      health_medicine: { fraction: 0.2 },
      global_health: { fraction: 0.2 },
      education: { fraction: 0.15 },
      climate_change: { fraction: 0.15 },
      local_community: { fraction: 0.07 },
      arts_culture: { fraction: 0.08 },
      institutions: { fraction: 0.05 },
      pandemics: { fraction: 0.03 },
      science_tech: { fraction: 0.02 },
      global_development: { fraction: 0.05 } } },
  { name: 'Yield Giving', categories: { 
      social_justice: { fraction: 0.4 },
      health_medicine: { fraction: 0.09 },
      education: { fraction: 0.11 },
      climate_change: { fraction: 0.04 },
      local_community: { fraction: 0.06 },
      arts_culture: { fraction: 0.04 },
      housing: { fraction: 0.05 },
      global_health: { fraction: 0.04 },
      human_rights: {fraction: 0.05 },
      environmental: { fraction: 0.05 },
      global_development: { fraction: 0.07 } } },
  { name: 'Machine Intelligence Research Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Centre for the Study of Existential Risk', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'AI Impacts', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Berkeley Existential Risk Initiative', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Leverage Research', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Center for Applied Rationality', categories: { ai_risk: { fraction: 1.0 } } },
  { name: '80,000 Hours', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Topos Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Median Group', categories: { education: { fraction: 1.0 } } },
  { name: 'Global Catastrophic Risk Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Lightcone Infrastructure', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Convergence Analysis', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Quantified Uncertainty Research Institute', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Centre for Enabling EA Learning & Research', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Long-Term Future Fund', categories: { 
    ai_risk: { fraction: 0.6 },
    pandemics: { fraction: 0.15 },
    meta_theory: { fraction: 0.15 },
    global_priorities: { fraction: 0.1 } } },
  { name: 'Modeling Cooperation', categories: { decision_making: { fraction: 1.0 } } },
  { name: 'Legal Priorities Project', categories: { institutions: { fraction: 1.0 } } },
  { name: 'New Science Research', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'AI Safety Support', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Centre for Long-Term Resilience', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Generation Pledge', categories: { global_priorities: { fraction: 1.0 } } },
  { name: 'Charter Cities Institute', categories: { institutions: { fraction: 1.0, multiplier: 5 } } },
  { name: 'Alliance to Feed the Earth in Disasters', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Effective Altruism Infrastructure Fund', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'AI Objectives Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Center on Long-Term Risk', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'AI Safety Camp', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Ought', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Redwood Research', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Alignment Research Center', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Association for Computing Machinery (ACM FAccT)', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'HitRecord AI Safety Project', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Center for AI Safety Action Fund', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Radicalxchange', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Center for AI Safety', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'MILA', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Saturn Data', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Signal Technology Foundation', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'Collective Intelligence Project', categories: { decision_making: { fraction: 1.0 } } },
  { name: 'Institute for Security and Technology', categories: { institutions: { fraction: 1.0 } } },
  { name: 'AI Policy Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Epoch AI', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Longview Philanthropy', categories: { 
    ai_risk: { fraction: 0.3 },
    pandemics: { fraction: 0.3 },
    nuclear: { fraction: 0.3 },
    global_priorities: { fraction: 0.1 } } },
  { name: 'Safe Artificial Intelligence Forum Institute', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Our World in Data', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Rootclaim', categories: { decision_making: { fraction: 1.0 } } },
  { name: 'Rethink Priorities', categories: { global_priorities: { fraction: 1.0 } } },
  { name: 'Haydn Belfield', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Zvi Mowshowitz', categories: { ai_risk: { fraction: 1.0 } } },
  { name: 'Erik Brynjolfsson', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Internet Archive', categories: { science_tech: { fraction: 1.0, costPerLife: 30000 } } },
  { name: 'India COVID-Crypto Relief Fund', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Gitcoin', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Methuselah Foundation', categories: { longevity: { fraction: 1.0 } } },
  { name: 'GiveWell', categories: { meta_theory: { fraction: 1.0 } } },
  { name: 'Aid For Ukraine', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Unchain Fund', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'Patient-Led Research Collaborative', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Dogecoin Foundation', categories: { science_tech: { fraction: 1.0 } } },
  { name: 'UNSW Kirby Institute', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'Long Covid Research Initiative', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'University of Maryland, School of Public Health', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'University of California San Diego (Airborne Institute)', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'Tornado Cash Devs Legal Fund', categories: { human_rights: { fraction: 1.0 } } },
  { name: 'Coin Center', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Khao Kheow Open Zoo', categories: { animal_welfare: { fraction: 1.0 } } },
  { name: 'Kanro', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'Balvi Philanthropic Fund', categories: { pandemics: { fraction: 1.0 } } },
  { name: 'EA Animal Welfare Fund', categories: { animal_welfare: { fraction: 1.0 } } },
  { name: 'Zuitzerland Project', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Newark Public Schools', categories: { education: { fraction: 1.0 } } },
  { name: 'Bay Area Public Schools', categories: { education: { fraction: 1.0 } } },
  { name: 'CDC Foundation (Ebola Response)', categories: { disaster_relief: { fraction: 1.0 } } },
  { name: 'San Francisco General Hospital Foundation', categories: { health_medicine: { fraction: 1.0 } } },
  { name: 'Chan Zuckerberg Initiative', categories: {
      health_medicine: { fraction: 0.40 },
      education: { fraction: 0.26 },
      science_tech: { fraction: 0.10 },
      housing: { fraction: 0.08 },
      human_rights: { fraction: 0.05 },
      global_health: { fraction: 0.05 },
      pandemics: { fraction: 0.03 },
      social_justice: { fraction: 0.03 }
    } },
  { name: 'Center for Tech and Civic Life', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Center for Election Innovation and Research', categories: { institutions: { fraction: 1.0 } } },
  { name: 'Multiple Jewish Community Organizations', categories: { local_community: { fraction: 1.0 } } },
];


export const donations = [
  
  /*
  // Bernard Arnault donations
  { date: '2023-01-15', donor: 'Bernard Arnault', charity: 'Against Malaria Foundation', amount: 150000000, source: 'https://en.wikipedia.org/wiki/Bernard_Arnault' },
  { date: '2023-04-18', donor: 'Bernard Arnault', charity: 'Climate Works', amount: 600000000, source: 'https://www.forbes.com/profile/bernard-arnault/' },
  { date: '2023-09-25', donor: 'Bernard Arnault', charity: 'Wikimedia Foundation', amount: 350000000, source: 'https://www.lvmh.com/houses/lvmh/bernard-arnault/' },
  */

  // Bill Gates donations
  // Gemini says "Through 2023, Bill Gates (and formerly Melinda French Gates) had personally contributed $59.5 billion to the Gates Foundation endowment.. the below is only 50.4 donated total 
  // Don't count donations to his foundation... try to explode them.
  // Buffett started donating to the Gates foundation in 2006.. so give Bill 100% credit for everything before that, 50% after
  { date: '1991-10-07', donor: 'Bill Gates', charity: 'University of Washington (research)', amount: 12000000, source: 'https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/' },
  { date: '1992-01-01', donor: 'Bill Gates', charity: 'Stanford University', amount: 6000000, source: 'https://www.cs.stanford.edu/about/gates-computer-science-building#:~:text=The%20Gates%20Building%20is%20named,month%20period' },
  { date: '1995-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 10000000, source: 'https://www.washington.edu/news/1999/10/28/uw-awarded-10-million-from-bill-and-melinda-gates-foundation/' },
  { date: '1996-09-01', donor: 'Bill Gates', charity: 'Harvard University', amount: 25000000, source: 'https://www.thecrimson.com/article/1996/10/30/gates-ballmer-donate-25-m-for' },
  { date: '1996-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 12000000, source: 'https://archive.seattletimes.com/archive/20030424/gatesgift24/gates-gives-70-million-for-genome-work-at-uw' },
  { date: '1997-07-23', donor: 'Bill Gates', charity: 'Gates Library Foundation', amount: 200000000, source: 'https://www.historylink.org/File/2907' },
  { date: '1998-12-01', donor: 'Bill Gates', charity: 'Seattle Public Libraries', amount: 20000000, source: 'https://www.historylink.org/File/2907#:~:text=gifts%20of%20%24133%20million%20for,program%20approved%20the%20previous%20month' },
  { date: '1998-12-01', donor: 'Bill Gates', charity: 'PATH', amount: 100000000, credit: 1, source: 'https://www.washingtonpost.com/archive/politics/1998/12/02/gates-giving-100-million-to-help-immunize-children-in-3rd-world/11648ec3-4e48-4dee-82c6-7c323f1b19cf/' },
  { date: '1999-04-14', donor: 'Bill Gates', charity: 'MIT', amount: 20000000, source: 'https://news.mit.edu/1999/gates1-0414#:~:text=April%2014%2C%201999' },
  { date: '1999-01-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 15800000000, source: 'https://www.gatesfoundation.org/-/media/gfo/1annual-reports/1999gates-foundation-annual-report.pdf#:~:text=Continuing%20their%20generous%20and%20aggressive,national%20and%20global%20challenges%2C%20it', notes: 'Initial endowment' },
  { date: '1999-01-01', donor: 'Bill Gates', charity: 'United Negro College Fund', amount: 1265000000, source: 'https://spearswms.com/impact-philanthropy/the-12-biggest-bill-gates-donations/'},
  { date: '1999-11-01', donor: 'Bill Gates', charity: 'GAVI Alliance (The Vaccine Fund)', amount: 750000000, credit: 1, source: 'https://www.gatesfoundation.org/ideas/media-center/press-releases/2001/06/global-alliance-for-vaccines-and-immunization' },
  { date: '2000-01-24', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 5000000000, source: 'https://www.gatesfoundation.org/ideas/media-center/press-releases/2000/01/statement-from-the-bill-melinda-gates-foundation#:~:text=SEATTLE%20,8%20billion' },
  { date: '2003-04-24', donor: 'Bill Gates', charity: 'University of Washington (research)', amount: 70000000, source: 'https://archive.seattletimes.com/archive/20030424/gatesgift24/gates-gives-70-million-for-genome-work-at-uw#:~:text=The%20Bill%20%26%20Melinda%20Gates,genome%20research' },
  { date: '2004-11-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 3300000000, source: 'https://money.cnn.com/2004/09/21/technology/gates_pay/index.htm?cnn#:~:text=This%20November%2C%20the%20company%20plans,for%20him%20and%20his%20wife' },
  { date: '2017-06-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 4680000000, source: 'https://www.wsj.com/articles/bill-gates-donates-billions-in-stock-to-foundation-1502822229', notes: 'From Microsoft stock' },
  { date: '2017-11-01', donor: 'Bill Gates', charity: 'Dementia Discovery Fund', amount: 50000000, source: 'https://en.wikipedia.org/wiki/Bill_Gates#Philanthropy'},
  { date: '2022-07-13', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 20000000000, source: 'https://www.reuters.com/world/bill-gates-donates-20-bln-his-foundation-2022-07-13/#:~:text=July%2013%20%28Reuters%29%20,to%20boost%20its%20annual%20distributions', notes: 'Cash/stock gift' },
  /*
  // Dustin Moskovitz donations
  { date: '2023-05-19', donor: 'Dustin Moskovitz', charity: 'Mercy For Animals', amount: 45000000, source: 'https://www.opensocietyfoundations.org/newsroom/dustin-moskovitz-donation' },
  { date: '2023-06-30', donor: 'Dustin Moskovitz', charity: 'GiveDirectly', amount: 180000000, source: 'https://www.goodventures.org/our-portfolio/grants/givedirectly-general-support-2023' },
  { date: '2023-11-30', donor: 'Dustin Moskovitz', charity: 'Evidence Action', amount: 120000000, source: 'https://www.openphilanthropy.org/grants/' },
  */
  // Elon Musk donations
  // Count donations from Musk Foundation as his, since it's basically a one man show
  { date: '2010-12-01', donor: 'Elon Musk', charity: 'Bayou La Batre Hurricane Response Center', amount: 250000, source: 'https://cleantechnica.com/2011/12/29/tesla-and-solarcity-install-solar-on-disaster-relief-center-in-alabama/' },
  { date: '2011-07-01', donor: 'Elon Musk', charity: 'Soma City, Fukushima (tech)', amount: 250000, source: 'https://www.japantimes.co.jp/news/2011/07/27/national/elon-musk-helps-build-solar-power-plant-in-tsunami-hit-area/' },
  { date: '2014-07-10', donor: 'Elon Musk', charity: 'Tesla Science Center at Wardenclyffe', amount: 1000000, source: 'https://www.engadget.com/2014-07-10-elon-musk-donates-1-million-to-tesla-museum.html' },
  { date: '2015-01-15', donor: 'Elon Musk', charity: 'Future of Life Institute', amount: 10000000, source: 'https://www.theguardian.com/technology/2015/jan/16/elon-musk-donates-10m-to-artificial-intelligence-research' },
  { date: '2016-01-01', donor: 'Elon Musk', charity: 'OpenAI', amount: 15000000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/' },
  { date: '2018-01-01', donor: 'Elon Musk', charity: 'Sierra Club', amount: 6000000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/' },
  { date: '2018-01-01', donor: 'Elon Musk', charity: 'ACLU', amount: 500000, source: 'https://www.nytimes.com/2022/04/28/style/elon-musk-amber-heard-johnny-depp-trial.html' },
  { date: '2018-01-01', donor: 'Elon Musk', charity: 'Art of Elysium', amount: 250000, source: 'https://www.latimes.com/entertainment-arts/story/2022-05-17/amber-heard-aclu-elon-musk-art-of-elysium-charity' },
  { date: '2018-10-01', donor: 'Elon Musk', charity: 'Flint Public Schools (Water Filtration)', amount: 480000, source: 'https://www.theverge.com/2018/10/5/17941938/elon-musk-flint-water-crisis-donation-school-filtration' },
  { date: '2019-10-29', donor: 'Elon Musk', charity: 'Arbor Day Foundation', amount: 1000000, source: 'https://globalnews.ca/news/6101569/elon-musk-teamtrees-planting/' },
  { date: '2020-03-24', donor: 'Elon Musk', charity: 'California Covid Response', amount: 30000000, source: 'https://www.reuters.com/article/business/healthcare-pharmaceuticals/tesla-ceo-says-bought-ventilators-in-china-for-us-idUSKBN21B19P', notes: 'Ventilator donation. Amount is an estimate from Claude 3.7' },
  { date: '2020-06-01', donor: 'Elon Musk', charity: 'Ad Astra School', amount: 60000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/' },
  { date: '2020-06-01', donor: 'Elon Musk', charity: 'Crossroads School', amount: 25000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/' },
  { date: '2020-06-01', donor: 'Elon Musk', charity: 'Windward School', amount: 25000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/' },
  { date: '2021-01-12', donor: 'Elon Musk', charity: 'Khan Academy', amount: 5000000, source: 'https://www.teslarati.com/tesla-elon-musk-donates-5-million-khan-academy/' },
  { date: '2021-02-08', donor: 'Elon Musk', charity: 'XPrize, Climate Change', amount: 100000000, source: 'https://www.npr.org/2021/02/08/965372754/elon-musk-funds-100-million-xprize-for-pursuit-of-new-carbon-removal-ideas' },
  { date: '2021-03-30', donor: 'Elon Musk', charity: 'Cameron County Schools, TX', amount: 20000000, source: 'https://www.kristv.com/news/texas-news/elon-musk-announces-30m-donation-to-rgv-county-asks-people-to-move-to-starbase' },
  { date: '2021-03-30', donor: 'Elon Musk', charity: 'City of Brownsville, TX', amount: 10000000, source: 'https://www.kristv.com/news/texas-news/elon-musk-announces-30m-donation-to-rgv-county-asks-people-to-move-to-starbase' },
  { date: '2021-09-18', donor: 'Elon Musk', charity: 'St. Jude Children\'s Hospital', amount: 50000000, source: 'https://www.space.com/spacex-inspiration4-elon-musk-st-jude-donation' },
  { date: '2022-02-26', donor: 'Elon Musk', charity: 'Starlink in Ukraine', amount: 20000000, source: 'https://en.wikipedia.org/wiki/Starlink_in_the_Russian-Ukrainian_War', notes: 'Musk claims he paid at least 100m' },
  { date: '2022-07-01', donor: 'Elon Musk', charity: 'University of Texas Population Initiative', amount: 10000000, source: 'https://www.insidehighered.com/news/2023/03/22/elon-musk-gave-10m-ut-austin-population-research' },
  { date: '2023-12-01', donor: 'Elon Musk', charity: 'Unknown', amount: 108200000, source: 'https://www.reuters.com/business/musk-donated-108-million-tesla-shares-unnamed-charities-filing-shows-2025-01-02' },
  { date: '2024-12-20', donor: 'Elon Musk', charity: 'The Foundation (Musk)', amount: 137e6, credit: 1, source: 'https://www.cheddar.com/media/big-business-this-week-rage-over-rate-cuts/' },

  // Jaan Tallinn donations
  { date: '2012-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 155000, source: 'https://web.archive.org/web/20120719220051/http://singularity.org:80/topdonors/' },
  { date: '2012-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 109000, source: 'https://web.archive.org/web/20120918094656/http://singularity.org:80/topdonors/' },
  { date: '2012-01-01', donor: 'Jaan Tallinn', charity: 'Centre for the Study of Existential Risk', amount: 200000, source: 'https://en.wikipedia.org/wiki/Jaan_Tallinn' },
  { date: '2013-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 100000, source: 'http://archive.today/2013.10.21-235551/http://intelligence.org/topdonors/' },
  { date: '2014-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 100000, source: 'http://archive.today/2014.10.10-021359/http://intelligence.org/topdonors/' },
  { date: '2015-10-15', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 5000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2016-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 80000, source: 'https://web.archive.org/web/20160115172820/https://intelligence.org/donortools/topdonors.php' },
  { date: '2017-01-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 2000000, source: 'http://existence.org/grants' },
  { date: '2017-01-01', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 60500, source: 'https://web.archive.org/web/20170204024838/https://intelligence.org/topdonors/' },
  { date: '2017-12-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 5000000, source: 'http://existence.org/2018/01/11/activity-update-december-2017.html' },
  { date: '2019-04-03', donor: 'Jaan Tallinn', charity: 'Leverage Research', amount: 100000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2019-12-04', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 50000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2019-12-04', donor: 'Jaan Tallinn', charity: 'Leverage Research', amount: 50000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2019-12-04', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 30000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2019-12-16', donor: 'Jaan Tallinn', charity: '80,000 Hours', amount: 70000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2019-12-24', donor: 'Jaan Tallinn', charity: 'Centre for the Study of Existential Risk', amount: 20000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-01-12', donor: 'Jaan Tallinn', charity: 'Topos Institute', amount: 150000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-01-16', donor: 'Jaan Tallinn', charity: 'Median Group', amount: 120000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-09', donor: 'Jaan Tallinn', charity: 'Global Catastrophic Risk Institute', amount: 90000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-11', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 20000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-11', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 280000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-12', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 110000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-12', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 40000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-12', donor: 'Jaan Tallinn', charity: '80,000 Hours', amount: 30000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-15', donor: 'Jaan Tallinn', charity: 'Leverage Research', amount: 80000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-06-29', donor: 'Jaan Tallinn', charity: 'Convergence Analysis', amount: 10000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-07-23', donor: 'Jaan Tallinn', charity: 'Quantified Uncertainty Research Institute', amount: 60000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-07-23', donor: 'Jaan Tallinn', charity: 'Future of Life Institute', amount: 30000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-08-31', donor: 'Jaan Tallinn', charity: 'Centre for the Study of Existential Risk', amount: 134000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-09-28', donor: 'Jaan Tallinn', charity: 'Centre for Enabling EA Learning & Research', amount: 50000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-10-01', donor: 'Jaan Tallinn', charity: 'Topos Institute', amount: 151000, source: 'https://survivalandflourishing.fund/sff-2020-h2-recommendations' },
  { date: '2020-12-04', donor: 'Jaan Tallinn', charity: 'Future of Life Institute', amount: 347000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-12-08', donor: 'Jaan Tallinn', charity: 'Modeling Cooperation', amount: 74000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-12-08', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 39000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-12-17', donor: 'Jaan Tallinn', charity: 'Machine Intelligence Research Institute', amount: 563000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-12-23', donor: 'Jaan Tallinn', charity: 'Rethink Priorities', amount: 57000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2020-12-23', donor: 'Jaan Tallinn', charity: 'Median Group', amount: 98000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-01-05', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 247000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-01-12', donor: 'Jaan Tallinn', charity: 'Global Catastrophic Risk Institute', amount: 209000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-01-12', donor: 'Jaan Tallinn', charity: 'Center for Human-Compatible AI', amount: 799000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-03-12', donor: 'Jaan Tallinn', charity: 'Center for Human-Compatible AI', amount: 20000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 1055000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Centre for Enabling EA Learning & Research', amount: 61000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Long-Term Future Fund', amount: 675000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Global Catastrophic Risk Institute', amount: 48000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Centre for the Study of Existential Risk', amount: 145000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Legal Priorities Project', amount: 265000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 37000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'New Science Research', amount: 147000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'AI Safety Support', amount: 200000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Convergence Analysis', amount: 103000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Convergence Analysis', amount: 13000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Centre for Long-Term Resilience', amount: 1013000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 478000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Generation Pledge', amount: 291000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-04-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 333000, source: 'https://survivalandflourishing.fund/sff-2021-h1-recommendations' },
  { date: '2021-07-16', donor: 'Jaan Tallinn', charity: 'Charter Cities Institute', amount: 137000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-07-16', donor: 'Jaan Tallinn', charity: 'Alliance to Feed the Earth in Disasters', amount: 175000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-07-23', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 221000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-07-28', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 1207000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Convergence Analysis', amount: 34000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Effective Altruism Infrastructure Fund', amount: 699000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Long-Term Future Fund', amount: 1417000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'AI Objectives Institute', amount: 485000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Berkeley Existential Risk Initiative', amount: 248000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Modeling Cooperation', amount: 83000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Topos Institute', amount: 450000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'New Science Research', amount: 500000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Center on Long-Term Risk', amount: 1218000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'AI Safety Camp', amount: 130000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Ought', amount: 542000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-10-01', donor: 'Jaan Tallinn', charity: 'Centre for Long-Term Resilience', amount: 885000, source: 'https://survivalandflourishing.fund/sff-2021-h2-recommendations' },
  { date: '2021-12-16', donor: 'Jaan Tallinn', charity: 'Alliance to Feed the Earth in Disasters', amount: 979000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2021-12-30', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 380000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-06-16', donor: 'Jaan Tallinn', charity: 'Redwood Research', amount: 1274000, source: 'https://survivalandflourishing.fund/sff-2022-h1-recommendations' },
  { date: '2022-06-23', donor: 'Jaan Tallinn', charity: 'Charter Cities Institute', amount: 261000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-08-18', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 400000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-12-06', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 546000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-12-08', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 450000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-12-08', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 600000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-12-15', donor: 'Jaan Tallinn', charity: 'Centre for Enabling EA Learning & Research', amount: 224000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2022-12-20', donor: 'Jaan Tallinn', charity: 'Alignment Research Center', amount: 2179000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2023-02-16', donor: 'Jaan Tallinn', charity: 'Alliance to Feed the Earth in Disasters', amount: 427000, source: 'https://donations.vipulnaik.com/donor.php?donor=Jaan+Tallinn' },
  { date: '2023-04-01', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 1733000, source: 'https://survivalandflourishing.fund/sff-2023-h1-recommendations' },
  { date: '2023-04-01', donor: 'Jaan Tallinn', charity: 'Alliance to Feed the Earth in Disasters', amount: 1159000, source: 'https://survivalandflourishing.fund/sff-2023-h1-recommendations' },
  { date: '2023-04-01', donor: 'Jaan Tallinn', charity: 'Charter Cities Institute', amount: 315000, source: 'https://survivalandflourishing.fund/sff-2023-h1-recommendations' },
  { date: '2023-04-01', donor: 'Jaan Tallinn', charity: 'Alignment Research Center', amount: 1846000, source: 'https://survivalandflourishing.fund/sff-2023-h1-recommendations' },
  { date: '2023-10-01', donor: 'Jaan Tallinn', charity: 'AI Impacts', amount: 179000, source: 'https://survivalandflourishing.fund/sff-2023-h2-recommendations' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Association for Computing Machinery (ACM FAccT)', amount: 75000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: '80,000 Hours', amount: 200000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Topos Institute', amount: 100000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'HitRecord AI Safety Project', amount: 500000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for AI Safety Action Fund', amount: 1000000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Radicalxchange', amount: 500000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for AI Safety', amount: 1000000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'MILA', amount: 4000000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Saturn Data', amount: 500000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Signal Technology Foundation', amount: 1000000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Lightcone Infrastructure', amount: 1720000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 200000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Haydn Belfield', amount: 16000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Collective Intelligence Project', amount: 500000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Topos Institute', amount: 300000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Zvi Mowshowitz', amount: 200000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Institute for Security and Technology', amount: 400000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'HitRecord AI Safety Project', amount: 700000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'AI Policy Institute', amount: 300000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 100000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for AI Safety', amount: 300000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Epoch AI', amount: 600000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Longview Philanthropy', amount: 700000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Safe Artificial Intelligence Forum Institute', amount: 500000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Our World in Data', amount: 300000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Rootclaim', amount: 400000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Erik Brynjolfsson', amount: 400000, source: 'https://survivalandflourishing.fund/initiative-committee' },
  { date: '2024-01-01', donor: 'Jaan Tallinn', charity: 'Center for Applied Rationality', amount: 100000, source: 'https://survivalandflourishing.fund/initiative-committee' },
 /* 
  // Jack Dorsey donations
  { date: '2023-01-05', donor: 'Jack Dorsey', charity: 'New Incentives', amount: 75000000, source: 'https://twitter.com/jack' },
  { date: '2023-12-18', donor: 'Jack Dorsey', charity: 'Wikimedia Foundation', amount: 25000000, source: 'https://startsmall.llc/' },
  */
  // Jeff Bezos donations
  { date: '2011-08-17', donor: 'Jeff Bezos', charity: 'Museum of History & Industry (Seattle)', amount: 10000000, source: 'https://www.seattlepi.com/local/article/Jeff-Bezos-gives-MOHAI-10-million-for-2077208.php' },
  { date: '2011-12-13', donor: 'Jeff Bezos', charity: 'Princeton University (science)', amount: 15000000, source: 'https://www.princeton.edu/news/2011/12/13/jeff-and-mackenzie-bezos-donate-15-million-create-center-princeton-neuroscience' },
  { date: '2012-07-28', donor: 'Jeff Bezos', charity: 'Washington United for Marriage (Referendum 74 campaign)', amount: 2500000, source: 'https://www.reuters.com/article/lifestyle/amazons-jeff-bezos-wife-make-25-million-donation-for-gay-marriage-idUSBRE86R014/' },
  { date: '2017-05-23', donor: 'Jeff Bezos', charity: 'Reporters Committee for Freedom of the Press', amount: 1000000, source: 'https://www.rcfp.org/awards2017/' },
  { date: '2018-01-12', donor: 'Jeff Bezos', charity: 'TheDream.US', amount: 33000000, source: 'https://www.reuters.com/article/world/us/jeff-bezos-contributes-33-million-to-dreamers-scholarship-program-idUSKBN1F124Z/' },
  { date: '2018-09-05', donor: 'Jeff Bezos', charity: 'With Honor Fund', amount: 10000000, source: 'https://www.geekwire.com/2018/amazon-ceo-jeff-bezos-donates-10m-honors-effort-elect-veterans-congress/' },
  // Also only a pledge.. only half disbursed??
  { date: '2018-09-13', donor: 'Jeff Bezos', charity: 'Bezos Day One Fund', amount: 2000000000, source: 'https://www.geekwire.com/2018/jeff-bezos-unveils-2b-day-one-fund-focusing-homeless-families-preschool-education/' },
  // This is only a pledge.. OpenAI o3 says only 2.3 billion has been disbursed
  { date: '2020-02-17', donor: 'Jeff Bezos', charity: 'Bezos Earth Fund', amount: 10000000000, source: 'https://www.reuters.com/article/world/amazons-bezos-pledges-10-billion-to-climate-change-fight-idUSKBN20B1XJ/' },
  { date: '2020-04-02', donor: 'Jeff Bezos', charity: 'Feeding America (COVID-19 Response Fund)', amount: 100000000, source: 'https://www.feedingamerica.org/about-us/press-room/jeff-bezos-support-food-banks' },
  { date: '2020-06-24', donor: 'Jeff Bezos', charity: 'All In Washington (COVID-19 relief effort)', amount: 25000000, source: 'https://www.geekwire.com/2020/jeff-bezos-pledges-25m-wa-help-group-provide-covid-19-relief-across-state/' },
  { date: '2020-12-21', donor: 'Jeff Bezos', charity: 'All In Washington (COVID-19 relief effort)', amount: 25000000, source: 'https://www.kentreporter.com/business/bezos-pledges-an-additional-25-million-to-support-covid-19-relief-efforts/' },
  { date: '2021-07-14', donor: 'Jeff Bezos', charity: 'Smithsonian Institution', amount: 200000000, source: 'https://www.reuters.com/world/us/amazon-chair-jeff-bezos-donating-200-million-smithsonian-2021-07-14/' },
  { date: '2021-07-20', donor: 'Jeff Bezos', charity: 'Van Jones (Bezos Courage & Civility Award)', amount: 100000000, source: 'https://www.axios.com/2021/07/20/bezos-unveils-million-dollar-awards-van-jones-jose-andres' },
  { date: '2021-07-20', donor: 'Jeff Bezos', charity: 'José Andrés (Bezos Courage & Civility Award)', amount: 100000000, source: 'https://www.axios.com/2021/07/20/bezos-unveils-million-dollar-awards-van-jones-jose-andres' },
  { date: '2021-11-22', donor: 'Jeff Bezos', charity: 'Obama Foundation', amount: 100000000, source: 'https://www.reuters.com/world/us/bezos-donates-100-mln-obama-foundation-honor-congressman-john-lewis-2021-11-22/' },
  { date: '2022-11-12', donor: 'Jeff Bezos', charity: 'Dolly Parton (Bezos Courage & Civility Award)', amount: 100000000, source: 'https://www.reuters.com/lifestyle/dolly-parton-receives-100-million-award-jeff-bezos-2022-11-13/' },
  { date: '2024-03-15', donor: 'Jeff Bezos', charity: 'Eva Longoria (Bezos Courage & Civility Award)', amount: 50000000, source: 'https://people.com/eva-longoria-receives-usd50m-award-from-jeff-bezos-lauren-sanchez-to-spend-on-philanthropy-8609792' },
  { date: '2024-03-15', donor: 'Jeff Bezos', charity: 'Bill McRaven (Bezos Courage & Civility Award)', amount: 50000000, source: 'https://people.com/eva-longoria-receives-usd50m-award-from-jeff-bezos-lauren-sanchez-to-spend-on-philanthropy-8609792' },
  /*
  // Jensen Huang donations
  { date: '2023-04-30', donor: 'Jensen Huang', charity: 'Anthropic', amount: 150000000, source: 'https://www.nvidia.com/en-us/about-nvidia/jensen-huang/' },
  { date: '2023-09-15', donor: 'Jensen Huang', charity: 'Center for Human-Compatible AI', amount: 100000000, source: 'https://en.wikipedia.org/wiki/Jensen_Huang' },
  { date: '2023-12-05', donor: 'Jensen Huang', charity: 'Global Priorities Institute', amount: 75000000, source: 'https://www.forbes.com/profile/jensen-huang/' },
  
  // Jack Ma donations
  { date: '2023-02-28', donor: 'Jack Ma', charity: 'Climate Works', amount: 75000000, source: 'https://www.arnoldfoundation.org/' },
  { date: '2023-06-19', donor: 'Jack Ma', charity: 'Development Media International', amount: 65000000, source: 'https://en.wikipedia.org/wiki/John_Arnold' },
  
  // Larry Ellison donations
  // He backed out of his 115m pledge to Harvard
  { date: '1995-09-13', donor: 'Larry Ellison', charity: 'University of California, Davis (Medicine)', amount: 5000000, source: 'https://www.ucdavis.edu/news/private-gifts-uc-davis-hit-all-time-high' },
  { date: '2006-06-27', donor: 'Larry Ellison', charity: 'Ellison Medical Foundation', amount: 100000000, source: 'https://www.thecrimson.com/article/2006/6/28/ellison-pulls-plug-on-115-million/' },
  { date: '2007-08-09', donor: 'Larry Ellison', charity: 'Sderot Community Center (Israel)', amount: 500000, source: 'https://www.jta.org/2007/08/09/default/oracle-ceo-donating-to-sderot' },
  { date: '2014-02-08', donor: 'Larry Ellison', charity: 'Global Polio Eradication Initiative', amount: 100000000, source: 'https://polioeradication.org/news/lawrence-ellison-foundation-joins-global-effort-to-end-polio-with-100-million-donation/' },
  { date: '2014-11-06', donor: 'Larry Ellison', charity: 'Friends of the Israel Defense Forces', amount: 10000000, source: 'https://www.timesofisrael.com/hollywood-gala-raises-a-record-33-million-for-idf/' },
  { date: '2016-05-11', donor: 'Larry Ellison', charity: 'University of Southern California (Medicine)', amount: 200000000, source: 'https://news.usc.edu/100495/200-million-gift-launches-lawrence-j-ellison-institute-for-transformative-medicine-of-usc/' },
  { date: '2017-11-02', donor: 'Larry Ellison', charity: 'Friends of the Israel Defense Forces', amount: 16600000, source: 'https://www.timesofisrael.com/record-53-8-million-raised-for-idf-soldiers-at-beverly-hills-gala/' },
  { date: '2024-12-03', donor: 'Larry Ellison', charity: 'University of Oxford (Science)', amount: 165000000, source: 'https://www.ox.ac.uk/news/2024-12-03-university-oxford-and-ellison-institute-technology-join-forces-transformative', notes: 'only a pledge' },
*/
  
  // Larry Page donations
  { date: '2006-11-01', donor: 'Larry Page', charity: 'Californians for Clean Alternative Energy', amount: 1000000, source: 'https://www.influencewatch.org/person/larry-page/' },
  { date: '2008-11-01', donor: 'Larry Page', charity: 'No on Proposition 8 Campaign', amount: 400000, source: 'https://www.influencewatch.org/person/larry-page/' },
  { date: '2008-12-31', donor: 'Larry Page', charity: 'President Barack Obama Inaugural Committee', amount: 25000, source: 'https://www.influencewatch.org/person/larry-page/' },
  { date: '2014-11-10', donor: 'Larry Page', charity: 'Ebola Relief Efforts', amount: 15000000, source: 'https://philanthropynewsdigest.org/news/google-larry-page-pledge-30-million-for-ebola-relief-efforts' },
  { date: '2015-05-31', donor: 'Larry Page', charity: 'Shoo the Flu', amount: 88000, source: 'https://techcrunch.com/2019/12/11/larry-pages-secret-war-on-the-flu/' },
  { date: '2017-05-31', donor: 'Larry Page', charity: 'Shoo the Flu', amount: 4100000, source: 'https://techcrunch.com/2019/12/11/larry-pages-secret-war-on-the-flu/' },
  { date: '2017-12-31', donor: 'Larry Page', charity: 'Oakland Unified School District (Flu Shots)', amount: 800000, source: 'https://nonprofitquarterly.org/larry-page-makes-a-good-case-for-the-regulation-of-donor-advised-funds/' },
  { date: '2017-12-31', donor: 'Larry Page', charity: 'Regents of the University of California (vaccine delivery study)', amount: 303000, source: 'https://observer.com/2023/05/larry-page-foundation-donor-advised-funds-6-7-billion/' },
  { date: '2017-12-31', donor: 'Larry Page', charity: 'Oakland Unified School District (flu study)', amount: 162000, source: 'https://observer.com/2023/05/larry-page-foundation-donor-advised-funds-6-7-billion/' },
  { date: '2017-12-31', donor: 'Larry Page', charity: 'New Venture Fund', amount: 100000, source: 'https://nonprofitquarterly.org/larry-page-makes-a-good-case-for-the-regulation-of-donor-advised-funds/' },
  { date: '2017-12-31', donor: 'Larry Page', charity: 'American Cancer Society', amount: 1000, source: 'https://nonprofitquarterly.org/larry-page-makes-a-good-case-for-the-regulation-of-donor-advised-funds/' },
  { date: '2021-12-31', donor: 'Larry Page', charity: 'New Venture Fund', amount: 200000, source: 'https://www.insidephilanthropy.com/home/2023/5/10/larry-pages-foundation-doubled-in-size-to-hit-67-billion-in-assets-98-of-giving-goes-to-dafs' },
  { date: '2021-12-31', donor: 'Larry Page', charity: 'Shoo the Flu', amount: 38894, source: 'https://observer.com/2023/05/larry-page-foundation-donor-advised-funds-6-7-billion/' },
  { date: '2022-12-31', donor: 'Larry Page', charity: 'American Cancer Society', amount: 1000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Stichting European Climate Foundation', amount: 20000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'RF Catalytic Capital Inc (community project)', amount: 15000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Instituto Clima e Sociedade', amount: 10000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'World Resources Institute', amount: 4750000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'The Energy Foundation', amount: 4000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Stichting European Climate Foundation', amount: 3000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Global Fishing Watch', amount: 3000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'The Tides Center', amount: 2000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'People\'s Courage International Inc', amount: 2000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'New Venture Fund', amount: 1000000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'University Of California Berkeley Foundation (science)', amount: 750000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Upstream USA', amount: 500000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },
  { date: '2023-12-31', donor: 'Larry Page', charity: 'Think Of Us', amount: 500000, source: 'https://www.grantmakers.io/profiles/v0/201922957-carl-victor-page-memorial-foundation/' },

  // Mackenzie Scott donations
  { date: '2024-11-31', donor: 'Mackenzie Scott', charity: 'Yield Giving', amount: 19.25e9, source: 'https://gist.github.com/elliotolds/4eefa459f946fda43b0dc53c99ab532a#file-mackenzie_scott_donations-md' },
  
  // Mark Zuckerberg donations
  { date: '2010-09-24', donor: 'Mark Zuckerberg', charity: 'Newark Public Schools', amount: 100000000, source: 'http://www.reuters.com/article/us-facebook-donation-idUSTRE68N54E20100924' },
  { date: '2014-05-30', donor: 'Mark Zuckerberg', charity: 'Bay Area Public Schools', amount: 120000000, source: 'https://www.sfgate.com/education/article/mark-zuckerberg-wife-donate-120-million-to-bay-5515342.php' },
  { date: '2014-10-14', donor: 'Mark Zuckerberg', charity: 'CDC Foundation (Ebola Response)', amount: 25000000, source: 'https://www.cdcfoundation.org/pr/cdc-foundation-receives-25-million-donation-mark-zuckerberg-and-priscilla-chan-ebola-response' },
  { date: '2015-02-06', donor: 'Mark Zuckerberg', charity: 'San Francisco General Hospital Foundation', amount: 75000000, source: 'https://www.latimes.com/local/lanow/la-me-ln-zuckerberg-donation-20150206-story.html' },
  // The 45 billion below is just a pledge, so don't count it
  //{ date: '2015-12-01', donor: 'Mark Zuckerberg', charity: 'Chan Zuckerberg Initiative', amount: 45e9, source: 'https://www.theguardian.com/technology/2015/dec/01/mark-zuckerberg-and-priscilla-chan-announce-new-baby-and-massive-charity-initiative' },
  { date: '2016-09-01', donor: 'Mark Zuckerberg', charity: 'Chan Zuckerberg Initiative', amount: 85000000, source: 'https://philanthropynewsdigest.org/news/zuckerberg-chan-sell-facebook-shares-worth-another-95-million' },
  { date: '2017-11-07', donor: 'Mark Zuckerberg', charity: 'Chan Zuckerberg Initiative', amount: 1856575000, source: 'https://www.sfchronicle.com/business/networth/article/Charitable-giving-topped-400-billion-for-first-12988732.php' },
  { date: '2020-09-01', donor: 'Mark Zuckerberg', charity: 'Center for Tech and Civic Life', amount: 250000000, source: 'https://www.businessinsider.com/mark-zuckerberg-priscilla-chan-donate-300-million-2020-election-2020-9' },
  { date: '2020-09-01', donor: 'Mark Zuckerberg', charity: 'Center for Election Innovation and Research', amount: 50000000, source: 'https://www.businessinsider.com/mark-zuckerberg-priscilla-chan-donate-300-million-2020-election-2020-9' },
  { date: '2020-10-13', donor: 'Mark Zuckerberg', charity: 'Center for Tech and Civic Life', amount: 100000000, source: 'https://apnews.com/article/virus-outbreak-election-2020-technology-local-elections-elections-c2dcfde7fc750b7dd64243b0cf7fbb69' },
  { date: '2020-10-01', donor: 'Mark Zuckerberg', charity: 'Center for Election Innovation and Research', amount: 19500000, source: 'https://electioninnovation.org/press/chan-zuckerberg-increase-2020-election-support/' },
  { date: '2021-09-20', donor: 'Mark Zuckerberg', charity: 'Multiple Jewish Community Organizations', amount: 1300000, source: 'https://ejewishphilanthropy.com/your-daily-phil-mark-zuckerberg-and-priscilla-chan-donate-1-3-million-to-jewish-groups/' },
  // This seems to be from the CZI
  //{ date: '2021-12-07', donor: 'Mark Zuckerberg', charity: 'Harvard University (tech research)', amount: 500000000, source: 'https://www.harvardmagazine.com/2021/12/chan-zuckerberg-natural-and-artificial-intelligence' },
  { date: '2024-12-31', donor: 'Mark Zuckerberg', charity: 'Chan Zuckerberg Initiative', amount: 1110000000, source: 'https://www.philanthropy.com/package/newsrelease-phil50-2024donors-030425' },
  { date: '2025-04-24', donor: 'Mark Zuckerberg', charity: 'Chan Zuckerberg Initiative', amount: 3.915e9, source: 'https://gist.github.com/elliotolds/9e6773b7b357f8ff30d3396b431c258e#file-mark_zuckerberg_donations-md' },
  
// 

  // Michael Bloomberg donations
  { date: '2010-01-01', donor: 'Michael Bloomberg', charity: 'Sierra Club (climate change)', amount: 50000000, source: 'https://observer.com/2023/09/michael-bloomberg-donates-500m-eradicate-coal-plants/' },
  { date: '2016-01-01', donor: 'Michael Bloomberg', charity: 'Johns Hopkins University (science)', amount: 50000000, source: 'https://www.bbhub.io/dotorg/sites/2/2017/05/Bloomberg-Philanthropies-Annual-Report.pdf' },
  { date: '2018-11-18', donor: 'Michael Bloomberg', charity: 'Johns Hopkins University (education)', amount: 1800000000, source: 'https://www.prnewswire.com/news-releases/michael-bloomberg-makes-largest-ever-contribution-to-any-education-institution-in-the-united-states-300752633.html' },
  { date: '2024-12-31', donor: 'Michael Bloomberg', charity: 'Bloomberg Philanthropies', amount: 21e9, source: 'https://gist.github.com/elliotolds/5eb6c5c59c7d0e3dd5b37ef62e4003cd#file-michael_bloomberg_donations-md' },
/*
  // Sergey Brin donations
  { date: '2023-03-17', donor: 'Sergey Brin', charity: 'GiveDirectly', amount: 180000000, source: 'https://en.wikipedia.org/wiki/Sergey_Brin' },
  { date: '2023-06-14', donor: 'Sergey Brin', charity: 'Anthropic', amount: 275000000, source: 'https://research.google/people/sergey-brin/' },
  { date: '2023-09-20', donor: 'Sergey Brin', charity: 'New Incentives', amount: 120000000, source: 'https://www.forbes.com/profile/sergey-brin/' },
  { date: '2023-11-03', donor: 'Sergey Brin', charity: 'Center for Human-Compatible AI', amount: 225000000, source: 'https://www.alphabet.com/en-ww/leadership' },
  
  // Steve Ballmer donations
  { date: '2023-01-25', donor: 'Steve Ballmer', charity: 'GiveWell Maximum Impact Fund', amount: 450000000, source: 'https://en.wikipedia.org/wiki/Steve_Ballmer' },
  { date: '2023-07-12', donor: 'Steve Ballmer', charity: 'Malaria Consortium', amount: 300000000, source: 'https://www.ballmerfoundation.org/' },
  { date: '2023-11-18', donor: 'Steve Ballmer', charity: 'Climate Works', amount: 250000000, source: 'https://www.forbes.com/profile/steve-ballmer/' },
 */ 
  // Vitalik Buterin donations
  { date: '2017-12-14', donor: 'Vitalik Buterin', charity: 'SENS Research Foundation', amount: 2400000, source: 'https://cointelegraph.com/news/vitalik-buterin-donates-24-million-in-ether-to-anti-aging-research' },
  { date: '2017-12-31', donor: 'Vitalik Buterin', charity: 'Machine Intelligence Research Institute', amount: 763970, source: 'https://coinspeaker.com/vitalik-buterin-eth-holdings/' },
  { date: '2018-02-12', donor: 'Vitalik Buterin', charity: 'Internet Archive', amount: 93469, source: 'https://coinexplorers.com/insights/the-internet-archive-sees-large-donations-from-vitalik-buterin-7ylg6i' },
  { date: '2018-03-27', donor: 'Vitalik Buterin', charity: 'GiveDirectly', amount: 1000000, source: 'https://cointelegraph.com/news/omisego-and-vitalik-buterin-donate-1-million-in-crypto-to-charity-for-ugandan-refugees' },
  { date: '2018-12-31', donor: 'Vitalik Buterin', charity: 'SENS Research Foundation', amount: 350000, source: 'https://sens.org/vitaliks-350000-donation/' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'India COVID-Crypto Relief Fund', amount: 4e6, source: 'https://www.indiatoday.in/technology/news/story/vitalik-donates-1-billion-worth-shiba-inu-and-ethereum-to-india-covid-19-relief-fund-1802009-2021-05-13' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'Gitcoin', amount: 5e6, source: 'https://www.gitcoin.co/blog/announcement-gitcoin-community-receives-generous-gift-from-vitalik-buterin' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'Methuselah Foundation', amount: 4.3e6, source: 'https://www.fightaging.org/archives/2021/05/vitalik-buterin-donates-more-than-2-million-to-the-methuselah-foundation/' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'GiveWell', amount: 50e6, source: 'https://cryptonews.com.au/news/vitalik-buterin-donates-60-million-to-charity-after-dumping-shiba-inu-90686/' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'Machine Intelligence Research Institute', amount: 4378159, source: 'https://intelligence.org/2021/05/13/two-major-donations/' },
  { date: '2021-05-12', donor: 'Vitalik Buterin', charity: 'Charter Cities Institute', amount: 2080000, source: 'https://www.newsbtc.com/news/ethereum/vitalik-buterin-dumps-shib-price-tanks/' },
  { date: '2022-04-04', donor: 'Vitalik Buterin', charity: 'Aid For Ukraine', amount: 2500000, source: 'https://cointelegraph.com/news/vitalik-buterin-quietly-donates-5m-eth-to-aid-ukraine-as-total-tracked-crypto-donations-reach-133m' },
  { date: '2022-04-04', donor: 'Vitalik Buterin', charity: 'Unchain Fund', amount: 2500000, source: 'https://cointelegraph.com/news/vitalik-buterin-quietly-donates-5m-eth-to-aid-ukraine-as-total-tracked-crypto-donations-reach-133m' },
  { date: '2022-04-22', donor: 'Vitalik Buterin', charity: 'Patient-Led Research Collaborative', amount: 3000000, source: 'https://patientresearchcovid19.com/balvi-press-release/' },
  { date: '2022-05-12', donor: 'Vitalik Buterin', charity: 'Dogecoin Foundation', amount: 1000000, source: 'https://www.forbesindia.com/article/crypto-made-easy/vitalik-buterin-donates-1-billion-in-eth-to-dogecoin-foundation/76361/1' },
  { date: '2022-05-13', donor: 'Vitalik Buterin', charity: 'UNSW Kirby Institute', amount: 4000000, source: 'https://www.kirby.unsw.edu.au/news/major-crypto-gift-fund-kirby-institute-open-source-artificial-intelligence-tool-prevent' },
  { date: '2022-06-13', donor: 'Vitalik Buterin', charity: 'Balvi Philanthropic Fund', amount: 10e6, source: 'https://observer.com/2023/06/ethereum-vitalik-buterin-donation-crypto-covid/' },
  { date: '2022-09-07', donor: 'Vitalik Buterin', charity: 'Long Covid Research Initiative', amount: 15000000, source: 'https://techcrunch.com/2022/09/07/new-uk-nonprofit-startup-battles-long-covid-with-the-backing-of-ethereum-co-creator-vitalik-buterin/' },
  { date: '2022-11-01', donor: 'Vitalik Buterin', charity: 'University of Maryland, School of Public Health', amount: 9400000, source: 'https://today.umd.edu/record-breaking-9-4m-crypto-gift-to-fund-study-of-air-disinfection-to-prevent-future-pademics' },
  { date: '2023-03-07', donor: 'Vitalik Buterin', charity: 'University of California San Diego (Airborne Institute)', amount: 15000000, source: 'https://today.ucsd.edu/story/uc-san-diego-receives-15m-cryptocurrency-donation-largest-for-research-on-airborne-pathogens' },
  { date: '2023-11-01', donor: 'Vitalik Buterin', charity: 'Long Covid Research Initiative', amount: 15000000, source: 'https://www.biospace.com/article/releases/polybio-research-foundation-receives-15m-for-extended-long-covid-research-and-clinical-trials/' },
  { date: '2023-12-31', donor: 'Vitalik Buterin', charity: 'Tornado Cash Devs Legal Fund', amount: 170000, source: 'https://cointelegraph.com/news/vitalik-buterin-donates-tornado-cash-developers-alexey-pertsev-roman-storm' },
  { date: '2024-08-14', donor: 'Vitalik Buterin', charity: 'EA Animal Welfare Fund', amount: 532398, source: 'https://cointelegraph.com/news/vitalik-buterin-donates-eth-animal-charity' },
  { date: '2024-10-05', donor: 'Vitalik Buterin', charity: 'Tornado Cash Devs Legal Fund', amount: 240000, source: 'https://cointelegraph.com/news/vitalik-buterin-donates-100-eth-roman-storm-defense-fund' },
  { date: '2024-11-26', donor: 'Vitalik Buterin', charity: 'Coin Center', amount: 1000000, source: 'https://www.coindesk.com/policy/2024/11/27/vitalik-buterin-donated-1-m-in-ether-to-coin-center-hours-after-tornado-cash-victory/' },
  { date: '2024-12-15', donor: 'Vitalik Buterin', charity: 'Khao Kheow Open Zoo', amount: 150000, source: 'https://beincrypto.com/vitalik-buterin-meme-coins-charity/' },
  { date: '2025-01-06', donor: 'Vitalik Buterin', charity: 'Kanro', amount: 984000, source: 'https://beincrypto.com/vitalik-buterin-meme-coins-charity/' },
  { date: '2025-04-01', donor: 'Vitalik Buterin', charity: 'Zuitzerland Project', amount: 500000, source: 'https://thecryptobasic.com/2025/04/01/ethereum-founder-donates-274-eth-to-swiss-project-zuitzerland/' },
  
  
  // Warren Buffett donations
  { date: '2006-09-19', donor: 'Warren Buffett', charity: 'IAEA Nuclear Fuel Bank', amount: 50e6, source: 'https://www.nti.org/news/nti-commits-50-million-iaea-nuclear-fuel-bank/' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Bill & Melinda Gates Foundation', amount: 43e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Susan Thompson Buffett Foundation', amount: 5.8e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Howard G. Buffett Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Sherwood Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'NoVo Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'GLIDE Foundation', amount: 53e6, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
];