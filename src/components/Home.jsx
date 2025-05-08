import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  calculateDonorStats, 
  getCostPerLifeForRecipient, 
  getPrimaryCategoryId,
  getDonationsForRecipient,
  getCategoryById,
  getAllRecipients,
  getTotalAmountForRecipient,
  calculateLivesSavedForDonation,
  getRecipientNameById,
  getRecipientId
} from '../utils/donationDataHelpers';
import SortableTable from './SortableTable';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';

function Home(props) {
  const [donorStats, setDonorStats] = useState([]);
  const [recipientStats, setRecipientStats] = useState([]);
  const { customValues, openModal } = useCostPerLife();

  useEffect(() => {
    // Calculate donor statistics on component mount
    const stats = calculateDonorStats(customValues);
    setDonorStats(stats);

    // Calculate recipient statistics
    const recipientStats = getAllRecipients().map(recipient => {
        // Find the recipient ID
        const recipientId = getRecipientId(recipient);
        
        if (!recipientId) {
          throw new Error(`Could not find ID for recipient ${recipient.name}. This recipient exists in the data but has no ID mapping.`);
        }
        
        const totalReceived = getTotalAmountForRecipient(recipientId);
        const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);
        
        // Get the primary category for display
        const primaryCategoryId = getPrimaryCategoryId(recipientId);
        const primaryCategory = getCategoryById(primaryCategoryId);
        
        if (!primaryCategory) {
          throw new Error(`Invalid primary category "${primaryCategoryId}" for recipient "${recipient.name}". This category does not exist in categoriesById.`);
        }
        
        // Calculate total lives saved for this recipient
        const recipientDonations = getDonationsForRecipient(recipientId);
        const totalLivesSaved = recipientDonations.reduce(
          (sum, donation) => sum + calculateLivesSavedForDonation(donation, customValues),
          0
        );
        
        return {
          id: recipientId,
          name: recipient.name,
          primaryCategoryId: primaryCategoryId,
          categoryName: primaryCategory.name,
          totalReceived,
          costPerLife,
          totalLivesSaved
        };
    })
    .filter(recipient => recipient !== null) // Filter out any recipients that couldn't be processed
    .sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);
    
    setRecipientStats(recipientStats);
  }, [customValues]);


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
          to={`/donor/${encodeURIComponent(donor.id)}`}
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
        <div className={`text-sm ${donor.costPerLifeSaved < 0 ? 'text-red-600' : 'text-slate-900'}`}>
          {donor.livesSaved === 0 ? '∞' : formatCurrency(donor.costPerLifeSaved)}
        </div>
      )
    },
    { 
      key: 'netWorth', 
      label: 'Net Worth',
      render: (donor) => <div className="text-sm text-slate-900">{formatCurrency(donor.netWorth)}</div>
    }
  ];

  // Recipient table columns configuration
  const recipientColumns = [
    { 
      key: 'name', 
      label: 'Organization',
      render: (recipient) => (
        <Link 
          to={`/recipient/${encodeURIComponent(recipient.id)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {recipient.name}
        </Link>
      )
    },
    { 
      key: 'totalLivesSaved', 
      label: 'Lives Saved',
      render: (recipient) => (
        <div className={`text-sm ${recipient.totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(recipient.totalLivesSaved))}
        </div>
      )
    },
    { 
      key: 'costPerLife', 
      label: 'Cost/Life',
      render: (recipient) => {
        return (
          <div className="text-sm text-slate-900">
            {recipient.costPerLife === 0 ? '∞' : formatCurrency(recipient.costPerLife)}
          </div>
        );
      }
    },
    { 
      key: 'totalReceived', 
      label: 'Total Received',
      render: (recipient) => <div className="text-sm text-slate-900">{formatCurrency(recipient.totalReceived)}</div>
    },
    { 
      key: 'categoryName', 
      label: 'Focus Area',
      render: (recipient) => <div className="text-sm text-slate-900">{recipient.categoryName}</div>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Top Donors</h2>
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
              columns={donorColumns} 
              data={donorStats} 
              defaultSortColumn="livesSaved" 
              defaultSortDirection="desc"
              rankKey="rank"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Links to other pages */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex justify-center items-center">
          <Link 
            to="/recipients" 
            className="text-indigo-600 hover:text-indigo-800 hover:underline text-base"
            onClick={() => window.scrollTo(0, 0)}
          >
            View list of recipient organizations →
          </Link>
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

export default Home;