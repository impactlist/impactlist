import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { calculateDonorStats, donations, charities, effectivenessCategories, getCharityCostPerLife, donors } from '../data/donationData';
import SortableTable from './SortableTable';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Animation speed constant (in milliseconds)
const ANIMATION_DURATION = 400;

function DonorDetail() {
  const { donorName } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
  const [rawChartData, setRawChartData] = useState([]); // Store the raw data with both values
  const [chartData, setChartData] = useState([]); // This will change format based on view
  const [chartView, setChartView] = useState('livesSaved'); // 'donations' or 'livesSaved'
  const [shouldAnimate, setShouldAnimate] = useState(false); // Only animate when user toggles view
  
  // Colors for the chart segments - extended palette with more variety
  const COLORS = [
    // Blues and purples
    '#4f46e5', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#818cf8',
    // Greens and teals
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#22c55e', '#84cc16', '#34d399',
    // Yellows, oranges, reds
    '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a3e635', '#fbbf24', '#fb923c',
    // Pinks and additional colors
    '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#450a0a', '#3f3f46',
    '#78350f', '#1e3a8a', '#064e3b', '#701a75', '#0c4a6e', '#7c2d12', '#134e4a'
  ];

  useEffect(() => {
    // Get full donor statistics
    const stats = calculateDonorStats();
    const currentDonor = stats.find(donor => donor.name === donorName);
    setDonorStats(currentDonor);

    // Get donor donations and sort by date (most recent first)
    const donorDonationsList = donations
      .filter(donation => donation.donor === donorName)
      .map(donation => {
        const charity = charities.find(c => c.name === donation.charity);
        const categoryData = effectivenessCategories[charity.category];
        const costPerLife = getCharityCostPerLife(charity);
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        
        const livesSaved = costPerLife < 0 ? 
          (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
          creditedAmount / costPerLife; // Normal case
        
        return {
          ...donation,
          creditedAmount,
          category: charity.category,
          categoryName: categoryData.name,
          livesSaved,
          costPerLife,
          dateObj: new Date(donation.date)
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);
    
    // Find the donor with the totalDonated field in the donors array
    const donorData = donors.find(donor => donor.name === donorName);
    
    // Keep track of the sum of known donations for reference
    const knownDonationsTotal = donorDonationsList.reduce((total, donation) => total + donation.amount, 0);
    
    // If donor has totalDonated field and it's greater than the sum of known donations
    if (donorData?.totalDonated && donorData.totalDonated > knownDonationsTotal) {
      // Calculate the unknown amount
      const unknownAmount = donorData.totalDonated - knownDonationsTotal;
      
      // Calculate the average cost per life for all known donations
      const totalLivesSaved = donorDonationsList.reduce((total, donation) => total + donation.livesSaved, 0);
      
      // Only calculate avg cost if there are lives saved (avoid division by zero)
      const avgCostPerLife = totalLivesSaved !== 0 ? knownDonationsTotal / totalLivesSaved : 0;
      
      // Calculate lives saved for the unknown amount using the same cost per life
      const unknownLivesSaved = avgCostPerLife !== 0 ? unknownAmount / avgCostPerLife : 0;
      
      // Add the unknown donation to the list
      donorDonationsList.unshift({
        date: 'Unknown',
        donor: donorName,
        charity: 'Unknown',
        amount: unknownAmount,
        category: 'other',
        categoryName: 'Unknown',
        livesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0), // Oldest date to sort at the end
        source: '',
        isUnknown: true
      });
    }
    
    setDonorDonations(donorDonationsList);
    
    // Prepare category data for both donation amounts and lives saved
    // Group donations by category
    const categoryAmounts = {};
    const categoryLivesSaved = {};
    let chartDonationsTotal = 0;
    let chartLivesSavedTotal = 0;
    
    donorDonationsList.forEach(donation => {
      // Skip unknown donations for the chart
      if (donation.isUnknown) return;
      
      const category = donation.categoryName;
      
      // Initialize category objects if they don't exist
      if (!categoryAmounts[category]) {
        categoryAmounts[category] = {
          name: category,
          value: 0,
          category: donation.category
        };
      }
      
      if (!categoryLivesSaved[category]) {
        categoryLivesSaved[category] = {
          name: category,
          value: 0,
          category: donation.category,
          costPerLife: effectivenessCategories[donation.category]?.costPerLife || 0
        };
      }
      
      // Sum donation amounts
      categoryAmounts[category].value += donation.amount;
      chartDonationsTotal += donation.amount;
      
      // Sum lives saved
      categoryLivesSaved[category].value += donation.livesSaved;
      chartLivesSavedTotal += donation.livesSaved;
    });
    
    // Get the complete set of category names from both datasets
    const allCategoryNames = new Set([
      ...Object.keys(categoryAmounts),
      ...Object.keys(categoryLivesSaved)
    ]);
    
    // Create a unified dataset with both values
    let unifiedData = Array.from(allCategoryNames).map(name => {
      const donationEntry = categoryAmounts[name] || { name, value: 0, category: categoryLivesSaved[name]?.category };
      const livesSavedEntry = categoryLivesSaved[name] || { name, value: 0, category: categoryAmounts[name]?.category };
      const category = donationEntry.category || livesSavedEntry.category;
      
      return {
        name,
        donationValue: donationEntry.value,
        livesSavedValue: livesSavedEntry.value,
        category,
        donationPercentage: (donationEntry.value / chartDonationsTotal * 100).toFixed(1),
        livesSavedPercentage: chartLivesSavedTotal !== 0 ? 
          (Math.abs(livesSavedEntry.value) / Math.abs(chartLivesSavedTotal) * 100).toFixed(1) : 0,
        costPerLife: category ? effectivenessCategories[category]?.costPerLife || 0 : 0
      };
    });
    
    // Always sort by donation amount (largest first)
    unifiedData.sort((a, b) => b.donationValue - a.donationValue);
    
    // Limit to top categories if needed
    if (unifiedData.length > 12) {
      // Get top 11 categories
      const topCategories = unifiedData.slice(0, 11);
      const otherCategories = unifiedData.slice(11);
      
      // Calculate totals for "Other" category
      const otherDonationTotal = otherCategories.reduce((total, item) => total + item.donationValue, 0);
      const otherLivesSavedTotal = otherCategories.reduce((total, item) => total + item.livesSavedValue, 0);
      
      const otherDonationPercentage = (otherDonationTotal / chartDonationsTotal * 100).toFixed(1);
      const otherLivesSavedPercentage = chartLivesSavedTotal !== 0 ? 
        (Math.abs(otherLivesSavedTotal) / Math.abs(chartLivesSavedTotal) * 100).toFixed(1) : 0;
      
      // Add "Other" category
      if (otherDonationTotal > 0 || otherLivesSavedTotal !== 0) {
        topCategories.push({
          name: 'Other Categories',
          donationValue: otherDonationTotal,
          livesSavedValue: otherLivesSavedTotal,
          donationPercentage: otherDonationPercentage,
          livesSavedPercentage: otherLivesSavedPercentage
        });
      }
      
      unifiedData = topCategories;
    }
    
    // Store the raw data with both values
    setRawChartData(unifiedData);
  }, [donorName]);

  // Transform data when view changes to ensure animation
  useEffect(() => {
    if (rawChartData.length === 0) return;
    
    // Create a new array for the current view to trigger animations
    const newChartData = rawChartData.map(item => ({
      name: item.name,
      value: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
      // Keep all the original properties for tooltip access
      donationValue: item.donationValue,
      livesSavedValue: item.livesSavedValue,
      category: item.category,
      donationPercentage: item.donationPercentage,
      livesSavedPercentage: item.livesSavedPercentage,
      costPerLife: item.costPerLife
    }));
    
    setChartData(newChartData);
  }, [chartView, rawChartData]);
  
  // Separate effect to handle animation timing
  useEffect(() => {
    // When data is updated, delay turning off animation
    // to ensure it completes
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, ANIMATION_DURATION + 50); // Add a small buffer
      
      return () => clearTimeout(timer);
    }
  }, [chartData, shouldAnimate]);

  // Format functions
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  const formatCurrency = (amount, effectivenessRate = null) => {
    if (!amount || effectivenessRate === 0) {
      return '∞';
    } else if (amount >= 1000000000) {
      const value = amount / 1000000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}B`;
    } else if (amount >= 1000000) {
      const value = amount / 1000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const value = amount / 1000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}K`;
    } else {
      return `$${formatNumber(amount)}`;
    }
  };
  
  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && donorStats) {
      const data = payload[0];
      if (!data || !data.payload) return null;
      
      const entry = data.payload;
      const value = entry.value; // Current displayed value
      const percentage = chartView === 'donations' ? entry.donationPercentage : entry.livesSavedPercentage;
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="font-semibold text-sm">{entry.name}</p>
          {chartView === 'donations' ? (
            <>
              <p className="text-sm">{formatCurrency(value)}</p>
              <p className="text-xs text-slate-500">
                {`${percentage}% of known donations`}
              </p>
              {entry.name !== 'Other Categories' && entry.category && (
                <div className="mt-1 pt-1 border-t border-slate-100">
                  <p className="text-xs text-slate-600">
                    Cost per life: {formatCurrency(entry.costPerLife || 0)}
                  </p>
                  <p className="text-xs text-slate-600">
                    Lives saved: {formatNumber(Math.round(entry.livesSavedValue))}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className={`text-sm ${value < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(value))} lives {value < 0 ? 'lost' : 'saved'}
              </p>
              <p className="text-xs text-slate-500">
                {`${percentage}% of total impact`}
              </p>
              {entry.name !== 'Other Categories' && entry.category && (
                <div className="mt-1 pt-1 border-t border-slate-100">
                  <p className="text-xs text-slate-600">
                    Cost per life: {formatCurrency(entry.costPerLife || 0)}
                  </p>
                  <p className="text-xs text-slate-600">
                    Donation amount: {formatCurrency(entry.donationValue)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Donation table columns configuration
  const donationColumns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-slate-900">
          {donation.isUnknown ? 
            <span className="text-slate-500">Unknown</span> : 
            new Date(donation.date).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'short', 
              day: 'numeric'
            })}
        </div>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (donation) => (
        donation.isUnknown ? 
        <span className="text-sm text-slate-500">{formatCurrency(donation.amount)}</span> :
        <a 
          href={donation.source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {formatCurrency(donation.creditedAmount || donation.amount)}
        </a>
      )
    },
    { 
      key: 'charity', 
      label: 'Recipient',
      render: (donation) => (
        donation.isUnknown ? 
        <span className="text-sm text-slate-500">Unknown</span> :
        <div>
          <Link 
            to={`/recipient/${encodeURIComponent(donation.charity)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {donation.charity}
          </Link>
          {donation.credit !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              via intermediary, {Math.round(donation.credit * 100)}% credit
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'categoryName', 
      label: 'Category',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 'text-slate-900'}`}>
          {donation.categoryName}
        </div>
      )
    },
    { 
      key: 'livesSaved', 
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 
          (donation.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700')}`}>
          {formatNumber(Math.round(donation.livesSaved))}
        </div>
      )
    },
    { 
      key: 'costPerLife', 
      label: 'Cost/Life',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 'text-slate-900'}`}>
          {donation.livesSaved === 0 ? <span className="text-2xl">∞</span> : `$${formatNumber(Math.round(donation.costPerLife))}`}
        </div>
      )
    }
  ];

  if (!donorStats) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with back button */}
      <div className="w-full bg-indigo-700 py-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="text-indigo-100 hover:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Impact List
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Donor name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{donorStats.name}</h1>
        
        {/* Donor stats card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Impact Rank</span>
              <span className="text-3xl font-bold text-slate-900">#{donorStats.rank}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Lives Saved</span>
              <span className={`text-3xl font-bold ${donorStats.livesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(donorStats.livesSaved))}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Donated</span>
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(donorStats.totalDonatedField || donorStats.totalDonated)}
              </span>
              {donorStats.totalDonatedField && (
                <span className="text-xs text-slate-500 mt-1">
                  {formatCurrency(donorStats.knownDonations)} known
                </span>
              )}
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className="text-3xl font-bold text-slate-900">
                {donorStats.livesSaved === 0 ? <span className="text-6xl">∞</span> : `$${formatNumber(Math.round(donorStats.costPerLifeSaved))}`}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Net Worth</span>
              <span className="text-3xl font-bold text-slate-700">{formatCurrency(donorStats.netWorth)}</span>
            </div>
          </div>
        </div>

        {/* Donation categories visualization */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Donation Categories by {chartView === 'donations' ? 'Amount' : 'Lives Saved'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {chartView === 'donations' 
                    ? 'Showing distribution of known donations by category'
                    : 'Showing comparative impact (lives saved) by category'}
                </p>
              </div>
              
              {/* Toggle switch */}
              <div className="flex items-center">
                <div className="p-0.5 bg-slate-100 rounded-lg flex text-xs sm:text-sm shadow-inner">
                  <button
                    onClick={() => {
                      setShouldAnimate(true);
                      setChartView('donations');
                    }}
                    className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
                      chartView === 'donations'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Donations</span>
                  </button>
                  <button
                    onClick={() => {
                      setShouldAnimate(true);
                      setChartView('livesSaved');
                    }}
                    className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
                      chartView === 'livesSaved'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Lives Saved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-4 px-2 relative overflow-hidden">
            <div className="h-96 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="98%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 180, left: 90, bottom: 5 }}
                    animationDuration={shouldAnimate ? ANIMATION_DURATION : 0}
                    animationEasing="ease-in-out"
                    barGap={0}
                    barCategoryGap={8}
                  >
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => 
                        chartView === 'donations' ? formatCurrency(value) : formatNumber(Math.round(value))
                      } 
                      axisLine={true}
                      tickLine={true}
                      domain={[0, 'auto']}
                      animationDuration={shouldAnimate ? ANIMATION_DURATION : 0}
                      animationEasing="ease-in-out"
                      allowDataOverflow={true}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                      axisLine={true}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend formatter={() => 
                      chartView === 'donations' ? 'Donation Amount (By Category)' : 'Lives Saved (By Category)'
                    } />
                    <Bar 
                      dataKey="value" 
                      name={chartView === 'donations' ? 'Donation Amount' : 'Lives Saved'}
                      radius={[0, 4, 4, 0]}
                      animationDuration={shouldAnimate ? ANIMATION_DURATION : 0}
                      animationEasing="ease-in-out"
                      isAnimationActive={shouldAnimate}
                      animationBegin={0}
                      background={{ fill: 'transparent' }}
                      label={{ 
                        position: "right",
                        formatter: (value, entry) => {
                          if (!entry) return '';
                          
                          const percentage = chartView === 'donations' 
                            ? entry.donationPercentage 
                            : entry.livesSavedPercentage;
                          
                          return chartView === 'donations'
                            ? `${formatCurrency(value)} (${percentage}%)`
                            : `${formatNumber(Math.round(value))} (${percentage}%)`;
                        },
                        fontSize: 11,
                        fill: '#64748b',
                        offset: 5
                      }}
                    >
                      {chartData.map((entry, index) => {
                        // Determine the base color for this bar
                        const baseColor = chartView === 'livesSaved' && entry.value < 0 
                          ? '#ef4444' 
                          : COLORS[index % COLORS.length];
                        
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={baseColor}
                            // Create a custom style for hover states - slightly lighter version of the same color
                            style={{
                              filter: 'brightness(1)',
                              transition: 'filter 0.2s ease-in-out',
                              ':hover': {
                                filter: 'brightness(1.15)'
                              }
                            }}
                            // Add event handlers for hover effect
                            onMouseEnter={(e) => {
                              e.target.style.filter = 'brightness(1.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.filter = 'brightness(1)';
                            }}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-slate-500">No donation data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donations list */}
        <div className="bg-white rounded-xl shadow-lg mb-16 border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Donation History</h2>
          </div>
          <div className="overflow-x-auto">
            <SortableTable 
              columns={donationColumns}
              data={donorDonations}
              defaultSortColumn="date"
              defaultSortDirection="desc"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 bg-slate-800 text-center">
        <p className="text-sm text-slate-400">Data compiled from public donations and impact estimates</p>
      </div>
    </div>
  );
}

export default DonorDetail;