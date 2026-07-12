import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';
import { getRecipientId } from '../utils/donationDataHelpers';
import { recipientHasEffectOverrides as recipientHasOverrides } from '../utils/assumptionsEditorHelpers';

/**
 * Custom hook for managing recipient search and filtering.
 *
 * Matches are derived, not stored, so they can never go stale against
 * assumption changes. Search results are capped at DEFAULT_RESULTS_LIMIT
 * until the caller asks for all of them — and the full match count is always
 * reported, so the UI can say "10 of 88" instead of hiding the truncation.
 */
export const useRecipientSearch = (allRecipients, defaultAssumptions, userAssumptions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllMatches, setShowAllMatches] = useState(false);

  const matches = useMemo(() => {
    const filtered = searchTerm
      ? allRecipients.filter((recipient) => recipient.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : // Without a search term, list only recipients that carry
        // recipient-specific assumptions (built-in or user-edited).
        allRecipients.filter((recipient) => {
          const recipientId = getRecipientId(recipient);
          return (
            recipientId &&
            Object.keys(recipient.categories || {}).some((categoryId) =>
              recipientHasOverrides(defaultAssumptions, userAssumptions, recipientId, categoryId)
            )
          );
        });

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [allRecipients, defaultAssumptions, userAssumptions, searchTerm]);

  const isTruncated = Boolean(searchTerm) && !showAllMatches && matches.length > DEFAULT_RESULTS_LIMIT;

  const filteredRecipients = useMemo(
    () => (isTruncated ? matches.slice(0, DEFAULT_RESULTS_LIMIT) : matches),
    [matches, isTruncated]
  );

  const handleSearchChange = useCallback((value) => {
    const term = value && value.target ? value.target.value : value;
    setSearchTerm(term);
    // Each new term starts truncated again; "show all" is a per-search choice.
    setShowAllMatches(false);
  }, []);

  const handleShowAllMatches = useCallback(() => {
    setShowAllMatches(true);
  }, []);

  return {
    searchTerm,
    filteredRecipients,
    totalMatches: matches.length,
    isTruncated,
    handleSearchChange,
    handleShowAllMatches,
  };
};
