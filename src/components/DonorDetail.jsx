import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { calculateDonorStats, donations, charities, effectivenessCategories, getCharityCostPerLife, donors } from '../data/donationData';
import SortableTable from './SortableTable';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function DonorDetail() {
  const { donorName } = useParams();
  const [donorStats, setDonorStats] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  
  // Colors for the chart segments - extended palette with more variety
  const COLORS = [
    // Blues and purples
    '#4f46e5', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#818cf8',
    // Greens and teals
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#22c55e', '#84cc16', '#34d399',
    // Yellows, oranges, reds
    '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a3e635', '#fbbf24', '#fb923c',
    // Pinks and additional colors
    '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#450a0a', '#3f3f46',
    '#78350f', '#1e3a8a', '#064e3b', '#701a75', '#0c4a6e', '#7c2d12', '#134e4a'
  ];

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
        
        // Apply credit multiplier if it exists
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        
        const livesSaved = costPerLife < 0 ? 
          (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
          creditedAmount / costPerLife; // Normal case
        
        return {
          ...donation,
          creditedAmount,
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
    
    // Prepare category data for the pie chart
    // Group donations by category and sum amounts
    const categoryAmounts = {};
    let chartDonationsTotal = 0;
    
    donorDonationsList.forEach(donation => {
      // Skip unknown donations for the chart
      if (donation.isUnknown) return;
      
      const category = donation.categoryName;
      if (!categoryAmounts[category]) {
        categoryAmounts[category] = {
          name: category,
          value: 0,
          category: donation.category
        };
      }
      categoryAmounts[category].value += donation.amount;
      chartDonationsTotal += donation.amount;
    });
    
    // Transform object into array for Recharts and add percentage of known total
    const categoryChartData = Object.values(categoryAmounts).map(category => ({
      ...category,
      percentage: (category.value / chartDonationsTotal * 100).toFixed(1)
    }));
    
    // Sort by donation amount (largest first)
    categoryChartData.sort((a, b) => b.value - a.value);
    
    // Limit to top categories and combine small ones into "Other" if there are many
    if (categoryChartData.length > 12) {
      const topCategories = categoryChartData.slice(0, 11);
      const otherCategories = categoryChartData.slice(11);
      
      const otherTotal = otherCategories.reduce((total, item) => total + item.value, 0);
      const otherPercentage = (otherTotal / chartDonationsTotal * 100).toFixed(1);
      
      if (otherTotal > 0) {
        topCategories.push({
          name: 'Other Categories',
          value: otherTotal,
          percentage: otherPercentage
        });
      }
      
      setCategoryData(topCategories);
    } else {
      setCategoryData(categoryChartData);
    }
  }, [donorName]);

  // Format functions
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  const formatCurrency = (amount, effectivenessRate = null) => {
    if (!amount || effectivenessRate === 0) {
      return '∞';
    } else if (amount >= 1000000000) {
      const value = amount / 1000000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}B`;
    } else if (amount >= 1000000) {
      const value = amount / 1000000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const value = amount / 1000;
      return `$${Number.isInteger(value) ? value.toString() : value.toFixed(1)}K`;
    } else {
      return `$${formatNumber(amount)}`;
    }
  };
  
  // Custom pie chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && donorStats) {
      const data = payload[0];
      if (!data || !data.payload) return null;
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-slate-500">
            {data.payload.percentage ? `${data.payload.percentage}% of known donations` : ''}
          </p>
          {data.name !== 'Other Categories' && data.payload.category && (
            <div className="mt-1 pt-1 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                Cost per life: {formatCurrency(effectivenessCategories[data.payload.category]?.costPerLife || 0)}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
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
          {formatCurrency(donation.creditedAmount || donation.amount)}
        </a>
      )
    },
    { 
      key: 'charity', 
      label: 'Recipient',
      render: (donation) => (
        donation.isUnknown ? 
        <span className="text-sm text-slate-500">Unknown</span> :
        <div>
          <Link 
            to={`/recipient/${encodeURIComponent(donation.charity)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {donation.charity}
          </Link>
          {donation.credit !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              via intermediary, {Math.round(donation.credit * 100)}% credit
            </div>
          )}
        </div>
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

        {/* Donation categories visualization */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Donation Categories by Amount</h2>
            <p className="text-sm text-slate-500 mt-1">Showing distribution of known donations by category</p>
          </div>
          <div className="py-4 px-2">
            <div className="h-96 w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="98%" height="100%">
                  <BarChart
                    data={categoryData} 
                    layout="vertical"
                    margin={{ top: 20, right: 150, left: 90, bottom: 5 }}
                  >
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => formatCurrency(value)} 
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                      axisLine={true}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => `${value} (By Category)`} />
                    <Bar 
                      dataKey="value" 
                      name="Donation Amount" 
                      radius={[0, 4, 4, 0]}
                      label={{ 
                        position: "right",
                        formatter: (value, entry) => {
                          if (!entry || !entry.percentage) return formatCurrency(value);
                          return `${formatCurrency(value)} (${entry.percentage}%)`;
                        },
                        fontSize: 11,
                        fill: '#64748b',
                        offset: 5
                      }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-slate-500">No donation data available</p>
                </div>
              )}
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