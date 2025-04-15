import { useState, useEffect } from 'react'
import './App.css'
import { calculateDonorStats } from './data/donationData'

function App() {
  const [donorStats, setDonorStats] = useState([])

  useEffect(() => {
    // Calculate donor statistics on component mount
    const stats = calculateDonorStats()
    setDonorStats(stats)
  }, [])

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US')
  }

  // Format dollar amounts
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else {
      return `$${formatNumber(amount)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="impact-header">
        <h1 className="text-3xl font-bold mb-1">Impact List</h1>
        <p className="text-gray-100">Ranking of people by world impact through donations</p>
      </div>
      
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg overflow-hidden mx-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lives Saved</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donated</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Life</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Worth</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donorStats.map((donor) => (
              <tr key={donor.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium rank-cell">
                  {donor.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(Math.round(donor.livesSaved))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(donor.totalDonated)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(Math.round(donor.costPerLifeSaved))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(donor.netWorth)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App