import { useCallback, useMemo, useState } from 'react';
import { hasCuratedAssumptionsLabel } from '../utils/curatedAssumptionsProfiles';
import { buildEvictionNotificationMessage } from '../utils/savedAssumptionsMessages';
import {
  createComparableAssumptionsFingerprint,
  saveNewAssumptions,
  updateSavedAssumptions,
} from '../utils/savedAssumptionsStore';

const STORAGE_ERROR_MESSAGE = 'Could not save assumptions locally. Delete some saved assumptions and try again.';

const useSaveAssumptionsModal = ({
  activeLibraryEntry,
  activeLibraryEntryFingerprint,
  currentAssumptionsFingerprint,
  libraryEntries,
  hasUnsavedChanges,
  getCurrentAssumptions,
  persistAsActive,
  refreshSavedAssumptions,
  showNotification,
  beforeSave,
}) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalDefaultLabel, setSaveModalDefaultLabel] = useState('');
  const [saveModalDefaultDescription, setSaveModalDefaultDescription] = useState('');

  const isActiveSavedAssumptionsRemote = Boolean(activeLibraryEntry?.reference);
  const isActiveCuratedEntry = activeLibraryEntry?.source === 'curated';
  const canUpdateExisting = Boolean(
    activeLibraryEntry && hasUnsavedChanges && !isActiveSavedAssumptionsRemote && !isActiveCuratedEntry
  );

  const duplicateSavedAssumptionsLabel = useMemo(() => {
    if (!currentAssumptionsFingerprint) {
      return null;
    }

    if (activeLibraryEntryFingerprint && activeLibraryEntryFingerprint === currentAssumptionsFingerprint) {
      return activeLibraryEntry?.label || null;
    }

    const matchingEntry = libraryEntries.find(
      (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentAssumptionsFingerprint
    );
    return matchingEntry?.label || null;
  }, [activeLibraryEntry?.label, activeLibraryEntryFingerprint, currentAssumptionsFingerprint, libraryEntries]);

  const handleSaveAssumptionsClick = useCallback(() => {
    const prepareResult = beforeSave?.();
    if (prepareResult?.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before saving.');
      return;
    }

    const currentAssumptions = getCurrentAssumptions();
    if (!currentAssumptions) {
      showNotification('error', 'No custom assumptions to save.');
      return;
    }

    setSaveModalDefaultLabel(!hasUnsavedChanges && !isActiveCuratedEntry ? activeLibraryEntry?.label || '' : '');
    setSaveModalDefaultDescription(
      !hasUnsavedChanges && !isActiveCuratedEntry ? activeLibraryEntry?.description || '' : ''
    );
    setSaveModalOpen(true);
  }, [
    activeLibraryEntry?.description,
    activeLibraryEntry?.label,
    beforeSave,
    getCurrentAssumptions,
    hasUnsavedChanges,
    isActiveCuratedEntry,
    showNotification,
  ]);

  const handleSaveModalClose = useCallback(() => {
    setSaveModalOpen(false);
  }, []);

  const handleSaveAssumptionsSubmit = useCallback(
    ({ label, description, mode }) => {
      const currentAssumptions = getCurrentAssumptions();
      if (!currentAssumptions) {
        return { ok: false, errorCode: 'no_custom_assumptions' };
      }

      if (hasCuratedAssumptionsLabel(label)) {
        return { ok: false, errorCode: 'reserved_curated_label' };
      }

      const result =
        mode === 'update' && canUpdateExisting && activeLibraryEntry && !activeLibraryEntry.reference
          ? updateSavedAssumptions(activeLibraryEntry.id, {
              label,
              description,
              assumptions: currentAssumptions,
              source: activeLibraryEntry.source,
              reference: activeLibraryEntry.reference,
            })
          : saveNewAssumptions({
              label,
              description,
              assumptions: currentAssumptions,
              source: 'local',
            });

      if (!result.ok) {
        if (result.errorCode !== 'duplicate_label' && result.errorCode !== 'over_limit') {
          showNotification('error', STORAGE_ERROR_MESSAGE);
        }
        return { ok: false, errorCode: result.errorCode || 'unknown_error' };
      }

      const nextActiveId = result.entry?.id || activeLibraryEntry?.id;
      if (nextActiveId) {
        persistAsActive(nextActiveId);
      } else {
        refreshSavedAssumptions();
      }
      setSaveModalOpen(false);

      const successMessage = mode === 'update' ? 'Updated saved assumptions.' : 'Saved assumptions.';
      const evictionMessage = buildEvictionNotificationMessage({
        prefix: successMessage,
        result,
      });
      if (evictionMessage) {
        showNotification('info', evictionMessage);
      }
      return { ok: true };
    },
    [
      activeLibraryEntry,
      canUpdateExisting,
      getCurrentAssumptions,
      persistAsActive,
      refreshSavedAssumptions,
      showNotification,
    ]
  );

  return {
    handleSaveAssumptionsClick,
    saveModalProps: {
      isOpen: saveModalOpen,
      onClose: handleSaveModalClose,
      onSubmit: handleSaveAssumptionsSubmit,
      defaultLabel: saveModalDefaultLabel,
      defaultDescription: saveModalDefaultDescription,
      updateExistingLabel: canUpdateExisting ? activeLibraryEntry?.label || '' : '',
      canUpdateExisting,
      duplicateOfLabel: duplicateSavedAssumptionsLabel,
    },
  };
};

export default useSaveAssumptionsModal;
