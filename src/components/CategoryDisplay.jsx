import React from 'react';
import { Link } from 'react-router-dom';
import { getPrimaryCategoryForRecipient } from '../utils/donationDataHelpers';
import { buildCausePath } from '../utils/causeRoutes';

/**
 * A reusable component for displaying category information consistently across the app.
 * This handles both custom recipients with a specified category and existing recipients with their categories.
 */
const CategoryDisplay = ({ donation, categories, combinedAssumptions }) => {
  // For custom recipients, show the specified category and any effectiveness info
  if (donation.isCustomRecipient && donation.categoryId) {
    const category = categories.find((c) => c.id === donation.categoryId);
    const categoryName = category?.name || donation.categoryId;
    const categoryId = category?.id || donation.categoryId;

    return (
      <div>
        <Link to={buildCausePath(categoryId)} className="impact-link text-sm">
          {categoryName}
        </Link>
      </div>
    );
  }

  // For existing recipients, look up their categories
  const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);

  if (!recipientId) {
    return <span className="text-sm text-muted">Unknown</span>;
  }

  // Get primary category info
  const { categoryName, categoryId, count } = getPrimaryCategoryForRecipient(combinedAssumptions, recipientId);

  if (count <= 1) {
    return (
      <Link to={buildCausePath(categoryId)} className="impact-link text-sm">
        {categoryName}
      </Link>
    );
  } else {
    return (
      <div className="text-sm">
        <Link to={buildCausePath(categoryId)} className="impact-link">
          {categoryName}
        </Link>
        <span className="ml-1 text-xs text-muted">(+{count - 1})</span>
      </div>
    );
  }
};

export default CategoryDisplay;
