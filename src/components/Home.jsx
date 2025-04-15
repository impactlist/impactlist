import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateDonorStats, charities, donations, effectivenessCategories } from '../data/donationData';

function Home() {
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
      const effectivenessRate = effectivenessCategories[charity.category];
      const totalLivesSaved = charityDonations.reduce(
        (sum, d) => sum + (d.amount / 1000000) * effectivenessRate, 
        0
      );
      
      return {
        name: charity.name,
        category: charity.category,
        totalReceived,
        effectivenessRate,
        totalLivesSaved
      };
    }).sort((a, b) => b.totalReceived - a.totalReceived);
    
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

  // Format category for display
  const formatCategory = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-10 mb-10 text-center shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Impact List</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">Ranking of people by world impact through donations</p>
        </div>
      </div>
      
      {/* Donors Table Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Top Donors</h2>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              {/* Table Header */}
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lives Saved</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Donated</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cost/Life</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Worth</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-slate-200">
                {donorStats.map((donor, index) => (
                  <tr 
                    key={donor.name} 
                    className={`transition-colors hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{donor.rank}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Link 
                        to={`/donor/${encodeURIComponent(donor.name)}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {donor.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-emerald-700">{formatNumber(Math.round(donor.livesSaved))}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatCurrency(donor.totalDonated)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatCurrency(Math.round(donor.costPerLifeSaved))}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatCurrency(donor.netWorth)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recipients Table Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Recipient Organizations</h2>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              {/* Table Header */}
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Organization</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Effectiveness</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Received</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lives Saved</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-slate-200">
                {charityStats.map((charity, index) => (
                  <tr 
                    key={charity.name} 
                    className={`transition-colors hover:bg-emerald-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Link 
                        to={`/recipient/${encodeURIComponent(charity.name)}`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                      >
                        {charity.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatCategory(charity.category)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{charity.effectivenessRate} lives/$1M</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatCurrency(charity.totalReceived)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-emerald-700">{formatNumber(Math.round(charity.totalLivesSaved))}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Home;