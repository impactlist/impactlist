import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateDonorStats, donations, charities, effectivenessCategories, getCharityCostPerLife, donors, getPrimaryCategory } from '../data/donationData';
import SortableTable from './SortableTable';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Animation speed constant (in milliseconds)
const ANIMATION_DURATION = 600;

function DonorDetail(props) {
  const { donorName } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
  const [rawChartData, setRawChartData] = useState([]); // Store the raw data with both values
  const [chartData, setChartData] = useState([]); // This will change format based on view
  const [chartView, setChartView] = useState('livesSaved'); // 'donations' or 'livesSaved'
  const [shouldAnimate, setShouldAnimate] = useState(false); // Only animate when user toggles view
  const [transitionStage, setTransitionStage] = useState('none'); // 'none', 'shrinking', 'growing'
  
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
        const costPerLife = getCharityCostPerLife(charity);
        
        // Get the primary category for this charity
        const primaryCategory = getPrimaryCategory(charity);
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        
        const livesSaved = costPerLife < 0 ? 
          (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
          creditedAmount / costPerLife; // Normal case
        
        return {
          ...donation,
          creditedAmount,
          category: primaryCategory.id, // Use primary category ID
          categoryName: primaryCategory.name,
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
        category: 'other', // Use 'other' as the primary category ID
        categoryName: 'Unknown', // Use 'Unknown' as the primary category name
        livesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0), // Oldest date to sort at the end
        source: '',
        isUnknown: true
      });
      
      // Also create a dummy charity for the 'Unknown' entry to avoid errors
      if (!charities.some(c => c.name === 'Unknown')) {
        charities.push({
          name: 'Unknown',
          categories: {
            other: { fraction: 1.0 }
          }
        });
      }
    }
    
    setDonorDonations(donorDonationsList);
    
    // Prepare category data for both donation amounts and lives saved
    // Group donations by category, accounting for category fractions
    const categoryAmounts = {};
    const categoryLivesSaved = {};
    let chartDonationsTotal = 0;
    let chartLivesSavedTotal = 0;
    
    donorDonationsList.forEach(donation => {
      // Skip unknown donations for the chart
      if (donation.isUnknown) return;
      
      // Get the charity and its categories
      const charity = charities.find(c => c.name === donation.charity);
      if (!charity) return;
      
      // Process each category this charity belongs to
      Object.entries(charity.categories).forEach(([categoryId, categoryData]) => {
        const fraction = categoryData.fraction;
        const categoryName = effectivenessCategories[categoryId].name;
        
        // Get the costPerLife with multiplier properly applied
        let costPerLife;
        if (categoryData.costPerLife !== undefined) {
          // Use the explicit costPerLife if provided
          costPerLife = categoryData.costPerLife;
        } else {
          // Get base cost from effectivenessCategories
          const baseCostPerLife = effectivenessCategories[categoryId].costPerLife;
          
          // Apply multiplier if it exists
          if (categoryData.multiplier !== undefined) {
            costPerLife = baseCostPerLife / categoryData.multiplier; // Lower cost with higher multiplier
          } else {
            costPerLife = baseCostPerLife;
          }
        }
        
        // Calculate category-specific amount and lives saved
        const categoryAmount = donation.amount * fraction;
        let livesSavedForCategory;
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? 
          categoryAmount * donation.credit : categoryAmount;
        
        // Calculate lives saved for this specific category
        if (costPerLife < 0) {
          livesSavedForCategory = (creditedAmount / (costPerLife * -1)) * -1; // Lives lost case
        } else {
          livesSavedForCategory = costPerLife !== 0 ? creditedAmount / costPerLife : 0; // Normal case
        }
        
        // Initialize category objects if they don't exist
        if (!categoryAmounts[categoryName]) {
          categoryAmounts[categoryName] = {
            name: categoryName,
            value: 0,
            category: categoryId
          };
        }
        
        if (!categoryLivesSaved[categoryName]) {
          categoryLivesSaved[categoryName] = {
            name: categoryName,
            value: 0,
            category: categoryId,
            costPerLife: costPerLife,
            // Store multiplier info for the tooltip
            hasMultiplier: categoryData.multiplier !== undefined,
            multiplier: categoryData.multiplier
          };
        }
        
        // Sum donation amounts
        categoryAmounts[categoryName].value += categoryAmount;
        chartDonationsTotal += categoryAmount;
        
        // Sum lives saved
        categoryLivesSaved[categoryName].value += livesSavedForCategory;
        chartLivesSavedTotal += livesSavedForCategory;
      });
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
        costPerLife: livesSavedEntry.costPerLife || (category ? effectivenessCategories[category]?.costPerLife || 0 : 0),
        hasMultiplier: livesSavedEntry.hasMultiplier,
        multiplier: livesSavedEntry.multiplier
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

  // Prepare the initial sorted data once
  useEffect(() => {
    if (rawChartData.length === 0) return;
    
    // Sort the raw data by donation amount (largest first) for consistent positioning
    const sortedData = [...rawChartData].sort((a, b) => {
      // Always put "Other Categories" at the bottom
      if (a.name === 'Other Categories') return 1;
      if (b.name === 'Other Categories') return -1;
      return b.donationValue - a.donationValue;
    });
    
    // Initialize with lives saved values to match the default view
    const initialChartData = sortedData.map(item => ({
      name: item.name,
      value: item.livesSavedValue, // Start with lives saved values to match default view
      valueTarget: item.livesSavedValue, // Target is initially the same
      donationValue: item.donationValue,
      livesSavedValue: item.livesSavedValue,
      category: item.category,
      donationPercentage: item.donationPercentage,
      livesSavedPercentage: item.livesSavedPercentage,
      costPerLife: item.costPerLife,
      hasMultiplier: item.hasMultiplier,
      multiplier: item.multiplier
    }));
    
    setChartData(initialChartData);
  }, [rawChartData]);
  
  // Handle shrinking transition phase
  useEffect(() => {
    if (chartData.length === 0 || transitionStage !== 'shrinking') return;
    
    let needsIntermediateStep = false;
    
    // If switching from lives saved to donations, shrink negative bars to zero
    if (chartView === 'donations') {
      needsIntermediateStep = chartData.some(item => item.livesSavedValue < 0);
      
      if (needsIntermediateStep) {
        // Create intermediate data where negative values are set to zero
        const intermediateData = chartData.map(item => ({
          ...item,
          valueTarget: item.livesSavedValue < 0 ? 0 : item.livesSavedValue,
        }));
        
        setChartData(intermediateData);
      }
    } 
    // If switching from donations to lives saved, shrink positive bars that will become negative
    else if (chartView === 'livesSaved') {
      needsIntermediateStep = chartData.some(item => item.livesSavedValue < 0);
      
      if (needsIntermediateStep) {
        // First animate values to zero if they will become negative
        const intermediateData = chartData.map(item => ({
          ...item,
          valueTarget: item.livesSavedValue < 0 ? 0 : item.donationValue,
        }));
        
        setChartData(intermediateData);
      }
    }
    
    // Schedule next stage
    const timer = setTimeout(() => {
      setTransitionStage('growing');
    }, needsIntermediateStep ? ANIMATION_DURATION : 50);
    
    return () => clearTimeout(timer);
  }, [transitionStage, chartView]); // Remove chartData dependency
  
  // Handle growing transition phase
  useEffect(() => {
    if (chartData.length === 0 || transitionStage !== 'growing') return;
    
    // Second stage: Grow bars to their final values
    const finalData = chartData.map(item => ({
      ...item,
      valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
    }));
    
    setChartData(finalData);
    
    // Reset transition state after animation completes
    const timer = setTimeout(() => {
      setTransitionStage('none');
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(timer);
  }, [transitionStage, chartView]); // Remove chartData dependency
  
  // Initialize chart view on rawChartData load
  useEffect(() => {
    if (chartData.length === 0 || !chartView) return;
    
    // Only runs on initial load
    const initialData = chartData.map(item => ({
      ...item,
      valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
    }));
    
    setChartData(initialData);
  }, [rawChartData]); // Only depend on rawChartData for initialization
  
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
    if (amount === 0) {
      return '$0';
    } else if (effectivenessRate === 0 || amount === null || amount === undefined) {
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
      const value = entry.valueTarget; // Current displayed value
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
      render: (donation) => {
        // Skip this for unknown donations
        if (donation.isUnknown) {
          return (
            <div className="text-sm text-slate-500">
              {donation.categoryName}
            </div>
          );
        }
        
        // Get the charity to check if it has multiple categories
        const charity = charities.find(c => c.name === donation.charity);
        if (!charity) {
          return (
            <div className="text-sm text-slate-900">
              {donation.categoryName}
            </div>
          );
        }
        
        // Count categories
        const categoryCount = Object.keys(charity.categories).length;
        const hasMultipleCategories = categoryCount > 1;
        
        return (
          <div className="text-sm text-slate-900">
            {donation.categoryName}
            {hasMultipleCategories && (
              <span className="text-xs text-slate-500 ml-1">
                (+{categoryCount - 1})
              </span>
            )}
          </div>
        );
      }
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
    <motion.div 
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with back button - Hidden when using App layout */}
      {!props.hideHeader && (
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
      )}
      {/* Spacer when using App layout */}
      {props.hideHeader && <div className="h-10"></div>}

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Donor name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{donorStats.name}</h1>
        
        {/* Donor stats card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
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
        </motion.div>

        {/* Donation categories visualization */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg mb-8 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
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
                      setTransitionStage('shrinking');
                      setChartView('donations');
                    }}
                    className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
                      chartView === 'donations'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    disabled={transitionStage !== 'none'}
                  >
                    <span>Donations</span>
                  </button>
                  <button
                    onClick={() => {
                      setShouldAnimate(true);
                      setTransitionStage('shrinking');
                      setChartView('livesSaved');
                    }}
                    className={`px-3 py-2 font-medium rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 ${
                      chartView === 'livesSaved'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    disabled={transitionStage !== 'none'}
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
                    animationDuration={ANIMATION_DURATION}
                    animationEasing="ease-out"
                    barGap={0}
                    barCategoryGap={8}
                  >
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => {
                        // Create placeholder space during transition
                        // This preserves vertical layout but makes text invisible
                        if (transitionStage !== 'none') {
                          // Use a transparent placeholder with consistent width
                          // For donations view, we use dollar amounts which need more space
                          if (chartView === 'donations') {
                            return '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'; // Non-breaking spaces
                          } else {
                            // For lives saved view
                            return '\u00A0\u00A0\u00A0\u00A0\u00A0'; // Non-breaking spaces
                          }
                        }
                        
                        if (value === 0) return "0";
                        
                        if (chartView === 'donations') {
                          return formatCurrency(value);
                        } else {
                          // Handle both positive and negative large numbers
                          const absValue = Math.abs(value);
                          let formattedValue;
                          
                          if (absValue >= 1000000) {
                            formattedValue = `${(absValue / 1000000).toFixed(1)}M`;
                          } else if (absValue >= 1000) {
                            formattedValue = `${(absValue / 1000).toFixed(1)}K`;
                          } else {
                            formattedValue = formatNumber(Math.round(absValue));
                          }
                          
                          // Add negative sign back if needed
                          return value < 0 ? `-${formattedValue}` : formattedValue;
                        }
                      }}
                      axisLine={true}
                      tick={{ 
                        fill: transitionStage !== 'none' ? 'transparent' : '#1e293b', // Darker text (slate-800)
                        fontSize: 14, // Increased font size
                      }}
                      tickLine={true}
                      // Dynamically set domain based on current data values
                      domain={(() => {
                        // If we're in lives saved view or transitioning to it, and there are negative values
                        const hasNegativeValues = chartData.some(item => item.valueTarget < 0);
                        
                        if (hasNegativeValues) {
                          return ['dataMin', 'dataMax'];
                        } else if (chartView === 'donations' || 
                                  (chartView === 'livesSaved' && !chartData.some(item => item.livesSavedValue < 0))) {
                          return [0, 'auto'];
                        } else {
                          // During transition from negative lives saved to donations
                          return [Math.min(0, ...chartData.map(d => d.valueTarget)), 
                                  Math.max(...chartData.map(d => d.valueTarget))];
                        }
                      })()}
                      // Make axis line transparent during transition, dark during normal state
                      stroke={transitionStage !== 'none' ? 'transparent' : '#1e293b'} // Darker line (slate-800)
                      animationDuration={ANIMATION_DURATION}
                      animationEasing="ease-out"
                      allowDataOverflow={true}
                      // Keep space for labels by setting height
                      height={30}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ 
                        fontSize: 14, 
                        fill: '#1e293b' // Darker text (slate-800)
                      }}
                      axisLine={true}
                      stroke="#1e293b" // Darker line (slate-800)
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend formatter={() => 
                      chartView === 'donations' ? 'Donation Amount (By Category)' : 'Lives Saved (By Category)'
                    } />
                    <Bar 
                      dataKey="valueTarget" 
                      name={chartView === 'donations' ? 'Donation Amount' : 'Lives Saved'}
                      radius={[0, 4, 4, 0]}
                      animationDuration={ANIMATION_DURATION}
                      animationEasing="ease-out"
                      isAnimationActive={true}
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
                            ? `${formatCurrency(entry.donationValue)} (${percentage}%)`
                            : `${formatNumber(Math.round(entry.livesSavedValue))} (${percentage}%)`;
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
                            key={`cell-${entry.name}`} 
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
        </motion.div>

        {/* Donations list */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg mb-16 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
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
        </motion.div>
      </motion.div>

      {/* Footer - Hidden when using App layout */}
      {!props.hideHeader && (
        <div className="w-full py-6 bg-slate-800 text-center">
          <p className="text-sm text-slate-400">Data compiled from public donations and impact estimates</p>
        </div>
      )}
    </motion.div>
  );
}

export default DonorDetail;