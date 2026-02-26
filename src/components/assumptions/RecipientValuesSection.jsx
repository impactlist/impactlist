import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchInput from '../shared/SearchInput';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import { formatCurrency } from '../../utils/formatters';
import { getRecipientId, getCurrentYear } from '../../utils/donationDataHelpers';
import { calculateCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';
import { mergeGlobalParameters, recipientHasMeaningfulCustomValues } from '../../utils/assumptionsEditorHelpers';

/**
 * Component for displaying recipient-specific cost per life values.
 * Shows a single combined cost per life with Edit button to open the multi-category editor.
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
  const getRecipientCategoryCostPerLife = (recipientId, recipient, categoryId) => {
    const category = defaultAssumptions?.categories?.[categoryId];

    if (!category || !category.effects || category.effects.length === 0) {
      return null;
    }

    const defaultRecipientEffects = defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;

    let effectsToApply = null;
    if (userRecipientEffects && userRecipientEffects.length > 0) {
      effectsToApply = userRecipientEffects;
    } else if (defaultRecipientEffects && defaultRecipientEffects.length > 0) {
      effectsToApply = defaultRecipientEffects;
    }

    if (!effectsToApply) {
      return calculateCostPerLife(category.effects, mergedGlobalParameters, previewYear || getCurrentYear());
    }

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

    return calculateCostPerLife(modifiedEffects, mergedGlobalParameters, previewYear || getCurrentYear());
  };

  // Calculate combined/weighted cost per life across all categories for a recipient
  const getCombinedCostPerLife = (recipientId, recipient) => {
    const categories = Object.entries(recipient.categories || {});
    if (categories.length === 0) return null;

    // For single category, just return that category's cost
    if (categories.length === 1) {
      const [categoryId] = categories[0];
      return getRecipientCategoryCostPerLife(recipientId, recipient, categoryId);
    }

    // For multiple categories, calculate weighted average
    let totalWeightedCost = 0;
    let totalWeight = 0;

    for (const [categoryId, categoryData] of categories) {
      const fraction = categoryData.fraction || 0;
      const cost = getRecipientCategoryCostPerLife(recipientId, recipient, categoryId);

      if (cost !== null && cost !== Infinity && fraction > 0) {
        totalWeightedCost += cost * fraction;
        totalWeight += fraction;
      }
    }

    if (totalWeight === 0) return Infinity;
    return totalWeightedCost / totalWeight;
  };

  // Check if recipient has any custom values across all categories
  const recipientHasAnyCustomValues = (recipientId, recipient) => {
    const categories = Object.keys(recipient.categories || {});
    return categories.some((categoryId) => {
      const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
      const defaultRecipientEffects = defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
      return recipientHasMeaningfulCustomValues(userRecipientEffects, defaultRecipientEffects);
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col space-y-2">
        <SearchInput value={searchTerm} onChange={onSearch} placeholder="Search recipients..." />
        <div className="text-sm text-slate-500">
          {searchTerm === ''
            ? 'Showing only recipients with custom values. Use search to find others.'
            : filteredRecipients.length >= 10
              ? 'Showing first 10 matching recipients.'
              : `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`}
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          {searchTerm
            ? 'No recipients found matching your search'
            : 'No recipients with custom values found. Search for a specific recipient.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              const recipientId = getRecipientId(recipient);
              const combinedCost = getCombinedCostPerLife(recipientId, recipient);
              const formattedCost = combinedCost !== null ? formatCurrency(combinedCost).replace('$', '') : '—';
              const hasCustomValues = recipientHasAnyCustomValues(recipientId, recipient);
              const categoryCount = recipientCategories.length;

              return (
                <SectionCard key={recipient.name} isCustom={hasCustomValues} padding="default">
                  <div className="flex items-center gap-4">
                    {/* Recipient name */}
                    <Link
                      to={`/recipient/${encodeURIComponent(recipientId)}`}
                      className="text-slate-800 hover:text-indigo-600 font-semibold min-w-0 truncate transition-colors"
                    >
                      {recipient.name}
                    </Link>

                    {/* Combined cost per life with Edit button */}
                    <CurrencyInput
                      id={`recipient-${recipientId}`}
                      value={formattedCost}
                      onChange={() => {}}
                      className="w-32"
                      disabled={true}
                      isCustom={hasCustomValues}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => onEditRecipient(recipient, recipientId)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md font-medium transition-colors"
                        >
                          Edit
                        </button>
                      }
                    />
                  </div>
                  {/* Show category count for multi-category recipients */}
                  {categoryCount > 1 && <p className="text-xs text-slate-500 mt-1">{categoryCount} categories</p>}
                </SectionCard>
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
