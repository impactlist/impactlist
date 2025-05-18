import React from 'react';
import { getPrimaryCategoryForRecipient } from '../utils/donationDataHelpers';

/**
 * A reusable component for displaying category information consistently across the app.
 * This handles both custom recipients with a specified category and existing recipients with their categories.
 */
const CategoryDisplay = ({ donation, categories, recipientsById }) => {
  // For custom recipients, show the specified category and any effectiveness info
  if (donation.isCustomRecipient && donation.categoryId) {
    const categoryName = categories.find((c) => c.id === donation.categoryId)?.name || donation.categoryId;
    return (
      <div>
        <span className="text-sm text-slate-700">{categoryName}</span>
      </div>
    );
  }

  // For existing recipients, look up their categories
  const recipientId = Object.keys(recipientsById).find((id) => recipientsById[id].name === donation.recipientName);

  if (!recipientId) {
    return <span className="text-sm text-slate-700">Unknown</span>;
  }

  // Get primary category info
  const { categoryName, count } = getPrimaryCategoryForRecipient(recipientId);

  if (count <= 1) {
    return <span className="text-sm text-slate-700">{categoryName}</span>;
  } else {
    return (
      <div className="text-sm text-slate-700">
        {categoryName}
        <span className="text-xs text-slate-500 ml-1">(+{count - 1})</span>
      </div>
    );
  }
};

export default CategoryDisplay;
