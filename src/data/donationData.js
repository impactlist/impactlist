// Charity focus areas with lives saved per million dollars
export const effectivenessCategories = {
  'ai_risk': { name: 'AI Existential Risk', effectiveness: 20000 },          // 500 lives saved per $1M
  'pandemics': { name: 'Pandemics', effectiveness: 2000 },                  // 450 lives saved per $1M
  'nuclear': { name: 'Nuclear', effectiveness: 500 },                      // 400 lives saved per $1M
  'global_health': { name: 'Global Health', effectiveness: 200},           // 350 lives saved per $1M
  'global_development': { name: 'Global Development/Poverty', effectiveness: 200 }, // 300 lives saved per $1M
  'animal_welfare': { name: 'Animal Welfare', effectiveness: 50 },        // 250 lives saved per $1M
  'global_priorities': { name: 'Global Priorities Research', effectiveness: 2000 }, // 220 lives saved per $1M
  'meta_theory': { name: 'Meta and Theory', effectiveness: 2000 },          // 200 lives saved per $1M
  'decision_making': { name: 'Improving Decision Making', effectiveness: 1000 }, // 180 lives saved per $1M
  'climate_change': { name: 'Climate Change', effectiveness: 50 },        // 160 lives saved per $1M
  'health_medicine': { name: 'Health/Medicine', effectiveness: 200 },     // 140 lives saved per $1M  ... this is developed world health
  'education': { name: 'Education', effectiveness: 100 },                  // 120 lives saved per $1M
  'political': { name: 'Political Institutions', effectiveness: 100 },     // 100 lives saved per $1M
  'science_tech': { name: 'Science and Tech', effectiveness: 200 },         // 90 lives saved per $1M
  'local_community': { name: 'Local Community', effectiveness: 50 },       // 80 lives saved per $1M
  'arts_culture': { name: 'Arts, Culture, Heritage', effectiveness: 20 },  // 70 lives saved per $1M
  'religious': { name: 'Religious', effectiveness: 20 },                   // 60 lives saved per $1M
  'environmental': { name: 'General Environmental', effectiveness: 20 },   // 50 lives saved per $1M
  'disaster_relief': { name: 'Disaster Relief', effectiveness: 100 },       // 45 lives saved per $1M
  'human_rights': { name: 'Human Rights and Justice', effectiveness: 50 }, // 40 lives saved per $1M
  'housing': { name: 'Homelessness and Housing', effectiveness: 50 },      // 35 lives saved per $1M
  'longevity': { name: 'Longevity', effectiveness: 100 },                  // 30 lives saved per $1M
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
  { name: 'Anthropic', category: 'ai_risk', multiplier: 0.5 },
  { name: 'Center for Human-Compatible AI', category: 'ai_risk' },
  { name: 'Coalition for Epidemic Preparedness', category: 'pandemics' },
  { name: 'Nuclear Threat Initiative', category: 'nuclear' },
  { name: 'Mercy For Animals', category: 'animal_welfare' },
  { name: 'Global Priorities Institute', category: 'global_priorities' },
  { name: 'Climate Works', category: 'climate_change' },
  { name: 'Wikimedia Foundation', category: 'science_tech' },
  { name: 'Habitat for Humanity', category: 'housing' },
  { name: 'SENS Research Foundation', category: 'longevity' },
  { name: 'University of Washington (research)', category: 'science_tech' },
  { name: 'University of Washington', category: 'education' },
  { name: 'Stanford University', category: 'education' },
  { name: 'Harvard University', category: 'education' },
  { name: 'Gates Library Foundation', category: 'education' },
  { name: 'Seattle Public Libraries', category: 'education' },
  { name: 'Bill & Melinda Gates Foundation', category: 'global_health' },
  { name: 'United Negro College Fund', category: 'education' },
  { name: 'Dementia Discovery Fund', category: 'health_medicine' },
  { name: 'OpenAI', category: 'ai_risk', effectiveness: -20000},
];

// Donor data with net worth
export const donors = [
  { name: 'Mackenzie Scott', netWorth: 35000000000 },
  { name: 'Bill Gates', netWorth: 108000000000 },
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
  // Amancio Ortega donations
  { date: '2023-02-08', donor: 'Amancio Ortega', charity: 'SCI Foundation', amount: 200000000, source: 'https://en.wikipedia.org/wiki/Amancio_Ortega' },
  { date: '2023-08-22', donor: 'Amancio Ortega', charity: 'Habitat for Humanity', amount: 350000000, source: 'https://www.forbes.com/profile/amancio-ortega/' },
  { date: '2023-12-10', donor: 'Amancio Ortega', charity: 'Helen Keller International', amount: 175000000, source: 'https://www.inditex.com/en/about-us/our-people/our-founder' },
  
  // Bernard Arnault donations
  { date: '2023-01-15', donor: 'Bernard Arnault', charity: 'Against Malaria Foundation', amount: 150000000, source: 'https://en.wikipedia.org/wiki/Bernard_Arnault' },
  { date: '2023-04-18', donor: 'Bernard Arnault', charity: 'Climate Works', amount: 600000000, source: 'https://www.forbes.com/profile/bernard-arnault/' },
  { date: '2023-09-25', donor: 'Bernard Arnault', charity: 'Wikimedia Foundation', amount: 350000000, source: 'https://www.lvmh.com/houses/lvmh/bernard-arnault/' },
  
  // Bill Gates donations
  // Gemini says "Through 2023, Bill Gates (and formerly Melinda French Gates) had personally contributed $59.5 billion to the Gates Foundation endowment.. the below is only 50.4 donated total 
  { date: '1991-10-07', donor: 'Bill Gates', charity: 'University of Washington (research)', amount: 12000000, source: 'https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/' },
  { date: '1992-01-01', donor: 'Bill Gates', charity: 'Stanford University', amount: 6000000, source: 'https://www.cs.stanford.edu/about/gates-computer-science-building#:~:text=The%20Gates%20Building%20is%20named,month%20period' },
  { date: '1995-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 10000000, source: 'https://www.washington.edu/news/1999/10/28/uw-awarded-10-million-from-bill-and-melinda-gates-foundation/' },
  { date: '1996-09-01', donor: 'Bill Gates', charity: 'Harvard University', amount: 25000000, source: 'https://www.thecrimson.com/article/1996/10/30/gates-ballmer-donate-25-m-for' },
  { date: '1996-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 12000000, source: 'https://archive.seattletimes.com/archive/20030424/gatesgift24/gates-gives-70-million-for-genome-work-at-uw' },
  { date: '1997-07-23', donor: 'Bill Gates', charity: 'Gates Library Foundation', amount: 200000000, source: 'https://www.historylink.org/File/2907' },
  { date: '1998-12-01', donor: 'Bill Gates', charity: 'Seattle Public Libraries', amount: 20000000, source: 'https://www.historylink.org/File/2907#:~:text=gifts%20of%20%24133%20million%20for,program%20approved%20the%20previous%20month' },
  { date: '1999-01-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 15800000000, source: 'https://www.gatesfoundation.org/-/media/gfo/1annual-reports/1999gates-foundation-annual-report.pdf#:~:text=Continuing%20their%20generous%20and%20aggressive,national%20and%20global%20challenges%2C%20it', notes: 'Initial endowment' },
  { date: '1999-01-01', donor: 'Bill Gates', charity: 'United Negro College Fund', amount: 1265000000, source: 'https://spearswms.com/impact-philanthropy/the-12-biggest-bill-gates-donations/'},
  { date: '2000-01-24', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 5000000000, source: 'https://www.gatesfoundation.org/ideas/media-center/press-releases/2000/01/statement-from-the-bill-melinda-gates-foundation#:~:text=SEATTLE%20,8%20billion' },
  { date: '2003-04-24', donor: 'Bill Gates', charity: 'University of Washington (research)', amount: 70000000, source: 'https://archive.seattletimes.com/archive/20030424/gatesgift24/gates-gives-70-million-for-genome-work-at-uw#:~:text=The%20Bill%20%26%20Melinda%20Gates,genome%20research' },
  { date: '2004-11-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 3300000000, source: 'https://money.cnn.com/2004/09/21/technology/gates_pay/index.htm?cnn#:~:text=This%20November%2C%20the%20company%20plans,for%20him%20and%20his%20wife' },
  { date: '2017-06-01', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 4680000000, source: 'https://www.wsj.com/articles/bill-gates-donates-billions-in-stock-to-foundation-1502822229', notes: 'From Microsoft stock' },
  { date: '2017-11-01', donor: 'Bill Gates', charity: 'Dementia Discovery Fund', amount: 50000000, source: 'https://en.wikipedia.org/wiki/Bill_Gates#Philanthropy'},
  { date: '2022-07-13', donor: 'Bill Gates', charity: 'Bill & Melinda Gates Foundation', amount: 20000000000, source: 'https://www.reuters.com/world/bill-gates-donates-20-bln-his-foundation-2022-07-13/#:~:text=July%2013%20%28Reuters%29%20,to%20boost%20its%20annual%20distributions', notes: 'Cash/stock gift' },
  
  // Dustin Moskovitz donations
  { date: '2023-05-19', donor: 'Dustin Moskovitz', charity: 'Mercy For Animals', amount: 45000000, source: 'https://www.opensocietyfoundations.org/newsroom/dustin-moskovitz-donation' },
  { date: '2023-06-30', donor: 'Dustin Moskovitz', charity: 'GiveDirectly', amount: 180000000, source: 'https://www.goodventures.org/our-portfolio/grants/givedirectly-general-support-2023' },
  { date: '2023-11-30', donor: 'Dustin Moskovitz', charity: 'Evidence Action', amount: 120000000, source: 'https://www.openphilanthropy.org/grants/' },
  
  // Elon Musk donations
  { date: '2017-01-01', donor: 'Elon Musk', charity: 'OpenAI', amount: 15000000, source: 'https://techcrunch.com/2023/05/17/elon-musk-used-to-say-he-put-100m-in-openai-but-now-its-50m-here-are-the-receipts/'},
  { date: '2023-01-17', donor: 'Elon Musk', charity: 'SENS Research Foundation', amount: 50000000, source: 'https://twitter.com/elonmusk' },
  { date: '2023-07-18', donor: 'Elon Musk', charity: 'The END Fund', amount: 150000000, source: 'https://www.muskfoundation.org/' },
  { date: '2023-09-15', donor: 'Elon Musk', charity: 'Anthropic', amount: 300000000, source: 'https://en.wikipedia.org/wiki/Elon_Musk' },
  
  // Jaan Tallinn donations
  { date: '2023-02-17', donor: 'Jaan Tallinn', charity: 'Anthropic', amount: 40000000, source: 'https://jaan.online/' },
  { date: '2023-03-08', donor: 'Jaan Tallinn', charity: 'Nuclear Threat Initiative', amount: 20000000, source: 'https://en.wikipedia.org/wiki/Jaan_Tallinn' },
  { date: '2023-06-25', donor: 'Jaan Tallinn', charity: 'Center for Human-Compatible AI', amount: 35000000, source: 'https://www.skype.com/en/about/' },
  { date: '2023-10-12', donor: 'Jaan Tallinn', charity: 'Global Priorities Institute', amount: 25000000, source: 'https://futureoflife.org/team/jaan-tallinn/' },
  
  // Jack Dorsey donations
  { date: '2023-01-05', donor: 'Jack Dorsey', charity: 'New Incentives', amount: 75000000, source: 'https://twitter.com/jack' },
  { date: '2023-12-18', donor: 'Jack Dorsey', charity: 'Wikimedia Foundation', amount: 25000000, source: 'https://startsmall.llc/' },
  
  // Jeff Bezos donations
  { date: '2023-02-10', donor: 'Jeff Bezos', charity: 'Climate Works', amount: 1000000000, source: 'https://www.bezosearthfund.org/' },
  { date: '2023-04-05', donor: 'Jeff Bezos', charity: 'Coalition for Epidemic Preparedness', amount: 750000000, source: 'https://www.bezosdayonefund.org/' },
  { date: '2023-07-15', donor: 'Jeff Bezos', charity: 'Habitat for Humanity', amount: 500000000, source: 'https://www.bloomberg.com/billionaires/profiles/jeffrey-p-bezos/' },
  { date: '2023-10-20', donor: 'Jeff Bezos', charity: 'Global Priorities Institute', amount: 300000000, source: 'https://en.wikipedia.org/wiki/Jeff_Bezos' },
  { date: '2023-12-12', donor: 'Jeff Bezos', charity: 'Wikimedia Foundation', amount: 100000000, source: 'https://www.forbes.com/profile/jeff-bezos/' },
  
  // Jensen Huang donations
  { date: '2023-04-30', donor: 'Jensen Huang', charity: 'Anthropic', amount: 150000000, source: 'https://www.nvidia.com/en-us/about-nvidia/jensen-huang/' },
  { date: '2023-09-15', donor: 'Jensen Huang', charity: 'Center for Human-Compatible AI', amount: 100000000, source: 'https://en.wikipedia.org/wiki/Jensen_Huang' },
  { date: '2023-12-05', donor: 'Jensen Huang', charity: 'Global Priorities Institute', amount: 75000000, source: 'https://www.forbes.com/profile/jensen-huang/' },
  
  // John Arnold donations
  { date: '2023-02-28', donor: 'John Arnold', charity: 'Climate Works', amount: 75000000, source: 'https://www.arnoldfoundation.org/' },
  { date: '2023-06-19', donor: 'John Arnold', charity: 'Development Media International', amount: 65000000, source: 'https://en.wikipedia.org/wiki/John_Arnold' },
  
  // Larry Ellison donations
  { date: '2023-03-22', donor: 'Larry Ellison', charity: 'GiveWell Maximum Impact Fund', amount: 350000000, source: 'https://www.oracle.com/corporate/executives/lawrence-ellison/' },
  { date: '2023-08-15', donor: 'Larry Ellison', charity: 'Anthropic', amount: 425000000, source: 'https://en.wikipedia.org/wiki/Larry_Ellison' },
  { date: '2023-11-30', donor: 'Larry Ellison', charity: 'SENS Research Foundation', amount: 200000000, source: 'https://www.forbes.com/profile/larry-ellison/' },
  
  // Larry Page donations
  { date: '2023-02-28', donor: 'Larry Page', charity: 'Coalition for Epidemic Preparedness', amount: 400000000, source: 'https://en.wikipedia.org/wiki/Larry_Page' },
  { date: '2023-05-12', donor: 'Larry Page', charity: 'Center for Human-Compatible AI', amount: 300000000, source: 'https://www.google.com/about/our-story/' },
  { date: '2023-07-19', donor: 'Larry Page', charity: 'Evidence Action', amount: 150000000, source: 'https://www.forbes.com/profile/larry-page/' },
  { date: '2023-10-08', donor: 'Larry Page', charity: 'Global Priorities Institute', amount: 250000000, source: 'https://www.alphabet.com/en-ww/leadership' },
  
  // Mackenzie Scott donations
  { date: '2023-03-11', donor: 'Mackenzie Scott', charity: 'Malaria Consortium', amount: 250000000, source: 'https://mackenzie-scott.medium.com/' },
  { date: '2023-05-12', donor: 'Mackenzie Scott', charity: 'Against Malaria Foundation', amount: 500000000, source: 'https://en.wikipedia.org/wiki/MacKenzie_Scott' },
  { date: '2023-11-12', donor: 'Mackenzie Scott', charity: 'Global Priorities Institute', amount: 120000000, source: 'https://www.forbes.com/profile/mackenzie-scott/' },
  
  // Mark Zuckerberg donations
  { date: '2023-04-22', donor: 'Mark Zuckerberg', charity: 'Malaria Consortium', amount: 400000000, source: 'https://chanzuckerberg.com/' },
  { date: '2023-08-05', donor: 'Mark Zuckerberg', charity: 'Habitat for Humanity', amount: 200000000, source: 'https://www.facebook.com/zuck' },
  
  // Michael Bloomberg donations
  { date: '2023-03-25', donor: 'Michael Bloomberg', charity: 'Nuclear Threat Initiative', amount: 85000000, source: 'https://www.bloomberg.org/' },
  { date: '2023-08-14', donor: 'Michael Bloomberg', charity: 'Evidence Action', amount: 300000000, source: 'https://en.wikipedia.org/wiki/Michael_Bloomberg' },
  { date: '2023-10-14', donor: 'Michael Bloomberg', charity: 'SCI Foundation', amount: 2000000000, source: 'https://www.bloomberg.com/profile/person/1241252' },
  
  // Sam Bankman-Fried donations
  { date: '2023-07-21', donor: 'Sam Bankman-Fried', charity: 'Center for Human-Compatible AI', amount: 150000000, source: 'https://en.wikipedia.org/wiki/Sam_Bankman-Fried' },
  { date: '2023-09-28', donor: 'Sam Bankman-Fried', charity: 'Helen Keller International', amount: 340000000, source: 'https://www.forbes.com/profile/sam-bankman-fried/' },
  
  // Sergey Brin donations
  { date: '2023-03-17', donor: 'Sergey Brin', charity: 'GiveDirectly', amount: 180000000, source: 'https://en.wikipedia.org/wiki/Sergey_Brin' },
  { date: '2023-06-14', donor: 'Sergey Brin', charity: 'Anthropic', amount: 275000000, source: 'https://research.google/people/sergey-brin/' },
  { date: '2023-09-20', donor: 'Sergey Brin', charity: 'New Incentives', amount: 120000000, source: 'https://www.forbes.com/profile/sergey-brin/' },
  { date: '2023-11-03', donor: 'Sergey Brin', charity: 'Center for Human-Compatible AI', amount: 225000000, source: 'https://www.alphabet.com/en-ww/leadership' },
  
  // Steve Ballmer donations
  { date: '2023-01-25', donor: 'Steve Ballmer', charity: 'GiveWell Maximum Impact Fund', amount: 450000000, source: 'https://en.wikipedia.org/wiki/Steve_Ballmer' },
  { date: '2023-07-12', donor: 'Steve Ballmer', charity: 'Malaria Consortium', amount: 300000000, source: 'https://www.ballmerfoundation.org/' },
  { date: '2023-11-18', donor: 'Steve Ballmer', charity: 'Climate Works', amount: 250000000, source: 'https://www.forbes.com/profile/steve-ballmer/' },
  
  // Vitalik Buterin donations
  { date: '2023-03-18', donor: 'Vitalik Buterin', charity: 'Against Malaria Foundation', amount: 20000000, source: 'https://vitalik.ca/' },
  { date: '2023-05-01', donor: 'Vitalik Buterin', charity: 'SENS Research Foundation', amount: 15000000, source: 'https://twitter.com/VitalikButerin' },
  { date: '2023-06-24', donor: 'Vitalik Buterin', charity: 'GiveDirectly', amount: 45000000, source: 'https://en.wikipedia.org/wiki/Vitalik_Buterin' },
  { date: '2023-08-30', donor: 'Vitalik Buterin', charity: 'Center for Human-Compatible AI', amount: 80000000, source: 'https://ethereum.org/en/founders/' },
  { date: '2023-11-05', donor: 'Vitalik Buterin', charity: 'Anthropic', amount: 100000000, source: 'https://www.forbes.com/profile/vitalik-buterin/' },
  
  // Warren Buffett donations
  { date: '2023-02-15', donor: 'Warren Buffett', charity: 'GiveDirectly', amount: 3200000000, source: 'https://en.wikipedia.org/wiki/Warren_Buffett' },
  { date: '2023-04-18', donor: 'Warren Buffett', charity: 'New Incentives', amount: 450000000, source: 'https://www.berkshirehathaway.com/aboutwarren.html' }
];

// Helper function to get a charity's effectiveness rate
export const getCharityEffectiveness = (charity) => {
  // First check for charity-specific effectiveness
  if (charity.effectiveness !== undefined) {
    return charity.effectiveness;
  }
  
  // Then check for multiplier to scale category effectiveness
  const categoryEffectiveness = effectivenessCategories[charity.category].effectiveness;
  if (charity.multiplier !== undefined) {
    return categoryEffectiveness * charity.multiplier;
  }
  
  // Otherwise use plain category effectiveness
  return categoryEffectiveness;
};

// Get category base effectiveness
export const getCategoryEffectiveness = (charity) => {
  return effectivenessCategories[charity.category].effectiveness;
};

// Get effectiveness multiplier compared to category (how many times more/less effective)
export const getEffectivenessMultiplier = (charity) => {
  const charityEffectiveness = getCharityEffectiveness(charity);
  const categoryEffectiveness = getCategoryEffectiveness(charity);
  return charityEffectiveness / categoryEffectiveness;
};

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
    const effectivenessRate = getCharityEffectiveness(charity);
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