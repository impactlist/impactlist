import React, { useState, useEffect, useMemo } from 'react';
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
import { useNotificationActions } from '../contexts/NotificationContext';
import SpecificDonationModal from '../components/SpecificDonationModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import PageHeader from '../components/shared/PageHeader';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';

// Import new components
import CalculatorStats from '../components/calculator/CalculatorStats';
import CalculatorForm from '../components/calculator/CalculatorForm';
import RecipientTable from '../components/calculator/RecipientTable';
import useDocumentTitle from '../hooks/useDocumentTitle';

/* global localStorage */

// A corrupted stored value would otherwise crash the calculator on every
// visit (refreshing can't fix persisted storage): discard it loudly and start
// fresh instead. The caller notifies the user (notifying can't happen here —
// this runs during the first render).
const readStoredJson = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return { value: null, corrupted: false };
  try {
    return { value: JSON.parse(raw), corrupted: false };
  } catch (error) {
    console.error(`Discarding corrupted localStorage value for "${key}"`, error);
    localStorage.removeItem(key);
    return { value: null, corrupted: true };
  }
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

const getCustomRecipientCostPerLife = (combinedAssumptions, donation, donationYear) => {
  if (!donation?.isCustomRecipient || !donation.categoryId) {
    return null;
  }

  if (donation.customCostPerLife !== undefined && donation.customCostPerLife !== null) {
    return Number(donation.customCostPerLife);
  }

  const baseCostPerLife = getCostPerLifeFromCombined(combinedAssumptions, donation.categoryId, donationYear);
  if (donation.multiplier) {
    return baseCostPerLife * donation.multiplier;
  }

  return baseCostPerLife;
};

const livesSavedForSpecificDonation = (combinedAssumptions, donation) => {
  const donationYear = getDonationYear(donation);
  if (donation.isCustomRecipient && donation.categoryId) {
    const costPerLife = getCustomRecipientCostPerLife(combinedAssumptions, donation, donationYear);
    return donation.amount / costPerLife;
  }

  // For existing recipients, find the appropriate recipient ID by name
  const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);
  if (!recipientId) {
    throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
  }

  const recipientCostPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, donationYear);
  return donation.amount / recipientCostPerLife;
};

// Where the user would rank among real donors for a given lives-saved total.
// donorStats is sorted by lives saved, descending.
const findDonorRank = (donorStats, lives) => {
  let rank = 1;
  let donorAbove = null;
  let donorBelow = null;
  let twoBelow = null;
  let twoAbove = null;

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
      donorBelow = donor;
      // Get the donor two positions below if we're at the top
      if (rank === 1 && i + 2 < donorStats.length) {
        twoBelow = donorStats[i + 2];
      }
      break;
    }
  }

  return { rank, neighbors: { above: donorAbove, below: donorBelow, twoBelow, twoAbove } };
};

const NO_NEIGHBORS = { above: null, below: null, twoBelow: null, twoAbove: null };

const DonationCalculator = () => {
  useDocumentTitle('Donation Calculator');
  const { combinedAssumptions } = useAssumptions();
  const { showNotification } = useNotificationActions();

  const categories = useMemo(
    () => [...combinedAssumptions.getAllCategories()].sort((a, b) => a.name.localeCompare(b.name)),
    [combinedAssumptions]
  );

  // Persisted state loads once, in the initializers below, so the save
  // effects can never write before the load has happened.
  const [storedCalculatorState] = useState(() => {
    const donationsRead = readStoredJson('donationCalculatorValues');
    const specificDonationsRead = readStoredJson('specificDonations');
    return {
      donations: donationsRead.value || {},
      specificDonations: specificDonationsRead.value || [],
      corrupted: donationsRead.corrupted || specificDonationsRead.corrupted,
    };
  });

  const [donations, setDonations] = useState(() => {
    const initialDonations = {};
    categories.forEach((category) => {
      initialDonations[category.id] = storedCalculatorState.donations[category.id] || '';
    });
    return initialDonations;
  });

  const [specificDonations, setSpecificDonations] = useState(storedCalculatorState.specificDonations);

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

  // For specific donation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);

  // Notify (once, post-render) if the load discarded corrupted storage.
  useEffect(() => {
    if (storedCalculatorState.corrupted) {
      showNotification('error', 'Saved calculator data was corrupted and has been reset.');
    }
  }, [storedCalculatorState, showNotification]);

  // Calculate lives saved for a specific donation (prop for RecipientTable)
  const calculateLivesSavedForSpecificDonation = (donation) =>
    livesSavedForSpecificDonation(combinedAssumptions, donation);

  // The full ranked donor list only changes with assumptions — without this
  // memo every keystroke recomputed every donor's statistics.
  const donorStats = useMemo(() => calculateDonorStatsFromCombined(combinedAssumptions), [combinedAssumptions]);

  const { totalDonated, totalLivesSaved, costPerLife, donorRank, neighboringDonors } = useMemo(() => {
    let totalAmount = 0;
    let totalLives = 0;

    // Calculate for each category
    Object.entries(donations).forEach(([categoryId, amount]) => {
      // Skip empty or invalid inputs
      if (!amount || isNaN(Number(amount))) return;

      const donationAmount = Number(amount);
      totalAmount += donationAmount;

      const yearForCalc = categoryYear === '' || isNaN(categoryYear) ? getCurrentYear() : parseInt(categoryYear, 10);
      totalLives += calculateLivesSavedForCategoryFromCombined(
        combinedAssumptions,
        categoryId,
        donationAmount,
        yearForCalc
      );
    });

    // Add specific donations
    specificDonations.forEach((donation) => {
      totalAmount += donation.amount;
      totalLives += livesSavedForSpecificDonation(combinedAssumptions, donation);
    });

    if (totalLives === 0) {
      return {
        totalDonated: totalAmount,
        totalLivesSaved: 0,
        costPerLife: Infinity,
        donorRank: null,
        neighboringDonors: NO_NEIGHBORS,
      };
    }

    const { rank, neighbors } = findDonorRank(donorStats, totalLives);
    return {
      totalDonated: totalAmount,
      totalLivesSaved: totalLives,
      costPerLife: totalAmount / totalLives,
      donorRank: rank,
      neighboringDonors: neighbors,
    };
  }, [donations, specificDonations, categoryYear, combinedAssumptions, donorStats]);

  // Save calculator state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('donationCalculatorValues', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('specificDonations', JSON.stringify(specificDonations));
  }, [specificDonations]);

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

  // Clearing every specific donation is destructive — confirm first.
  const handleConfirmClearAll = () => {
    setSpecificDonations([]);
    setIsClearAllConfirmOpen(false);
  };

  // Get cost per life for a specific donation (for display in the table)
  const getCostPerLifeForSpecificDonation = (donation) => {
    const donationYear = getDonationYear(donation);
    if (donation.isCustomRecipient && donation.categoryId) {
      return getCustomRecipientCostPerLife(combinedAssumptions, donation, donationYear);
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
        className="impact-page calculator-page flex flex-col items-center"
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
          className="impact-page__container mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <AssumptionsSelector />
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

          {/* Category donations */}
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

          <RecipientTable
            donations={specificDonations}
            categories={categories}
            combinedAssumptions={combinedAssumptions}
            onAddClick={() => openDonationModal()}
            onEditClick={(donation) => openDonationModal(donation)}
            onDeleteClick={handleDeleteSpecificDonation}
            onClearAll={() => setIsClearAllConfirmOpen(true)}
            calculateLivesSaved={calculateLivesSavedForSpecificDonation}
            getCostPerLife={getCostPerLifeForSpecificDonation}
            className="mt-8"
          />
        </motion.div>

        <ConfirmActionModal
          isOpen={isClearAllConfirmOpen}
          title="Clear all specific donations?"
          description={`This removes ${specificDonations.length === 1 ? 'your 1 specific donation' : `all ${specificDonations.length} specific donations`} from the calculator. This cannot be undone.`}
          confirmLabel="Clear All"
          onConfirm={handleConfirmClearAll}
          onCancel={() => setIsClearAllConfirmOpen(false)}
        />

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
