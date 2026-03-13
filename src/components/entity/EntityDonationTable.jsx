import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SortableTable from '../shared/SortableTable';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { getEffectiveCostPerLifeFromCombined } from '../../utils/assumptionsDataHelpers';
import { extractYearFromDonation, getCurrentYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';

/**
 * Displays a table of donations for a donor or recipient entity.
 */
const EntityDonationTable = ({ donations, entityType, className = '', combinedAssumptions = null }) => {
  const isDonor = entityType === 'donor';

  // Define columns based on entity type
  const donorColumns = [
    {
      key: 'date',
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-strong">
          {donation.isUnknown ? (
            <span className="text-muted">Unknown</span>
          ) : (
            new Date(donation.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (donation) =>
        donation.isUnknown ? (
          <span className="text-sm text-muted">{formatCurrency(donation.amount)}</span>
        ) : (
          <div>
            <a
              href={donation.source}
              target="_blank"
              rel="noopener noreferrer"
              className="impact-link text-sm font-medium"
            >
              {formatCurrency(donation.creditedAmount || donation.amount)}
            </a>
            {donation.credit < 1 && (
              <div className="mt-1 text-xs text-muted">{Math.round(donation.credit * 100)}% credit</div>
            )}
          </div>
        ),
    },
    {
      key: 'recipient',
      label: 'Recipient',
      render: (donation) => (
        <div>
          {donation.isUnknown ? (
            <span className="text-sm text-muted">Unknown</span>
          ) : (
            <Link
              to={`/recipient/${encodeURIComponent(donation.recipientId)}`}
              className="impact-link text-sm font-medium"
            >
              {donation.recipient}
            </Link>
          )}
        </div>
      ),
    },
    {
      key: 'categoryName',
      label: 'Cause',
      render: (donation) => {
        // Get the primary category ID if it's not already in the donation object
        const categoryId = donation.categoryId || donation.primaryCategoryId;
        if (!categoryId) {
          throw new Error(`Category ID not found for donation ${donation.id}`);
        }

        return (
          <div className="text-sm text-strong">
            <Link to={buildCausePath(categoryId)} className="impact-link">
              {donation.categoryName}
            </Link>
            {donation.categoryCount > 1 && (
              <span className="ml-1 text-xs text-muted">(+{donation.categoryCount - 1})</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'livesSaved',
      label: 'Lives Saved',
      tooltip: (
        <div>
          Expected lives saved from this donation, based on the value in the cost/life column together with the amount
          donated.
        </div>
      ),
      render: (donation) => (
        <div
          className={`text-sm ${
            donation.isUnknown ? 'text-muted' : donation.totalLivesSaved < 0 ? 'text-danger' : 'text-success'
          }`}
        >
          {formatNumber(Math.round(donation.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      tooltip: (
        <div>
          Cost/life comes from our effectiveness estimates for this recipient at the time of the donation. It's the
          estimated amount needed to save the equivalent of one life.
        </div>
      ),
      render: (donation) => (
        <div className={`text-sm ${donation.isUnknown ? 'text-muted' : 'text-strong'}`}>
          {donation.totalLivesSaved === 0 ? (
            <span className="text-2xl">∞</span>
          ) : (
            formatCurrency(
              getEffectiveCostPerLifeFromCombined(
                combinedAssumptions,
                donation,
                donation.isUnknown ? getCurrentYear() : extractYearFromDonation(donation)
              )
            )
          )}
        </div>
      ),
    },
  ];

  const recipientColumns = [
    {
      key: 'date',
      label: 'Date',
      render: (donation) => (
        <div className="text-sm text-strong">
          {new Date(donation.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (donation) => (
        <div>
          <a
            href={donation.source}
            target="_blank"
            rel="noopener noreferrer"
            className="impact-link text-sm font-medium"
          >
            {formatCurrency(donation.creditedAmount || donation.amount)}
          </a>
          {donation.credit < 1 && (
            <div className="mt-1 text-xs text-muted">{Math.round(donation.credit * 100)}% credit</div>
          )}
        </div>
      ),
    },
    {
      key: 'donor',
      label: 'Donor',
      render: (donation) => (
        <div>
          <Link to={`/donor/${encodeURIComponent(donation.donorId)}`} className="impact-link text-sm font-medium">
            {donation.donor}
          </Link>
        </div>
      ),
    },
    {
      key: 'totalLivesSaved',
      label: 'Lives Saved',
      render: (donation) => (
        <div className={`text-sm ${donation.totalLivesSaved < 0 ? 'text-danger' : 'text-success'}`}>
          {formatNumber(Math.round(donation.totalLivesSaved))}
        </div>
      ),
    },
    {
      key: 'costPerLife',
      label: 'Cost/Life',
      render: (donation) => (
        <div className="text-sm text-strong">
          {donation.totalLivesSaved === 0 ? (
            <span className="text-2xl">∞</span>
          ) : (
            formatCurrency(
              getEffectiveCostPerLifeFromCombined(combinedAssumptions, donation, extractYearFromDonation(donation))
            )
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className={`impact-surface mb-16 ${className}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="impact-surface__header px-6 py-4">
        <h2 className="text-xl font-semibold text-strong">Donation History</h2>
      </div>
      <SortableTable
        columns={isDonor ? donorColumns : recipientColumns}
        data={donations}
        defaultSortColumn="date"
        defaultSortDirection="desc"
      />
    </motion.div>
  );
};

EntityDonationTable.propTypes = {
  donations: PropTypes.array.isRequired,
  entityType: PropTypes.oneOf(['donor', 'recipient']).isRequired,
  className: PropTypes.string,
  combinedAssumptions: PropTypes.object,
};

export default React.memo(EntityDonationTable);
