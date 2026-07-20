const activeRestorationCounts = new Map();

export const getHistoryEntryScrollId = ({ key, pathname, search = '', hash = '' }) =>
  `${key}:${pathname}${search}${hash}`;

/**
 * Coordinate the global history restoration with components that have their
 * own intentional landing scroll. Counts make this safe under nested starts
 * and React StrictMode effect replay.
 */
export const beginHistoryEntryScrollRestoration = (historyEntryId) => {
  activeRestorationCounts.set(historyEntryId, (activeRestorationCounts.get(historyEntryId) || 0) + 1);

  let finished = false;
  return () => {
    if (finished) {
      return;
    }
    finished = true;

    const remainingCount = (activeRestorationCounts.get(historyEntryId) || 1) - 1;
    if (remainingCount > 0) {
      activeRestorationCounts.set(historyEntryId, remainingCount);
    } else {
      activeRestorationCounts.delete(historyEntryId);
    }
  };
};

export const isHistoryEntryScrollRestorationActive = (historyEntryId) => activeRestorationCounts.has(historyEntryId);
