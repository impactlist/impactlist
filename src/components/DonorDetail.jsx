import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { calculateDonorStats, donations, charities, effectivenessCategories } from '../data/donationData';

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
        const effectivenessRate = effectivenessCategories[charity.category];
        const livesSaved = (donation.amount / 1000000) * effectivenessRate;
        const costPerLife = donation.amount / livesSaved;
        
        return {
          ...donation,
          category: charity.category,
          livesSaved,
          costPerLife
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setDonorDonations(donorDonationsList);
  }, [donorName]);

  // Format functions
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

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

  if (!donorStats) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with back button */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-indigo-100 hover:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Impact List
            </Link>
            <h1 className="text-3xl font-bold text-white">{donorStats.name}</h1>
            <div></div> {/* Empty div for flex alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Donor stats card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Impact Rank</span>
              <span className="text-3xl font-bold text-indigo-600">#{donorStats.rank}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Lives Saved</span>
              <span className="text-3xl font-bold text-emerald-600">{formatNumber(Math.round(donorStats.livesSaved))}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Total Donated</span>
              <span className="text-3xl font-bold text-purple-600">{formatCurrency(donorStats.totalDonated)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className="text-3xl font-bold text-amber-600">{formatCurrency(Math.round(donorStats.costPerLifeSaved))}</span>
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
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Recipient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Lives Saved</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cost/Life</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {donorDonations.map((donation, index) => (
                  <tr key={`${donation.date}-${donation.charity}`} 
                      className={`transition-colors hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700">
                      {donation.charity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCategory(donation.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">
                      {formatNumber(Math.round(donation.livesSaved))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCurrency(Math.round(donation.costPerLife))}
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

export default DonorDetail;