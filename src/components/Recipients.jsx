import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { charities, donations, effectivenessCategories, getCharityCostPerLife, getPrimaryCategory, getCategoryBreakdown } from '../data/donationData';
import SortableTable from './SortableTable';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';

function Recipients(props) {
  const [charityStats, setCharityStats] = useState([]);
  const { customValues, openModal } = useCostPerLife();

  useEffect(() => {
    // Calculate charity statistics
    const recipientStats = charities.map(charity => {
      const charityDonations = donations.filter(d => d.charity === charity.name);
      const totalReceived = charityDonations.reduce((sum, d) => sum + d.amount, 0);
      const costPerLife = getCharityCostPerLife(charity, customValues);
      
      // Get the primary category and all categories for display
      const primaryCategory = getPrimaryCategory(charity);
      const categoryBreakdown = getCategoryBreakdown(charity);
      const categoryNames = categoryBreakdown.map(category => category.name);
      
      const totalLivesSaved = charityDonations.reduce(
        (sum, d) => {
          // Apply credit multiplier if it exists
          const creditedAmount = d.credit !== undefined ? d.amount * d.credit : d.amount;
          
          const livesSaved = costPerLife < 0 ? 
            (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
            creditedAmount / costPerLife; // Normal case
          return sum + livesSaved;
        }, 
        0
      );
      
      return {
        name: charity.name,
        primaryCategoryId: primaryCategory.id,
        primaryCategoryName: primaryCategory.name,
        categoryNames,
        totalReceived,
        costPerLife,
        totalLivesSaved
      };
    }).sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);
    
    setCharityStats(recipientStats);
  }, [customValues]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  // Format dollar amounts
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      const value = amount / 1000000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}B`;
    } else if (amount >= 1000000) {
      const value = amount / 1000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}M`;
    } else {
      return `$${formatNumber(amount)}`;
    }
  };

  // Charity table columns configuration
  const charityColumns = [
    { 
      key: 'rank', 
      label: 'Rank',
      render: (charity) => <div className="text-sm text-slate-900">{charity.rank}</div>
    },
    { 
      key: 'name', 
      label: 'Organization',
      render: (charity) => (
        <Link 
          to={`/recipient/${encodeURIComponent(charity.name)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {charity.name}
        </Link>
      )
    },
    { 
      key: 'totalLivesSaved', 
      label: 'Lives Saved',
      render: (charity) => (
        <div className={`text-sm ${charity.totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(charity.totalLivesSaved))}
        </div>
      )
    },
    { 
      key: 'costPerLife', 
      label: 'Cost/Life',
      render: (charity) => {
        return (
          <div className={`text-sm ${charity.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {charity.costPerLife === 0 ? '∞' : 
             charity.costPerLife < 0 ? `-${formatCurrency(Math.abs(Math.round(charity.costPerLife)))}` : 
             formatCurrency(Math.round(charity.costPerLife))}
          </div>
        );
      }
    },
    { 
      key: 'totalReceived', 
      label: 'Total Received',
      render: (charity) => <div className="text-sm text-slate-900">{formatCurrency(charity.totalReceived)}</div>
    },
    { 
      key: 'primaryCategoryName', 
      label: 'Focus Area',
      render: (charity) => (
        <div className="text-sm text-slate-900">
          {charity.categoryNames.length === 1 ? (
            charity.primaryCategoryName
          ) : (
            <div>
              <div>{charity.primaryCategoryName}</div>
              {charity.categoryNames.length > 1 && (
                <div className="text-xs text-gray-500 mt-1">
                  +{charity.categoryNames.length - 1} more
                </div>
              )}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-slate-50 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Hidden when using App layout */}
      {!props.hideHeader && (
        <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-10 mb-10 text-center shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Recipient Organizations</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">Ranked by total lives saved through donations</p>
          </div>
        </div>
      )}
      {/* Spacer when using App layout */}
      {props.hideHeader && <div className="h-10"></div>}
      
      {/* Back Link */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Link 
          to="/" 
          className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
        >
          ← Back to top donors
        </Link>
      </motion.div>
      
      {/* Recipients Table Container */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Recipient Organizations</h2>
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
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <SortableTable 
              columns={charityColumns} 
              data={charityStats.map((charity, index) => ({
                ...charity,
                rank: index + 1
              }))} 
              defaultSortColumn="totalLivesSaved" 
              defaultSortDirection="desc"
              rankKey="rank"
            />
          </div>
        </div>
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

export default Recipients;