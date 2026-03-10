import { useCallback, useState } from 'react';
import { attachSavedAssumptionsShareReference, saveNewAssumptions } from '../utils/savedAssumptionsStore';
import { slugify } from '../utils/shareAssumptions';

const SHARE_LIBRARY_SAVE_ERROR = 'Share link created, but could not save it to the Assumptions Library.';
const SHARE_LIBRARY_SYNC_ERROR = 'Share link created, but could not sync it to the Assumptions Library.';
const NO_SHARE_LINK_ERROR = 'No share link available for this entry.';
const COPY_LINK_ERROR = 'Could not copy link automatically. Please copy it manually.';
const COPY_LINK_SUCCESS = 'Copied share link.';

export const useAssumptionsShareActions = ({
  activeLibraryEntry,
  assumptionsForSharing,
  hasUnsavedChanges,
  persistAsActive,
  showNotification,
}) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalInitialResult, setShareModalInitialResult] = useState(null);
  const [shareModalInitialDescription, setShareModalInitialDescription] = useState('');
  const [shareModalInitialSlug, setShareModalInitialSlug] = useState('');
  const isActiveSavedAssumptionsRemote = Boolean(activeLibraryEntry?.reference);
  const shouldForkEditedRemoteAssumptions = Boolean(isActiveSavedAssumptionsRemote && hasUnsavedChanges);
  const shareAssumptionName = shouldForkEditedRemoteAssumptions ? null : activeLibraryEntry?.label || null;

  const handleOpenShareModal = useCallback(() => {
    const shouldPrefillDescription = !hasUnsavedChanges;
    const shouldPrefillSlug =
      !hasUnsavedChanges && activeLibraryEntry?.source === 'local' && !activeLibraryEntry?.reference;

    if (activeLibraryEntry?.reference && !hasUnsavedChanges && activeLibraryEntry?.shareUrl) {
      setShareModalInitialResult({
        id: activeLibraryEntry.id,
        reference: activeLibraryEntry.reference,
        description: activeLibraryEntry.description,
        shareUrl: activeLibraryEntry.shareUrl,
      });
    } else {
      setShareModalInitialResult(null);
    }

    setShareModalInitialDescription(shouldPrefillDescription ? activeLibraryEntry?.description || '' : '');
    setShareModalInitialSlug(shouldPrefillSlug ? slugify(activeLibraryEntry?.label || '') : '');
    setShareModalOpen(true);
  }, [
    activeLibraryEntry?.description,
    activeLibraryEntry?.id,
    activeLibraryEntry?.label,
    activeLibraryEntry?.reference,
    activeLibraryEntry?.shareUrl,
    activeLibraryEntry?.source,
    hasUnsavedChanges,
  ]);

  const handleCloseShareModal = useCallback(() => {
    setShareModalOpen(false);
    setShareModalInitialResult(null);
    setShareModalInitialDescription('');
    setShareModalInitialSlug('');
  }, []);

  const createAndActivateSharedEntry = useCallback(
    (sharedReference, description) => {
      const createResult = saveNewAssumptions({
        label: sharedReference,
        description,
        assumptions: assumptionsForSharing,
        source: 'local',
        reference: sharedReference,
        resolveDuplicateLabel: true,
      });

      if (createResult.ok && createResult.entry?.id) {
        persistAsActive(createResult.entry.id);
        return true;
      }

      showNotification('error', SHARE_LIBRARY_SAVE_ERROR);
      return false;
    },
    [assumptionsForSharing, persistAsActive, showNotification]
  );

  const handleShareSaved = useCallback(
    (sharedResult) => {
      const sharedReference = typeof sharedResult?.reference === 'string' ? sharedResult.reference.trim() : '';
      const sharedDescription = sharedResult?.description || null;

      if (!sharedReference || !assumptionsForSharing) {
        return;
      }

      if (shouldForkEditedRemoteAssumptions) {
        createAndActivateSharedEntry(sharedReference, sharedDescription);
        return;
      }

      const attachResult = attachSavedAssumptionsShareReference({
        reference: sharedReference,
        description: sharedDescription,
        assumptions: assumptionsForSharing,
        preferredId: activeLibraryEntry?.source === 'curated' ? null : activeLibraryEntry?.id || null,
      });

      if (attachResult.ok && attachResult.entry?.id) {
        persistAsActive(attachResult.entry.id);
        return;
      }

      if (attachResult.errorCode === 'not_found') {
        createAndActivateSharedEntry(sharedReference, sharedDescription);
        return;
      }

      showNotification('error', SHARE_LIBRARY_SYNC_ERROR);
    },
    [
      activeLibraryEntry?.id,
      activeLibraryEntry?.source,
      assumptionsForSharing,
      createAndActivateSharedEntry,
      persistAsActive,
      shouldForkEditedRemoteAssumptions,
      showNotification,
    ]
  );

  const handleCopySavedLink = useCallback(
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

  return {
    shareModalOpen,
    shareModalInitialResult,
    shareModalInitialDescription,
    shareModalInitialSlug,
    shareAssumptionName,
    handleOpenShareModal,
    handleCloseShareModal,
    handleShareSaved,
    handleCopySavedLink,
  };
};

export default useAssumptionsShareActions;
