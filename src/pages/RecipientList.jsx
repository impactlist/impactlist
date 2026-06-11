import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getPrimaryCategoryId,
  getCategoryBreakdown,
  getCreditedAmount,
  getDonationsForRecipient,
  getCurrentYear,
} from '../utils/donationDataHelpers';
import {
  getCostPerLifeForRecipientFromCombined,
  calculateLivesSavedForDonationFromCombined,
} from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { formatCurrency } from '../utils/formatters';
import { buildCausePath } from '../utils/causeRoutes';
import ListSearchControls from '../components/shared/ListSearchControls';
import ListPageShell from '../components/shared/ListPageShell';
import ImpactValueCell from '../components/shared/ImpactValueCell';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useNameSearch from '../hooks/useNameSearch';

const buildRecipientStats = (combinedAssumptions) => {
  const currentYear = getCurrentYear();
  return combinedAssumptions.getAllRecipients().map((recipient) => {
    // Use the recipient ID directly (now included in the object)
    const recipientId = recipient.id;

    const recipientDonations = getDonationsForRecipient(recipientId);
    const totalReceived = recipientDonations.reduce((sum, d) => sum + getCreditedAmount(d), 0);
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
};

// Recipient table columns configuration (static — no component state involved)
const recipientColumns = [
  {
    key: 'name',
    label: 'Organization',
    render: (recipient) => (
      <div className="max-w-[300px] break-words">
        <Link to={`/recipient/${encodeURIComponent(recipient.id)}`} className="impact-link text-sm font-medium">
          {recipient.name}
        </Link>
      </div>
    ),
  },
  {
    key: 'totalLivesSaved',
    label: 'Lives Saved',
    tooltip: (
      <div>
        Expected lives saved from donations to this organization, using our effectiveness estimates from the cost/life
        column together with the total amount given.
      </div>
    ),
    render: (recipient) => <ImpactValueCell kind="lives" value={recipient.totalLivesSaved} />,
  },
  {
    key: 'costPerLife',
    label: 'Cost/Life',
    tooltip: (
      <div>
        Cost/Life comes from our cost-effectiveness estimates for this organization. It is the estimated amount one
        would need to donate to this organization to save the equivalent of one life.
      </div>
    ),
    render: (recipient) => <ImpactValueCell kind="currency" value={recipient.costPerLife} />,
  },
  {
    key: 'totalReceived',
    label: 'Total Received',
    render: (recipient) => <div className="text-sm text-strong">{formatCurrency(recipient.totalReceived)}</div>,
  },
  {
    key: 'primaryCategoryName',
    label: 'Cause Area',
    render: (recipient) => (
      <div className="text-sm text-strong">
        {recipient.categoryNames.length === 1 ? (
          <Link to={buildCausePath(recipient.primaryCategoryId)} className="impact-link">
            {recipient.primaryCategoryName}
          </Link>
        ) : (
          <div>
            <Link to={buildCausePath(recipient.primaryCategoryId)} className="impact-link">
              {recipient.primaryCategoryName}
            </Link>
            {recipient.categoryNames.length > 1 && (
              <div className="mt-1 text-xs text-muted">+{recipient.categoryNames.length - 1} more</div>
            )}
          </div>
        )}
      </div>
    ),
  },
];

const RecipientList = () => {
  useDocumentTitle('Recipients');
  const { combinedAssumptions } = useAssumptions();

  const recipientStats = useMemo(() => buildRecipientStats(combinedAssumptions), [combinedAssumptions]);
  const { searchTerm, setSearchTerm, filteredItems: filteredRecipients } = useNameSearch(recipientStats);

  return (
    <ListPageShell title="Recipients" subtitle="Entities that have received donations">
      <ListSearchControls searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search recipients..." />
      <div className="impact-surface impact-surface--table">
        <SortableTable
          columns={recipientColumns}
          data={filteredRecipients}
          defaultSortColumn="costPerLife"
          defaultSortDirection="asc"
          tiebreakColumn="totalLivesSaved"
          tiebreakDirection="desc"
          emptyMessage="No recipients match your search."
        />
      </div>
    </ListPageShell>
  );
};

export default RecipientList;
