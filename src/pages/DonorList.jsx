import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateDonorStatsFromCombined } from '../utils/assumptionsDataHelpers';
import SortableTable from '../components/shared/SortableTable';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { formatCurrency } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';
import DonorPhoto from '../components/shared/DonorPhoto';
import ListSearchControls from '../components/shared/ListSearchControls';
import ImpactValueCell from '../components/shared/ImpactValueCell';
import DonatedValueCell from '../components/shared/DonatedValueCell';
import CauseFilter, { CauseScopeSummary } from '../components/shared/CauseFilter';
import {
  DONOR_LIVES_SAVED_TOOLTIP,
  DONOR_DONATED_TOOLTIP,
  DONOR_COST_PER_LIFE_TOOLTIP,
} from '../constants/metricTooltips';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useNameSearch from '../hooks/useNameSearch';
import useCauseFilter from '../hooks/useCauseFilter';
import { useNotificationActions } from '../contexts/NotificationContext';

const INVALID_CAUSE_LINK_NOTICE =
  'That link does not match any current cause areas, so the all-cause ranking is shown instead.';

// Donor table columns configuration (static — no component state involved)
const donorColumns = [
  {
    key: 'photo',
    label: '',
    sortable: false,
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
    tooltip: DONOR_LIVES_SAVED_TOOLTIP,
    render: (donor) => <ImpactValueCell kind="lives" value={donor.totalLivesSaved} positiveTone="success" />,
  },
  {
    key: 'totalDonated',
    label: 'Donated',
    tooltip: DONOR_DONATED_TOOLTIP,
    render: (donor) => <DonatedValueCell totalDonated={donor.totalDonated} netWorth={donor.netWorth} />,
  },
  {
    key: 'costPerLife',
    label: 'Cost/Life',
    tooltip: DONOR_COST_PER_LIFE_TOOLTIP,
    render: (donor) => <ImpactValueCell kind="currency" value={donor.costPerLife} />,
  },
  {
    key: 'netWorth',
    label: 'Net Worth',
    render: (donor) => <div className="text-sm text-strong">{formatCurrency(donor.netWorth)}</div>,
  },
];

const DonorList = () => {
  useDocumentTitle('Top Donors by Lives Saved');
  const { combinedAssumptions } = useAssumptions();
  const { showNotification } = useNotificationActions();

  const categories = useMemo(
    () => [...combinedAssumptions.getAllCategories()].sort((a, b) => a.name.localeCompare(b.name)),
    [combinedAssumptions]
  );
  const {
    selectedCategoryIds,
    selectedCategories,
    isCauseFiltered,
    hasInvalidCauseSelection,
    rawCauseSelection,
    applyCauseFilter,
    clearInvalidCauseSelection,
  } = useCauseFilter(categories);
  const handledInvalidCauseSelectionRef = useRef(null);

  useEffect(() => {
    if (!hasInvalidCauseSelection) {
      handledInvalidCauseSelectionRef.current = null;
      return;
    }

    if (handledInvalidCauseSelectionRef.current === rawCauseSelection) {
      return;
    }

    handledInvalidCauseSelectionRef.current = rawCauseSelection;
    showNotification('info', INVALID_CAUSE_LINK_NOTICE);
    clearInvalidCauseSelection();
  }, [clearInvalidCauseSelection, hasInvalidCauseSelection, rawCauseSelection, showNotification]);

  const donorStats = useMemo(
    () => calculateDonorStatsFromCombined(combinedAssumptions, { categoryIds: selectedCategoryIds }),
    [combinedAssumptions, selectedCategoryIds]
  );
  const { searchTerm, setSearchTerm, filteredItems: filteredDonors } = useNameSearch(donorStats);
  const emptyMessage = searchTerm.trim()
    ? 'No donors match your search within the selected causes.'
    : 'No donors have categorized donations in the selected causes.';

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
          subtitle="Ranking people by their positive impact on the world via donations"
          className="pt-8 sm:pt-10"
        />

        {/* Donors Table Container */}
        <motion.div
          className="impact-page__container mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <ListSearchControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search donors..."
            filterControl={
              <CauseFilter
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onApply={applyCauseFilter}
              />
            }
          />

          {isCauseFiltered && (
            <CauseScopeSummary
              selectedCategories={selectedCategories}
              donorCount={donorStats.length}
              onReset={() => applyCauseFilter(null)}
            />
          )}

          <div className="impact-surface impact-surface--table">
            <SortableTable
              columns={donorColumns}
              data={filteredDonors}
              defaultSortColumn="totalLivesSaved"
              defaultSortDirection="desc"
              tiebreakColumn="rank"
              tiebreakDirection="asc"
              emptyMessage={isCauseFiltered ? emptyMessage : 'No donors match your search.'}
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
            <Link to="/calculator" className="impact-link text-base">
              Calculate the lives you could save with your donations →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DonorList;
