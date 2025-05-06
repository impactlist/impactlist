import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  calculateDonorStats,
  getCostPerLifeForRecipient,
  getPrimaryCategoryId,
  getDefaultCostPerLifeForCategory,
  getActualCostPerLifeForCategoryData,
  getDonorById,
  getCategoryById,
  getRecipientById,
  getDonationsForDonor,
  getRecipientId,
  calculateLivesSavedForDonation
} from '../utils/donationDataHelpers';
import SortableTable from './SortableTable';
import ImpactBarChart, { ImpactChartToggle } from './ImpactBarChart';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';

// Animation speed constant (in milliseconds)
const ANIMATION_DURATION = 600;

function DonorDetail(props) {
  const { donorId } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
  const [rawChartData, setRawChartData] = useState([]); // Store the raw data with both values
  const [chartData, setChartData] = useState([]); // This will change format based on view
  const [chartView, setChartView] = useState('livesSaved'); // 'donations' or 'livesSaved'
  const [shouldAnimate, setShouldAnimate] = useState(false); // Only animate when user toggles view
  const [transitionStage, setTransitionStage] = useState('none'); // 'none', 'shrinking', 'growing'
  const [chartContainerWidth, setChartContainerWidth] = useState(800); // Default to a reasonable width
  const chartContainerRef = useRef(null);
  const { customValues, openModal } = useCostPerLife();
  
  // Calculate chart height based on number of categories (used later)
  const calculateChartHeight = (categories) => {
    // Allocate about 55px per category with a minimum height of 384px (corresponds to ~8-9 categories)
    // Each additional category beyond that adds more height
    return Math.max(384, categories.length * 55);
  };
  
  
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
    const stats = calculateDonorStats(customValues);
    const currentDonor = stats.find(donor => donor.id === donorId);
    setDonorStats(currentDonor);
    
    if (!currentDonor) {
      throw new Error(`Donor with ID "${donorId}" not found. Please check that this donor exists in the database.`);
    }
    
    // Get donor donations and sort by date (most recent first)
    const donorDonationsList = getDonationsForDonor(donorId)
      .map(donation => {
        const recipientId = donation.recipientId;
        const recipient = getRecipientById(recipientId);
        
        // Throw error if recipient doesn't exist in our database
        if (!recipient) {
          throw new Error(`Recipient not found: ${donation.recipient} for donor ${donorId}. This recipient needs to be added to the recipients array.`);
        }
        
        // Normal flow when recipient exists
        const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);
        
        // Get the primary category ID for this recipient
        const primaryCategoryId = getPrimaryCategoryId(recipientId);
        const primaryCategory = getCategoryById(primaryCategoryId) || { name: 'Other' };
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        
        // Calculate lives saved
        const livesSaved = calculateLivesSavedForDonation(donation, customValues);
        
        return {
          ...donation,
          creditedAmount,
          category: primaryCategoryId, // Use primary category ID 
          categoryName: primaryCategory.name, // Get the name from categoriesById
          livesSaved,
          costPerLife,
          dateObj: donation.date ? new Date(donation.date) : new Date(0)
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);
    
    // Find the donor object
    const donorData = getDonorById(donorId);
    
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
        donorId: donorId,
        donor: donorData.name,
        recipientId: 'unknown',
        recipient: 'Unknown',
        amount: unknownAmount,
        category: 'other', // Use 'other' as the primary category ID
        categoryName: 'Unknown', // Use 'Unknown' as the primary category name
        livesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0), // Oldest date to sort at the end
        source: '',
        isUnknown: true
      });
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
      
      // Get the recipient and its categories
      const recipientId = donation.recipientId;
      const recipient = getRecipientById(recipientId);
      if (!recipient) return;
      
      // Process each category this recipient belongs to
      Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
        const fraction = categoryData.fraction;
        const category = getCategoryById(categoryId);
        const categoryName = category.name;
        
        // Get the costPerLife with multiplier properly applied
        const costPerLife = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
        
        // Calculate category-specific amount and lives saved
        const categoryAmount = donation.amount * fraction;
        let livesSavedForCategory;
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? 
          categoryAmount * donation.credit : categoryAmount;
        
        livesSavedForCategory = costPerLife !== 0 ? creditedAmount / costPerLife : 0; // Normal case
        
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
        costPerLife: livesSavedEntry.costPerLife || (category ? 
          getDefaultCostPerLifeForCategory(category, customValues) || 0 : 0),
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
  }, [donorId, customValues]);

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
  }, [rawChartData, customValues]); // Include customValues in dependencies
  
  // Handle the transition between views
  useEffect(() => {
    if (chartData.length === 0 || transitionStage !== 'shrinking') return;
    
    // Create a deep copy of the current data to ensure React detects the change
    // and properly animates between states
    const initialData = chartData.map(item => ({
      ...item,
      // Important: Keep the current value as is (this is what we're animating FROM)
      value: item.valueTarget, 
      // Update the valueTarget to the new view's value (this is what we're animating TO)
      valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
    }));
    
    // Set the data to start the animation
    setChartData(initialData);
    
    // Complete the transition after animation
    const timer = setTimeout(() => {
      setTransitionStage('none');
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(timer);
  }, [transitionStage, chartView, customValues]); // Include customValues in dependencies
  
  // Keep this as a placeholder to avoid changing too much code structure
  // But we'll skip the growing phase by directly setting transitionStage to 'none' above

  
  // Update chart view whenever rawChartData or customValues change
  useEffect(() => {
    if (chartData.length === 0 || !chartView) return;

    // Only rebuild chart data when not in a transition (to avoid interrupting animations)
    if (transitionStage === 'none' && !shouldAnimate) {
      // Completely rebuild chart data from rawChartData
      // This ensures all values (including donationValue and livesSavedValue) are current
      const initialData = rawChartData.map(item => ({
        name: item.name,
        // Set the current value based on the view
        value: chartView === 'donations' ? item.donationValue : item.livesSavedValue, 
        // Set the target value for animations
        valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
        // Copy all raw data fields directly from rawChartData for the most current values
        donationValue: item.donationValue,
        livesSavedValue: item.livesSavedValue,
        category: item.category,
        donationPercentage: item.donationPercentage,
        livesSavedPercentage: item.livesSavedPercentage,
        costPerLife: item.costPerLife,
        hasMultiplier: item.hasMultiplier,
        multiplier: item.multiplier
      }));

      // Sort data consistently (is this needed?)
      const sortedData = [...initialData].sort((a, b) => {
        // Always put "Other Categories" at the bottom
        if (a.name === 'Other Categories') return 1;
        if (b.name === 'Other Categories') return -1;
        return b.donationValue - a.donationValue;
      });
      
      setChartData(sortedData);
    }
  }, [rawChartData, customValues, chartView, transitionStage, shouldAnimate]); // Include all dependencies
  
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
  
  
  // Effect to handle chart container resizing
  useEffect(() => {
    const updateContainerWidth = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        setChartContainerWidth(width);
      }
    };
    
    // Initial update
    updateContainerWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateContainerWidth);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Using imported formatNumber and formatCurrency functions from utils/formatters.js
  
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
      key: 'recipient', 
      label: 'Recipient',
      render: (donation) => (
        <div>
          {donation.isUnknown ? (
            <span className="text-sm text-slate-500">Unknown</span>
          ) : (
            <Link 
              to={`/recipient/${encodeURIComponent(donation.recipientId)}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {donation.recipient}
            </Link>
          )}
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
        
        // Get the recipient to check if it has multiple categories
        const recipientDetails = getRecipientById(donation.recipientId);
        if (!recipientDetails) {
          return (
            <div className="text-sm text-slate-900">
              {donation.categoryName}
            </div>
          );
        }
        
        // Count categories
        const categoryCount = Object.keys(recipientDetails.categories).length;
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
          {donation.livesSaved === 0 ? <span className="text-2xl">∞</span> : formatCurrency(donation.costPerLife)}
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
          <div className="flex justify-end mb-2">
            <div className="flex items-center space-x-3">
              <CustomValuesIndicator />
              <button 
                onClick={openModal}
                className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 bg-white rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Adjust Assumptions
              </button>
            </div>
          </div>
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
              <span className={`text-3xl font-bold ${donorStats.costPerLifeSaved < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {donorStats.livesSaved === 0 ? <span className="text-6xl">∞</span> : formatCurrency(donorStats.costPerLifeSaved)}
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
              <ImpactChartToggle
                chartView={chartView}
                onToggle={(view) => {
                  setShouldAnimate(true);
                  setTransitionStage('shrinking');
                  setChartView(view);
                }}
                disabled={transitionStage !== 'none'}
              />
            </div>
          </div>
          
          <div className={`py-4 px-2 relative ${chartContainerWidth < 500 ? 'overflow-x-auto' : 'overflow-hidden'}`}>
            <div 
              ref={chartContainerRef}
              className="w-full overflow-visible"
              style={{ height: chartData.length > 0 ? `${calculateChartHeight(chartData)}px` : '384px' }}
            >
              {chartData.length > 0 ? (
                <ImpactBarChart 
                  data={chartData}
                  dataKey="valueTarget"
                  nameKey="name"
                  colors={COLORS.map((color, index) => {
                    // Use red for negative values in lives saved view
                    const entry = chartData[index];
                    return (chartView === 'livesSaved' && entry && entry.value < 0) ? '#ef4444' : color;
                  })}
                  tooltipContent={<CustomTooltip />}
                  formatXAxisTick={(value) => {
                    // Create placeholder space during transition
                    if (transitionStage !== 'none') {
                      return chartView === 'donations' ? 
                        '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' : 
                        '\u00A0\u00A0\u00A0\u00A0\u00A0';
                    }
                    
                    if (value === 0) return "0";
                    
                    if (chartView === 'donations') {
                      return formatCurrency(value);
                    } else {
                      // Use formatNumber for lives saved values
                      return formatNumber(Math.round(value));
                    }
                  }}
                  xAxisDomain={(() => {
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
                  labelFormatter={(value, entry) => {
                    if (!entry) return '';
                    
                    const percentage = chartView === 'donations' 
                      ? entry.donationPercentage 
                      : entry.livesSavedPercentage;
                    
                    return chartView === 'donations'
                      ? `${formatCurrency(entry.donationValue)} (${percentage}%)`
                      : `${formatNumber(Math.round(entry.livesSavedValue))} (${percentage}%)`;
                  }}
                  barCategoryGap={chartData.length > 10 ? 4 : chartData.length > 6 ? 8 : 16}
                  heightCalculator={(dataLength) => Math.max(384, dataLength * 55)}
                  isAnimationActive={true}
                  animationDuration={ANIMATION_DURATION}
                  animationBegin={0}
                  animationEasing="ease-in-out"
                  showLegend={true}
                  legendFormatter={() => chartView === 'donations' ? 'Donation Amount (By Category)' : 'Lives Saved (By Category)'}
                />
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