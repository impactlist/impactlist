// Effectiveness categories (lives saved per million dollars)
export const effectivenessCategories = {
  'extremely_effective': 400, // 400 lives saved per $1M
  'very_effective': 250,      // 250 lives saved per $1M
  'effective': 100,           // 100 lives saved per $1M
  'somewhat_effective': 50,   // 50 lives saved per $1M
  'less_effective': 10        // 10 lives saved per $1M
};

// Charity data with their effectiveness categories
export const charities = [
  { name: 'Against Malaria Foundation', category: 'extremely_effective' },
  { name: 'GiveDirectly', category: 'effective' },
  { name: 'Malaria Consortium', category: 'very_effective' },
  { name: 'GiveWell Maximum Impact Fund', category: 'very_effective' },
  { name: 'Evidence Action', category: 'very_effective' },
  { name: 'Helen Keller International', category: 'effective' },
  { name: 'SCI Foundation', category: 'effective' },
  { name: 'The END Fund', category: 'somewhat_effective' },
  { name: 'New Incentives', category: 'very_effective' },
  { name: 'Development Media International', category: 'somewhat_effective' }
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
  { name: 'John Arnold', netWorth: 3500000000 }
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
  { date: '2023-04-18', donor: 'Warren Buffett', charity: 'New Incentives', amount: 450000000 }
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
    const effectivenessRate = effectivenessCategories[charity.category];
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