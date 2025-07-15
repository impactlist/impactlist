import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SortableTable from '../SortableTable';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { getEffectiveCostPerLife } from '../../utils/donationDataHelpers';

/**
 * Displays a table of donations for a donor or recipient entity.
 */
const EntityDonationTable = ({ donations, entityType, className = '', customValues = null }) => {
  const isDonor = entityType === 'donor';

  // Define columns based on entity type
  const donorColumns = [
    {
      key: 'date',
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-slate-900">
          {donation.isUnknown ? (
            <span className="text-slate-500">Unknown</span>
          ) : (
            new Date(donation.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (donation) =>
        donation.isUnknown ? (
          <span className="text-sm text-slate-500">{formatCurrency(donation.amount)}</span>
        ) : (
          <div>
            <a
              href={donation.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {formatCurrency(donation.creditedAmount || donation.amount)}
            </a>
            {donation.credit < 1 && (
              <div className="text-xs text-gray-500 mt-1">{Math.round(donation.credit * 100)}% credit</div>
            )}
          </div>
        ),
    },
    {
      key: 'recipient',
      label: 'Recipient',
      render: (donation) => (
        <div>
          {donation.isUnknown ? (
            <span className="text-sm text-slate-500">Unknown</span>
          ) : (
            <Link
              to={`/recipient/${encodeURIComponent(donation.recipientId)}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {donation.recipient}
            </Link>
          )}
        </div>
      ),
    },
    {
      key: 'categoryName',
      label: 'Category',
      render: (donation) => {
        // Get the primary category ID if it's not already in the donation object
        const categoryId = donation.categoryId || donation.primaryCategoryId;
        if (!categoryId) {
          throw new Error(`Category ID not found for donation ${donation.id}`);
        }

        return (
          <div className="text-sm text-slate-900">
            <Link
              to={`/category/${encodeURIComponent(categoryId)}`}
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {donation.categoryName}
            </Link>
            {donation.categoryCount > 1 && (
              <span className="text-xs text-slate-500 ml-1">(+{donation.categoryCount - 1})</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'livesSaved',
      label: 'Lives Saved',
      render: (donation) => (
        <div
          className={`text-sm ${
            donation.isUnknown ? 'text-slate-500' : donation.totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'
          }`}
        >
          {formatNumber(Math.round(donation.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-slate-500' : 'text-slate-900'}`}>
          {donation.totalLivesSaved === 0 ? (
            <span className="text-2xl">∞</span>
          ) : (
            formatCurrency(getEffectiveCostPerLife(donation, customValues))
          )}
        </div>
      ),
    },
  ];

  const recipientColumns = [
    {
      key: 'date',
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-slate-900">
          {new Date(donation.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (donation) => (
        <div>
          <a
            href={donation.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {formatCurrency(donation.creditedAmount || donation.amount)}
          </a>
          {donation.credit < 1 && (
            <div className="text-xs text-gray-500 mt-1">{Math.round(donation.credit * 100)}% credit</div>
          )}
        </div>
      ),
    },
    {
      key: 'donor',
      label: 'Donor',
      render: (donation) => (
        <div>
          <Link
            to={`/donor/${encodeURIComponent(donation.donorId)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {donation.donor}
          </Link>
        </div>
      ),
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(donation.totalLivesSaved))}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg mb-16 border border-slate-200 ${className}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">Donation History</h2>
      </div>
      <div className="overflow-x-auto">
        <SortableTable
          columns={isDonor ? donorColumns : recipientColumns}
          data={donations}
          defaultSortColumn="date"
          defaultSortDirection="desc"
        />
      </div>
    </motion.div>
  );
};

EntityDonationTable.propTypes = {
  donations: PropTypes.array.isRequired,
  entityType: PropTypes.oneOf(['donor', 'recipient']).isRequired,
  className: PropTypes.string,
  customValues: PropTypes.object,
};

export default React.memo(EntityDonationTable);
