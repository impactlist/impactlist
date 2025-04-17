import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateDonorStats, charities, donations, effectivenessCategories, getCharityCostPerLife } from '../data/donationData';
import SortableTable from './SortableTable';

function Home(props) {
  const [donorStats, setDonorStats] = useState([]);
  const [charityStats, setCharityStats] = useState([]);

  useEffect(() => {
    // Calculate donor statistics on component mount
    const stats = calculateDonorStats();
    setDonorStats(stats);
    
    // Calculate charity statistics
    const recipientStats = charities.map(charity => {
      const charityDonations = donations.filter(d => d.charity === charity.name);
      const totalReceived = charityDonations.reduce((sum, d) => sum + d.amount, 0);
      const categoryData = effectivenessCategories[charity.category];
      const costPerLife = getCharityCostPerLife(charity);
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
        category: charity.category,
        categoryName: categoryData.name,
        totalReceived,
        costPerLife,
        totalLivesSaved
      };
    }).sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);
    
    setCharityStats(recipientStats);
  }, []);

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

  // Get category display name
  const formatCategory = (categoryKey) => {
    return effectivenessCategories[categoryKey].name;
  };

  // Donor table columns configuration
  const donorColumns = [
    { 
      key: 'rank', 
      label: 'Rank',
      render: (donor) => <div className="text-sm text-slate-900">{donor.rank}</div>
    },
    { 
      key: 'name', 
      label: 'Name',
      render: (donor) => (
        <Link 
          to={`/donor/${encodeURIComponent(donor.name)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {donor.name}
        </Link>
      )
    },
    { 
      key: 'livesSaved', 
      label: 'Lives Saved',
      render: (donor) => (
        <div className={`text-sm ${donor.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(donor.livesSaved))}
        </div>
      )
    },
    { 
      key: 'totalDonated', 
      label: 'Donated',
      render: (donor) => <div className="text-sm text-slate-900">{formatCurrency(donor.totalDonated)}</div>
    },
    { 
      key: 'costPerLifeSaved', 
      label: 'Cost/Life',
      render: (donor) => (
        <div className="text-sm text-slate-900">
          {formatCurrency(Math.round(donor.costPerLifeSaved))}
        </div>
      )
    },
    { 
      key: 'netWorth', 
      label: 'Net Worth',
      render: (donor) => <div className="text-sm text-slate-900">{formatCurrency(donor.netWorth)}</div>
    }
  ];

  // Charity table columns configuration
  const charityColumns = [
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
          <div className="text-sm text-slate-900">
            {charity.costPerLife === 0 ? '∞' : formatCurrency(Math.round(charity.costPerLife))}
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
      key: 'categoryName', 
      label: 'Focus Area',
      render: (charity) => <div className="text-sm text-slate-900">{charity.categoryName}</div>
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
      {/* Hero Header - Hidden when using App layout */}
      {!props.hideHeader && (
        <div className="w-full bg-indigo-700 py-10 mb-10 text-center shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Impact List</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">Rankings based on positive impact via donations</p>
          </div>
        </div>
      )}
      {/* Spacer when using App layout */}
      {props.hideHeader && <div className="h-10"></div>}
      
      {/* Donors Table Container */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Top Donors</h2>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <SortableTable 
              columns={donorColumns} 
              data={donorStats} 
              defaultSortColumn="livesSaved" 
              defaultSortDirection="desc"
              rankKey="rank"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Link to Recipients Page */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Link 
          to="/recipients" 
          className="text-indigo-600 hover:text-indigo-800 hover:underline text-base"
        >
          View list of recipient organizations →
        </Link>
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

export default Home;