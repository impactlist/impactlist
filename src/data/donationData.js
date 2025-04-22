// Charity focus areas with cost to save a life (in dollars)
export const effectivenessCategories = {
  'ai_risk': { name: 'AI Existential Risk', costPerLife: 50 },             
  'pandemics': { name: 'Pandemics', costPerLife: 500 },                    
  'nuclear': { name: 'Nuclear', costPerLife: 2000 },                      
  'global_health': { name: 'Global Health', costPerLife: 5000},            
  'global_development': { name: 'Global Development/Poverty', costPerLife: 5000 },
  'animal_welfare': { name: 'Animal Welfare', costPerLife: 30000 },       
  'global_priorities': { name: 'Global Priorities Research', costPerLife: 5000 },
  'meta_theory': { name: 'Meta and Theory', costPerLife: 5000 },           
  'decision_making': { name: 'Improving Decision Making', costPerLife: 1000 },
  'climate_change': { name: 'Climate Change', costPerLife: 50000 },        
  'health_medicine': { name: 'Health/Medicine', costPerLife: 20000 },       
  'education': { name: 'Education', costPerLife: 20000 },                  
  'political': { name: 'Political Institutions', costPerLife: 10000 },    
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

// Charity data with their focus area categories
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
  { name: 'Obama Foundation', categories: { political: { fraction: 1.0 } } },
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
];

// Donor data with net worth
export const donors = [
  { name: 'Mackenzie Scott', netWorth: 2.5e10 },
  { name: 'Bill Gates', netWorth: 1.08e11, totalDonated: 5.9e10 },
  { name: 'Warren Buffett', netWorth: 1.61e11 },
  { name: 'Dustin Moskovitz', netWorth: 1.4e10 },
  { name: 'Elon Musk', netWorth: 3.64e11 },
  { name: 'Mark Zuckerberg', netWorth: 1.7e11 },
  { name: 'Michael Bloomberg', netWorth: 1.1e11 },
  { name: 'Jack Dorsey', netWorth: 3.6e9 },
  { name: 'Jack Ma', netWorth: 2.6e10 },
  { name: 'Vitalik Buterin', netWorth: 6e8 },
  { name: 'Jeff Bezos', netWorth: 1.91e11 },
  { name: 'Larry Ellison', netWorth: 1.63e11 },
  { name: 'Bernard Arnault', netWorth: 1.45e11 },
  // Larry allegedly donated 800 million
  { name: 'Larry Page', netWorth: 1.28e11 },
  { name: 'Sergey Brin', netWorth: 1.23e11 },
  { name: 'Amancio Ortega', netWorth: 1.21e11 },
  { name: 'Steve Ballmer', netWorth: 1.13e11 },
  { name: 'Jensen Huang', netWorth: 9.2e10 },
  { name: 'Jaan Tallinn', netWorth: 1.0e9 }
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
  { date: '2024-12-20', donor: 'Elon Musk', charity: 'The Foundation (Musk)', amount: 137e6, credit: 1, source: 'https://www.cheddar.com/media/big-business-this-week-rage-over-rate-cuts/' },

  // Jaan Tallinn donations
  { date: '2023-02-17', donor: 'Jaan Tallinn', charity: 'Anthropic', amount: 40000000, source: 'https://jaan.online/' },
  { date: '2023-03-08', donor: 'Jaan Tallinn', charity: 'Nuclear Threat Initiative', amount: 20000000, source: 'https://en.wikipedia.org/wiki/Jaan_Tallinn' },
  { date: '2023-06-25', donor: 'Jaan Tallinn', charity: 'Center for Human-Compatible AI', amount: 35000000, source: 'https://www.skype.com/en/about/' },
  { date: '2023-10-12', donor: 'Jaan Tallinn', charity: 'Global Priorities Institute', amount: 25000000, source: 'https://futureoflife.org/team/jaan-tallinn/' },
  
  // Jack Dorsey donations
  { date: '2023-01-05', donor: 'Jack Dorsey', charity: 'New Incentives', amount: 75000000, source: 'https://twitter.com/jack' },
  { date: '2023-12-18', donor: 'Jack Dorsey', charity: 'Wikimedia Foundation', amount: 25000000, source: 'https://startsmall.llc/' },
  
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
  { date: '2006-09-19', donor: 'Warren Buffett', charity: 'IAEA Nuclear Fuel Bank', amount: 50e6, source: 'https://www.nti.org/news/nti-commits-50-million-iaea-nuclear-fuel-bank/' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Bill & Melinda Gates Foundation', amount: 43e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Susan Thompson Buffett Foundation', amount: 5.8e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Howard G. Buffett Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'Sherwood Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'NoVo Foundation', amount: 2.6e9, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
  { date: '2006-11-25', donor: 'Warren Buffett', charity: 'GLIDE Foundation', amount: 53e6, source: 'https://gist.github.com/elliotolds/3254004d00be1af97fd1676bd230f5c6#file-warren_bufftet_donations-md' },
];

// Helper function to get a charity's cost per life
export const getCharityCostPerLife = (charity) => {
  // Calculate weighted average cost per life across all categories
  const categories = Object.entries(charity.categories);
  let weightedCostPerLife = 0;
  
  categories.forEach(([categoryId, categoryData]) => {
    const fraction = categoryData.fraction;
    let costPerLife;
    
    // First check for category-specific costPerLife
    if (categoryData.costPerLife !== undefined) {
      costPerLife = categoryData.costPerLife;
    } else {
      // Get base cost from effectivenessCategories
      const baseCostPerLife = effectivenessCategories[categoryId].costPerLife;
      
      // Check for multiplier to scale category costPerLife
      if (categoryData.multiplier !== undefined) {
        costPerLife = baseCostPerLife / categoryData.multiplier;
      } else {
        costPerLife = baseCostPerLife;
      }
    }
    
    weightedCostPerLife += costPerLife * fraction;
  });
  
  return weightedCostPerLife;
};

// Get category base costPerLife
export const getCategoryCostPerLife = (charity) => {
  // Calculate weighted average base cost per life across all categories
  const categories = Object.entries(charity.categories);
  let weightedBaseCostPerLife = 0;
  
  categories.forEach(([categoryId, categoryData]) => {
    const fraction = categoryData.fraction;
    const baseCostPerLife = effectivenessCategories[categoryId].costPerLife;
    weightedBaseCostPerLife += baseCostPerLife * fraction;
  });
  
  return weightedBaseCostPerLife;
};

// Get costPerLife multiplier compared to category (how many times more/less effective)
export const getCostPerLifeMultiplier = (charity) => {
  const charityCostPerLife = getCharityCostPerLife(charity);
  const categoryCostPerLife = getCategoryCostPerLife(charity);
  return categoryCostPerLife / charityCostPerLife; // Higher multiplier means better (lower cost)
};

// Helper function to get the primary category of a charity (with highest fraction)
export const getPrimaryCategory = (charity) => {
  const categoriesEntries = Object.entries(charity.categories);
  categoriesEntries.sort((a, b) => b[1].fraction - a[1].fraction);
  const primaryCategoryId = categoriesEntries[0][0];
  const primaryCategoryData = effectivenessCategories[primaryCategoryId];
  
  return {
    id: primaryCategoryId,
    name: primaryCategoryData.name,
    fraction: categoriesEntries[0][1].fraction
  };
};

// Helper function to get all categories of a charity with percentages
export const getCategoryBreakdown = (charity) => {
  const categoriesEntries = Object.entries(charity.categories);
  
  return categoriesEntries.map(([categoryId, data]) => ({
    id: categoryId,
    name: effectivenessCategories[categoryId].name,
    fraction: data.fraction,
    percentage: Math.round(data.fraction * 100)
  })).sort((a, b) => b.fraction - a.fraction);
};

// Helper function to validate data integrity
export const validateDataIntegrity = () => {
  const errors = [];
  
  // Check if all charities have valid categories
  charities.forEach(charity => {
    if (!charity.categories || Object.keys(charity.categories).length === 0) {
      errors.push(`Charity "${charity.name}" has no categories`);
      return;
    }
    
    // Validate each category and fraction sum
    let fractionSum = 0;
    Object.entries(charity.categories).forEach(([categoryId, categoryData]) => {
      if (!effectivenessCategories[categoryId]) {
        errors.push(`Invalid category "${categoryId}" for charity "${charity.name}"`);
      }
      
      if (categoryData.fraction === undefined) {
        errors.push(`Missing fraction for category "${categoryId}" in charity "${charity.name}"`);
      } else {
        fractionSum += categoryData.fraction;
      }
    });
    
    // Check if fractions sum to approximately 1.0 (allowing for small floating point errors)
    if (Math.abs(fractionSum - 1.0) > 0.001) {
      errors.push(`Category fractions for charity "${charity.name}" sum to ${fractionSum}, should be 1.0`);
    }
  });
  
  // Check if all donations reference existing charities
  donations.forEach((donation, index) => {
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
      costPerLifeSaved: 0,
      // Store the totalDonated field separately if it exists
      totalDonatedField: donor.totalDonated || null
    });
  });
  
  // Calculate total donations and lives saved
  donations.forEach(donation => {
    const charity = charities.find(c => c.name === donation.charity);
    const costPerLife = getCharityCostPerLife(charity);
    const donorData = donorMap.get(donation.donor);
    
    // Apply credit multiplier if it exists
    const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
    
    // Negative cost means lives lost per dollar
    const livesSaved = costPerLife < 0 ? 
      (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
      creditedAmount / costPerLife; // Normal case
    
    donorMap.set(donation.donor, {
      ...donorData,
      totalDonated: donorData.totalDonated + creditedAmount,
      livesSaved: donorData.livesSaved + livesSaved
    });
  });
  
  // Calculate cost per life saved and handle totalDonated field
  donorMap.forEach((data, name) => {
    // For donors with totalDonatedField, calculate additional lives saved using same efficiency
    let totalLivesSaved = data.livesSaved;
    let displayTotalDonated = data.totalDonated;
    let knownDonations = data.totalDonated; // Store known donations separately
    
    if (data.totalDonatedField && data.totalDonatedField > data.totalDonated) {
      // If they have a totalDonatedField and it's greater than known donations
      const unknownAmount = data.totalDonatedField - data.totalDonated;
      
      // Only calculate additional lives if they've saved some lives already
      if (data.livesSaved !== 0) {
        const avgCostPerLife = data.totalDonated / data.livesSaved;
        const additionalLives = avgCostPerLife !== 0 ? unknownAmount / avgCostPerLife : 0;
        totalLivesSaved += additionalLives;
      }
      
      // Use the totalDonatedField as the display value
      displayTotalDonated = data.totalDonatedField;
    }
    
    donorMap.set(name, {
      ...data,
      totalDonated: displayTotalDonated, // This is now the full amount including unknown
      knownDonations: knownDonations, // Store just the known donations
      livesSaved: totalLivesSaved,
      costPerLifeSaved: totalLivesSaved > 0 ? displayTotalDonated / totalLivesSaved : 
                       (totalLivesSaved < 0 ? displayTotalDonated / Math.abs(totalLivesSaved) * -1 : 0)
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