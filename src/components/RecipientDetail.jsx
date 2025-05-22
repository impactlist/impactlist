import { useParams } from 'react-router-dom';
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
  calculateLivesSavedForDonation,
} from '../utils/donationDataHelpers';
import { ImpactChartToggle } from './ImpactBarChart';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import EntityStatistics from './entity/EntityStatistics';
import EntityChartSection from './entity/EntityChartSection';
import EntityDonationTable from './entity/EntityDonationTable';
import { CHART_ANIMATION_DURATION } from '../utils/constants';

const RecipientDetail = () => {
  const { recipientId } = useParams();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recipientDonations, setRecipientDonations] = useState([]);
  const [rawChartData, setRawChartData] = useState([]); // Store the raw data with both values
  const [chartData, setChartData] = useState([]); // This will change format based on view
  const [chartView, setChartView] = useState('livesSaved'); // 'donations' or 'livesSaved'
  const [shouldAnimate, setShouldAnimate] = useState(false); // Only animate when user toggles view
  const [transitionStage, setTransitionStage] = useState('none'); // 'none', 'shrinking', 'growing'
  const [, setChartContainerWidth] = useState(800); // Default to a reasonable width
  const chartContainerRef = useRef(null);
  const { customValues, openModal } = useCostPerLife();

  // Calculate chart height based on number of categories (used later)
  const calculateChartHeight = (categories) => {
    // Allocate about 55px per category with a minimum height of 384px (corresponds to ~8-9 categories)
    // Each additional category beyond that adds more height
    return Math.max(384, categories.length * 55);
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
    const categoryBreakdown = getCategoryBreakdown(recipientId).map((category) => {
      const categoryInfo = getCategoryById(category.categoryId);
      if (!categoryInfo) {
        throw new Error(`Invalid category ID: ${category.categoryId}. This category does not exist.`);
      }
      return {
        ...category,
        id: category.categoryId,
        name: categoryInfo.name,
        percentage: Math.round(category.fraction * 100),
      };
    });

    // Filter donations for this recipient
    const recipientDonationsList = getDonationsForRecipient(recipientId)
      .map((donation) => {
        // Calculate lives saved for this donation
        const totalLivesSaved = calculateLivesSavedForDonation(donation, customValues);

        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;

        return {
          ...donation,
          creditedAmount,
          totalLivesSaved,
          dateObj: donation.date,
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);

    // Calculate total received
    const totalReceived = recipientDonationsList.reduce((sum, donation) => sum + donation.creditedAmount, 0);
    const totalLivesSaved = recipientDonationsList.reduce((sum, donation) => sum + donation.totalLivesSaved, 0);

    // Prepare data for the two chart views
    // Create donations by category data
    const categoryDonations = {};
    const categoryLivesSaved = {};
    let chartDonationsTotal = 0;
    let chartLivesSavedTotal = 0;

    recipientDonationsList.forEach((donation) => {
      // Process each category this donation belongs to
      Object.entries(recipient.categories || { other: { fraction: 1 } }).forEach(([categoryId, categoryData]) => {
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
            categoryId: categoryId,
          };
        }

        if (!categoryLivesSaved[categoryName]) {
          categoryLivesSaved[categoryName] = {
            name: categoryName,
            value: 0,
            categoryId: categoryId,
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
    const allCategoryNames = new Set([...Object.keys(categoryDonations), ...Object.keys(categoryLivesSaved)]);

    // Create a unified dataset with both values
    let unifiedData = Array.from(allCategoryNames).map((name) => {
      const donationEntry = categoryDonations[name] || {
        name,
        value: 0,
        categoryId: categoryLivesSaved[name]?.categoryId,
      };
      const livesSavedEntry = categoryLivesSaved[name] || {
        name,
        value: 0,
        categoryId: categoryDonations[name]?.categoryId,
      };
      const categoryId = donationEntry.categoryId || livesSavedEntry.categoryId;

      return {
        name,
        donationValue: donationEntry.value,
        livesSavedValue: livesSavedEntry.value,
        categoryId,
        donationPercentage:
          chartDonationsTotal > 0 ? ((donationEntry.value / chartDonationsTotal) * 100).toFixed(1) : '0.0',
        livesSavedPercentage:
          chartLivesSavedTotal !== 0
            ? ((Math.abs(livesSavedEntry.value) / Math.abs(chartLivesSavedTotal)) * 100).toFixed(1)
            : '0.0',
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
      totalLivesSaved,
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
    const initialChartData = sortedData.map((item) => ({
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
    const initialData = chartData.map((item) => ({
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
    }, CHART_ANIMATION_DURATION);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionStage, chartView, customValues]); // Include customValues in dependencies

  // Initialize chart view on rawChartData load
  useEffect(() => {
    if (rawChartData.length === 0 || !chartView) return;

    // Only rebuild chart data when not in a transition (to avoid interrupting animations)
    if (transitionStage === 'none' && !shouldAnimate) {
      // Completely rebuild chart data from rawChartData
      const initialData = rawChartData.map((item) => ({
        name: item.name,
        // Copy all properties from rawChartData
        donationValue: item.donationValue,
        livesSavedValue: item.livesSavedValue,
        categoryId: item.categoryId,
        donationPercentage: item.donationPercentage,
        livesSavedPercentage: item.livesSavedPercentage,
        // Set current value and target based on view
        value: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
        valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
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
      }, CHART_ANIMATION_DURATION + 50); // Add a small buffer

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

  const handleChartViewChange = (view) => {
    setShouldAnimate(true);
    setTransitionStage('shrinking');
    setChartView(view);
  };

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
      <BackButton />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Recipient name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{recipientInfo.name}</h1>

        {/* Recipient stats card */}
        <EntityStatistics
          stats={{
            totalLivesSaved: recipientInfo.totalLivesSaved,
            costPerLife: recipientInfo.costPerLife,
            categoryCostPerLife: recipientInfo.categoryCostPerLife,
            totalReceived: recipientInfo.totalReceived,
            categoryBreakdown: recipientInfo.categoryBreakdown,
          }}
          entityType="recipient"
          customValuesIndicator={<CustomValuesIndicator />}
          onAdjustAssumptions={openModal}
        />

        {/* Focus Areas chart with toggle */}
        {recipientInfo.categoryBreakdown.length > 1 && (
          <EntityChartSection
            chartData={chartData}
            chartView={chartView}
            onViewChange={handleChartViewChange}
            isTransitioning={transitionStage !== 'none'}
            toggleComponent={
              <ImpactChartToggle
                chartView={chartView}
                onToggle={handleChartViewChange}
                disabled={transitionStage !== 'none'}
              />
            }
            entityType="recipient"
            containerHeight={calculateChartHeight(chartData)}
          />
        )}

        {/* Donations list */}
        <EntityDonationTable donations={recipientDonations} entityType="recipient" />
      </motion.div>
    </motion.div>
  );
};

export default RecipientDetail;
