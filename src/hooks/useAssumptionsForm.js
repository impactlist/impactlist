import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';
import { getRecipientId } from '../utils/donationDataHelpers';
import { recipientHasEffectOverrides as recipientHasOverrides } from '../utils/assumptionsEditorHelpers';

/**
 * Custom hook for managing recipient search and filtering.
 */
export const useRecipientSearch = (allRecipients, defaultAssumptions, userAssumptions, isRecipientsTabActive) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [showOnlyCustom, setShowOnlyCustom] = useState(true);

  const filterRecipients = useCallback(
    (term, onlyCustom) => {
      let filtered = allRecipients;

      if (term) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter((recipient) => recipient.name.toLowerCase().includes(lowerTerm));
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));

        if (filtered.length > DEFAULT_RESULTS_LIMIT) {
          filtered = filtered.slice(0, DEFAULT_RESULTS_LIMIT);
        }
      } else if (onlyCustom) {
        filtered = filtered.filter((recipient) => {
          const recipientId = getRecipientId(recipient);
          return (
            recipientId &&
            Object.keys(recipient.categories || {}).some((categoryId) =>
              recipientHasOverrides(defaultAssumptions, userAssumptions, recipientId, categoryId)
            )
          );
        });

        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredRecipients(filtered);
    },
    [allRecipients, defaultAssumptions, userAssumptions]
  );

  const handleSearchChange = useCallback(
    (value) => {
      const term = value && value.target ? value.target.value : value;
      setSearchTerm(term);
      const shouldShowOnlyCustom = term === '';
      setShowOnlyCustom(shouldShowOnlyCustom);
      filterRecipients(term, shouldShowOnlyCustom);
    },
    [filterRecipients]
  );

  useEffect(() => {
    if (isRecipientsTabActive) {
      filterRecipients(searchTerm, searchTerm === '');
    }
  }, [isRecipientsTabActive, filterRecipients, searchTerm]);

  return {
    searchTerm,
    filteredRecipients,
    showOnlyCustom,
    filterRecipients,
    handleSearchChange,
  };
};
