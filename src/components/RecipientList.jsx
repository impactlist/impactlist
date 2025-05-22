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
import PageHeader from './PageHeader';
import AdjustAssumptionsButton from './AdjustAssumptionsButton';

const RecipientList = () => {
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
            <Link
              to={`/category/${encodeURIComponent(recipient.primaryCategoryId)}`}
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {recipient.primaryCategoryName}
            </Link>
          ) : (
            <div>
              <Link
                to={`/category/${encodeURIComponent(recipient.primaryCategoryId)}`}
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {recipient.primaryCategoryName}
              </Link>
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
    <>
      <BackButton to="/" label="Back to top donors" />
      <motion.div
        className="min-h-screen bg-slate-50 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <PageHeader title="Recipients" subtitle="Entities that have received donations" />

        {/* Recipients Table Container */}
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center space-x-3">
              <CustomValuesIndicator />
              <AdjustAssumptionsButton onClick={openModal} />
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <SortableTable
                columns={recipientColumns}
                data={recipientStats}
                defaultSortColumn="costPerLife"
                defaultSortDirection="asc"
                tiebreakColumn="totalLivesSaved"
                tiebreakDirection="desc"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default RecipientList;
