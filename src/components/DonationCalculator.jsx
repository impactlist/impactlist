import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from './BackButton';
import { getAllCategories } from '../utils/donationDataHelpers';
import {
  getCostPerLifeFromCombined,
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForCategoryFromCombined,
} from '../utils/combinedAssumptions';
import { recipientsById } from '../data/generatedData';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import SpecificDonationModal from './SpecificDonationModal';
import PageHeader from './PageHeader';
import AdjustAssumptionsButton from './AdjustAssumptionsButton';

// Import new components
import CalculatorStats from './calculator/CalculatorStats';
import CalculatorForm from './calculator/CalculatorForm';
import RecipientTable from './calculator/RecipientTable';

/* global localStorage */

const DonationCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState({});
  const [specificDonations, setSpecificDonations] = useState([]);
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
  const { combinedAssumptions, openModal } = useCostPerLife();

  // For specific donation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);

  // Calculate donor rank based on lives saved - now wrapped in useCallback
  const calculateDonorRank = useCallback((lives) => {
    // This would use actual donor data, for now it's a placeholder
    // Ideally, it would compare the lives saved against all donors' lives saved
    // and determine where this user would rank

    // Sample implementation:
    import('./SortableTable')
      .then(() => {
        import('../utils/donationDataHelpers').then(({ calculateDonorStats }) => {
          const donorStats = calculateDonorStats();

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
        });
      })
      .catch((error) => {
        console.error('Error calculating donor rank:', error);
        setDonorRank(null);
        setNeighboringDonors({ above: null, below: null, twoBelow: null, twoAbove: null });
      });
  }, []);

  // Initialize categories and load saved donation values on component mount
  useEffect(() => {
    const categoriesData = getAllCategories();
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
  }, []);

  // Calculate lives saved when donations, specificDonations, or combinedAssumptions change
  useEffect(() => {
    // Skip calculation if no categories loaded yet
    if (categories.length === 0) return;
    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    let totalAmount = 0;
    let totalLives = 0;

    // Calculate for each category
    Object.entries(donations).forEach(([categoryId, amount]) => {
      // Skip empty or invalid inputs
      if (!amount || isNaN(Number(amount))) return;

      const donationAmount = Number(amount);
      totalAmount += donationAmount;

      // Calculate lives saved for this category using combined assumptions
      const livesSaved = calculateLivesSavedForCategoryFromCombined(combinedAssumptions, categoryId, donationAmount);
      totalLives += livesSaved;
    });

    // Add specific donations
    specificDonations.forEach((donation) => {
      totalAmount += donation.amount;

      // Calculate lives saved for each specific donation
      let livesSaved = 0;

      if (donation.isCustomRecipient && donation.categoryId) {
        // For custom recipients, calculate based on the category and any overrides
        let costPerLife;

        if (donation.costPerLife) {
          // Use directly provided cost per life
          costPerLife = donation.costPerLife;
        } else if (donation.multiplier) {
          // Apply multiplier to the category's cost per life
          const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
          costPerLife = baseCostPerLife / donation.multiplier;
        } else {
          // Use category default
          costPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
        }

        livesSaved = donation.amount / costPerLife;
      } else {
        // For existing recipients, find the appropriate recipient ID
        const recipientId = Object.keys(recipientsById).find(
          (id) => recipientsById[id].name === donation.recipientName
        );

        if (!recipientId) {
          throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
        }

        // Get actual cost per life for this recipient using combined assumptions
        const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId);
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
  }, [donations, specificDonations, combinedAssumptions, categories, calculateDonorRank]);

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
  const getLivesSavedForCategory = (categoryId, amount) => {
    if (!amount || isNaN(Number(amount))) return 0;

    const donationAmount = Number(amount);
    return calculateLivesSavedForCategoryFromCombined(combinedAssumptions, categoryId, donationAmount);
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

  // Calculate lives saved for a specific donation
  const calculateLivesSavedForSpecificDonation = (donation) => {
    if (donation.isCustomRecipient && donation.categoryId) {
      // For custom recipients, calculate based on the category and any overrides
      let costPerLife;

      if (donation.costPerLife) {
        // Use directly provided cost per life
        costPerLife = donation.costPerLife;
      } else if (donation.multiplier) {
        // Apply multiplier to the category's cost per life
        const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
        costPerLife = baseCostPerLife / donation.multiplier;
      } else {
        // Use category default
        costPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
      }

      return donation.amount / costPerLife;
    } else {
      // For existing recipients, find the recipient in our data
      // Find the appropriate recipient ID by matching name
      const recipientId = Object.keys(recipientsById).find((id) => recipientsById[id].name === donation.recipientName);

      if (!recipientId) {
        throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
      }

      // Get actual cost per life for this recipient using combined assumptions
      const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId);
      return donation.amount / recipientCostPerLife;
    }
  };

  // Get cost per life for a specific donation (for display in the table)
  const getCostPerLifeForSpecificDonation = (donation) => {
    // For custom recipients, we need to handle multiplier and costPerLife overrides
    if (donation.isCustomRecipient && donation.categoryId) {
      if (donation.costPerLife) {
        return donation.costPerLife;
      } else if (donation.multiplier) {
        const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
        return baseCostPerLife / donation.multiplier;
      } else {
        return getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId);
      }
    } else {
      // For existing recipients, get cost per life using combined assumptions
      const recipientId = Object.keys(recipientsById).find((id) => recipientsById[id].name === donation.recipientName);
      if (recipientId) {
        return getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId);
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
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center space-x-3">
              <CustomValuesIndicator />
              <AdjustAssumptionsButton onClick={openModal} />
            </div>
          </div>

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
              recipientsById={recipientsById}
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
            getCostPerLifeForCategory={(categoryId) => getCostPerLifeFromCombined(combinedAssumptions, categoryId)}
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
