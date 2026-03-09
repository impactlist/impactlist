import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getPrimaryCategoryId,
  getDonationsForRecipient,
  getTotalAmountForRecipient,
  getCurrentYear,
} from '../utils/donationDataHelpers';
import {
  calculateDonorStatsFromCombined,
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { formatNumber, formatCurrency } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';
import DonorPhoto from '../components/shared/DonorPhoto';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';

const DonorList = () => {
  const [donorStats, setDonorStats] = useState([]);
  const [, setRecipientStats] = useState([]);
  const { combinedAssumptions } = useAssumptions();

  useEffect(() => {
    if (!combinedAssumptions) {
      throw new Error('combinedAssumptions is required but does not exist.');
    }

    // Calculate donor statistics on component mount
    const stats = calculateDonorStatsFromCombined(combinedAssumptions);
    setDonorStats(stats);

    // Calculate recipient statistics
    const recipientStats = combinedAssumptions
      .getAllRecipients()
      .map((recipient) => {
        // Use the recipient ID directly (now included in the object)
        const recipientId = recipient.id;

        const totalReceived = getTotalAmountForRecipient(recipientId);
        const costPerLife = getCostPerLifeForRecipientFromCombined(combinedAssumptions, recipientId, getCurrentYear());

        // Get the primary category for display
        const primaryCategoryId = getPrimaryCategoryId(combinedAssumptions, recipientId);
        const primaryCategory = combinedAssumptions.getCategoryById(primaryCategoryId);

        if (!primaryCategory) {
          throw new Error(
            `Invalid primary category "${primaryCategoryId}" for recipient "${recipient.name}". This category does not exist in categoriesById.`
          );
        }

        // Calculate total lives saved for this recipient
        const recipientDonations = getDonationsForRecipient(recipientId);
        const totalLivesSaved = recipientDonations.reduce(
          (sum, donation) => sum + calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation),
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
  }, [combinedAssumptions]);

  // Donor table columns configuration
  const donorColumns = [
    {
      key: 'photo',
      label: '',
      render: (donor) => (
        <div className="flex justify-center">
          <DonorPhoto donorId={donor.id} donorName={donor.name} size="small" />
        </div>
      ),
    },
    {
      key: 'rank',
      label: 'Rank',
      render: (donor) => <div className="text-sm text-strong">{donor.rank}</div>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (donor) => (
        <Link to={`/donor/${encodeURIComponent(donor.id)}`} className="impact-link text-sm font-medium">
          {donor.name}
        </Link>
      ),
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      tooltip: (
        <div>
          We first calculate the expected lives saved for each donation a person has made, based on our cost
          effectiveness estimates for every charity. We then sum these values across all the donations a person has made
          to get their total expected lives saved.
          <br />
          <br />
          See the FAQ for more details.
        </div>
      ),
      render: (donor) => (
        <div className={`text-sm ${donor.totalLivesSaved < 0 ? 'text-danger' : 'text-success'}`}>
          {formatNumber(Math.round(donor.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'totalDonated',
      label: 'Donated',
      render: (donor) => <div className="text-sm text-strong">{formatCurrency(donor.totalDonated)}</div>,
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      tooltip: (
        <div>
          Cost/Life is the amount donated divided by the lives saved. For every dollar amount shown here, the equivalent
          of one life is expected to be saved.
        </div>
      ),
      render: (donor) => (
        <div className={`text-sm ${donor.costPerLife < 0 ? 'text-danger' : 'text-strong'}`}>
          {donor.totalLivesSaved === 0 ? '∞' : formatCurrency(donor.costPerLife)}
        </div>
      ),
    },
    {
      key: 'netWorth',
      label: 'Net Worth',
      render: (donor) => <div className="text-sm text-strong">{formatCurrency(donor.netWorth)}</div>,
    },
  ];

  return (
    <>
      <motion.div
        className="impact-page flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <PageHeader
          title="Impact List"
          subtitle="Ranking donors by their positive impact on the world"
          className="pt-8 sm:pt-10"
        />

        {/* Donors Table Container */}
        <motion.div
          className="impact-page__container mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <AssumptionsSelector />

          <div className="impact-surface impact-surface--table">
            <SortableTable
              columns={donorColumns}
              data={donorStats}
              defaultSortColumn="totalLivesSaved"
              defaultSortDirection="desc"
              rankKey="rank"
            />
          </div>
        </motion.div>

        {/* Links to other pages */}
        <motion.div
          className="impact-page__container mb-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex justify-center items-center">
            <Link to="/calculator" className="impact-link text-base" onClick={() => window.scrollTo(0, 0)}>
              Calculate the lives you could save with your donations →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DonorList;
