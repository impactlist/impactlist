// Charity focus areas with cost to save a life (in dollars)
export const effectivenessCategories = {
  'ai_risk': { name: 'AI Existential Risk', costPerLife: 50 },             // $50 per life saved
  'pandemics': { name: 'Pandemics', costPerLife: 500 },                    // $500 per life saved
  'nuclear': { name: 'Nuclear', costPerLife: 2000 },                       // $2K per life saved
  'global_health': { name: 'Global Health', costPerLife: 5000},            // $5K per life saved
  'global_development': { name: 'Global Development/Poverty', costPerLife: 5000 }, // $5K per life saved
  'animal_welfare': { name: 'Animal Welfare', costPerLife: 20000 },        // $20K per life saved
  'global_priorities': { name: 'Global Priorities Research', costPerLife: 500 }, // $500 per life saved
  'meta_theory': { name: 'Meta and Theory', costPerLife: 500 },            // $500 per life saved
  'decision_making': { name: 'Improving Decision Making', costPerLife: 1000 }, // $1K per life saved
  'climate_change': { name: 'Climate Change', costPerLife: 20000 },        // $20K per life saved
  'health_medicine': { name: 'Health/Medicine', costPerLife: 5000 },       // $5K per life saved (developed world health)
  'education': { name: 'Education', costPerLife: 10000 },                  // $10K per life saved
  'political': { name: 'Political Institutions', costPerLife: 10000 },     // $10K per life saved
  'science_tech': { name: 'Science and Tech', costPerLife: 5000 },         // $5K per life saved
  'local_community': { name: 'Local Community', costPerLife: 20000 },      // $20K per life saved
  'arts_culture': { name: 'Arts, Culture, Heritage', costPerLife: 50000 }, // $50K per life saved
  'religious': { name: 'Religious', costPerLife: 50000 },                  // $50K per life saved
  'environmental': { name: 'General Environmental', costPerLife: 50000 },  // $50K per life saved
  'disaster_relief': { name: 'Disaster Relief', costPerLife: 10000 },      // $10K per life saved
  'human_rights': { name: 'Human Rights and Justice', costPerLife: 20000 }, // $20K per life saved
  'housing': { name: 'Homelessness and Housing', costPerLife: 20000 },     // $20K per life saved
  'longevity': { name: 'Longevity', costPerLife: 10000 },                  // $10K per life saved
  'population': { name: 'Population', costPerLife: 5000 },                  // $10K per life saved
  'other': { name: 'Other', costPerLife: 50000 }                          // $50K per life saved
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
  { name: 'Anthropic', category: 'ai_risk', multiplier: 2 },
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
  { name: 'OpenAI', category: 'ai_risk', costPerLife: -5},
  { name: 'Sierra Club', category: 'environmental'},
  { name: 'Future of Life Institute', category: 'ai_risk'},
  { name: 'California Covid Response', category: 'disaster_relief'},
  { name: 'XPrize, Climate Change', category: 'climate_change'},
  { name: 'Cameron County Schools, TX', category: 'education'},
  { name: 'City of Brownsville, TX', category: 'local_community'},
  { name: 'St. Jude Children\'s Hospital', category: 'health_medicine'},
  { name: 'Khan Academy', category: 'education', multiplier: 10 },
  { name: 'Arbor Day Foundation', category: 'environmental' },
  { name: 'Bayou La Batre Hurricane Response Center', category: 'disaster_relief' },
  { name: 'Soma City, Fukushima (tech)', category: 'science_tech' },
  { name: 'Tesla Science Center at Wardenclyffe', category: 'arts_culture' },
  { name: 'ACLU', category: 'human_rights' },
  { name: 'Art of Elysium', category: 'arts_culture' },
  { name: 'Flint Public Schools (Water Filtration)', category: 'health_medicine' },
  { name: 'Ad Astra School', category: 'education' },
  { name: 'Crossroads School', category: 'education' },
  { name: 'Windward School', category: 'education' },
  { name: 'University of Texas Population Initiative', category: 'population' },
  { name: 'MIT', category: 'education'},
  { name: 'Unknown', category: 'other' },
  { name: 'Starlink in Ukraine', category: 'disaster_relief' },
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
  // We won't count the donations of the Gates Foundation fund as his, since warren also donates to it, and it does mostly the same kind of thing.
  { date: '1991-10-07', donor: 'Bill Gates', charity: 'University of Washington (research)', amount: 12000000, source: 'https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/' },
  { date: '1992-01-01', donor: 'Bill Gates', charity: 'Stanford University', amount: 6000000, source: 'https://www.cs.stanford.edu/about/gates-computer-science-building#:~:text=The%20Gates%20Building%20is%20named,month%20period' },
  { date: '1995-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 10000000, source: 'https://www.washington.edu/news/1999/10/28/uw-awarded-10-million-from-bill-and-melinda-gates-foundation/' },
  { date: '1996-09-01', donor: 'Bill Gates', charity: 'Harvard University', amount: 25000000, source: 'https://www.thecrimson.com/article/1996/10/30/gates-ballmer-donate-25-m-for' },
  { date: '1996-01-01', donor: 'Bill Gates', charity: 'University of Washington', amount: 12000000, source: 'https://archive.seattletimes.com/archive/20030424/gatesgift24/gates-gives-70-million-for-genome-work-at-uw' },
  { date: '1997-07-23', donor: 'Bill Gates', charity: 'Gates Library Foundation', amount: 200000000, source: 'https://www.historylink.org/File/2907' },
  { date: '1998-12-01', donor: 'Bill Gates', charity: 'Seattle Public Libraries', amount: 20000000, source: 'https://www.historylink.org/File/2907#:~:text=gifts%20of%20%24133%20million%20for,program%20approved%20the%20previous%20month' },
  { date: '1999-04-14', donor: 'Bill Gates', charity: 'MIT', amount: 20000000, source: 'https://news.mit.edu/1999/gates1-0414#:~:text=April%2014%2C%201999' },
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

// Helper function to get a charity's cost per life
export const getCharityCostPerLife = (charity) => {
  // First check for charity-specific costPerLife
  if (charity.costPerLife !== undefined) {
    return charity.costPerLife;
  }
  
  // Then check for multiplier to scale category costPerLife
  const categoryCostPerLife = effectivenessCategories[charity.category].costPerLife;
  if (charity.multiplier !== undefined) {
    return categoryCostPerLife / charity.multiplier; // Lower multiplier means higher cost
  }
  
  // Otherwise use plain category costPerLife
  return categoryCostPerLife;
};

// Get category base costPerLife
export const getCategoryCostPerLife = (charity) => {
  return effectivenessCategories[charity.category].costPerLife;
};

// Get costPerLife multiplier compared to category (how many times more/less effective)
export const getCostPerLifeMultiplier = (charity) => {
  const charityCostPerLife = getCharityCostPerLife(charity);
  const categoryCostPerLife = getCategoryCostPerLife(charity);
  return categoryCostPerLife / charityCostPerLife; // Higher multiplier means better (lower cost)
};

// Helper function to validate data integrity
export const validateDataIntegrity = () => {
  const errors = [];
  
  // Check if all charities have valid categories
  charities.forEach(charity => {
    if (!effectivenessCategories[charity.category]) {
      errors.push(`Invalid category "${charity.category}" for charity "${charity.name}"`);
    }
  });
  
  // Check if all donations reference existing charities
  donations.forEach(donation => {
    const charity = charities.find(c => c.name === donation.charity);
    if (!charity) {
      errors.push(`Donation references non-existent charity "${donation.charity}" from donor "${donation.donor}"`);
    }
  });
  
  // Check if all donations reference existing donors
  donations.forEach(donation => {
    const donor = donors.find(d => d.name === donation.donor);
    if (!donor) {
      errors.push(`Donation references non-existent donor "${donation.donor}" to charity "${donation.charity}"`);
    }
  });
  
  return errors;
};

// Helper function to calculate total donations by donor
export const calculateDonorStats = () => {
  // First validate data integrity
  const validationErrors = validateDataIntegrity();
  if (validationErrors.length > 0) {
    console.error('Data validation errors:', validationErrors);
    throw new Error(`Data validation failed: ${validationErrors[0]}`);
  }
  
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
    const costPerLife = getCharityCostPerLife(charity);
    const donorData = donorMap.get(donation.donor);
    
    // Negative cost means lives lost per dollar
    const livesSaved = costPerLife < 0 ? 
      (donation.amount / (costPerLife * -1)) * -1 : // Lives lost case
      donation.amount / costPerLife; // Normal case
    
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
      costPerLifeSaved: data.livesSaved > 0 ? data.totalDonated / data.livesSaved : 
                       (data.livesSaved < 0 ? data.totalDonated / Math.abs(data.livesSaved) * -1 : 0)
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