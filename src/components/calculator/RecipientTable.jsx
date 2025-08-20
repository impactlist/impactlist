import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SortableTable from '../shared/SortableTable';
import CategoryDisplay from '../CategoryDisplay';
import { formatCurrency, formatLives } from '../../utils/formatters';

/**
 * Table component to display specific recipient donations with sorting and actions.
 */
const RecipientTable = ({
  donations,
  categories,
  combinedAssumptions,
  onAddClick,
  onEditClick,
  onDeleteClick,
  calculateLivesSaved,
  getCostPerLife,
  className = '',
}) => {
  if (donations.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 p-6 mb-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800">Your Specific Donations</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onDeleteClick && donations.forEach((donation) => onDeleteClick(donation.id))}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <SortableTable
          columns={[
            {
              key: 'amount',
              label: 'Amount',
              render: (donation) => (
                <div className="text-sm font-medium text-slate-700">{formatCurrency(donation.amount)}</div>
              ),
            },
            {
              key: 'date',
              label: 'Year',
              render: (donation) => <div className="text-sm font-medium text-slate-700">{donation.date || 'N/A'}</div>,
            },
            {
              key: 'recipientName',
              label: 'Recipient',
              render: (donation) => (
                <div>
                  {donation.isCustomRecipient ? (
                    <span className="text-sm font-medium text-slate-700">{donation.recipientName}</span>
                  ) : (
                    <Link
                      to={`/recipient/${encodeURIComponent(
                        combinedAssumptions.findRecipientId(donation.recipientName) || ''
                      )}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {donation.recipientName}
                    </Link>
                  )}
                </div>
              ),
            },
            {
              key: 'category',
              label: 'Category',
              render: (donation) => (
                <CategoryDisplay
                  donation={donation}
                  categories={categories}
                  combinedAssumptions={combinedAssumptions}
                />
              ),
            },
            {
              key: 'lives',
              label: 'Lives Saved',
              render: (donation) => {
                const livesSaved = calculateLivesSaved(donation);
                return (
                  <div className={`text-sm font-medium ${livesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {livesSaved < 0 ? '-' : ''}
                    {formatLives(Math.abs(livesSaved))}
                  </div>
                );
              },
            },
            {
              key: 'costPerLife',
              label: 'Cost Per Life',
              render: (donation) => {
                const costPerLife = getCostPerLife(donation);
                return <div className="text-sm font-medium text-slate-700">{formatCurrency(costPerLife)}</div>;
              },
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (donation) => (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditClick && onEditClick(donation)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Edit donation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDeleteClick && onDeleteClick(donation.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Delete donation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ),
            },
          ]}
          data={donations}
          defaultSortColumn="amount"
          defaultSortDirection="desc"
        />
      </div>

      {/* Add donation button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Specific Donation
        </button>
      </div>
    </motion.div>
  );
};

RecipientTable.propTypes = {
  donations: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  combinedAssumptions: PropTypes.object.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  calculateLivesSaved: PropTypes.func.isRequired,
  getCostPerLife: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default React.memo(RecipientTable);
