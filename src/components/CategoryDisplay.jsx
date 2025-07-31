import React from 'react';
import { Link } from 'react-router-dom';
import { getPrimaryCategoryForRecipient } from '../utils/donationDataHelpers';

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
        <Link
          to={`/category/${encodeURIComponent(categoryId)}`}
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {categoryName}
        </Link>
      </div>
    );
  }

  // For existing recipients, look up their categories
  const recipientId = combinedAssumptions.findRecipientId(donation.recipientName);

  if (!recipientId) {
    return <span className="text-sm text-slate-700">Unknown</span>;
  }

  // Get primary category info
  const { categoryName, categoryId, count } = getPrimaryCategoryForRecipient(recipientId);

  if (count <= 1) {
    return (
      <Link
        to={`/category/${encodeURIComponent(categoryId)}`}
        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
      >
        {categoryName}
      </Link>
    );
  } else {
    return (
      <div className="text-sm">
        <Link
          to={`/category/${encodeURIComponent(categoryId)}`}
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          {categoryName}
        </Link>
        <span className="text-xs text-slate-500 ml-1">(+{count - 1})</span>
      </div>
    );
  }
};

export default CategoryDisplay;
