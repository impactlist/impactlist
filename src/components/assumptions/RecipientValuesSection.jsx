import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatNumberWithCommas } from '../../utils/formatters';
import { getRecipientId } from '../../utils/donationDataHelpers';
import { calculateCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';

/**
 * Component for displaying recipient-specific cost per life values.
 * Now read-only with Edit buttons to open RecipientEffectEditor
 */
const RecipientValuesSection = ({
  filteredRecipients,
  allCategories,
  defaultCategories,
  onSearch,
  searchTerm,
  defaultAssumptions,
  onEditRecipient,
}) => {
  // Calculate the cost per life for a recipient's category
  const getRecipientCostPerLife = (recipientId, recipient, categoryId) => {
    const category = defaultCategories[categoryId];
    if (!category || !category.effects || category.effects.length === 0) {
      return null;
    }

    // Check if recipient has custom effects
    const recipientCategory = recipient.categories?.[categoryId];
    if (!recipientCategory || !recipientCategory.effects || recipientCategory.effects.length === 0) {
      // No custom effects, return base category cost
      return calculateCostPerLife(category.effects, defaultAssumptions.globalParameters, categoryId);
    }

    // Apply recipient effects to base category effects
    const modifiedEffects = category.effects.map((baseEffect) => {
      const recipientEffect = recipientCategory.effects.find((e) => e.effectId === baseEffect.effectId);
      if (recipientEffect && (recipientEffect.overrides || recipientEffect.multipliers)) {
        return applyRecipientEffectToBase(baseEffect, recipientEffect, `recipient ${recipient.name}`);
      }
      return baseEffect;
    });

    // Calculate cost per life from modified effects
    return calculateCostPerLife(modifiedEffects, defaultAssumptions.globalParameters, categoryId);
  };

  // Check if recipient has any custom values for a category
  const hasCustomValues = (recipient, categoryId) => {
    const recipientCategory = recipient.categories?.[categoryId];
    if (!recipientCategory || !recipientCategory.effects) {
      return false;
    }

    return recipientCategory.effects.some((effect) => {
      const hasOverrides = effect.overrides && Object.keys(effect.overrides).length > 0;
      const hasMultipliers = effect.multipliers && Object.keys(effect.multipliers).length > 0;
      return hasOverrides || hasMultipliers;
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-sm text-gray-600 italic">
          {searchTerm === ''
            ? 'Showing only recipients with custom values. Use search to find others.'
            : filteredRecipients.length >= 10
              ? 'Showing first 10 matching recipients.'
              : `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`}
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? 'No recipients found matching your search'
            : 'No recipients with custom values found. Search for a specific recipient.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient, index) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              // Get recipient ID for lookups
              const recipientId = getRecipientId(recipient);

              // Alternate row colors for better readability
              const isEven = index % 2 === 0;
              const bgColorClass = isEven ? 'bg-white' : 'bg-gray-100';

              return (
                <div key={recipient.name} className={`border border-gray-200 rounded-md p-3 ${bgColorClass}`}>
                  <h3 className="font-medium text-gray-800 mb-2">{recipient.name}</h3>
                  <div className="space-y-3">
                    {recipientCategories.map(([categoryId]) => {
                      const categoryName = allCategories[categoryId]?.name || categoryId;
                      const baseCostPerLife = defaultCategories[categoryId]?.costPerLife || 0;
                      const customCostPerLife = recipientId
                        ? getRecipientCostPerLife(recipientId, recipient, categoryId)
                        : null;
                      const hasCustom = hasCustomValues(recipient, categoryId);

                      return (
                        <div key={categoryId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex-1">
                            <Link
                              to={`/explore/${categoryId}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                              {categoryName}
                            </Link>
                            <div className="mt-1 text-sm text-gray-600">
                              Cost per Life:{' '}
                              <span className={`font-medium ${hasCustom ? 'text-indigo-600' : 'text-gray-900'}`}>
                                ${formatNumberWithCommas(Math.round(customCostPerLife || baseCostPerLife))}
                              </span>
                              {hasCustom && (
                                <span className="text-xs text-gray-500 ml-2">
                                  (base: ${formatNumberWithCommas(Math.round(baseCostPerLife))})
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => onEditRecipient(recipient, recipientId, categoryId)}
                            className="ml-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

RecipientValuesSection.propTypes = {
  filteredRecipients: PropTypes.array.isRequired,
  allCategories: PropTypes.object.isRequired,
  defaultCategories: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  defaultAssumptions: PropTypes.object.isRequired,
  onEditRecipient: PropTypes.func.isRequired,
};

export default RecipientValuesSection;
