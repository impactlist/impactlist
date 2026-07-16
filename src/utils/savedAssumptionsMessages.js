// "Removed 1 old imported assumptions" is ungrammatical — the evicted unit
// is an assumptions SET, so pluralize that noun.
const describeSets = (count, qualifier) => `${count} ${qualifier} assumptions ${count === 1 ? 'set' : 'sets'}`;

export const buildEvictionNotificationMessage = ({ prefix, result }) => {
  const evictedImportedCount = result?.evictedImportedCount || 0;
  const evictedLocalCount = result?.evictedLocalCount || 0;

  if (evictedImportedCount <= 0 && evictedLocalCount <= 0) {
    return null;
  }

  if (evictedImportedCount > 0 && evictedLocalCount > 0) {
    return `${prefix} Removed ${describeSets(evictedImportedCount, 'old imported')} and ${describeSets(evictedLocalCount, 'local')} to make room.`;
  }

  if (evictedImportedCount > 0) {
    return `${prefix} Removed ${describeSets(evictedImportedCount, 'old imported')} to make room.`;
  }

  return `${prefix} Removed ${describeSets(evictedLocalCount, 'local')} to make room.`;
};
