import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/formatters';

/**
 * Form component for the donation calculator to input category-based donations.
 */
const CalculatorForm = ({
  categories,
  donations,
  onDonationChange,
  onReset,
  getLivesSavedForCategory,
  getCostPerLifeForCategory,
  className = '',
}) => {
  // Format for display
  const formatDonationInput = (value) => {
    if (!value) return '';
    const num = Number(value);
    return isNaN(num) ? value : num.toLocaleString();
  };

  return (
    <div className={`bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6 ${className}`}>
      {/* Donation inputs header with reset button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800">Donations by category</h3>
        <button
          onClick={onReset}
          className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805v2.203a1 1 0 01-1.707.707L1.707 8.13a1 1 0 010-1.415l2.586-2.586A1 1 0 015 3.99V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13.5V11a1 1 0 012 0v2a7.002 7.002 0 01-11.601 5.29 1 1 0 01-.61-1.275l.009-.019.354-.707a1 1 0 01.614-.61z"
              clipRule="evenodd"
            />
          </svg>
          Reset All Amounts
        </button>
      </div>

      {/* Donation inputs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {categories.map((category) => {
          const amount = donations[category.id] || '';
          const livesSaved = getLivesSavedForCategory(category.id, amount);
          const costPerLife = getCostPerLifeForCategory(category.id);

          return (
            <div
              key={category.id}
              className="px-4 py-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-1">
                <label className="text-sm font-medium text-slate-800" htmlFor={`donation-${category.id}`}>
                  {category.name}
                </label>
                <span className="text-xs text-slate-500">${formatNumber(costPerLife)}/life</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="text-slate-700 mr-1">$</span>
                <input
                  id={`donation-${category.id}`}
                  type="text"
                  inputMode="decimal"
                  value={formatDonationInput(amount)}
                  onChange={(e) => onDonationChange(category.id, e.target.value)}
                  className="w-full py-0.5 px-2 border rounded text-sm leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              {amount && !isNaN(Number(amount)) && (
                <div className={`text-sm ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  Lives saved: {livesSaved < 0 ? '-' : ''}
                  {formatNumber(Math.abs(livesSaved))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

CalculatorForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  donations: PropTypes.object.isRequired,
  onDonationChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  getLivesSavedForCategory: PropTypes.func.isRequired,
  getCostPerLifeForCategory: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default React.memo(CalculatorForm);
