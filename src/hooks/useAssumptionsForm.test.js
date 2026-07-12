import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useRecipientSearch } from './useAssumptionsForm';
import { DEFAULT_RESULTS_LIMIT } from '../utils/constants';

const makeRecipient = (id, name) => ({ id, name, categories: { 'cause-a': { fraction: 1 } } });

// More matches than the display limit, with zero-padded names so name-sorting
// is deterministic.
const matchCount = DEFAULT_RESULTS_LIMIT + 5;
const matchingRecipients = Array.from({ length: matchCount }, (_, i) =>
  makeRecipient(`match-${String(i).padStart(2, '0')}`, `Match Foundation ${String(i).padStart(2, '0')}`)
);
const overrideRecipient = makeRecipient('with-override', 'Override Recipient');
const plainRecipient = makeRecipient('plain', 'Plain Recipient');
const allRecipients = [...matchingRecipients, overrideRecipient, plainRecipient];

// Only `with-override` carries built-in recipient-level effects.
const defaultAssumptions = {
  recipients: {
    'with-override': {
      categories: { 'cause-a': { effects: [{ effectId: 'effect-a', overrides: { costPerQALY: 100 } }] } },
    },
  },
};

const renderSearch = () => renderHook(() => useRecipientSearch(allRecipients, defaultAssumptions, null));

describe('useRecipientSearch', () => {
  it('lists only recipients with recipient-specific assumptions when there is no search term', () => {
    const { result } = renderSearch();

    expect(result.current.filteredRecipients.map((recipient) => recipient.name)).toEqual(['Override Recipient']);
    expect(result.current.totalMatches).toBe(1);
    expect(result.current.isTruncated).toBe(false);
  });

  it('caps search results at the display limit but reports the full match count', () => {
    const { result } = renderSearch();

    act(() => {
      result.current.handleSearchChange('match foundation');
    });

    expect(result.current.totalMatches).toBe(matchCount);
    expect(result.current.filteredRecipients).toHaveLength(DEFAULT_RESULTS_LIMIT);
    expect(result.current.isTruncated).toBe(true);
  });

  it('does not claim truncation when the matches fit the limit exactly', () => {
    const { result } = renderSearch();

    // "match foundation 0" matches exactly the zero-padded 00–09 names.
    act(() => {
      result.current.handleSearchChange('match foundation 0');
    });

    expect(result.current.totalMatches).toBe(DEFAULT_RESULTS_LIMIT);
    expect(result.current.filteredRecipients).toHaveLength(DEFAULT_RESULTS_LIMIT);
    expect(result.current.isTruncated).toBe(false);
  });

  it('reveals every match on request and re-truncates for the next search', () => {
    const { result } = renderSearch();

    act(() => {
      result.current.handleSearchChange('match foundation');
    });
    act(() => {
      result.current.handleShowAllMatches();
    });

    expect(result.current.filteredRecipients).toHaveLength(matchCount);
    expect(result.current.isTruncated).toBe(false);

    // "Show all" is a per-search choice; a new term starts truncated again.
    act(() => {
      result.current.handleSearchChange('match');
    });

    expect(result.current.filteredRecipients).toHaveLength(DEFAULT_RESULTS_LIMIT);
    expect(result.current.isTruncated).toBe(true);
  });
});
