import { useCallback } from 'react';

const NO_SHARE_LINK_ERROR = 'No share link available for this entry.';
const COPY_LINK_ERROR = 'Could not copy link automatically. Please copy it manually.';
const COPY_LINK_SUCCESS = 'Copied share link.';

/**
 * Copy a library entry's share link to the clipboard, with success/error
 * notifications. Shared by the assumptions page (via
 * useAssumptionsShareActions) and the sitewide AssumptionsSelector dropdown.
 */
const useCopySavedAssumptionsLink = (showNotification) =>
  useCallback(
    async (entry) => {
      if (!entry?.shareUrl) {
        showNotification('error', NO_SHARE_LINK_ERROR);
        return;
      }

      try {
        await globalThis.navigator.clipboard.writeText(entry.shareUrl);
        showNotification('success', COPY_LINK_SUCCESS);
      } catch {
        showNotification('error', COPY_LINK_ERROR);
      }
    },
    [showNotification]
  );

export default useCopySavedAssumptionsLink;
