import { useMemo, useState } from 'react';

/**
 * Search-by-name state for list pages: holds the search term and returns the
 * items whose `name` contains it, case-insensitively and ignoring surrounding
 * whitespace. The query is normalized once per term, and the filtered array is
 * memoized so tables whose sort keys on data identity (SortableTable) receive
 * a stable array per search term.
 */
const useNameSearch = (items) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query ? items.filter((item) => item.name.toLowerCase().includes(query)) : items;
  }, [items, searchTerm]);

  return { searchTerm, setSearchTerm, filteredItems };
};

export default useNameSearch;
