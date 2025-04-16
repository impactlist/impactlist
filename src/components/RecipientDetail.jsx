import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  donations, 
  charities, 
  effectivenessCategories, 
  getCharityEffectiveness, 
  getCategoryEffectiveness,
  getEffectivenessMultiplier 
} from '../data/donationData';
import SortableTable from './SortableTable';

function RecipientDetail() {
  const { recipientName } = useParams();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recipientDonations, setRecipientDonations] = useState([]);

  useEffect(() => {
    // Get charity info
    const charity = charities.find(c => c.name === recipientName);
    
    if (charity) {
      const categoryData = effectivenessCategories[charity.category];
      const effectivenessRate = getCharityEffectiveness(charity);
      
      // Filter donations for this charity
      const charityDonations = donations
        .filter(donation => donation.charity === recipientName)
        .map(donation => {
          const livesSaved = (donation.amount / 1000000) * effectivenessRate;
          
          return {
            ...donation,
            livesSaved,
            dateObj: new Date(donation.date)
          };
        })
        .sort((a, b) => b.dateObj - a.dateObj);
      
      // Calculate total received
      const totalReceived = charityDonations.reduce((sum, donation) => sum + donation.amount, 0);
      const totalLivesSaved = charityDonations.reduce((sum, donation) => sum + donation.livesSaved, 0);
      
      // Get effectiveness multiplier compared to category average
      const categoryEffectiveness = getCategoryEffectiveness(charity);
      const effectivenessMultiplier = getEffectivenessMultiplier(charity);
      
      setRecipientInfo({
        name: recipientName,
        category: charity.category,
        categoryName: categoryData.name,
        effectivenessRate,
        categoryEffectiveness,
        effectivenessMultiplier,
        totalReceived,
        totalLivesSaved
      });
      
      setRecipientDonations(charityDonations);
    }
  }, [recipientName]);

  // Format functions
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  const formatCurrency = (amount, effectivenessRate = null) => {
    if (effectivenessRate === 0) {
      return '∞';
    } else if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
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
          {new Date(donation.date).toLocaleDateString('en-US', {
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
      key: 'donor', 
      label: 'Donor',
      render: (donation) => (
        <Link 
          to={`/donor/${encodeURIComponent(donation.donor)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {donation.donor}
        </Link>
      )
    },
    { 
      key: 'livesSaved', 
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(donation.livesSaved))}
        </div>
      )
    }
  ];

  if (!recipientInfo) {
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
        {/* Recipient name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{recipientInfo.name}</h1>
        
        {/* Recipient stats card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Focus Area</span>
              <span className="text-3xl font-bold text-slate-900">{recipientInfo.categoryName}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className="text-3xl font-bold text-slate-900">
                {recipientInfo.effectivenessRate === 0 ? <span className="text-6xl">∞</span> : `$${formatNumber(Math.round(1000000 / recipientInfo.effectivenessRate))}`}
              </span>
              <span className="text-sm mt-2 text-slate-500">
                Category avg: {recipientInfo.categoryEffectiveness === 0 ? <span className="text-xl">∞</span> : `$${formatNumber(Math.round(1000000 / recipientInfo.categoryEffectiveness))}`}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Received</span>
              <span className="text-3xl font-bold text-slate-900">{formatCurrency(recipientInfo.totalReceived)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Lives Saved</span>
              <span className={`text-3xl font-bold ${recipientInfo.totalLivesSaved < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatNumber(Math.round(recipientInfo.totalLivesSaved))}
              </span>
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
              data={recipientDonations}
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

export default RecipientDetail;