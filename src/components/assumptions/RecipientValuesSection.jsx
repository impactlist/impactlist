import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SearchInput from '../shared/SearchInput';
import CurrencyInput from '../shared/CurrencyInput';
import SectionCard from '../shared/SectionCard';
import IconActionButton from '../shared/IconActionButton';
import { formatCurrency } from '../../utils/formatters';
import { getRecipientId, getCurrentYear } from '../../utils/donationDataHelpers';
import { createCombinedAssumptions, getCostPerLifeForRecipientFromCombined } from '../../utils/assumptionsDataHelpers';
import { recipientHasMeaningfulCustomValues } from '../../utils/assumptionsEditorHelpers';

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
  onResetRecipient,
  previewYear,
}) => {
  const currentCombinedAssumptions = useMemo(
    () => createCombinedAssumptions(defaultAssumptions, userAssumptions),
    [defaultAssumptions, userAssumptions]
  );

  const baselineCombinedAssumptions = useMemo(
    () =>
      createCombinedAssumptions(defaultAssumptions, {
        globalParameters: userAssumptions?.globalParameters,
        categories: userAssumptions?.categories,
      }),
    [defaultAssumptions, userAssumptions]
  );

  // Calculate combined/weighted cost per life across all categories for a recipient
  const getCombinedCostPerLife = (recipientId, recipient, includeUserOverrides = true) => {
    const assumptionsToUse = includeUserOverrides ? currentCombinedAssumptions : baselineCombinedAssumptions;
    return getCostPerLifeForRecipientFromCombined(assumptionsToUse, recipientId, previewYear || getCurrentYear());
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
        <div className="mt-2 text-sm italic text-muted">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredRecipients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((recipient) => {
              const recipientCategories = Object.entries(recipient.categories || {});
              if (recipientCategories.length === 0) return null;

              const recipientId = getRecipientId(recipient);
              const combinedCost = getCombinedCostPerLife(recipientId, recipient, true);
              const defaultCombinedCost = getCombinedCostPerLife(recipientId, recipient, false);
              const formattedCost = combinedCost !== null ? formatCurrency(combinedCost).replace('$', '') : '—';
              const formattedDefaultCost = defaultCombinedCost !== null ? formatCurrency(defaultCombinedCost) : '—';
              const hasCustomValues = recipientHasAnyCustomValues(recipientId, recipient);

              return (
                <SectionCard key={recipient.name} isCustom={hasCustomValues} padding="sm" className="h-full">
                  <div className="assumption-card__top">
                    <div className="min-w-0">
                      <div className="assumption-card__title-wrap pr-2">
                        <Link
                          to={`/recipient/${encodeURIComponent(recipientId)}`}
                          className="assumptions-link block min-w-0 truncate text-base"
                          title={recipient.name}
                        >
                          {recipient.name}
                        </Link>
                        {hasCustomValues && (
                          <span className="assumption-card__default-meta">(Baseline: {formattedDefaultCost})</span>
                        )}
                      </div>
                    </div>
                    <div className="assumption-card__actions">
                      {hasCustomValues && onResetRecipient && (
                        <IconActionButton icon="reset" label="Reset" onClick={() => onResetRecipient(recipientId)} />
                      )}
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
  onResetRecipient: PropTypes.func,
  previewYear: PropTypes.number,
};

export default RecipientValuesSection;
