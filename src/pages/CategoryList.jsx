import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import { getDonationsForRecipient, getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import {
  getCostPerLifeFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { formatNumber, formatCurrency } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';

const CategoryList = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const { combinedAssumptions } = useAssumptions();

  useEffect(() => {
    // Get all categories
    const categories = combinedAssumptions.getAllCategories();

    // Get all recipients and their donations to calculate totals by category
    const recipients = combinedAssumptions.getAllRecipients();

    // Initialize totals
    const categoryTotals = {};
    const categoryLivesSaved = {};

    // Initialize data structure for each category
    categories.forEach((category) => {
      categoryTotals[category.id] = 0;
      categoryLivesSaved[category.id] = 0;
    });

    // Calculate total donations and lives saved for each category
    recipients.forEach((recipient) => {
      const recipientId = getRecipientId(recipient);
      if (!recipientId) return;

      const recipientDonations = getDonationsForRecipient(recipientId);

      // For each donation to this recipient
      recipientDonations.forEach((donation) => {
        const creditedAmount = donation.credit !== undefined ? donation.amount * donation.credit : donation.amount;
        const livesSaved = calculateLivesSavedForDonationFromCombined(combinedAssumptions, donation);

        // If the donation has category information
        if (donation.categoryId) {
          categoryTotals[donation.categoryId] = (categoryTotals[donation.categoryId] || 0) + creditedAmount;
          categoryLivesSaved[donation.categoryId] = (categoryLivesSaved[donation.categoryId] || 0) + livesSaved;
        }
        // If the recipient has categories, split among them according to fractions
        else if (recipient.categories) {
          Object.entries(recipient.categories).forEach(([categoryId, categoryData]) => {
            const fraction = categoryData.fraction || 0;
            const amountForCategory = creditedAmount * fraction;
            const livesSavedForCategory = livesSaved * fraction;

            categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + amountForCategory;
            categoryLivesSaved[categoryId] = (categoryLivesSaved[categoryId] || 0) + livesSavedForCategory;
          });
        }
      });
    });

    // Prepare the category stats for display
    const currentYear = getCurrentYear();
    const stats = categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        costPerLife: getCostPerLifeFromCombined(combinedAssumptions, category.id, currentYear),
        actualCostPerLife: getCostPerLifeFromCombined(combinedAssumptions, category.id, currentYear),
        totalDonated: categoryTotals[category.id] || 0,
        totalLivesSaved: categoryLivesSaved[category.id] || 0,
      };
    });

    setCategoryStats(stats);
  }, [combinedAssumptions]);

  // Category table columns configuration
  const categoryColumns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (category) => (
        <div className="max-w-[300px] break-words">
          <Link
            to={`/category/${encodeURIComponent(category.id)}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {category.name}
          </Link>
        </div>
      ),
    },
    {
      key: 'actualCostPerLife',
      label: 'Cost/Life',
      render: (category) => {
        return (
          <div className={`text-sm ${category.actualCostPerLife < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {category.actualCostPerLife === 0 ? '∞' : formatCurrency(category.actualCostPerLife)}
          </div>
        );
      },
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      render: (category) => (
        <div className={`text-sm ${category.totalLivesSaved < 0 ? 'text-red-700' : 'text-slate-900'}`}>
          {formatNumber(Math.round(category.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'totalDonated',
      label: 'Total Donated',
      render: (category) => <div className="text-sm text-slate-900">{formatCurrency(category.totalDonated)}</div>,
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
        <PageHeader title="Categories" subtitle="Focus areas for charitable donations" />

        {/* Categories Table Container */}
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <SortableTable
                columns={categoryColumns}
                data={categoryStats}
                defaultSortColumn="actualCostPerLife"
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

export default CategoryList;
