import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer
} from 'recharts';
import { 
  donations, 
  charities, 
  effectivenessCategories, 
  getCharityCostPerLife, 
  getCategoryCostPerLife,
  getCostPerLifeMultiplier,
  getPrimaryCategory,
  getCategoryBreakdown
} from '../data/donationData';
import SortableTable from './SortableTable';

function RecipientDetail(props) {
  const { recipientName } = useParams();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recipientDonations, setRecipientDonations] = useState([]);
  
  // Colors for the chart bars
  const COLORS = [
    '#4f46e5', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#818cf8',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#22c55e', '#84cc16', '#34d399',
    '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a3e635', '#fbbf24', '#fb923c',
    '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#3f3f46'
  ];

  useEffect(() => {
    // Get charity info
    const charity = charities.find(c => c.name === recipientName);
    
    if (charity) {
      const costPerLife = getCharityCostPerLife(charity);
      const categoryCostPerLife = getCategoryCostPerLife(charity);
      const costPerLifeMultiplier = getCostPerLifeMultiplier(charity);
      
      // Get primary category and category breakdown
      const primaryCategory = getPrimaryCategory(charity);
      const categoryBreakdown = getCategoryBreakdown(charity);
      
      // Filter donations for this charity
      const charityDonations = donations
        .filter(donation => donation.charity === recipientName)
        .map(donation => {
          // Apply credit multiplier if it exists
          const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
          
          const livesSaved = costPerLife < 0 ? 
            (creditedAmount / (costPerLife * -1)) * -1 : // Lives lost case
            creditedAmount / costPerLife; // Normal case
          
          return {
            ...donation,
            creditedAmount,
            livesSaved,
            dateObj: new Date(donation.date)
          };
        })
        .sort((a, b) => b.dateObj - a.dateObj);
      
      // Calculate total received
      const totalReceived = charityDonations.reduce((sum, donation) => sum + donation.amount, 0);
      const totalLivesSaved = charityDonations.reduce((sum, donation) => sum + donation.livesSaved, 0);
      
      setRecipientInfo({
        name: recipientName,
        categoryId: primaryCategory.id,
        categoryName: primaryCategory.name,
        categoryBreakdown,
        costPerLife,
        categoryCostPerLife,
        costPerLifeMultiplier,
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
          {formatCurrency(donation.creditedAmount || donation.amount)}
        </a>
      )
    },
    { 
      key: 'donor', 
      label: 'Donor',
      render: (donation) => (
        <div>
          <Link 
            to={`/donor/${encodeURIComponent(donation.donor)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {donation.donor}
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
    <motion.div 
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with back button - Hidden when using App layout */}
      {!props.hideHeader && (
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
      )}
      {/* Spacer when using App layout */}
      {props.hideHeader && <div className="h-10"></div>}

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Recipient name */}
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">{recipientInfo.name}</h1>
        
        {/* Recipient stats card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {recipientInfo.categoryBreakdown.length === 1 && (
              <div className="flex flex-col p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 uppercase font-semibold text-center mb-2">Focus Area</span>
                <div className="space-y-2">
                  {recipientInfo.categoryBreakdown.map((category) => (
                    <div key={category.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                      <span className="text-sm font-semibold text-slate-700">{category.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600 uppercase font-semibold">Cost Per Life</span>
              <span className="text-3xl font-bold text-slate-900">
                {recipientInfo.costPerLife === 0 ? <span className="text-6xl">∞</span> : `$${formatNumber(Math.round(recipientInfo.costPerLife))}`}
              </span>
              <span className="text-sm mt-2 text-slate-500">
                Category avg: {recipientInfo.categoryCostPerLife === 0 ? <span className="text-xl">∞</span> : `$${formatNumber(Math.round(recipientInfo.categoryCostPerLife))}`}
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
        </motion.div>

        {/* Focus Areas Bar Chart - Only show if multiple focus areas */}
        {recipientInfo.categoryBreakdown.length > 1 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg mb-8 border border-slate-200"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Focus Areas</h2>
              <p className="text-sm text-slate-500 mt-1">
                Distribution of focus areas by percentage
              </p>
            </div>
            
            <div className="py-4 px-2 relative overflow-hidden">
              <div 
                className="w-full overflow-visible"
                style={{ height: `${Math.max(200, recipientInfo.categoryBreakdown.length * 40)}px` }}
              >
                <ResponsiveContainer width="98%" height="100%">
                  <BarChart
                    data={recipientInfo.categoryBreakdown}
                    layout="vertical"
                    margin={{ top: 20, right: 100, left: 120, bottom: 5 }}
                    barGap={0}
                    barCategoryGap={8}
                  >
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      axisLine={true}
                      tick={{ 
                        fill: '#1e293b',
                        fontSize: 14,
                      }}
                      tickLine={true}
                      stroke="#1e293b"
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ 
                        fontSize: 14, 
                        fill: '#1e293b',
                        dy: 0
                      }}
                      axisLine={true}
                      stroke="#1e293b"
                      interval={0}
                    />
                    <Bar 
                      dataKey="percentage" 
                      name="Percentage"
                      radius={[0, 4, 4, 0]}
                      label={{ 
                        position: "right",
                        formatter: (value) => `${value}%`,
                        fontSize: 12,
                        fill: '#64748b'
                      }}
                    >
                      {recipientInfo.categoryBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={COLORS[index % COLORS.length]}
                          // Create a custom style for hover states - slightly lighter version
                          style={{
                            filter: 'brightness(1)',
                            transition: 'filter 0.2s ease-in-out',
                            cursor: 'pointer'
                          }}
                          // Event handlers for hover effect
                          onMouseEnter={(e) => {
                            e.target.style.filter = 'brightness(1.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.filter = 'brightness(1)';
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Donations list */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg mb-16 border border-slate-200"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
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
        </motion.div>
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

export default RecipientDetail;