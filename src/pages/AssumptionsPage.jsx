import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import AssumptionsDescriptionModal from '../components/AssumptionsDescriptionModal';
import AssumptionsEditor from '../components/AssumptionsEditor';
import ShareAssumptionsModal from '../components/ShareAssumptionsModal';
import SaveAssumptionsModal from '../components/SaveAssumptionsModal';
import SavedAssumptionsMigrationModal from '../components/SavedAssumptionsMigrationModal';
import SavedAssumptionsPanel from '../components/SavedAssumptionsPanel';
import SharedImportDecisionModal from '../components/SharedImportDecisionModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { useNotificationActions } from '../contexts/NotificationContext';
import useAssumptionsShareActions from '../hooks/useAssumptionsShareActions';
import {
  getCuratedAssumptionsEntries,
  hasCuratedAssumptionsLabel,
  isCuratedAssumptionsEntryId,
} from '../utils/curatedAssumptionsProfiles';
import { buildEvictionNotificationMessage } from '../utils/savedAssumptionsMessages';
import {
  completeSavedAssumptionsMigration,
  createComparableAssumptionsFingerprint,
  deleteSavedAssumptions,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  markSavedAssumptionsLoaded,
  maybeRunSavedAssumptionsMigration,
  renameSavedAssumptions,
  saveNewAssumptions,
  SAVED_ASSUMPTIONS_CHANGED_EVENT,
  setActiveSavedAssumptionsId,
  updateSavedAssumptions,
} from '../utils/savedAssumptionsStore';

const STORAGE_ERROR_MESSAGE = 'Could not save assumptions locally. Delete some saved assumptions and try again.';
const DEFAULT_ASSUMPTIONS_ENTRY_ID = '__default__';

const AssumptionsPage = () => {
  const { isUsingCustomValues, getNormalizedUserAssumptionsForSharing, setAllUserAssumptions } = useAssumptions();
  const { showNotification } = useNotificationActions();
  const shouldReduceMotion = useReducedMotion();
  const curatedAssumptions = useMemo(() => getCuratedAssumptionsEntries(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalDefaultLabel, setSaveModalDefaultLabel] = useState('My Current Assumptions');
  const [saveModalDefaultDescription, setSaveModalDefaultDescription] = useState('');
  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsId, setActiveSavedAssumptionsIdState] = useState(null);
  const [pendingLoadEntry, setPendingLoadEntry] = useState(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState(null);
  const [pendingDescriptionEntry, setPendingDescriptionEntry] = useState(null);
  const [migrationPromptOpen, setMigrationPromptOpen] = useState(false);
  const [migrationDefaultLabel, setMigrationDefaultLabel] = useState('My Current Assumptions');
  const [migrationCheckDone, setMigrationCheckDone] = useState(false);
  const assumptionsEditorRef = useRef(null);

  const initialTab = searchParams.get('tab') || 'global';
  const initialCategoryId = searchParams.get('categoryId') || null;
  const initialRecipientId = searchParams.get('recipientId') || null;
  const initialActiveCategory = searchParams.get('activeCategory') || null;
  const assumptionsForSharing = getNormalizedUserAssumptionsForSharing();
  const libraryEntries = useMemo(
    () => [...curatedAssumptions, ...savedAssumptions],
    [curatedAssumptions, savedAssumptions]
  );
  const currentFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(assumptionsForSharing),
    [assumptionsForSharing]
  );
  const activeLibraryEntry = useMemo(
    () => libraryEntries.find((entry) => entry.id === activeSavedAssumptionsId) || null,
    [activeSavedAssumptionsId, libraryEntries]
  );
  const activeLibraryEntryFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(activeLibraryEntry?.assumptions),
    [activeLibraryEntry?.assumptions]
  );
  const hasUnsavedChanges = activeLibraryEntry
    ? activeLibraryEntryFingerprint !== currentFingerprint
    : isUsingCustomValues;
  const isActiveSavedAssumptionsRemote = Boolean(activeLibraryEntry?.reference);
  const isActiveCuratedEntry = activeLibraryEntry?.source === 'curated';
  const activePanelEntryId = activeSavedAssumptionsId || DEFAULT_ASSUMPTIONS_ENTRY_ID;
  const isCurrentStateRepresentedBySavedAssumptions = useMemo(() => {
    if (!isUsingCustomValues) {
      return true;
    }

    if (!currentFingerprint) {
      return false;
    }

    return libraryEntries.some(
      (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentFingerprint
    );
  }, [currentFingerprint, isUsingCustomValues, libraryEntries]);
  const canUpdateExisting = Boolean(
    activeLibraryEntry && hasUnsavedChanges && !isActiveSavedAssumptionsRemote && !isActiveCuratedEntry
  );
  const duplicateSavedAssumptionsLabel = useMemo(() => {
    if (!currentFingerprint) {
      return null;
    }

    if (activeLibraryEntry) {
      const activeFingerprint = createComparableAssumptionsFingerprint(activeLibraryEntry.assumptions);
      if (activeFingerprint && activeFingerprint === currentFingerprint) {
        return activeLibraryEntry.label;
      }
    }

    const matchingEntry = libraryEntries.find(
      (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentFingerprint
    );
    return matchingEntry?.label || null;
  }, [activeLibraryEntry, currentFingerprint, libraryEntries]);
  // `isUsingCustomValues` becomes false when the current state matches the built-in default assumptions,
  // but users can still have unsaved edits relative to a previously loaded saved set. Keep summary-row
  // Save/Share actions visible in that case so they can preserve or share the diverged state.
  const shouldShowCurrentAssumptionsActions = isUsingCustomValues || hasUnsavedChanges;

  const refreshSavedAssumptions = useCallback(() => {
    const entries = getSavedAssumptions();
    const activeId = getActiveSavedAssumptionsId();
    const activeExists =
      activeId && (entries.some((entry) => entry.id === activeId) || isCuratedAssumptionsEntryId(activeId));

    if (activeId && !activeExists) {
      setActiveSavedAssumptionsId(null);
      setActiveSavedAssumptionsIdState(null);
    } else {
      setActiveSavedAssumptionsIdState(activeId || null);
    }

    setSavedAssumptions(entries);
  }, []);

  useEffect(() => {
    refreshSavedAssumptions();
  }, [refreshSavedAssumptions]);

  useEffect(() => {
    const handleSavedAssumptionsChanged = () => {
      refreshSavedAssumptions();
    };

    globalThis.addEventListener(SAVED_ASSUMPTIONS_CHANGED_EVENT, handleSavedAssumptionsChanged);
    return () => {
      globalThis.removeEventListener(SAVED_ASSUMPTIONS_CHANGED_EVENT, handleSavedAssumptionsChanged);
    };
  }, [refreshSavedAssumptions]);

  useEffect(() => {
    if (migrationCheckDone) {
      return;
    }

    const migrationResult = maybeRunSavedAssumptionsMigration({
      currentAssumptions: assumptionsForSharing,
      defaultLabel: 'My Current Assumptions',
    });

    if (migrationResult.shouldPrompt) {
      setMigrationDefaultLabel(migrationResult.defaultLabel || 'My Current Assumptions');
      setMigrationPromptOpen(true);
    }

    setMigrationCheckDone(true);
  }, [assumptionsForSharing, migrationCheckDone]);

  // Handle URL param changes from the editor
  // Uses replace for tab changes, push for entity edit/exit
  const handleParamsChange = useCallback(
    (newParams, usePush = false) => {
      const paramsObj = {};

      if (newParams.tab && newParams.tab !== 'global') {
        paramsObj.tab = newParams.tab;
      }
      if (newParams.categoryId) {
        paramsObj.categoryId = newParams.categoryId;
      }
      if (newParams.recipientId) {
        paramsObj.recipientId = newParams.recipientId;
      }
      if (newParams.activeCategory) {
        paramsObj.activeCategory = newParams.activeCategory;
      }
      // Preserve `shared` while route-local query params are updated, so global import
      // is not interrupted if users switch assumptions tabs before it completes.
      if (searchParams.get('shared')) {
        paramsObj.shared = searchParams.get('shared');
      }

      const hasChanged =
        searchParams.get('tab') !== (paramsObj.tab || null) ||
        searchParams.get('categoryId') !== (paramsObj.categoryId || null) ||
        searchParams.get('recipientId') !== (paramsObj.recipientId || null) ||
        searchParams.get('activeCategory') !== (paramsObj.activeCategory || null);

      if (hasChanged) {
        setSearchParams(paramsObj, { replace: !usePush });
      }
    },
    [searchParams, setSearchParams]
  );

  const commitPendingEdits = useCallback(() => {
    const result =
      assumptionsEditorRef.current?.commitPendingAssumptionsEdits?.() ||
      assumptionsEditorRef.current?.prepareForShare?.();
    return result || { ok: true };
  }, []);

  const persistAsActive = useCallback(
    (entryId) => {
      setActiveSavedAssumptionsId(entryId);
      setActiveSavedAssumptionsIdState(entryId);
      refreshSavedAssumptions();
    },
    [refreshSavedAssumptions]
  );
  const {
    shareModalOpen,
    shareModalInitialResult,
    shareModalInitialDescription,
    handleOpenShareModal,
    handleCloseShareModal,
    handleShareSaved,
    handleCopySavedLink,
  } = useAssumptionsShareActions({
    activeLibraryEntry,
    assumptionsForSharing,
    hasUnsavedChanges,
    persistAsActive,
    showNotification,
  });

  const applySavedAssumptionsEntry = useCallback(
    (entry) => {
      if (!entry?.assumptions) {
        showNotification('error', 'Saved assumptions entry is invalid.');
        return;
      }

      setAllUserAssumptions(entry.assumptions);
      if (entry.source === 'curated') {
        persistAsActive(entry.id);
        return;
      }

      const loadedResult = markSavedAssumptionsLoaded(entry.id);
      if (!loadedResult.ok) {
        showNotification('error', STORAGE_ERROR_MESSAGE);
        return;
      }

      persistAsActive(entry.id);
    },
    [persistAsActive, setAllUserAssumptions, showNotification]
  );

  const applyDefaultAssumptions = useCallback(() => {
    setAllUserAssumptions(null);
    setActiveSavedAssumptionsId(null);
    setActiveSavedAssumptionsIdState(null);
    refreshSavedAssumptions();
  }, [refreshSavedAssumptions, setAllUserAssumptions]);

  const handleLoadSavedAssumptions = useCallback(
    (entry) => {
      if (!entry) {
        return;
      }

      if (entry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID) {
        if (!isUsingCustomValues && !activeSavedAssumptionsId) {
          showNotification('info', 'Default assumptions are already loaded.');
          return;
        }

        if (!isCurrentStateRepresentedBySavedAssumptions) {
          setPendingLoadEntry(entry);
          return;
        }

        applyDefaultAssumptions();
        return;
      }

      const entryFingerprint = createComparableAssumptionsFingerprint(entry.assumptions);
      if (entryFingerprint && entryFingerprint === currentFingerprint) {
        if (entry.source === 'curated') {
          persistAsActive(entry.id);
        } else {
          const loadedResult = markSavedAssumptionsLoaded(entry.id);
          if (loadedResult.ok) {
            persistAsActive(entry.id);
          }
        }
        const isSameActiveEntry = activeSavedAssumptionsId === entry.id;
        showNotification(
          'info',
          isSameActiveEntry ? 'These assumptions are already loaded.' : 'Switched active saved assumptions entry.'
        );
        return;
      }

      if (isUsingCustomValues && !isCurrentStateRepresentedBySavedAssumptions) {
        setPendingLoadEntry(entry);
        return;
      }

      applySavedAssumptionsEntry(entry);
    },
    [
      activeSavedAssumptionsId,
      applyDefaultAssumptions,
      applySavedAssumptionsEntry,
      currentFingerprint,
      isCurrentStateRepresentedBySavedAssumptions,
      isUsingCustomValues,
      persistAsActive,
      showNotification,
    ]
  );

  const handleContinuePendingLoad = useCallback(() => {
    if (!pendingLoadEntry) {
      return;
    }
    if (pendingLoadEntry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID) {
      applyDefaultAssumptions();
      setPendingLoadEntry(null);
      return;
    }
    applySavedAssumptionsEntry(pendingLoadEntry);
    setPendingLoadEntry(null);
  }, [applyDefaultAssumptions, applySavedAssumptionsEntry, pendingLoadEntry]);

  const handleCancelPendingLoad = useCallback(() => {
    setPendingLoadEntry(null);
  }, []);

  const handleShareButtonClick = useCallback(() => {
    const prepareResult = commitPendingEdits();
    if (prepareResult?.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before sharing.');
      return;
    }

    handleOpenShareModal();
  }, [commitPendingEdits, handleOpenShareModal, showNotification]);

  const handleSaveAssumptionsClick = useCallback(() => {
    const prepareResult = commitPendingEdits();
    if (prepareResult?.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before saving.');
      return;
    }

    const currentAssumptions = getNormalizedUserAssumptionsForSharing();
    if (!currentAssumptions) {
      showNotification('error', 'No custom assumptions to save.');
      return;
    }

    setSaveModalDefaultLabel(isActiveCuratedEntry ? '' : activeLibraryEntry?.label || '');
    setSaveModalDefaultDescription(isActiveCuratedEntry ? '' : activeLibraryEntry?.description || '');
    setSaveModalOpen(true);
  }, [
    activeLibraryEntry?.description,
    activeLibraryEntry?.label,
    commitPendingEdits,
    getNormalizedUserAssumptionsForSharing,
    isActiveCuratedEntry,
    showNotification,
  ]);

  const handleSaveModalClose = useCallback(() => {
    setSaveModalOpen(false);
  }, []);

  const handleSaveAssumptionsSubmit = useCallback(
    ({ label, description, mode }) => {
      const currentAssumptions = getNormalizedUserAssumptionsForSharing();
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
      getNormalizedUserAssumptionsForSharing,
      persistAsActive,
      refreshSavedAssumptions,
      showNotification,
    ]
  );

  const handleRenameSavedAssumptions = useCallback(
    (entryId, nextLabel) => {
      if (hasCuratedAssumptionsLabel(nextLabel)) {
        return { ok: false, errorCode: 'reserved_curated_label' };
      }

      const result = renameSavedAssumptions(entryId, nextLabel);
      if (!result.ok) {
        if (result.errorCode !== 'duplicate_label') {
          showNotification('error', STORAGE_ERROR_MESSAGE);
        }
        return { ok: false, errorCode: result.errorCode || 'unknown_error' };
      }

      refreshSavedAssumptions();
      return { ok: true };
    },
    [refreshSavedAssumptions, showNotification]
  );

  const handleRequestDeleteSavedAssumptions = useCallback((entryId) => {
    setPendingDeleteEntryId(entryId);
  }, []);

  const handleDeleteSavedAssumptions = useCallback(
    (entryId) => {
      if (!entryId) {
        return;
      }

      const result = deleteSavedAssumptions(entryId);
      if (!result.ok) {
        showNotification('error', STORAGE_ERROR_MESSAGE);
        return;
      }

      refreshSavedAssumptions();
    },
    [refreshSavedAssumptions, showNotification]
  );

  const handleDescriptionModalOpen = useCallback((entry) => {
    if (!entry?.id) {
      return;
    }

    setPendingDescriptionEntry(entry);
  }, []);

  const handleDescriptionModalClose = useCallback(() => {
    setPendingDescriptionEntry(null);
  }, []);

  const handleSaveDescription = useCallback(
    (description) => {
      if (!pendingDescriptionEntry?.id || pendingDescriptionEntry.reference) {
        setPendingDescriptionEntry(null);
        return;
      }

      const result = updateSavedAssumptions(pendingDescriptionEntry.id, { description });
      if (!result.ok) {
        showNotification('error', STORAGE_ERROR_MESSAGE);
        return;
      }

      refreshSavedAssumptions();
      setPendingDescriptionEntry(null);
    },
    [pendingDescriptionEntry, refreshSavedAssumptions, showNotification]
  );

  const handleMigrationSave = useCallback(() => {
    const result = completeSavedAssumptionsMigration({
      accepted: true,
      currentAssumptions: assumptionsForSharing,
      label: migrationDefaultLabel,
    });

    if (!result.ok) {
      showNotification('error', STORAGE_ERROR_MESSAGE);
      return;
    }

    setMigrationPromptOpen(false);
    refreshSavedAssumptions();
  }, [assumptionsForSharing, migrationDefaultLabel, refreshSavedAssumptions, showNotification]);

  const handleMigrationSkip = useCallback(() => {
    const result = completeSavedAssumptionsMigration({
      accepted: false,
      currentAssumptions: assumptionsForSharing,
    });

    if (!result.ok) {
      showNotification('error', STORAGE_ERROR_MESSAGE);
      return;
    }

    setMigrationPromptOpen(false);
  }, [assumptionsForSharing, showNotification]);

  return (
    <motion.div
      className="assumptions-page min-h-screen pb-8"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28 }}
    >
      <BackButton
        to="/"
        label="Back to top donors"
        variant="accent"
        className="no-underline"
        containerProps={{
          className: 'relative z-10 mx-auto mb-2 mt-4 flex max-w-7xl justify-start px-4 sm:px-6 lg:px-8',
        }}
        motion={shouldReduceMotion ? { initial: false, animate: { opacity: 1 } } : undefined}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8"
        initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.36, delay: 0.02 }}
      >
        <div className="mb-8">
          <h1 className="impact-page__title">Assumptions</h1>
          <p className="impact-page__subtitle">Adjust or view the parameters used to calculate lives saved.</p>
        </div>

        <SavedAssumptionsPanel
          entries={libraryEntries}
          activeId={activePanelEntryId}
          hasUnsavedChanges={hasUnsavedChanges}
          showCurrentActions={shouldShowCurrentAssumptionsActions}
          onLoad={handleLoadSavedAssumptions}
          onSaveCurrent={handleSaveAssumptionsClick}
          onShareCurrent={handleShareButtonClick}
          onRename={handleRenameSavedAssumptions}
          onDelete={handleRequestDeleteSavedAssumptions}
          onCopyLink={handleCopySavedLink}
          onDescription={handleDescriptionModalOpen}
        />

        <div className="assumptions-shell overflow-hidden">
          <AssumptionsEditor
            ref={assumptionsEditorRef}
            initialTab={initialTab}
            initialCategoryId={initialCategoryId}
            initialRecipientId={initialRecipientId}
            initialActiveCategory={initialActiveCategory}
            onParamsChange={handleParamsChange}
          />
        </div>

        <ShareAssumptionsModal
          isOpen={shareModalOpen}
          onClose={handleCloseShareModal}
          assumptions={assumptionsForSharing}
          assumptionName={activeLibraryEntry?.label || null}
          onSaved={handleShareSaved}
          title="Share Assumptions"
          initialDescription={shareModalInitialDescription}
          initialSavedResult={shareModalInitialResult}
        />

        <SaveAssumptionsModal
          isOpen={saveModalOpen}
          onClose={handleSaveModalClose}
          onSubmit={handleSaveAssumptionsSubmit}
          defaultLabel={saveModalDefaultLabel}
          defaultDescription={saveModalDefaultDescription}
          canUpdateExisting={canUpdateExisting}
          duplicateOfLabel={duplicateSavedAssumptionsLabel}
        />

        <SharedImportDecisionModal
          isOpen={Boolean(pendingLoadEntry)}
          onContinue={handleContinuePendingLoad}
          onCancel={handleCancelPendingLoad}
          title="Overwrite your unsaved assumptions?"
          description="You already have custom assumptions in this browser. Continuing will replace them with this saved entry."
          continueLabel="Continue (overwrite yours)"
          cancelLabel="Cancel"
        />

        <SavedAssumptionsMigrationModal
          isOpen={migrationPromptOpen}
          onSaveCurrent={handleMigrationSave}
          onSkip={handleMigrationSkip}
        />

        <ConfirmActionModal
          isOpen={Boolean(pendingDeleteEntryId)}
          title="Delete from Assumptions Library?"
          description="This saved assumptions entry will be removed from this browser."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            handleDeleteSavedAssumptions(pendingDeleteEntryId);
            setPendingDeleteEntryId(null);
          }}
          onCancel={() => setPendingDeleteEntryId(null)}
        />

        <AssumptionsDescriptionModal
          isOpen={Boolean(pendingDescriptionEntry)}
          entryLabel={pendingDescriptionEntry?.label || ''}
          initialDescription={pendingDescriptionEntry?.content || pendingDescriptionEntry?.description || ''}
          isReadOnly={Boolean(
            pendingDescriptionEntry?.reference ||
              pendingDescriptionEntry?.source === 'curated' ||
              pendingDescriptionEntry?.source === 'custom'
          )}
          onClose={handleDescriptionModalClose}
          onSave={handleSaveDescription}
        />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
