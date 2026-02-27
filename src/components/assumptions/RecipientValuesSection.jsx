import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchInput from '../shared/SearchInput';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import IconActionButton from '../shared/IconActionButton';
import { formatCurrency } from '../../utils/formatters';
import { getRecipientId, getCurrentYear } from '../../utils/donationDataHelpers';
import { calculateCostPerLife, applyRecipientEffectToBase } from '../../utils/effectsCalculation';
import { mergeGlobalParameters, recipientHasMeaningfulCustomValues } from '../../utils/assumptionsEditorHelpers';

/**
 * Component for displaying recipient-specific cost per life values.
 * Shows a single combined cost per life with compact actions.
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
      <div className="mb-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)] p-3 shadow-[0_4px_12px_-6px_rgba(32,24,12,0.15)]">
        <SearchInput value={searchTerm} onChange={onSearch} placeholder="Search recipients..." />
        <div className="mt-2 text-sm italic text-[var(--text-muted)]">
          {searchTerm === ''
            ? 'Showing only recipients with custom values. Use search to find others.'
            : filteredRecipients.length >= 10
              ? 'Showing first 10 matching recipients.'
              : `Showing ${filteredRecipients.length} matching recipient${filteredRecipients.length === 1 ? '' : 's'}.`}
        </div>
      </div>

      {filteredRecipients.length === 0 ? (
        <div className="assumptions-empty-state py-10 text-sm">
          {searchTerm
            ? 'No recipients found matching your search'
            : 'No recipients with custom values found. Search for a specific recipient.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
                <SectionCard key={recipient.name} isCustom={hasCustomValues} padding="sm" className="h-full">
                  <div className="assumption-card__top">
                    <div className="min-w-0">
                      <Link
                        to={`/recipient/${encodeURIComponent(recipientId)}`}
                        className="assumptions-link block truncate text-base"
                        title={recipient.name}
                      >
                        {recipient.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {categoryCount > 1
                          ? `${categoryCount} categories weighted into one combined estimate.`
                          : 'Single-category recipient estimate.'}
                      </p>
                    </div>
                    <div className="assumption-card__actions">
                      <IconActionButton
                        icon="edit"
                        label="Edit"
                        onClick={() => onEditRecipient(recipient, recipientId)}
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <CurrencyInput
                      id={`recipient-${recipientId}`}
                      value={formattedCost}
                      onChange={() => {}}
                      className="w-full"
                      disabled={true}
                      isCustom={hasCustomValues}
                    />
                  </div>
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
