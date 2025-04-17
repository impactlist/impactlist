import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { calculateDonorStats, donations, charities, effectivenessCategories, getCharityCostPerLife, donors } from '../data/donationData';
import SortableTable from './SortableTable';

function DonorDetail() {
  const { donorName } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);

  useEffect(() => {
    // Get full donor statistics
    const stats = calculateDonorStats();
    const currentDonor = stats.find(donor => donor.name === donorName);
    setDonorStats(currentDonor);

    // Get donor donations and sort by date (most recent first)
    const donorDonationsList = donations
      .filter(donation => donation.donor === donorName)
      .map(donation => {
        const charity = charities.find(c => c.name === donation.charity);
        const categoryData = effectivenessCategories[charity.category];
        const costPerLife = getCharityCostPerLife(charity);
        const livesSaved = costPerLife < 0 ? 
          (donation.amount / (costPerLife * -1)) * -1 : // Lives lost case
          donation.amount / costPerLife; // Normal case
        
        return {
          ...donation,
          category: charity.category,
          categoryName: categoryData.name,
          livesSaved,
          costPerLife,
          dateObj: new Date(donation.date)
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);
    
    // Find the donor with the totalDonated field in the donors array
    const donorData = donors.find(donor => donor.name === donorName);
    
    // Keep track of the sum of known donations for reference
    const knownDonationsTotal = donorDonationsList.reduce((total, donation) => total + donation.amount, 0);
    
    // If donor has totalDonated field and it's greater than the sum of known donations
    if (donorData?.totalDonated && donorData.totalDonated > knownDonationsTotal) {
      // Calculate the unknown amount
      const unknownAmount = donorData.totalDonated - knownDonationsTotal;
      
      // Calculate the average cost per life for all known donations
      const totalLivesSaved = donorDonationsList.reduce((total, donation) => total + donation.livesSaved, 0);
      
      // Only calculate avg cost if there are lives saved (avoid division by zero)
      const avgCostPerLife = totalLivesSaved !== 0 ? knownDonationsTotal / totalLivesSaved : 0;
      
      // Calculate lives saved for the unknown amount using the same cost per life
      const unknownLivesSaved = avgCostPerLife !== 0 ? unknownAmount / avgCostPerLife : 0;
      
      // Add the unknown donation to the list
      donorDonationsList.unshift({
        date: 'Unknown',
        donor: donorName,
        charity: 'Unknown',
        amount: unknownAmount,
        category: 'other',
        categoryName: 'Unknown',
        livesSaved: unknownLivesSaved,
        costPerLife: avgCostPerLife,
        dateObj: new Date(0), // Oldest date to sort at the end
        source: '',
        isUnknown: true
      });
    }
    
    setDonorDonations(donorDonationsList);
  }, [donorName]);

  // Format functions
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  const formatCurrency = (amount, effectivenessRate = null) => {
    if (effectivenessRate === 0) {
      return '∞';
    } else if (amount >= 1000000000) {
      const value = amount / 1000000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}B`;
    } else if (amount >= 1000000) {
      const value = amount / 1000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}M`;
    } else {
      return `$${formatNumber(amount)}`;
    }
  };
  
  // Donation table columns configuration
  const donationColumns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-slate-900">
          {donation.isUnknown ? 
            <span className="text-slate-500">Unknown</span> : 
            new Date(donation.date).toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'short', 
              day: 'numeric'
            })}
        </div>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (donation) => (
        donation.isUnknown ? 
        <span className="text-sm text-slate-500">{formatCurrency(donation.amount)}</span> :
        <a 
          href={donation.source} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {formatCurrency(donation.amount)}
        </a>
      )
    },
    { 
      key: 'charity', 
      label: 'Recipient',
      render: (donation) => (
        donation.isUnknown ? 
        <span className="text-sm text-slate-500">Unknown</span> :
        <Link 
          to={`/recipient/${encodeURIComponent(donation.charity)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {donation.charity}
        </Link>
      )
    },
    { 
      key: 'categoryName', 
      label: 'Category',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 'text-slate-900'}`}>
          {donation.categoryName}
        </div>
      )
    },
    { 
      key: 'livesSaved', 
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 
          (donation.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700')}`}>
          {formatNumber(Math.round(donation.livesSaved))}
        </div>
      )
    },
    { 
      key: 'costPerLife', 
      label: 'Cost/Life',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 'text-slate-900'}`}>
          {donation.livesSaved === 0 ? <span className="text-2xl">∞</span> : `$${formatNumber(Math.round(donation.costPerLife))}`}
        </div>
      )
    }
  ];

  if (!donorStats) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with back button */}
      <div className="w-full bg-indigo-700 py-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="text-indigo-100 hover:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Impact List
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Donor name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{donorStats.name}</h1>
        
        {/* Donor stats card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Impact Rank</span>
              <span className="text-3xl font-bold text-slate-900">#{donorStats.rank}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Lives Saved</span>
              <span className={`text-3xl font-bold ${donorStats.livesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(donorStats.livesSaved))}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Donated</span>
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(donorStats.totalDonatedField || donorStats.totalDonated)}
              </span>
              {donorStats.totalDonatedField && (
                <span className="text-xs text-slate-500 mt-1">
                  {formatCurrency(donorStats.knownDonations)} known
                </span>
              )}
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className="text-3xl font-bold text-slate-900">
                {donorStats.livesSaved === 0 ? <span className="text-6xl">∞</span> : `$${formatNumber(Math.round(donorStats.costPerLifeSaved))}`}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Net Worth</span>
              <span className="text-3xl font-bold text-slate-700">{formatCurrency(donorStats.netWorth)}</span>
            </div>
          </div>
        </div>

        {/* Donations list */}
        <div className="bg-white rounded-xl shadow-lg mb-16 border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Donation History</h2>
          </div>
          <div className="overflow-x-auto">
            <SortableTable 
              columns={donationColumns}
              data={donorDonations}
              defaultSortColumn="date"
              defaultSortDirection="desc"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 bg-slate-800 text-center">
        <p className="text-sm text-slate-400">Data compiled from public donations and impact estimates</p>
      </div>
    </div>
  );
}

export default DonorDetail;