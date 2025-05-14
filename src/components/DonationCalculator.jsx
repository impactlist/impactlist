import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';
import {
  getAllCategories,
  getAllRecipients,
  calculateLivesSavedForCategory,
  getDefaultCostPerLifeForCategory,
  getCostPerLifeForRecipient,
  getCategoryById,
  getPrimaryCategoryForRecipient
} from '../utils/donationDataHelpers';
import { recipientsById } from '../data/generatedData';
import { useCostPerLife } from './CostPerLifeContext';
import { formatNumber, formatCurrency, formatLives } from '../utils/formatters';
import CustomValuesIndicator from './CustomValuesIndicator';
import SpecificDonationModal from './SpecificDonationModal';
import SortableTable from './SortableTable';
import CategoryDisplay from './CategoryDisplay';
import MiniImpactList from './MiniImpactList';

const DonationCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState({});
  const [specificDonations, setSpecificDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalLivesSaved, setTotalLivesSaved] = useState(0);
  const [costPerLife, setCostPerLife] = useState(0);
  const [donorRank, setDonorRank] = useState(null);
  const [neighboringDonors, setNeighboringDonors] = useState({ above: null, below: null, twoBelow: null, twoAbove: null });
  const { customValues, openModal } = useCostPerLife();

  // For specific donation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);

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
    sortedCategories.forEach(category => {
      initialDonations[category.id] = parsedDonations[category.id] || '';
    });

    setDonations(initialDonations);

    // Load specific donations
    const savedSpecificDonations = localStorage.getItem('specificDonations');
    if (savedSpecificDonations) {
      setSpecificDonations(JSON.parse(savedSpecificDonations));
    }
  }, []);

  // Calculate lives saved when donations, specificDonations, or customValues change
  useEffect(() => {
    // Skip calculation if no categories loaded yet
    if (categories.length === 0) return;

    let totalAmount = 0;
    let totalLives = 0;

    // Calculate for each category
    Object.entries(donations).forEach(([categoryId, amount]) => {
      // Skip empty or invalid inputs
      if (!amount || isNaN(Number(amount))) return;

      const donationAmount = Number(amount);
      totalAmount += donationAmount;

      // Calculate lives saved for this category
      const livesSaved = calculateLivesSavedForCategory(categoryId, donationAmount, customValues);
      totalLives += livesSaved;
    });

    // Add specific donations
    specificDonations.forEach(donation => {
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
          const baseCostPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
          costPerLife = baseCostPerLife / donation.multiplier;
        } else {
          // Use category default
          costPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
        }

        livesSaved = donation.amount / costPerLife;
      } else {
        // For existing recipients, find the appropriate recipient ID
        const recipientId = Object.keys(recipientsById).find(id =>
          recipientsById[id].name === donation.recipientName);

        if (!recipientId) {
          throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
        }

        // Get actual cost per life for this recipient
        const recipientCostPerLife = getCostPerLifeForRecipient(recipientId, customValues);
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
    // This would ideally use actual donor data from the application
    // For now, we'll set a placeholder calculation
    if (totalLives !== 0) {
      calculateDonorRank(totalLives);
    } else {
      setDonorRank(null);
    }
  }, [donations, specificDonations, customValues, categories]);
  
  // Calculate donor rank based on lives saved
  const calculateDonorRank = (lives) => {
    // This would use actual donor data, for now it's a placeholder
    // Ideally, it would compare the lives saved against all donors' lives saved
    // and determine where this user would rank
    
    // Sample implementation:
    import('./SortableTable').then(() => {
      import('../utils/donationDataHelpers').then(({ calculateDonorStats }) => {
        const donorStats = calculateDonorStats(customValues);
        
        // Find where the user would rank
        let rank = 1;
        let donorAbove = null;
        let donorBelow = null;
        let twoBelow = null;
        let twoAbove = null;

        // Donors are sorted by lives saved in descending order
        for (let i = 0; i < donorStats.length; i++) {
          const donor = donorStats[i];
          
          if (lives <= donor.livesSaved) {
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
          twoAbove: twoAbove
        });
      });
    }).catch(error => {
      console.error("Error calculating donor rank:", error);
      setDonorRank(null);
      setNeighboringDonors({ above: null, below: null, twoBelow: null, twoAbove: null });
    });
  };
  
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
    
    setDonations(prev => ({
      ...prev,
      [categoryId]: sanitizedValue
    }));
  };
  
  // Format for display
  const formatDonationInput = (value) => {
    if (!value) return '';
    const num = Number(value);
    return isNaN(num) ? value : num.toLocaleString();
  };
  
  // Reset all donation amounts
  const resetDonations = () => {
    const emptyDonations = {};
    categories.forEach(category => {
      emptyDonations[category.id] = '';
    });
    setDonations(emptyDonations);
  };

  // Clear all specific donations
  const clearSpecificDonations = () => {
    setSpecificDonations([]);
  };

  // Calculate lives saved for a specific category
  const getLivesSavedForCategory = (categoryId, amount) => {
    if (!amount || isNaN(Number(amount))) return 0;

    const donationAmount = Number(amount);
    return calculateLivesSavedForCategory(categoryId, donationAmount, customValues);
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
      setSpecificDonations(prev =>
        prev.map(item => item.id === donationData.id ? donationData : item)
      );
    } else {
      // Add new donation
      setSpecificDonations(prev => [...prev, donationData]);
    }
    setEditingDonation(null);
  };

  // Handle deleting a specific donation
  const handleDeleteSpecificDonation = (id) => {
    setSpecificDonations(prev => prev.filter(item => item.id !== id));
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
        const baseCostPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
        costPerLife = baseCostPerLife / donation.multiplier;
      } else {
        // Use category default
        costPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
      }

      return donation.amount / costPerLife;
    } else {
      // For existing recipients, find the recipient in our data
      // Find the appropriate recipient ID by matching name
      const recipientId = Object.keys(recipientsById).find(id =>
        recipientsById[id].name === donation.recipientName);

      if (!recipientId) {
        throw new Error(`Could not find ID for recipient: ${donation.recipientName}`);
      }

      // Get actual cost per life for this recipient
      const recipientCostPerLife = getCostPerLifeForRecipient(recipientId, customValues);
      return donation.amount / recipientCostPerLife;
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-slate-50 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spacer */}
      <div className="h-10"></div>
      
      {/* Back Link */}
      <BackButton to="/" label="Back to top donors" />
      
      {/* Main Content Container */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Donation Calculator</h1>
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
        
        {/* Results panel - Now at the top */}
        <div className="bg-indigo-50 shadow-lg rounded-xl overflow-hidden border border-indigo-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Your Impact Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Total Donated</div>
              <div className="text-xl font-bold text-slate-800">{formatCurrency(totalDonated)}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Lives Saved</div>
              <div className={`text-xl font-bold ${totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {totalLivesSaved < 0 ? '-' : ''}{formatLives(Math.abs(totalLivesSaved))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Average Cost Per Life</div>
              <div className={`text-xl font-bold ${costPerLife < 0 ? 'text-red-700' : 'text-slate-800'}`}>
                {totalLivesSaved !== 0 ? formatCurrency(costPerLife) : '—'}
              </div>
            </div>
          </div>
          
          {donorRank !== null && (
            <MiniImpactList
              donorRank={donorRank}
              totalLivesSaved={totalLivesSaved}
              totalDonated={totalDonated}
              costPerLife={costPerLife}
              neighboringDonors={neighboringDonors}
            />
          )}
        </div>
        
        {/* Instruction text moved between panels */}
        <p className="text-lg text-slate-700 mb-6 px-2">
          Enter your donation amounts to see your impact based on past or future donations.
        </p>

        {/* Specific Donations */}
        {specificDonations.length > 0 && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-800">Your Specific Donations</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearSpecificDonations}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <SortableTable
                columns={[
                  {
                    key: 'amount',
                    label: 'Amount',
                    render: (donation) => (
                      <div className="text-sm font-medium text-slate-700">
                        {formatCurrency(donation.amount)}
                      </div>
                    )
                  },
                  {
                    key: 'recipientName',
                    label: 'Recipient',
                    render: (donation) => (
                      <div>
                        {donation.isCustomRecipient ? (
                          <span className="text-sm font-medium text-slate-700">
                            {donation.recipientName}
                          </span>
                        ) : (
                          <Link
                            to={`/recipient/${encodeURIComponent(Object.keys(recipientsById).find(id =>
                              recipientsById[id].name === donation.recipientName) || '')}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {donation.recipientName}
                          </Link>
                        )}
                      </div>
                    )
                  },
                  {
                    key: 'category',
                    label: 'Category',
                    render: (donation) => (
                      <CategoryDisplay
                        donation={donation}
                        categories={categories}
                        recipientsById={recipientsById}
                      />
                    )
                  },
                  {
                    key: 'lives',
                    label: 'Lives Saved',
                    render: (donation) => {
                      const livesSaved = calculateLivesSavedForSpecificDonation(donation);
                      return (
                        <div className={`text-sm font-medium ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                          {livesSaved < 0 ? '-' : ''}{formatLives(Math.abs(livesSaved))}
                        </div>
                      );
                    }
                  },
                  {
                    key: 'costPerLife',
                    label: 'Cost Per Life',
                    render: (donation) => {
                      let costPerLife;

                      if (donation.isCustomRecipient && donation.categoryId) {
                        if (donation.costPerLife) {
                          costPerLife = donation.costPerLife;
                        } else if (donation.multiplier) {
                          const baseCostPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
                          costPerLife = baseCostPerLife / donation.multiplier;
                        } else {
                          costPerLife = getDefaultCostPerLifeForCategory(donation.categoryId, customValues);
                        }
                      } else {
                        const recipientId = Object.keys(recipientsById).find(id =>
                          recipientsById[id].name === donation.recipientName);

                        if (recipientId) {
                          costPerLife = getCostPerLifeForRecipient(recipientId, customValues);
                        } else {
                          costPerLife = 0;
                        }
                      }

                      return (
                        <div className="text-sm font-medium text-slate-700">
                          {formatCurrency(costPerLife)}
                        </div>
                      );
                    }
                  },
                  {
                    key: 'actions',
                    label: 'Actions',
                    render: (donation) => (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDonationModal(donation)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Edit donation"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDeleteSpecificDonation(donation.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          title="Delete donation"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )
                  }
                ]}
                data={specificDonations}
                defaultSortColumn="amount"
                defaultSortDirection="desc"
              />
            </div>
          </div>
        )}

        {/* Add Specific Donation button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => openDonationModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Specific Donation
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6">
          {/* Donation inputs header with reset button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-800">Donations by category</h3>
            <button 
              onClick={resetDonations}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805v2.203a1 1 0 01-1.707.707L1.707 8.13a1 1 0 010-1.415l2.586-2.586A1 1 0 015 3.99V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13.5V11a1 1 0 012 0v2a7.002 7.002 0 01-11.601 5.29 1 1 0 01-.61-1.275l.009-.019.354-.707a1 1 0 01.614-.61z" clipRule="evenodd" />
              </svg>
              Reset All Amounts
            </button>
          </div>
          
          {/* Donation inputs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
            {categories.map(category => {
              const amount = donations[category.id] || '';
              const livesSaved = getLivesSavedForCategory(category.id, amount);
              const costPerLife = getDefaultCostPerLifeForCategory(category.id, customValues);
              
              return (
                <div key={category.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <label className="font-medium text-slate-800" htmlFor={`donation-${category.id}`}>
                      {category.name}
                    </label>
                    <span className="text-xs text-slate-500">
                      ${formatNumber(costPerLife)}/life
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-slate-700 mr-1">$</span>
                    <input
                      id={`donation-${category.id}`}
                      type="text"
                      inputMode="decimal"
                      value={formatDonationInput(amount)}
                      onChange={(e) => handleDonationChange(category.id, e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  {amount && !isNaN(Number(amount)) && (
                    <div className={`text-sm ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                      Lives saved: {livesSaved < 0 ? '-' : ''}{formatLives(Math.abs(livesSaved))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DonationCalculator;