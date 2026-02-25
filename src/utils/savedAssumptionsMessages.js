export const buildEvictionNotificationMessage = ({ prefix, result }) => {
  const evictedImportedCount = result?.evictedImportedCount || 0;
  const evictedLocalCount = result?.evictedLocalCount || 0;

  if (evictedImportedCount <= 0 && evictedLocalCount <= 0) {
    return null;
  }

  if (evictedImportedCount > 0 && evictedLocalCount > 0) {
    return `${prefix} Removed ${evictedImportedCount} old imported assumptions and ${evictedLocalCount} local assumptions to make room.`;
  }

  if (evictedImportedCount > 0) {
    return `${prefix} Removed ${evictedImportedCount} old imported assumptions to make room.`;
  }

  return `${prefix} Removed ${evictedLocalCount} local assumptions to make room.`;
};
