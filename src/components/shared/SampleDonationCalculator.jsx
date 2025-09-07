import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import YearSelector from './YearSelector';
import NumericInput from './NumericInput';
import LivesSavedGraph from '../charts/LivesSavedGraph';
import { getCostPerLifeForRecipientFromCombined, getCostPerLifeFromCombined } from '../../utils/assumptionsDataHelpers';
import { formatCurrency, formatLives } from '../../utils/formatters';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import { calculateLivesSavedSegments } from '../../utils/effectsVisualization';

const SampleDonationCalculator = ({ recipientId, categoryId, combinedAssumptions }) => {
  const currentYear = getCurrentYear();
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [costPerLife, setCostPerLife] = useState(0);
  const [livesSaved, setLivesSaved] = useState(0);

  // Helper to get numeric value from NumericInput's output
  // NumericInput returns either a number or string (for partial inputs like "-" or ".")
  const getNumericValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/,/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Determine if we're working with a category or recipient
  const isCategory = !!categoryId;
  const entityId = categoryId || recipientId;

  // Calculate cost per life whenever year changes
  useEffect(() => {
    if (!combinedAssumptions || !entityId) return;

    try {
      const cost = isCategory
        ? getCostPerLifeFromCombined(combinedAssumptions, entityId, selectedYear)
        : getCostPerLifeForRecipientFromCombined(combinedAssumptions, entityId, selectedYear);
      setCostPerLife(cost);
    } catch {
      setCostPerLife(Infinity);
    }
  }, [combinedAssumptions, entityId, selectedYear, isCategory]);

  // Calculate lives saved whenever amount or cost per life changes
  useEffect(() => {
    const amount = getNumericValue(donationAmount);

    if (amount > 0 && costPerLife !== 0 && costPerLife !== Infinity) {
      setLivesSaved(amount / costPerLife);
    } else {
      setLivesSaved(0);
    }
  }, [donationAmount, costPerLife]);

  // Calculate segments and visualization data
  const visualizationData = useMemo(() => {
    const amount = getNumericValue(donationAmount);

    if (!combinedAssumptions || !entityId || amount <= 0 || costPerLife === Infinity) {
      return [];
    }

    // Calculate points using sampling approach - now returns points with effect breakdowns
    const points = calculateLivesSavedSegments(entityId, amount, selectedYear, combinedAssumptions, { isCategory });

    return points;
  }, [donationAmount, selectedYear, costPerLife, entityId, combinedAssumptions, isCategory]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Sample donation for year</h2>
        <YearSelector value={selectedYear} onChange={setSelectedYear} label="" className="" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        <div>
          <NumericInput
            id="sample-donation-amount"
            value={donationAmount}
            onChange={setDonationAmount}
            placeholder="Enter amount"
            label="Donation Amount"
            prefix="$"
            className=""
          />
        </div>

        <div className="flex items-center">
          <div className="space-y-1 mt-3">
            <div className="text-sm text-gray-600">
              Cost per life in {selectedYear}:{' '}
              <span className="font-semibold text-gray-900">
                {costPerLife === Infinity ? 'N/A' : formatCurrency(costPerLife)}
              </span>
            </div>

            {donationAmount && livesSaved !== 0 && (
              <div className="text-sm text-gray-600">
                Lives saved:{' '}
                <span className={`font-semibold ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {formatLives(livesSaved)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Graph - show whenever there's a valid donation amount */}
      {donationAmount && livesSaved !== 0 && visualizationData.length > 0 && (
        <div className="mt-6">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Discounted Lives Saved Over Time</h3>
            <LivesSavedGraph data={visualizationData} height={250} />
          </div>
        </div>
      )}
    </div>
  );
};

SampleDonationCalculator.propTypes = {
  recipientId: PropTypes.string,
  categoryId: PropTypes.string,
  combinedAssumptions: PropTypes.object.isRequired,
};

export default SampleDonationCalculator;
