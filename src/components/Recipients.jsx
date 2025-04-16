import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { charities, donations, effectivenessCategories, getCharityEffectiveness } from '../data/donationData';
import SortableTable from './SortableTable';

function Recipients() {
  const [charityStats, setCharityStats] = useState([]);

  useEffect(() => {
    // Calculate charity statistics
    const recipientStats = charities.map(charity => {
      const charityDonations = donations.filter(d => d.charity === charity.name);
      const totalReceived = charityDonations.reduce((sum, d) => sum + d.amount, 0);
      const categoryData = effectivenessCategories[charity.category];
      const effectivenessRate = getCharityEffectiveness(charity);
      const totalLivesSaved = charityDonations.reduce(
        (sum, d) => sum + (d.amount / 1000000) * effectivenessRate, 
        0
      );
      
      return {
        name: charity.name,
        category: charity.category,
        categoryName: categoryData.name,
        totalReceived,
        effectivenessRate,
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
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
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
        const costPerLife = 1000000 / charity.effectivenessRate;
        return (
          <div className="text-sm text-slate-900">
            {formatCurrency(Math.round(costPerLife))}
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-10 mb-10 text-center shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Recipient Organizations</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">Ranked by total lives saved through donations</p>
        </div>
      </div>
      
      {/* Back Link */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link 
          to="/" 
          className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
        >
          ← Back to top donors
        </Link>
      </div>
      
      {/* Recipients Table Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <SortableTable 
              columns={charityColumns} 
              data={charityStats.map((charity, index) => ({
                ...charity,
                rank: index + 1,
                costPerLife: Math.round(1000000 / charity.effectivenessRate)
              }))} 
              defaultSortColumn="totalLivesSaved" 
              defaultSortDirection="desc"
              rankKey="rank"
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

export default Recipients;