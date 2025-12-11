import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import {
  getCostPerLifeFromCombined,
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForCategoryFromCombined,
  calculateDonorStatsFromCombined,
} from '../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../utils/donationDataHelpers';
import { useAssumptions } from '../contexts/AssumptionsContext';
import SpecificDonationModal from '../components/SpecificDonationModal';
import PageHeader from '../components/shared/PageHeader';

// Import new components
import CalculatorStats from '../components/calculator/CalculatorStats';
import CalculatorForm from '../components/calculator/CalculatorForm';
import RecipientTable from '../components/calculator/RecipientTable';

/* global localStorage */

const DonationCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState({});
  const [specificDonations, setSpecificDonations] = useState([]);
  const [categoryYear, setCategoryYear] = useState(() => {
    // Initialize with saved value or current year
    const savedCategoryYear = localStorage.getItem('categoryYear');
    if (savedCategoryYear) {
      const year = parseInt(savedCategoryYear, 10);
      if (!isNaN(year)) {
        return year;
      }
    }
    return getCurrentYear();
  });
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalLivesSaved, setTotalLivesSaved] = useState(0);
  const [costPerLife, setCostPerLife] = useState(0);
  const [donorRank, setDonorRank] = useState(null);
  const [neighboringDonors, setNeighboringDonors] = useState({
    above: null,
    below: null,
    twoBelow: null,
    twoAbove: null,
  });
  const { combinedAssumptions } = useAssumptions();

  // For specific donation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);

  // Calculate donor rank based on lives saved - now wrapped in useCallback
  const calculateDonorRank = useCallback(
    (lives) => {
      const donorStats = calculateDonorStatsFromCombined(combinedAssumptions);

      // Find where the user would rank
      let rank = 1;
      let donorAbove = null;
      let donorBelow = null;
      let twoBelow = null;
      let twoAbove = null;

      // Donors are sorted by lives saved in descending order
      for (let i = 0; i < donorStats.length; i++) {
        const donor = donorStats[i];

        if (lives <= donor.totalLivesSaved) {
          rank++;
          // This donor would be above the user
          donorAbove = donor;
          // If we're at the bottom, get the donor two positions above
          if (!donorBelow && i > 0) {
            twoAbove = donorStats[i - 1];
          }
        } else {
          // This donor would be below the user
          donorBelow = i < donorStats.length ? donor : null;
          // Get the donor two positions below if we're at the top
          if (rank === 1 && i + 2 < donorStats.length) {
            twoBelow = donorStats[i + 2];
          }
          break;
        }
      }

      setDonorRank(rank);
      setNeighboringDonors({
        above: donorAbove,
        below: donorBelow,
        twoBelow: twoBelow,
        twoAbove: twoAbove,
      });
    },
    [combinedAssumptions]
  );

  // Initialize categories and load saved donation values on component mount
  useEffect(() => {
    const categoriesData = combinedAssumptions.getAllCategories();
    // Sort categories alphabetically by name
    const sortedCategories = [...categoriesData].sort((a, b) => a.name.localeCompare(b.name));
    setCategories(sortedCategories);

    // Initialize donations object with saved values or empty values
    const savedDonations = localStorage.getItem('donationCalculatorValues');
    const parsedDonations = savedDonations ? JSON.parse(savedDonations) : {};

    const initialDonations = {};
    sortedCategories.forEach((category) => {
      initialDonations[category.id] = parsedDonations[category.id] || '';
    });

    setDonations(initialDonations);

    // Load specific donations
    const savedSpecificDonations = localStorage.getItem('specificDonations');
    if (savedSpecificDonations) {
      setSpecificDonations(JSON.parse(savedSpecificDonations));
    }
  }, [combinedAssumptions]);

  // Calculate lives saved when donations, specificDonations, or combinedAssumptions change
  useEffect(() => {
    // Skip calculation if no categories loaded yet
    if (categories.length === 0) return;
    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    // Helper function to calculate cost per life for custom recipients
    const calculateCustomRecipientCostPerLife = (donation, currentYear) => {
      if (!donation.isCustomRecipient || !donation.categoryId) {
        return null;
      }

      const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId, currentYear);

      if (donation.multiplier) {
        return baseCostPerLife * donation.multiplier;
      }

      return baseCostPerLife;
    };

    let totalAmount = 0;
    let totalLives = 0;

    // Calculate for each category
    Object.entries(donations).forEach(([categoryId, amount]) => {
      // Skip empty or invalid inputs
      if (!amount || isNaN(Number(amount))) return;

      const donationAmount = Number(amount);
      totalAmount += donationAmount;

      // Calculate lives saved for this category using combined assumptions
      const yearForCalc = categoryYear === '' || isNaN(categoryYear) ? getCurrentYear() : parseInt(categoryYear, 10);
      const livesSaved = calculateLivesSavedForCategoryFromCombined(
        combinedAssumptions,
        categoryId,
        donationAmount,
        yearForCalc
      );
      totalLives += livesSaved;
    });

    // Add specific donations
    specificDonations.forEach((donation) => {
      totalAmount += donation.amount;

      // Calculate lives saved for each specific donation
      let livesSaved = 0;
      const donationYear = getDonationYear(donation);

      if (donation.isCustomRecipient && donation.categoryId) {
        // For custom recipients, use the helper function
        const costPerLife = calculateCustomRecipientCostPerLife(donation, donationYear);
        livesSaved = donation.amount / costPerLife;
      } else {
        // For existing recipients, find the appropriate recipient ID
        const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);

        if (!recipientId) {
          throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
        }

        // Get actual cost per life for this recipient using combined assumptions
        const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(
          combinedAssumptions,
          recipientId,
          donationYear
        );
        livesSaved = donation.amount / recipientCostPerLife;
      }

      totalLives += livesSaved;
    });

    setTotalDonated(totalAmount);
    setTotalLivesSaved(totalLives);

    // Calculate overall cost per life
    if (totalLives !== 0) {
      setCostPerLife(totalAmount / totalLives);
    } else {
      setCostPerLife(0);
    }

    // Calculate rank
    if (totalLives !== 0) {
      calculateDonorRank(totalLives);
    } else {
      setDonorRank(null);
    }
  }, [donations, specificDonations, combinedAssumptions, categories, calculateDonorRank, categoryYear]);

  // Save donations to localStorage when they change
  useEffect(() => {
    // Skip saving if no categories loaded yet
    if (categories.length === 0) return;

    localStorage.setItem('donationCalculatorValues', JSON.stringify(donations));
  }, [donations, categories]);

  // Save specific donations to localStorage when they change
  useEffect(() => {
    // Skip saving if no categories loaded yet
    if (categories.length === 0) return;

    localStorage.setItem('specificDonations', JSON.stringify(specificDonations));
  }, [specificDonations, categories]);

  // Save category year to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('categoryYear', categoryYear.toString());
  }, [categoryYear]);

  // Handle donation input change
  const handleDonationChange = (categoryId, value) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');

    setDonations((prev) => ({
      ...prev,
      [categoryId]: sanitizedValue,
    }));
  };

  // Reset all donation amounts
  const resetDonations = () => {
    const emptyDonations = {};
    categories.forEach((category) => {
      emptyDonations[category.id] = '';
    });
    setDonations(emptyDonations);
  };

  // Calculate lives saved for a specific category
  const getLivesSavedForCategory = (categoryId, amount, year = categoryYear) => {
    if (!amount || isNaN(Number(amount))) return 0;

    const donationAmount = Number(amount);
    const yearForCalculation = year === '' || isNaN(year) ? getCurrentYear() : parseInt(year, 10);
    return calculateLivesSavedForCategoryFromCombined(
      combinedAssumptions,
      categoryId,
      donationAmount,
      yearForCalculation
    );
  };

  // Open modal to add or edit a specific donation
  const openDonationModal = (donation = null) => {
    setEditingDonation(donation);
    setIsModalOpen(true);
  };

  // Handle saving a specific donation
  const handleSaveSpecificDonation = (donationData) => {
    if (editingDonation) {
      // Update existing donation
      setSpecificDonations((prev) => prev.map((item) => (item.id === donationData.id ? donationData : item)));
    } else {
      // Add new donation
      setSpecificDonations((prev) => [...prev, donationData]);
    }
    setEditingDonation(null);
  };

  // Handle deleting a specific donation
  const handleDeleteSpecificDonation = (id) => {
    setSpecificDonations((prev) => prev.filter((item) => item.id !== id));
  };

  // Helper function to get the year from a specific donation
  const getDonationYear = (donation) => {
    // Specific donations store year in 'date' field as a string
    if (!donation.date) {
      throw new Error(`Donation missing required date field: ${JSON.stringify(donation)}`);
    }
    const year = parseInt(donation.date, 10);
    if (isNaN(year)) {
      throw new Error(`Invalid year format in donation date field: "${donation.date}"`);
    }
    return year;
  };

  // Calculate lives saved for a specific donation
  const calculateLivesSavedForSpecificDonation = (donation) => {
    const donationYear = getDonationYear(donation);
    if (donation.isCustomRecipient && donation.categoryId) {
      // For custom recipients, calculate cost per life with multiplier
      const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId, donationYear);
      const costPerLife = donation.multiplier ? baseCostPerLife * donation.multiplier : baseCostPerLife;
      return donation.amount / costPerLife;
    } else {
      // For existing recipients, find the recipient in our data
      // Find the appropriate recipient ID by matching name
      const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);

      if (!recipientId) {
        throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
      }

      // Get actual cost per life for this recipient using combined assumptions
      const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(
        combinedAssumptions,
        recipientId,
        donationYear
      );
      return donation.amount / recipientCostPerLife;
    }
  };

  // Get cost per life for a specific donation (for display in the table)
  const getCostPerLifeForSpecificDonation = (donation) => {
    const donationYear = getDonationYear(donation);
    // For custom recipients, calculate cost per life with multiplier
    if (donation.isCustomRecipient && donation.categoryId) {
      const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId, donationYear);
      return donation.multiplier ? baseCostPerLife * donation.multiplier : baseCostPerLife;
    } else {
      // For existing recipients, get cost per life using combined assumptions
      const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);
      if (recipientId) {
        return getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, donationYear);
      } else {
        return 0;
      }
    }
  };

  return (
    <>
      <BackButton to="/" label="Back to top donors" />
      <motion.div
        className="min-h-screen bg-slate-50 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <PageHeader
          title="Donation Calculator"
          subtitle="Calculate the impact of your donations and see where you would rank"
        />

        {/* Main Content Container */}
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Impact Summary */}
          <CalculatorStats
            totalDonated={totalDonated}
            totalLivesSaved={totalLivesSaved}
            costPerLife={costPerLife}
            donorRank={donorRank}
            neighboringDonors={neighboringDonors}
          />

          {/* Smaller Spacer */}
          <div className="h-10"></div>

          {/* Instruction text */}
          <p className="text-lg text-slate-700 mb-6 px-2">
            Enter your donation amounts to see your impact based on past or future donations.
          </p>

          {/* Specific Donations - Using the new RecipientTable component */}
          {specificDonations.length > 0 && (
            <RecipientTable
              donations={specificDonations}
              categories={categories}
              combinedAssumptions={combinedAssumptions}
              onAddClick={() => openDonationModal()}
              onEditClick={(donation) => openDonationModal(donation)}
              onDeleteClick={handleDeleteSpecificDonation}
              calculateLivesSaved={calculateLivesSavedForSpecificDonation}
              getCostPerLife={getCostPerLifeForSpecificDonation}
              className="mb-6"
            />
          )}

          {/* Add Specific Donation button - Only show if no donations yet */}
          {specificDonations.length === 0 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => openDonationModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Specific Donation
              </button>
            </div>
          )}

          {/* Category Donations - Using the new CalculatorForm component */}
          <CalculatorForm
            categories={categories}
            donations={donations}
            onDonationChange={handleDonationChange}
            onReset={resetDonations}
            getLivesSavedForCategory={getLivesSavedForCategory}
            getCostPerLifeForCategory={(categoryId) => {
              const yearForCalculation =
                categoryYear === '' || isNaN(categoryYear) ? getCurrentYear() : parseInt(categoryYear, 10);
              return getCostPerLifeFromCombined(combinedAssumptions, categoryId, yearForCalculation);
            }}
            categoryYear={categoryYear}
            onYearChange={setCategoryYear}
          />
        </motion.div>

        {/* Specific Donation Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <SpecificDonationModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingDonation(null);
              }}
              onSave={handleSaveSpecificDonation}
              editingDonation={editingDonation}
              categories={categories}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default DonationCalculator;
