import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import {
  getPrimaryCategoryId,
  getCategoryBreakdown,
  getDonationsForRecipient,
  getCurrentYear,
} from '../utils/donationDataHelpers';
import {
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import CustomValuesIndicator from '../components/shared/CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';
import AdjustAssumptionsButton from '../components/shared/AdjustAssumptionsButton';
import SearchInput from '../components/shared/SearchInput';
import Tooltip from '../components/shared/Tooltip';

const RecipientList = () => {
  const [recipientStats, setRecipientStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { combinedAssumptions, openModal } = useAssumptions();

  useEffect(() => {
    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    // Calculate recipient statistics
    const currentYear = getCurrentYear();
    const recipientStats = combinedAssumptions.getAllRecipients().map((recipient) => {
      // Use the recipient ID directly (now included in the object)
      const recipientId = recipient.id;

      const recipientDonations = getDonationsForRecipient(recipientId);
      const totalReceived = recipientDonations.reduce((sum, d) => {
        const creditedAmount = d.credit !== undefined ? d.amount * d.credit : d.amount;
        return sum + creditedAmount;
      }, 0);
      const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, currentYear);

      // Get the primary category and all categories for display
      const primaryCategoryId = getPrimaryCategoryId(combinedAssumptions, recipientId);

      if (!primaryCategoryId) {
        throw new Error(
          `No primary category found for recipient ${recipient.name}. Please check that this recipient has categories defined.`
        );
      }

      const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId);

      if (!primaryCategory) {
        throw new Error(
          `Invalid primary category ID: ${primaryCategoryId} for recipient ${recipient.name}. This category does not exist.`
        );
      }

      const categoryBreakdown = getCategoryBreakdown(combinedAssumptions, recipientId);

      // Get category names from breakdown
      const categoryNames = categoryBreakdown.map((category) => {
        const categoryObj = combinedAssumptions.getCategoryById(category.categoryId);

        if (!categoryObj) {
          throw new Error(
            `Invalid category ID: ${category.categoryId} for recipient ${recipient.name}. This category does not exist.`
          );
        }

        return categoryObj.name;
      });

      // Calculate total lives saved
      const totalLivesSaved = recipientDonations.reduce(
        (sum, donation) => sum + calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation),
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
  }, [combinedAssumptions]);

  // Filter recipients based on search term
  const filteredRecipients = searchTerm
    ? recipientStats.filter((recipient) => recipient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : recipientStats;

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
      label: (
        <Tooltip content="Lives saved is calculated by dividing each donation amount (after applying any credit adjustments) by the recipient's cost per life, then summing across all donations to the recipient.">
          <span className="border-b border-dotted border-slate-400 cursor-help">Lives Saved</span>
        </Tooltip>
      ),
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
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <div className="w-full sm:max-w-md">
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search recipients..." />
            </div>
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <CustomValuesIndicator />
              <AdjustAssumptionsButton onClick={openModal} />
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <SortableTable
                columns={recipientColumns}
                data={filteredRecipients}
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
