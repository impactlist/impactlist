// Charity focus areas with lives saved per million dollars
export const effectivenessCategories = {
  'ai_risk': { name: 'AI Existential Risk', effectiveness: 500 },          // 500 lives saved per $1M
  'pandemics': { name: 'Pandemics', effectiveness: 450 },                  // 450 lives saved per $1M
  'nuclear': { name: 'Nuclear', effectiveness: 400 },                      // 400 lives saved per $1M
  'global_health': { name: 'Global Health', effectiveness: 350 },          // 350 lives saved per $1M
  'global_development': { name: 'Global Development/Poverty', effectiveness: 300 }, // 300 lives saved per $1M
  'animal_welfare': { name: 'Animal Welfare', effectiveness: 250 },        // 250 lives saved per $1M
  'global_priorities': { name: 'Global Priorities Research', effectiveness: 220 }, // 220 lives saved per $1M
  'meta_theory': { name: 'Meta and Theory', effectiveness: 200 },          // 200 lives saved per $1M
  'decision_making': { name: 'Improving Decision Making', effectiveness: 180 }, // 180 lives saved per $1M
  'climate_change': { name: 'Climate Change', effectiveness: 160 },        // 160 lives saved per $1M
  'health_medicine': { name: 'Health/Medicine (Developed)', effectiveness: 140 }, // 140 lives saved per $1M
  'education': { name: 'Education', effectiveness: 120 },                  // 120 lives saved per $1M
  'political': { name: 'Political Institutions', effectiveness: 100 },     // 100 lives saved per $1M
  'science_tech': { name: 'Science and Tech', effectiveness: 90 },         // 90 lives saved per $1M
  'local_community': { name: 'Local Community', effectiveness: 80 },       // 80 lives saved per $1M
  'arts_culture': { name: 'Arts, Culture, Heritage', effectiveness: 70 },  // 70 lives saved per $1M
  'religious': { name: 'Religious', effectiveness: 60 },                   // 60 lives saved per $1M
  'environmental': { name: 'General Environmental', effectiveness: 50 },   // 50 lives saved per $1M
  'disaster_relief': { name: 'Disaster Relief', effectiveness: 45 },       // 45 lives saved per $1M
  'human_rights': { name: 'Human Rights and Justice', effectiveness: 40 }, // 40 lives saved per $1M
  'housing': { name: 'Homelessness and Housing', effectiveness: 35 },      // 35 lives saved per $1M
  'longevity': { name: 'Longevity', effectiveness: 30 },                  // 30 lives saved per $1M
  'other': { name: 'Other', effectiveness: 20 }                           // 20 lives saved per $1M
};

// Charity data with their focus area categories
export const charities = [
  { name: 'Against Malaria Foundation', category: 'global_health' },
  { name: 'GiveDirectly', category: 'global_development' },
  { name: 'Malaria Consortium', category: 'global_health' },
  { name: 'GiveWell Maximum Impact Fund', category: 'meta_theory' },
  { name: 'Evidence Action', category: 'global_health' },
  { name: 'Helen Keller International', category: 'global_health' },
  { name: 'SCI Foundation', category: 'health_medicine' },
  { name: 'The END Fund', category: 'disaster_relief' },
  { name: 'New Incentives', category: 'global_health' },
  { name: 'Development Media International', category: 'education' },
  { name: 'Anthropic', category: 'ai_risk' },
  { name: 'Center for Human-Compatible AI', category: 'ai_risk' },
  { name: 'Coalition for Epidemic Preparedness', category: 'pandemics' },
  { name: 'Nuclear Threat Initiative', category: 'nuclear' },
  { name: 'Mercy For Animals', category: 'animal_welfare' },
  { name: 'Global Priorities Institute', category: 'global_priorities' },
  { name: 'Climate Works', category: 'climate_change' },
  { name: 'Wikimedia Foundation', category: 'science_tech' },
  { name: 'Habitat for Humanity', category: 'housing' },
  { name: 'SENS Research Foundation', category: 'longevity' }
];

// Donor data with net worth
export const donors = [
  { name: 'Mackenzie Scott', netWorth: 35000000000 },
  { name: 'Bill Gates', netWorth: 120000000000 },
  { name: 'Warren Buffett', netWorth: 95000000000 },
  { name: 'Dustin Moskovitz', netWorth: 14000000000 },
  { name: 'Elon Musk', netWorth: 180000000000 },
  { name: 'Mark Zuckerberg', netWorth: 75000000000 },
  { name: 'Michael Bloomberg', netWorth: 60000000000 },
  { name: 'Jack Dorsey', netWorth: 5000000000 },
  { name: 'Sam Bankman-Fried', netWorth: 24000000000 },
  { name: 'John Arnold', netWorth: 3500000000 },
  { name: 'Vitalik Buterin', netWorth: 1500000000 },
  { name: 'Jeff Bezos', netWorth: 150000000000 },
  { name: 'Larry Ellison', netWorth: 145000000000 },
  { name: 'Bernard Arnault', netWorth: 195000000000 },
  { name: 'Larry Page', netWorth: 110000000000 },
  { name: 'Sergey Brin', netWorth: 105000000000 },
  { name: 'Amancio Ortega', netWorth: 85000000000 },
  { name: 'Steve Ballmer', netWorth: 95000000000 },
  { name: 'Jensen Huang', netWorth: 48000000000 },
  { name: 'Jaan Tallinn', netWorth: 1000000000 }
];

// Donation data
export const donations = [
  { date: '2023-05-12', donor: 'Mackenzie Scott', charity: 'Against Malaria Foundation', amount: 500000000 },
  { date: '2023-08-24', donor: 'Bill Gates', charity: 'GiveWell Maximum Impact Fund', amount: 750000000 },
  { date: '2023-02-15', donor: 'Warren Buffett', charity: 'GiveDirectly', amount: 3200000000 },
  { date: '2023-11-30', donor: 'Dustin Moskovitz', charity: 'Evidence Action', amount: 120000000 },
  { date: '2023-07-18', donor: 'Elon Musk', charity: 'The END Fund', amount: 150000000 },
  { date: '2023-04-22', donor: 'Mark Zuckerberg', charity: 'Malaria Consortium', amount: 400000000 },
  { date: '2023-10-14', donor: 'Michael Bloomberg', charity: 'SCI Foundation', amount: 2000000000 },
  { date: '2023-01-05', donor: 'Jack Dorsey', charity: 'New Incentives', amount: 75000000 },
  { date: '2023-09-28', donor: 'Sam Bankman-Fried', charity: 'Helen Keller International', amount: 340000000 },
  { date: '2023-06-19', donor: 'John Arnold', charity: 'Development Media International', amount: 65000000 },
  { date: '2023-03-11', donor: 'Mackenzie Scott', charity: 'Malaria Consortium', amount: 250000000 },
  { date: '2023-12-05', donor: 'Bill Gates', charity: 'Against Malaria Foundation', amount: 900000000 },
  { date: '2023-06-30', donor: 'Dustin Moskovitz', charity: 'GiveDirectly', amount: 180000000 },
  { date: '2023-08-14', donor: 'Michael Bloomberg', charity: 'Evidence Action', amount: 300000000 },
  { date: '2023-04-18', donor: 'Warren Buffett', charity: 'New Incentives', amount: 450000000 },
  // New donations to new charities
  { date: '2023-09-15', donor: 'Elon Musk', charity: 'Anthropic', amount: 300000000 },
  { date: '2023-07-21', donor: 'Sam Bankman-Fried', charity: 'Center for Human-Compatible AI', amount: 150000000 },
  { date: '2023-10-30', donor: 'Bill Gates', charity: 'Coalition for Epidemic Preparedness', amount: 500000000 },
  { date: '2023-03-25', donor: 'Michael Bloomberg', charity: 'Nuclear Threat Initiative', amount: 85000000 },
  { date: '2023-05-19', donor: 'Dustin Moskovitz', charity: 'Mercy For Animals', amount: 45000000 },
  { date: '2023-11-12', donor: 'Mackenzie Scott', charity: 'Global Priorities Institute', amount: 120000000 },
  { date: '2023-02-28', donor: 'John Arnold', charity: 'Climate Works', amount: 75000000 },
  { date: '2023-12-18', donor: 'Jack Dorsey', charity: 'Wikimedia Foundation', amount: 25000000 },
  { date: '2023-08-05', donor: 'Mark Zuckerberg', charity: 'Habitat for Humanity', amount: 200000000 },
  { date: '2023-01-17', donor: 'Elon Musk', charity: 'SENS Research Foundation', amount: 50000000 },
  // Vitalik Buterin donations
  { date: '2023-03-18', donor: 'Vitalik Buterin', charity: 'Against Malaria Foundation', amount: 20000000 },
  { date: '2023-06-24', donor: 'Vitalik Buterin', charity: 'GiveDirectly', amount: 45000000 },
  { date: '2023-11-05', donor: 'Vitalik Buterin', charity: 'Anthropic', amount: 100000000 },
  { date: '2023-08-30', donor: 'Vitalik Buterin', charity: 'Center for Human-Compatible AI', amount: 80000000 },
  { date: '2023-05-01', donor: 'Vitalik Buterin', charity: 'SENS Research Foundation', amount: 15000000 },
  // Jeff Bezos donations
  { date: '2023-02-10', donor: 'Jeff Bezos', charity: 'Climate Works', amount: 1000000000 },
  { date: '2023-07-15', donor: 'Jeff Bezos', charity: 'Habitat for Humanity', amount: 500000000 },
  { date: '2023-10-20', donor: 'Jeff Bezos', charity: 'Global Priorities Institute', amount: 300000000 },
  { date: '2023-04-05', donor: 'Jeff Bezos', charity: 'Coalition for Epidemic Preparedness', amount: 750000000 },
  { date: '2023-12-12', donor: 'Jeff Bezos', charity: 'Wikimedia Foundation', amount: 100000000 },
  
  // Larry Ellison donations
  { date: '2023-03-22', donor: 'Larry Ellison', charity: 'GiveWell Maximum Impact Fund', amount: 350000000 },
  { date: '2023-08-15', donor: 'Larry Ellison', charity: 'Anthropic', amount: 425000000 },
  { date: '2023-11-30', donor: 'Larry Ellison', charity: 'SENS Research Foundation', amount: 200000000 },
  
  // Bernard Arnault donations
  { date: '2023-04-18', donor: 'Bernard Arnault', charity: 'Climate Works', amount: 600000000 },
  { date: '2023-09-25', donor: 'Bernard Arnault', charity: 'Wikimedia Foundation', amount: 350000000 },
  { date: '2023-01-15', donor: 'Bernard Arnault', charity: 'Against Malaria Foundation', amount: 150000000 },
  
  // Larry Page donations
  { date: '2023-05-12', donor: 'Larry Page', charity: 'Center for Human-Compatible AI', amount: 300000000 },
  { date: '2023-10-08', donor: 'Larry Page', charity: 'Global Priorities Institute', amount: 250000000 },
  { date: '2023-02-28', donor: 'Larry Page', charity: 'Coalition for Epidemic Preparedness', amount: 400000000 },
  { date: '2023-07-19', donor: 'Larry Page', charity: 'Evidence Action', amount: 150000000 },
  
  // Sergey Brin donations
  { date: '2023-06-14', donor: 'Sergey Brin', charity: 'Anthropic', amount: 275000000 },
  { date: '2023-11-03', donor: 'Sergey Brin', charity: 'Center for Human-Compatible AI', amount: 225000000 },
  { date: '2023-03-17', donor: 'Sergey Brin', charity: 'GiveDirectly', amount: 180000000 },
  { date: '2023-09-20', donor: 'Sergey Brin', charity: 'New Incentives', amount: 120000000 },
  
  // Amancio Ortega donations
  { date: '2023-02-08', donor: 'Amancio Ortega', charity: 'SCI Foundation', amount: 200000000 },
  { date: '2023-08-22', donor: 'Amancio Ortega', charity: 'Habitat for Humanity', amount: 350000000 },
  { date: '2023-12-10', donor: 'Amancio Ortega', charity: 'Helen Keller International', amount: 175000000 },
  
  // Steve Ballmer donations
  { date: '2023-01-25', donor: 'Steve Ballmer', charity: 'GiveWell Maximum Impact Fund', amount: 450000000 },
  { date: '2023-07-12', donor: 'Steve Ballmer', charity: 'Malaria Consortium', amount: 300000000 },
  { date: '2023-11-18', donor: 'Steve Ballmer', charity: 'Climate Works', amount: 250000000 },
  
  // Jensen Huang donations
  { date: '2023-04-30', donor: 'Jensen Huang', charity: 'Anthropic', amount: 150000000 },
  { date: '2023-09-15', donor: 'Jensen Huang', charity: 'Center for Human-Compatible AI', amount: 100000000 },
  { date: '2023-12-05', donor: 'Jensen Huang', charity: 'Global Priorities Institute', amount: 75000000 },
  
  // Jaan Tallinn donations
  { date: '2023-02-17', donor: 'Jaan Tallinn', charity: 'Anthropic', amount: 40000000 },
  { date: '2023-06-25', donor: 'Jaan Tallinn', charity: 'Center for Human-Compatible AI', amount: 35000000 },
  { date: '2023-10-12', donor: 'Jaan Tallinn', charity: 'Global Priorities Institute', amount: 25000000 },
  { date: '2023-03-08', donor: 'Jaan Tallinn', charity: 'Nuclear Threat Initiative', amount: 20000000 }
];

// Helper function to calculate total donations by donor
export const calculateDonorStats = () => {
  const donorMap = new Map();
  
  // Initialize with donor data
  donors.forEach(donor => {
    donorMap.set(donor.name, {
      name: donor.name,
      netWorth: donor.netWorth,
      totalDonated: 0,
      livesSaved: 0,
      costPerLifeSaved: 0
    });
  });
  
  // Calculate total donations and lives saved
  donations.forEach(donation => {
    const charity = charities.find(c => c.name === donation.charity);
    const effectivenessRate = effectivenessCategories[charity.category].effectiveness;
    const donorData = donorMap.get(donation.donor);
    
    const livesSaved = (donation.amount / 1000000) * effectivenessRate;
    
    donorMap.set(donation.donor, {
      ...donorData,
      totalDonated: donorData.totalDonated + donation.amount,
      livesSaved: donorData.livesSaved + livesSaved
    });
  });
  
  // Calculate cost per life saved
  donorMap.forEach((data, name) => {
    donorMap.set(name, {
      ...data,
      costPerLifeSaved: data.livesSaved > 0 ? data.totalDonated / data.livesSaved : 0
    });
  });
  
  // Convert to array and sort by lives saved
  return Array.from(donorMap.values())
    .sort((a, b) => b.livesSaved - a.livesSaved)
    .map((donor, index) => ({
      ...donor,
      rank: index + 1
    }));
};