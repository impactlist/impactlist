import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import YearSelector from './YearSelector';
import LivesSavedGraph from '../charts/LivesSavedGraph';
import { getCostPerLifeForRecipientFromCombined } from '../../utils/assumptionsDataHelpers';
import { formatNumberWithCommas, formatCurrency, formatLives } from '../../utils/formatters';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import {
  calculateLivesSavedSegments,
  generateVisualizationPoints,
  calculateIntegralBreakdown,
} from '../../utils/effectsVisualization';

const SampleDonationCalculator = ({ recipientId, combinedAssumptions }) => {
  const currentYear = getCurrentYear();
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [costPerLife, setCostPerLife] = useState(0);
  const [livesSaved, setLivesSaved] = useState(0);

  // Calculate cost per life whenever year changes
  useEffect(() => {
    if (!combinedAssumptions || !recipientId) return;

    try {
      const cost = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, selectedYear);
      setCostPerLife(cost);
    } catch {
      setCostPerLife(Infinity);
    }
  }, [combinedAssumptions, recipientId, selectedYear]);

  // Calculate lives saved whenever amount or cost per life changes
  useEffect(() => {
    const amount = parseFloat(donationAmount.replace(/,/g, ''));

    if (!isNaN(amount) && amount > 0 && costPerLife > 0 && costPerLife !== Infinity) {
      setLivesSaved(amount / costPerLife);
    } else {
      setLivesSaved(0);
    }
  }, [donationAmount, costPerLife]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and commas
    if (value === '' || /^[\d,]*\.?\d*$/.test(value)) {
      setDonationAmount(value);
    }
  };

  const handleAmountBlur = () => {
    // Format with commas on blur
    const amount = parseFloat(donationAmount.replace(/,/g, ''));
    if (!isNaN(amount) && amount > 0) {
      setDonationAmount(formatNumberWithCommas(amount.toString()));
    }
  };

  // Calculate segments and visualization data
  const { visualizationData, breakdown } = useMemo(() => {
    const amount = parseFloat(donationAmount.replace(/,/g, ''));

    if (!combinedAssumptions || !recipientId || isNaN(amount) || amount <= 0 || costPerLife === Infinity) {
      return { visualizationData: [], breakdown: null };
    }

    // Calculate raw points using sampling approach
    const rawPoints = calculateLivesSavedSegments(recipientId, amount, selectedYear, combinedAssumptions);

    // Generate visualization points in the format expected by the graph
    const vizData = generateVisualizationPoints(rawPoints);

    // Calculate breakdown
    const integralBreakdown = calculateIntegralBreakdown(vizData);

    return {
      visualizationData: vizData,
      breakdown: integralBreakdown,
    };
  }, [donationAmount, selectedYear, costPerLife, recipientId, combinedAssumptions]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <span className="text-gray-700 font-medium">Sample donation for year</span>
        <YearSelector value={selectedYear} onChange={setSelectedYear} label="" className="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sample-donation-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              id="sample-donation-amount"
              value={donationAmount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              placeholder="Enter amount"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <div className="text-sm text-gray-600">
            Cost per life in {selectedYear}:{' '}
            <span className="font-semibold text-gray-900">
              {costPerLife === Infinity ? 'N/A' : formatCurrency(costPerLife)}
            </span>
          </div>

          {donationAmount && livesSaved > 0 && (
            <div className={`text-sm ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
              Lives saved: <span className="font-semibold">{formatLives(livesSaved)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Graph - show whenever there's a valid donation amount */}
      {donationAmount && livesSaved > 0 && visualizationData.length > 0 && (
        <div className="mt-6">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Discounted Lives Saved Over Time</h3>
            <LivesSavedGraph data={visualizationData} breakdown={breakdown} height={250} />
          </div>
        </div>
      )}
    </div>
  );
};

SampleDonationCalculator.propTypes = {
  recipientId: PropTypes.string.isRequired,
  combinedAssumptions: PropTypes.object.isRequired,
};

export default SampleDonationCalculator;
