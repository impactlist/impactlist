import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import { 
  getCostPerLifeForRecipient, 
  getPrimaryCategoryId,
  getCategoryBreakdown,
  getDefaultCostPerLifeForCategory,
  getActualCostPerLifeForCategoryData,
  getRecipientById,
  getDonationsForRecipient,
  getCategoryById,
  calculateLivesSavedForDonation
} from '../utils/donationDataHelpers';
import SortableTable from './SortableTable';
import ImpactBarChart, { ImpactChartToggle } from './ImpactBarChart';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';

// Animation speed constant (in milliseconds)
const ANIMATION_DURATION = 600;

const RecipientDetail = (props) => {
  const { recipientId } = useParams();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recipientDonations, setRecipientDonations] = useState([]);
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
  
  // Colors for the chart bars
  const COLORS = [
    '#4f46e5', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#818cf8',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#22c55e', '#84cc16', '#34d399',
    '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a3e635', '#fbbf24', '#fb923c',
    '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#3f3f46'
  ];

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && recipientInfo) {
      const data = payload[0];
      if (!data || !data.payload) return null;
      
      const entry = data.payload;
      const value = entry.valueTarget; // Current displayed value
      const percentage = chartView === 'donations' ? entry.donationPercentage : entry.livesSavedPercentage;
      const categoryId = entry.categoryId || entry.id;
      
      // Get category-specific cost per life
      const recipient = getRecipientById(recipientId);
      const categoryData = recipient?.categories[categoryId];
      let costPerLife;
      
      if (categoryData) {
        // Use our helper function to calculate the cost per life
        costPerLife = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
      }
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="font-semibold text-sm">{entry.name}</p>
          {chartView === 'donations' ? (
            <>
              <p className="text-sm">{formatCurrency(value)}</p>
              <p className="text-xs text-slate-500">
                {`${percentage}% of total donations`}
              </p>
              <div className="mt-1 pt-1 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Cost per life: {formatCurrency(costPerLife || 0)}
                </p>
                <p className="text-xs text-slate-600">
                  Lives saved: {formatNumber(Math.round(entry.livesSavedValue))}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className={`text-sm ${value < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(value))} lives {value < 0 ? 'lost' : 'saved'}
              </p>
              <p className="text-xs text-slate-500">
                {`${percentage}% of total impact`}
              </p>
              <div className="mt-1 pt-1 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Cost per life: {formatCurrency(costPerLife || 0)}
                </p>
                <p className="text-xs text-slate-600">
                  Donation amount: {formatCurrency(entry.donationValue)}
                </p>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    // Get recipient info
    const recipient = getRecipientById(recipientId);
    
    if (!recipient) {
      throw new Error(`Invalid recipient ID: ${recipientId}. This recipient does not exist.`);
    }
    
    const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);
    
    // Get primary category and category breakdown
    const primaryCategoryId = getPrimaryCategoryId(recipientId);
    const primaryCategory = getCategoryById(primaryCategoryId) || { name: 'Other' };
    const primaryCategoryName = primaryCategory.name;
    
    // Get cost per life for the primary category
    const categoryCostPerLife = getDefaultCostPerLifeForCategory(primaryCategoryId, customValues);
    
    // Get formatted breakdown for bar chart with required properties
    const categoryBreakdown = getCategoryBreakdown(recipientId).map(category => {
      const categoryInfo = getCategoryById(category.categoryId);
      if (!categoryInfo) {
        throw new Error(`Invalid category ID: ${category.categoryId}. This category does not exist.`);
      }
      return {
        ...category,
        id: category.categoryId,
        name: categoryInfo.name,
        percentage: Math.round(category.fraction * 100)
      };
    });
    
    // Filter donations for this recipient
    const recipientDonationsList = getDonationsForRecipient(recipientId)
      .map(donation => {
        // Calculate lives saved for this donation
        const livesSaved = calculateLivesSavedForDonation(donation, customValues);
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        
        return {
          ...donation,
          creditedAmount,
          livesSaved,
          dateObj: donation.date
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);
    
    // Calculate total received
    const totalReceived = recipientDonationsList.reduce((sum, donation) => sum + donation.creditedAmount, 0);
    const totalLivesSaved = recipientDonationsList.reduce((sum, donation) => sum + donation.livesSaved, 0);
    
    // Prepare data for the two chart views
    // Create donations by category data
    const categoryDonations = {};
    const categoryLivesSaved = {};
    let chartDonationsTotal = 0;
    let chartLivesSavedTotal = 0;
    
    recipientDonationsList.forEach(donation => {
      // Process each category this donation belongs to
      Object.entries(recipient.categories || { 'other': { fraction: 1 }}).forEach(([categoryId, categoryData]) => {
        const fraction = categoryData.fraction || 1;
        const category = getCategoryById(categoryId);
        if (!category) {
          throw new Error(`Invalid category ID: ${categoryId}. This category does not exist.`);
        }
        const categoryName = category.name;
        
        // Get category-specific cost per life
        const catCostPerLife = getActualCostPerLifeForCategoryData(recipientId, categoryId, categoryData, customValues);
        
        // Calculate donation amount and lives saved for this category
        const categoryAmount = donation.creditedAmount * fraction;
        const livesSaved = catCostPerLife !== 0 ? categoryAmount / catCostPerLife : 0;
        
        // Initialize category objects if they don't exist
        if (!categoryDonations[categoryName]) {
          categoryDonations[categoryName] = {
            name: categoryName,
            value: 0,
            categoryId: categoryId
          };
        }
        
        if (!categoryLivesSaved[categoryName]) {
          categoryLivesSaved[categoryName] = {
            name: categoryName,
            value: 0,
            categoryId: categoryId
          };
        }
        
        // Sum donation amounts
        categoryDonations[categoryName].value += categoryAmount;
        chartDonationsTotal += categoryAmount;
        
        // Sum lives saved
        categoryLivesSaved[categoryName].value += livesSaved;
        chartLivesSavedTotal += livesSaved;
      });
    });
    
    // Get the complete set of category names from both datasets
    const allCategoryNames = new Set([
      ...Object.keys(categoryDonations),
      ...Object.keys(categoryLivesSaved)
    ]);
    
    // Create a unified dataset with both values
    let unifiedData = Array.from(allCategoryNames).map(name => {
      const donationEntry = categoryDonations[name] || { name, value: 0, categoryId: categoryLivesSaved[name]?.categoryId };
      const livesSavedEntry = categoryLivesSaved[name] || { name, value: 0, categoryId: categoryDonations[name]?.categoryId };
      const categoryId = donationEntry.categoryId || livesSavedEntry.categoryId;
      
      return {
        name,
        donationValue: donationEntry.value,
        livesSavedValue: livesSavedEntry.value,
        categoryId,
        donationPercentage: chartDonationsTotal > 0 ? (donationEntry.value / chartDonationsTotal * 100).toFixed(1) : '0.0',
        livesSavedPercentage: chartLivesSavedTotal !== 0 ? 
          (Math.abs(livesSavedEntry.value) / Math.abs(chartLivesSavedTotal) * 100).toFixed(1) : '0.0'
      };
    });
    
    // Sort by donation amount (largest first)
    unifiedData.sort((a, b) => b.donationValue - a.donationValue);
    
    // Prepare chart data
    setRawChartData(unifiedData);
    
    setRecipientInfo({
      name: recipient.name,
      categoryId: primaryCategoryId,
      categoryName: primaryCategoryName,
      categoryBreakdown,
      costPerLife,
      categoryCostPerLife,
      totalReceived,
      totalLivesSaved
    });
    
    setRecipientDonations(recipientDonationsList);
  }, [recipientId, customValues]);

  // Prepare the initial sorted data once
  useEffect(() => {
    if (rawChartData.length === 0) return;
    
    // Sort the raw data by donation amount (largest first) for consistent positioning
    const sortedData = [...rawChartData].sort((a, b) => {
      return b.donationValue - a.donationValue;
    });
    
    // Initialize with lives saved values to match the default view
    const initialChartData = sortedData.map(item => ({
      ...item,
      value: item.livesSavedValue, // Start with lives saved values to match default view
      valueTarget: item.livesSavedValue, // Target is initially the same
    }));
    
    setChartData(initialChartData);
  }, [rawChartData]);

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

  // Initialize chart view on rawChartData load
  useEffect(() => {
    if (rawChartData.length === 0 || !chartView) return;
    
    // Only rebuild chart data when not in a transition (to avoid interrupting animations)
    if (transitionStage === 'none' && !shouldAnimate) {
      // Completely rebuild chart data from rawChartData
      const initialData = rawChartData.map(item => ({
        name: item.name,
        // Copy all properties from rawChartData
        donationValue: item.donationValue,
        livesSavedValue: item.livesSavedValue,
        categoryId: item.categoryId,
        donationPercentage: item.donationPercentage,
        livesSavedPercentage: item.livesSavedPercentage,
        // Set current value and target based on view
        value: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
        valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue
      }));
      
      // Sort the data consistently (similar to what you do elsewhere)
      const sortedData = [...initialData].sort((a, b) => {
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
  
  // Donation table columns configuration
  const donationColumns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-slate-900">
          {new Date(donation.date).toLocaleDateString('en-US', {
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
        <div>
          <a 
            href={donation.source} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {formatCurrency(donation.creditedAmount || donation.amount)}
          </a>
          {donation.credit < 1 && (
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(donation.credit * 100)}% credit
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'donor', 
      label: 'Donor',
      render: (donation) => (
        <div>
          <Link 
            to={`/donor/${encodeURIComponent(donation.donorId)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {donation.donor}
          </Link>
        </div>
      )
    },
    { 
      key: 'livesSaved', 
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(donation.livesSaved))}
        </div>
      )
    }
  ];

  if (!recipientInfo) {
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
              <BackButton 
                className="text-indigo-100 hover:text-white" 
                containerProps={{ className: "flex justify-start" }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Back button when using App layout */}
      {props.hideHeader && <BackButton />}

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Recipient name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{recipientInfo.name}</h1>
        
        {/* Recipient stats card */}
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
          <div className={`grid grid-cols-1 ${recipientInfo.categoryBreakdown.length === 1 ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
            {/* Total Lives Saved - Always first */}
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Lives Saved</span>
              <span className={`text-3xl font-bold ${recipientInfo.totalLivesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(recipientInfo.totalLivesSaved))}
              </span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className={`text-3xl font-bold ${recipientInfo.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {recipientInfo.costPerLife === 0 ? <span className="text-6xl">∞</span> : formatCurrency(recipientInfo.costPerLife)}
              </span>
              <span className="text-sm mt-2 text-slate-500">
                Category avg: {recipientInfo.categoryCostPerLife === 0 ? <span className="text-xl">∞</span> : formatCurrency(recipientInfo.categoryCostPerLife)}
              </span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Received</span>
              <span className="text-3xl font-bold text-slate-900">{formatCurrency(recipientInfo.totalReceived)}</span>
            </div>
            
            {/* Focus Area - Always last (when shown) */}
            {recipientInfo.categoryBreakdown.length === 1 && (
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 uppercase font-semibold">Focus Area</span>
                <span className="text-3xl font-bold text-slate-900">
                  {recipientInfo.categoryBreakdown[0].name}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Focus Areas chart with toggle */}
        {recipientInfo.categoryBreakdown.length > 1 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg mb-8 border border-slate-200"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Focus Areas by {chartView === 'donations' ? 'Donation Amount' : 'Lives Saved'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {chartView === 'donations' 
                      ? 'Distribution of donations across focus areas'
                      : 'Distribution of impact (lives saved) across focus areas'}
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
        )}

        {/* Donations list */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg mb-16 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Donation History</h2>
          </div>
          <div className="overflow-x-auto">
            <SortableTable 
              columns={donationColumns}
              data={recipientDonations}
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

export default RecipientDetail;