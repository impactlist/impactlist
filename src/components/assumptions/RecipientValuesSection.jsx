import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchInput from '../shared/SearchInput';
import CurrencyInput from '../shared/CurrencyInput';
import { formatCurrency } from '../../utils/formatters';
import { getRecipientId, getCurrentYear } from '../../utils/donationDataHelpers';
import { calculateCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';
import { mergeGlobalParameters, recipientHasMeaningfulCustomValues } from '../../utils/assumptionsEditorHelpers';

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
  previewYear,
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
      return calculateCostPerLife(category.effects, mergedGlobalParameters, previewYear || getCurrentYear());
    }

    // Apply recipient effects to base category effects
    const modifiedEffects = category.effects.map((baseEffect) => {
      const recipientEffect = effectsToApply.find((e) => e.effectId === baseEffect.effectId);
      if (
        recipientEffect &&
        (recipientEffect.overrides || recipientEffect.multipliers || recipientEffect.disabled !== undefined)
      ) {
        return applyRecipientEffectToBase(baseEffect, recipientEffect, `recipient ${recipient.name}`);
      }
      return baseEffect;
    });

    // Calculate cost per life from modified effects
    return calculateCostPerLife(modifiedEffects, mergedGlobalParameters, previewYear || getCurrentYear());
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
        <div className="flex flex-wrap gap-3">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              // Get recipient ID for lookups
              const recipientId = getRecipientId(recipient);

              return (
                <div key={recipient.name} className="border border-gray-400 rounded-md p-3 inline-block bg-white">
                  <h3 className="font-medium mb-2">
                    <Link
                      to={`/recipient/${encodeURIComponent(recipientId)}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {recipient.name}
                    </Link>
                  </h3>
                  <div className="space-y-1">
                    {recipientCategories.map(([categoryId]) => {
                      const category = defaultAssumptions?.categories?.[categoryId];
                      const categoryName = category?.name || categoryId;

                      // Calculate base category cost per life (without recipient modifications)
                      let categoryCostPerLife = 0;
                      if (category?.effects && category.effects.length > 0) {
                        categoryCostPerLife = calculateCostPerLife(
                          category.effects,
                          defaultAssumptions.globalParameters,
                          previewYear || getCurrentYear()
                        );
                      }

                      // Calculate recipient's actual cost per life (with any modifications)
                      const recipientCostPerLife = recipientId
                        ? getRecipientCostPerLife(recipientId, recipient, categoryId)
                        : null;

                      // Check if recipient has user custom values that differ from the recipient's defaults
                      const userRecipientEffects =
                        userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
                      const defaultRecipientEffects =
                        defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

                      const hasUserCustomValues = recipientHasMeaningfulCustomValues(
                        userRecipientEffects,
                        defaultRecipientEffects
                      );

                      // Show category cost in parentheses if recipient cost differs
                      // Compare formatted values to determine if they're visually different
                      const formattedRecipientCost = formatCurrency(
                        recipientCostPerLife || categoryCostPerLife
                      ).replace('$', '');
                      const formattedCategoryCost = formatCurrency(categoryCostPerLife).replace('$', '');
                      const recipientCostDiffers = formattedRecipientCost !== formattedCategoryCost;

                      return (
                        <div key={categoryId} className="flex items-start gap-4">
                          {/* Category name */}
                          <Link
                            to={`/explore/${categoryId}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex-shrink-0 w-40 mt-1"
                          >
                            {categoryName}
                          </Link>

                          {/* Cost per life input with Edit button */}
                          <div className="flex-1 max-w-xs">
                            <div className="relative">
                              <CurrencyInput
                                id={`recipient-${recipientId}-${categoryId}`}
                                value={formattedRecipientCost}
                                onChange={() => {}} // Read-only, no-op
                                className="w-full pr-10"
                                disabled={true}
                                isCustom={hasUserCustomValues}
                                placeholder={formattedCategoryCost}
                              />
                              <button
                                type="button"
                                onClick={() => onEditRecipient(recipient, recipientId, categoryId)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                Edit
                              </button>
                            </div>
                            {/* Show category cost below input if different */}
                            {recipientCostDiffers && (
                              <p className="text-xs text-gray-500 mt-0.5">Category: ${formattedCategoryCost}</p>
                            )}
                          </div>
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
  previewYear: PropTypes.number,
};

export default RecipientValuesSection;
