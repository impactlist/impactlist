import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
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
  calculateLivesSavedForDonation,
} from '../utils/donationDataHelpers';
import { ImpactChartToggle } from './ImpactBarChart';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import EntityStatistics from './entity/EntityStatistics';
import EntityChartSection from './entity/EntityChartSection';
import EntityDonationTable from './entity/EntityDonationTable';
import MarkdownContent from './MarkdownContent';
import { CHART_ANIMATION_DURATION } from '../utils/constants';

const DonorDetail = () => {
  const { donorId } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorContent, setDonorContent] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
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
    // Get full donor statistics
    const stats = calculateDonorStats(customValues);
    const currentDonor = stats.find((donor) => donor.id === donorId);
    setDonorStats(currentDonor);

    if (!currentDonor) {
      throw new Error(`Donor with ID "${donorId}" not found. Please check that this donor exists in the database.`);
    }

    // Get donor donations and sort by date (most recent first)
    const donorDonationsList = getDonationsForDonor(donorId)
      .map((donation) => {
        const recipientId = donation.recipientId;
        const recipient = getRecipientById(recipientId);

        // Throw error if recipient doesn't exist in our database
        if (!recipient) {
          throw new Error(
            `Recipient not found: ${donation.recipient} for donor ${donorId}. This recipient needs to be added to the recipients array.`
          );
        }

        // Normal flow when recipient exists
        const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);

        // Get the primary category ID for this recipient
        const primaryCategoryId = getPrimaryCategoryId(recipientId);
        const primaryCategory = getCategoryById(primaryCategoryId) || { name: 'Other' };

        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;

        // Calculate lives saved
        const totalLivesSaved = calculateLivesSavedForDonation(donation, customValues);

        return {
          ...donation,
          creditedAmount,
          categoryId: primaryCategoryId, // Use primary category ID
          categoryName: primaryCategory.name, // Get the name from categoriesById
          totalLivesSaved,
          costPerLife,
          dateObj: donation.date ? new Date(donation.date) : new Date(0),
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);

    // Find the donor object
    const donorData = getDonorById(donorId);

    // Store donor content for rendering
    setDonorContent(donorData?.content);

    // Keep track of the sum of known donations for reference
    const knownDonationsTotal = donorDonationsList.reduce((total, donation) => total + donation.amount, 0);

    // If donor has totalDonated field and it's greater than the sum of known donations
    if (donorData?.totalDonated && donorData.totalDonated > knownDonationsTotal) {
      // Calculate the unknown amount
      const unknownAmount = donorData.totalDonated - knownDonationsTotal;

      // Calculate the average cost per life for all known donations
      const totalLivesSaved = donorDonationsList.reduce((total, donation) => total + donation.totalLivesSaved, 0);

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
        categoryId: 'other', // Use 'other' as the primary category ID
        categoryName: 'Unknown', // Use 'Unknown' as the primary category name
        totalLivesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0), // Oldest date to sort at the end
        source: '',
        isUnknown: true,
      });
    }

    // Enhance donations with categoryCount for display
    const donationsWithCategoryCount = donorDonationsList.map((donation) => {
      if (donation.isUnknown) return donation;

      const recipient = getRecipientById(donation.recipientId);
      const categoryCount = recipient ? Object.keys(recipient.categories).length : 1;

      return {
        ...donation,
        categoryCount,
      };
    });

    setDonorDonations(donationsWithCategoryCount);

    // Prepare category data for both donation amounts and lives saved
    // Group donations by category, accounting for category fractions
    const categoryAmounts = {};
    const categoryLivesSaved = {};
    let chartDonationsTotal = 0;
    let chartLivesSavedTotal = 0;

    donorDonationsList.forEach((donation) => {
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
        const categoryAmount = donation.creditedAmount * fraction;
        let livesSavedForCategory;

        // Calculate lives saved directly from the credited amount
        livesSavedForCategory = costPerLife !== 0 ? categoryAmount / costPerLife : 0; // Normal case

        // Initialize category objects if they don't exist
        if (!categoryAmounts[categoryName]) {
          categoryAmounts[categoryName] = {
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
            costPerLife: costPerLife,
            // Store multiplier info for the tooltip
            hasMultiplier: categoryData.multiplier !== undefined,
            multiplier: categoryData.multiplier,
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
    const allCategoryNames = new Set([...Object.keys(categoryAmounts), ...Object.keys(categoryLivesSaved)]);

    // Create a unified dataset with both values
    let unifiedData = Array.from(allCategoryNames).map((name) => {
      const donationEntry = categoryAmounts[name] || {
        name,
        value: 0,
        categoryId: categoryLivesSaved[name]?.categoryId,
      };
      const livesSavedEntry = categoryLivesSaved[name] || {
        name,
        value: 0,
        categoryId: categoryAmounts[name]?.categoryId,
      };
      const categoryId = donationEntry.categoryId || livesSavedEntry.categoryId;

      return {
        name,
        donationValue: donationEntry.value,
        livesSavedValue: livesSavedEntry.value,
        categoryId,
        donationPercentage: ((donationEntry.value / chartDonationsTotal) * 100).toFixed(1),
        livesSavedPercentage:
          chartLivesSavedTotal !== 0
            ? ((Math.abs(livesSavedEntry.value) / Math.abs(chartLivesSavedTotal)) * 100).toFixed(1)
            : 0,
        costPerLife:
          livesSavedEntry.costPerLife ||
          (categoryId ? getDefaultCostPerLifeForCategory(categoryId, customValues) || 0 : 0),
        hasMultiplier: livesSavedEntry.hasMultiplier,
        multiplier: livesSavedEntry.multiplier,
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

      const otherDonationPercentage = ((otherDonationTotal / chartDonationsTotal) * 100).toFixed(1);
      const otherLivesSavedPercentage =
        chartLivesSavedTotal !== 0
          ? ((Math.abs(otherLivesSavedTotal) / Math.abs(chartLivesSavedTotal)) * 100).toFixed(1)
          : 0;

      // Add "Other" category
      if (otherDonationTotal > 0 || otherLivesSavedTotal !== 0) {
        topCategories.push({
          name: 'Other Categories',
          donationValue: otherDonationTotal,
          livesSavedValue: otherLivesSavedTotal,
          donationPercentage: otherDonationPercentage,
          livesSavedPercentage: otherLivesSavedPercentage,
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
    const initialChartData = sortedData.map((item) => ({
      name: item.name,
      value: item.livesSavedValue, // Start with lives saved values to match default view
      valueTarget: item.livesSavedValue, // Target is initially the same
      donationValue: item.donationValue,
      livesSavedValue: item.livesSavedValue,
      categoryId: item.categoryId,
      donationPercentage: item.donationPercentage,
      livesSavedPercentage: item.livesSavedPercentage,
      costPerLife: item.costPerLife,
      hasMultiplier: item.hasMultiplier,
      multiplier: item.multiplier,
    }));

    setChartData(initialChartData);
  }, [rawChartData, customValues]); // Include customValues in dependencies

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

  // Update chart view whenever rawChartData or customValues change
  useEffect(() => {
    if (chartData.length === 0 || !chartView) return;

    // Only rebuild chart data when not in a transition (to avoid interrupting animations)
    if (transitionStage === 'none' && !shouldAnimate) {
      // Completely rebuild chart data from rawChartData
      // This ensures all values (including donationValue and livesSavedValue) are current
      const initialData = rawChartData.map((item) => ({
        name: item.name,
        // Set the current value based on the view
        value: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
        // Set the target value for animations
        valueTarget: chartView === 'donations' ? item.donationValue : item.livesSavedValue,
        // Copy all raw data fields directly from rawChartData for the most current values
        donationValue: item.donationValue,
        livesSavedValue: item.livesSavedValue,
        categoryId: item.categoryId,
        donationPercentage: item.donationPercentage,
        livesSavedPercentage: item.livesSavedPercentage,
        costPerLife: item.costPerLife,
        hasMultiplier: item.hasMultiplier,
        multiplier: item.multiplier,
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
  }, [rawChartData, customValues, chartView, transitionStage, shouldAnimate, chartData.length]); // Include all dependencies

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
      <BackButton />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Donor name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{donorStats.name}</h1>

        {/* Donor stats card */}
        <EntityStatistics
          stats={donorStats}
          entityType="donor"
          customValuesIndicator={<CustomValuesIndicator />}
          onAdjustAssumptions={openModal}
        />

        {/* Donation categories visualization */}
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
          entityType="donor"
          containerHeight={calculateChartHeight(chartData)}
          customValues={customValues}
        />

        {/* Donor markdown content */}
        <MarkdownContent content={donorContent} className="mt-8 mb-8" />

        {/* Donations list */}
        <EntityDonationTable donations={donorDonations} entityType="donor" customValues={customValues} />
      </motion.div>
    </motion.div>
  );
};

export default DonorDetail;
