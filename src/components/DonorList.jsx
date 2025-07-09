import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  calculateDonorStats,
  getCostPerLifeForRecipient,
  getPrimaryCategoryId,
  getDonationsForRecipient,
  getCategoryById,
  getAllRecipients,
  getTotalAmountForRecipient,
  calculateLivesSavedForDonation,
  getRecipientId,
} from '../utils/donationDataHelpers';
import SortableTable from './SortableTable';
import { useCostPerLife } from './CostPerLifeContext';
import CustomValuesIndicator from './CustomValuesIndicator';
import { formatNumber, formatCurrency } from '../utils/formatters';
import PageHeader from './PageHeader';
import AdjustAssumptionsButton from './AdjustAssumptionsButton';

const DonorList = () => {
  const [donorStats, setDonorStats] = useState([]);
  const [, setRecipientStats] = useState([]);
  const { customValues, openModal } = useCostPerLife();

  useEffect(() => {
    // Calculate donor statistics on component mount
    const stats = calculateDonorStats(customValues);
    setDonorStats(stats);

    // Calculate recipient statistics
    const recipientStats = getAllRecipients()
      .map((recipient) => {
        // Find the recipient ID
        const recipientId = getRecipientId(recipient);

        if (!recipientId) {
          throw new Error(
            `Could not find ID for recipient ${recipient.name}. This recipient exists in the data but has no ID mapping.`
          );
        }

        const totalReceived = getTotalAmountForRecipient(recipientId);
        const costPerLife = getCostPerLifeForRecipient(recipientId, customValues);

        // Get the primary category for display
        const primaryCategoryId = getPrimaryCategoryId(recipientId);
        const primaryCategory = getCategoryById(primaryCategoryId);

        if (!primaryCategory) {
          throw new Error(
            `Invalid primary category "${primaryCategoryId}" for recipient "${recipient.name}". This category does not exist in categoriesById.`
          );
        }

        // Calculate total lives saved for this recipient
        const recipientDonations = getDonationsForRecipient(recipientId);
        const totalLivesSaved = recipientDonations.reduce(
          (sum, donation) => sum + calculateLivesSavedForDonation(donation, customValues),
          0
        );

        return {
          id: recipientId,
          name: recipient.name,
          primaryCategoryId: primaryCategoryId,
          categoryName: primaryCategory.name,
          totalReceived,
          costPerLife,
          totalLivesSaved,
        };
      })
      .filter((recipient) => recipient !== null) // Filter out any recipients that couldn't be processed
      .sort((a, b) => b.totalLivesSaved - a.totalLivesSaved);

    setRecipientStats(recipientStats);
  }, [customValues]);

  // Donor table columns configuration
  const donorColumns = [
    {
      key: 'rank',
      label: 'Rank',
      render: (donor) => <div className="text-sm text-slate-900 w-8 mx-auto text-center">{donor.rank}</div>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (donor) => (
        <Link
          to={`/donor/${encodeURIComponent(donor.id)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {donor.name}
        </Link>
      ),
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      render: (donor) => (
        <div className={`text-sm ${donor.totalLivesSaved < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {formatNumber(Math.round(donor.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'totalDonated',
      label: 'Donated',
      render: (donor) => <div className="text-sm text-slate-900">{formatCurrency(donor.totalDonated)}</div>,
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      render: (donor) => (
        <div className={`text-sm ${donor.costPerLife < 0 ? 'text-red-600' : 'text-slate-900'}`}>
          {donor.totalLivesSaved === 0 ? '∞' : formatCurrency(donor.costPerLife)}
        </div>
      ),
    },
    {
      key: 'netWorth',
      label: 'Net Worth',
      render: (donor) => <div className="text-sm text-slate-900">{formatCurrency(donor.netWorth)}</div>,
    },
  ];

  return (
    <>
      <div className="h-10"></div>
      <motion.div
        className="min-h-screen bg-slate-50 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <PageHeader title="Impact List" subtitle="Ranking donors by their positive impact on the world" />

        {/* Donors Table Container */}
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
                columns={donorColumns}
                data={donorStats}
                defaultSortColumn="totalLivesSaved"
                defaultSortDirection="desc"
                rankKey="rank"
              />
            </div>
          </div>
        </motion.div>

        {/* Links to other pages */}
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex justify-center items-center">
            <Link
              to="/calculator"
              className="text-indigo-600 hover:text-indigo-800 hover:underline text-base"
              onClick={() => window.scrollTo(0, 0)}
            >
              Calculate the lives you could save with your donations →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DonorList;
