import { useMemo } from 'react';
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
import useDocumentTitle from '../hooks/useDocumentTitle';
import useNameSearch from '../hooks/useNameSearch';

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
    tooltip: (
      <div>
        We first calculate the expected lives saved for each donation a person has made, based on our cost effectiveness
        estimates for every charity. We then sum these values across all the donations a person has made to get their
        total expected lives saved.
        <br />
        <br />
        See the FAQ for more details.
      </div>
    ),
    render: (donor) => <ImpactValueCell kind="lives" value={donor.totalLivesSaved} positiveTone="success" />,
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

  const donorStats = useMemo(() => calculateDonorStatsFromCombined(combinedAssumptions), [combinedAssumptions]);
  const { searchTerm, setSearchTerm, filteredItems: filteredDonors } = useNameSearch(donorStats);

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
          <ListSearchControls searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search donors..." />

          <div className="impact-surface impact-surface--table">
            <SortableTable
              columns={donorColumns}
              data={filteredDonors}
              defaultSortColumn="totalLivesSaved"
              defaultSortDirection="desc"
              emptyMessage="No donors match your search."
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
