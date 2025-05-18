import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from './BackButton';
import {
  getCostPerLifeForRecipient,
  getPrimaryCategoryId,
  getCategoryBreakdown,
  getAllRecipients,
  getDonationsForRecipient,
  getCategoryById,
  getRecipientId,
  calculateLivesSavedForDonation,
} from '../utils/donationDataHelpers';
import SortableTable from './SortableTable';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';

const RecipientList = (props) => {
  const [recipientStats, setRecipientStats] = useState([]);
  const { customValues, openModal } = useCostPerLife();

  useEffect(() => {
    // Calculate recipient statistics
    const recipientStats = getAllRecipients().map((recipient) => {
      const recipientId = getRecipientId(recipient);

      if (!recipientId) {
        throw new Error(
          `Could not find ID for recipient ${recipient.name}. Please check that this recipient has a valid ID.`
        );
      }

      const recipientDonations = getDonationsForRecipient(recipientId);
      const totalReceived = recipientDonations.reduce((sum, d) => {
        const creditedAmount = d.credit !== undefined ? d.amount * d.credit : d.amount;
        return sum + creditedAmount;
      }, 0);
      const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);

      // Get the primary category and all categories for display
      const primaryCategoryId = getPrimaryCategoryId(recipientId);

      if (!primaryCategoryId) {
        throw new Error(
          `No primary category found for recipient ${recipient.name}. Please check that this recipient has categories defined.`
        );
      }

      const primaryCategory = getCategoryById(primaryCategoryId);

      if (!primaryCategory) {
        throw new Error(
          `Invalid primary category ID: ${primaryCategoryId} for recipient ${recipient.name}. This category does not exist.`
        );
      }

      const categoryBreakdown = getCategoryBreakdown(recipientId);

      // Get category names from breakdown
      const categoryNames = categoryBreakdown.map((category) => {
        const categoryObj = getCategoryById(category.categoryId);

        if (!categoryObj) {
          throw new Error(
            `Invalid category ID: ${category.categoryId} for recipient ${recipient.name}. This category does not exist.`
          );
        }

        return categoryObj.name;
      });

      // Calculate total lives saved
      const totalLivesSaved = recipientDonations.reduce(
        (sum, donation) => sum + calculateLivesSavedForDonation(donation, customValues),
        0
      );

      return {
        id: recipientId,
        name: recipient.name,
        primaryCategoryId: primaryCategoryId,
        primaryCategoryName: primaryCategory.name,
        categoryNames,
        totalReceived,
        costPerLife,
        totalLivesSaved,
      };
    });

    // Let SortableTable handle the sorting with the special logic
    setRecipientStats(recipientStats);
  }, [customValues]);

  // Recipient table columns configuration
  const recipientColumns = [
    {
      key: 'name',
      label: 'Organization',
      render: (recipient) => (
        <div className="max-w-[300px] break-words">
          <Link
            to={`/recipient/${encodeURIComponent(recipient.id)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {recipient.name}
          </Link>
        </div>
      ),
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      render: (recipient) => (
        <div className={`text-sm ${recipient.totalLivesSaved < 0 ? 'text-red-700' : 'text-slate-900'}`}>
          {formatNumber(Math.round(recipient.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      render: (recipient) => {
        return (
          <div className={`text-sm ${recipient.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {recipient.costPerLife === 0 ? '∞' : formatCurrency(recipient.costPerLife)}
          </div>
        );
      },
    },
    {
      key: 'totalReceived',
      label: 'Total Received',
      render: (recipient) => <div className="text-sm text-slate-900">{formatCurrency(recipient.totalReceived)}</div>,
    },
    {
      key: 'primaryCategoryName',
      label: 'Focus Area',
      render: (recipient) => (
        <div className="text-sm text-slate-900">
          {recipient.categoryNames.length === 1 ? (
            recipient.primaryCategoryName
          ) : (
            <div>
              <div>{recipient.primaryCategoryName}</div>
              {recipient.categoryNames.length > 1 && (
                <div className="text-xs text-gray-500 mt-1">+{recipient.categoryNames.length - 1} more</div>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-slate-50 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Hidden when using App layout */}
      {!props.hideHeader && (
        <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-10 mb-10 text-center shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Donation Recipients</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">Ranked by total lives saved through donations</p>
          </div>
        </div>
      )}
      {/* Spacer when using App layout */}
      {props.hideHeader && <div className="h-10"></div>}

      {/* Back Link */}
      <BackButton to="/" label="Back to top donors" />

      {/* Recipients Table Container */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Donation Recipients</h2>
          <div className="flex items-center space-x-3">
            <CustomValuesIndicator />
            <button
              onClick={openModal}
              className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 bg-white rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Adjust Assumptions
            </button>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <SortableTable
              columns={recipientColumns}
              data={recipientStats}
              defaultSortColumn="totalLivesSaved"
              defaultSortDirection="desc"
            />
          </div>
        </div>
      </motion.div>

      {/* Footer - Hidden when using App layout */}
      {!props.hideHeader && (
        <div className="w-full py-6 bg-slate-800 text-center">
          <p className="text-sm text-slate-400">Data compiled from public donations and impact estimates</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecipientList;
