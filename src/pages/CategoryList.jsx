import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDonationsForRecipient, getRecipientId, getCurrentYear } from '../utils/donationDataHelpers';
import {
  getCostPerLifeFromCombined,
  calculateCategoryBreakdownForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { formatCurrency } from '../utils/formatters';
import { buildCausePath } from '../utils/causeRoutes';
import AssumptionsSelector from '../components/shared/AssumptionsSelector';
import ListPageShell from '../components/shared/ListPageShell';
import ImpactValueCell from '../components/shared/ImpactValueCell';
import useDocumentTitle from '../hooks/useDocumentTitle';

const buildCategoryStats = (combinedAssumptions) => {
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

    recipientDonations.forEach((donation) => {
      const categoryBreakdown = calculateCategoryBreakdownForDonationFromCombined(combinedAssumptions, donation);

      categoryBreakdown.forEach(({ categoryId, amount, livesSaved }) => {
        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + amount;
        categoryLivesSaved[categoryId] = (categoryLivesSaved[categoryId] || 0) + livesSaved;
      });
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

  return stats;
};

// Category table columns configuration (static — no component state involved)
const categoryColumns = [
  {
    key: 'name',
    label: 'Cause Name',
    render: (category) => (
      <div className="max-w-[300px] break-words">
        <Link to={buildCausePath(category.id)} className="impact-link text-sm font-medium">
          {category.name}
        </Link>
      </div>
    ),
  },
  {
    key: 'actualCostPerLife',
    label: 'Cost/Life',
    tooltip: (
      <div>
        Cost/Life comes from our cost-effectiveness estimates for this cause. It is the estimated donation needed to
        save the equivalent of one life in this area.
      </div>
    ),
    render: (category) => <ImpactValueCell kind="currency" value={category.actualCostPerLife} />,
  },
  {
    key: 'totalLivesSaved',
    label: 'Lives Saved',
    tooltip: (
      <div>
        Expected lives saved from donations to this cause, computed for each donation year and recipient/cause
        assumptions.
      </div>
    ),
    render: (category) => <ImpactValueCell kind="lives" value={category.totalLivesSaved} />,
  },
  {
    key: 'totalDonated',
    label: 'Total Donated',
    render: (category) => <div className="text-sm text-strong">{formatCurrency(category.totalDonated)}</div>,
  },
];

const CategoryList = () => {
  useDocumentTitle('Cause Areas');
  const { combinedAssumptions } = useAssumptions();

  const categoryStats = useMemo(() => buildCategoryStats(combinedAssumptions), [combinedAssumptions]);

  return (
    <ListPageShell title="Causes" subtitle="Focus areas for charitable giving">
      <AssumptionsSelector />
      <div className="impact-surface impact-surface--table">
        <SortableTable
          columns={categoryColumns}
          data={categoryStats}
          defaultSortColumn="actualCostPerLife"
          defaultSortDirection="asc"
          tiebreakColumn="totalLivesSaved"
          tiebreakDirection="desc"
        />
      </div>
    </ListPageShell>
  );
};

export default CategoryList;
