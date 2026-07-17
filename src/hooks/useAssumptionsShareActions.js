import { useCallback, useState } from 'react';
import { attachSavedAssumptionsShareReference, saveNewAssumptions } from '../utils/savedAssumptionsStore';
import { isValidSlug, slugify } from '../utils/shareAssumptions';
import useCopySavedAssumptionsLink from './useCopySavedAssumptionsLink';

const SHARE_LIBRARY_SAVE_ERROR =
  'Share link created, but could not save it with your assumptions sets in this browser.';
const SHARE_LIBRARY_SYNC_ERROR = 'Share link created, but could not attach it to your saved assumptions set.';

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
    // Slugs are optional; a short label can slugify to something the API
    // rejects (min 3 chars), so only prefill when the result is valid.
    const prefillSlug = shouldPrefillSlug ? slugify(activeLibraryEntry?.label || '') : '';
    setShareModalInitialSlug(isValidSlug(prefillSlug) ? prefillSlug : '');
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

  const handleCopySavedLink = useCopySavedAssumptionsLink(showNotification);

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
