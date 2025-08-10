import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchInput from '../shared/SearchInput';
import { formatNumberWithCommas } from '../../utils/formatters';
import { getRecipientId } from '../../utils/donationDataHelpers';
import { calculateCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';
import { mergeGlobalParameters } from '../../utils/assumptionsEditorHelpers';

/**
 * Component for displaying recipient-specific cost per life values.
 * Now read-only with Edit buttons to open RecipientEffectEditor
 */
const RecipientValuesSection = ({
  filteredRecipients,
  onSearch,
  searchTerm,
  defaultAssumptions,
  userAssumptions,
  onEditRecipient,
}) => {
  // Merge global parameters once
  const mergedGlobalParameters = useMemo(
    () => mergeGlobalParameters(defaultAssumptions?.globalParameters, userAssumptions?.globalParameters),
    [defaultAssumptions?.globalParameters, userAssumptions]
  );

  // Calculate the cost per life for a recipient's category
  const getRecipientCostPerLife = (recipientId, recipient, categoryId) => {
    // Get the actual category data with effects from defaultAssumptions
    const category = defaultAssumptions?.categories?.[categoryId];

    if (!category || !category.effects || category.effects.length === 0) {
      return null;
    }

    // Get default recipient effects if they exist
    const defaultRecipientEffects = defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    // Get user overrides if they exist
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    // Determine which effects to use (user overrides default)
    let effectsToApply = null;
    if (userRecipientEffects && userRecipientEffects.length > 0) {
      // User has overrides, use them
      effectsToApply = userRecipientEffects;
    } else if (defaultRecipientEffects && defaultRecipientEffects.length > 0) {
      // No user overrides but recipient has default effects (like Anthropic's multiplier)
      effectsToApply = defaultRecipientEffects;
    }

    // If no recipient effects at all, return base category cost
    if (!effectsToApply) {
      return calculateCostPerLife(category.effects, mergedGlobalParameters, categoryId);
    }

    // Apply recipient effects to base category effects
    const modifiedEffects = category.effects.map((baseEffect) => {
      const recipientEffect = effectsToApply.find((e) => e.effectId === baseEffect.effectId);
      if (recipientEffect && (recipientEffect.overrides || recipientEffect.multipliers)) {
        return applyRecipientEffectToBase(baseEffect, recipientEffect, `recipient ${recipient.name}`);
      }
      return baseEffect;
    });

    // Calculate cost per life from modified effects
    return calculateCostPerLife(modifiedEffects, mergedGlobalParameters, categoryId);
  };

  // Check if recipient has any custom values for a category
  const hasCustomValues = (recipientId, categoryId) => {
    // Check if user has set custom values for this recipient
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    if (!userRecipientEffects || userRecipientEffects.length === 0) {
      return false;
    }

    return userRecipientEffects.some((effect) => {
      const hasOverrides = effect.overrides && Object.keys(effect.overrides).length > 0;
      const hasMultipliers = effect.multipliers && Object.keys(effect.multipliers).length > 0;
      return hasOverrides || hasMultipliers;
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <SearchInput value={searchTerm} onChange={onSearch} placeholder="Search recipients..." />
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
                      const category = defaultAssumptions?.categories?.[categoryId];
                      const categoryName = category?.name || categoryId;

                      // Calculate base cost per life from default category effects
                      let baseCostPerLife = 0;
                      if (category?.effects && category.effects.length > 0) {
                        baseCostPerLife = calculateCostPerLife(
                          category.effects,
                          defaultAssumptions.globalParameters,
                          categoryId
                        );
                      }
                      const customCostPerLife = recipientId
                        ? getRecipientCostPerLife(recipientId, recipient, categoryId)
                        : null;
                      const hasCustom = hasCustomValues(recipientId, categoryId);

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
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  defaultAssumptions: PropTypes.object.isRequired,
  userAssumptions: PropTypes.object,
  onEditRecipient: PropTypes.func.isRequired,
};

export default RecipientValuesSection;
