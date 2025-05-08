import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';
import { 
  getAllCategories, 
  calculateLivesSavedForCategory, 
  getDefaultCostPerLifeForCategory 
} from '../utils/donationDataHelpers';
import { useCostPerLife } from './CostPerLifeContext';
import { formatNumber, formatCurrency } from '../utils/formatters';
import CustomValuesIndicator from './CustomValuesIndicator';

const DonationCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState({});
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalLivesSaved, setTotalLivesSaved] = useState(0);
  const [costPerLife, setCostPerLife] = useState(0);
  const [donorRank, setDonorRank] = useState(null);
  const { customValues, openModal } = useCostPerLife();

  // Initialize categories on component mount
  useEffect(() => {
    const categoriesData = getAllCategories();
    // Sort categories alphabetically by name
    const sortedCategories = [...categoriesData].sort((a, b) => a.name.localeCompare(b.name));
    setCategories(sortedCategories);
    
    // Initialize donations object with empty values
    const initialDonations = {};
    sortedCategories.forEach(category => {
      initialDonations[category.id] = '';
    });
    setDonations(initialDonations);
  }, []);

  // Calculate lives saved when donations or customValues change
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
    
    setTotalDonated(totalAmount);
    setTotalLivesSaved(totalLives);
    
    // Calculate overall cost per life
    if (totalLives > 0) {
      setCostPerLife(totalAmount / totalLives);
    } else {
      setCostPerLife(0);
    }
    
    // Calculate rank
    // This would ideally use actual donor data from the application
    // For now, we'll set a placeholder calculation
    if (totalLives > 0) {
      calculateDonorRank(totalLives);
    } else {
      setDonorRank(null);
    }
  }, [donations, customValues, categories]);
  
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
        for (const donor of donorStats) {
          if (lives <= donor.livesSaved) {
            rank++;
          } else {
            break;
          }
        }
        
        setDonorRank(rank);
      });
    }).catch(error => {
      console.error("Error calculating donor rank:", error);
      setDonorRank(null);
    });
  };
  
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
  
  // Calculate lives saved for a specific category
  const getLivesSavedForCategory = (categoryId, amount) => {
    if (!amount || isNaN(Number(amount))) return 0;
    
    const donationAmount = Number(amount);
    return calculateLivesSavedForCategory(categoryId, donationAmount, customValues);
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
              <div className="text-xl font-bold text-emerald-700">{formatNumber(Math.round(totalLivesSaved))}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Average Cost Per Life</div>
              <div className="text-xl font-bold text-slate-800">
                {totalLivesSaved > 0 ? formatCurrency(costPerLife) : '—'}
              </div>
            </div>
          </div>
          
          {donorRank && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Your Potential Rank on Impact List</div>
              <div className="text-xl font-bold text-indigo-700">#{donorRank}</div>
              <div className="text-sm text-slate-600 mt-1">
                With {formatNumber(Math.round(totalLivesSaved))} lives saved, you would rank #{donorRank} on our Impact List.
              </div>
            </div>
          )}
        </div>
        
        {/* Instruction text moved between panels */}
        <p className="text-lg text-slate-700 mb-6 px-2">
          Enter your donation amounts to see your impact based on past or future donations.
        </p>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6">
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
                    <div className="text-emerald-700 text-sm">
                      Lives saved: {formatNumber(Math.round(livesSaved))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DonationCalculator;