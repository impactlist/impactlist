import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import AssumptionsEditor from '../components/AssumptionsEditor';
import ShareAssumptionsModal from '../components/ShareAssumptionsModal';
import SaveAssumptionsModal from '../components/SaveAssumptionsModal';
import SavedAssumptionsMigrationModal from '../components/SavedAssumptionsMigrationModal';
import SavedAssumptionsPanel from '../components/SavedAssumptionsPanel';
import SharedImportDecisionModal from '../components/SharedImportDecisionModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { useNotificationActions } from '../contexts/NotificationContext';
import { buildEvictionNotificationMessage } from '../utils/savedAssumptionsMessages';
import {
  attachSavedAssumptionsShareReference,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalInitialResult, setShareModalInitialResult] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalDefaultLabel, setSaveModalDefaultLabel] = useState('My Current Assumptions');
  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsId, setActiveSavedAssumptionsIdState] = useState(null);
  const [pendingLoadEntry, setPendingLoadEntry] = useState(null);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState(null);
  const [migrationPromptOpen, setMigrationPromptOpen] = useState(false);
  const [migrationDefaultLabel, setMigrationDefaultLabel] = useState('My Current Assumptions');
  const [migrationCheckDone, setMigrationCheckDone] = useState(false);
  const assumptionsEditorRef = useRef(null);

  const initialTab = searchParams.get('tab') || 'global';
  const initialCategoryId = searchParams.get('categoryId') || null;
  const initialRecipientId = searchParams.get('recipientId') || null;
  const initialActiveCategory = searchParams.get('activeCategory') || null;
  const assumptionsForSharing = getNormalizedUserAssumptionsForSharing();
  const currentFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(assumptionsForSharing),
    [assumptionsForSharing]
  );
  const activeSavedAssumptionsEntry = useMemo(
    () => savedAssumptions.find((entry) => entry.id === activeSavedAssumptionsId) || null,
    [activeSavedAssumptionsId, savedAssumptions]
  );
  const activeSavedAssumptionsFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(activeSavedAssumptionsEntry?.assumptions),
    [activeSavedAssumptionsEntry?.assumptions]
  );
  const hasUnsavedChanges = activeSavedAssumptionsEntry
    ? activeSavedAssumptionsFingerprint !== currentFingerprint
    : isUsingCustomValues;
  const isActiveSavedAssumptionsRemote = Boolean(activeSavedAssumptionsEntry?.reference);
  const activePanelEntryId = activeSavedAssumptionsId || DEFAULT_ASSUMPTIONS_ENTRY_ID;
  const isCurrentStateRepresentedBySavedAssumptions = useMemo(() => {
    if (!isUsingCustomValues) {
      return true;
    }

    if (!currentFingerprint) {
      return false;
    }

    return savedAssumptions.some(
      (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentFingerprint
    );
  }, [currentFingerprint, isUsingCustomValues, savedAssumptions]);
  const canUpdateExisting = Boolean(
    activeSavedAssumptionsEntry && hasUnsavedChanges && !isActiveSavedAssumptionsRemote
  );
  const duplicateSavedAssumptionsLabel = useMemo(() => {
    if (!currentFingerprint) {
      return null;
    }

    if (activeSavedAssumptionsEntry) {
      const activeFingerprint = createComparableAssumptionsFingerprint(activeSavedAssumptionsEntry.assumptions);
      if (activeFingerprint && activeFingerprint === currentFingerprint) {
        return activeSavedAssumptionsEntry.label;
      }
    }

    const matchingEntry = savedAssumptions.find(
      (entry) => createComparableAssumptionsFingerprint(entry.assumptions) === currentFingerprint
    );
    return matchingEntry?.label || null;
  }, [activeSavedAssumptionsEntry, currentFingerprint, savedAssumptions]);

  const refreshSavedAssumptions = useCallback(() => {
    const entries = getSavedAssumptions();
    const activeId = getActiveSavedAssumptionsId();
    const activeExists = activeId && entries.some((entry) => entry.id === activeId);

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

  const applySavedAssumptionsEntry = useCallback(
    (entry) => {
      if (!entry?.assumptions) {
        showNotification('error', 'Saved assumptions entry is invalid.');
        return;
      }

      setAllUserAssumptions(entry.assumptions);
      const loadedResult = markSavedAssumptionsLoaded(entry.id);
      if (!loadedResult.ok) {
        showNotification('error', STORAGE_ERROR_MESSAGE);
        return;
      }

      persistAsActive(entry.id);
      showNotification('success', 'Loaded saved assumptions.');
    },
    [persistAsActive, setAllUserAssumptions, showNotification]
  );

  const applyDefaultAssumptions = useCallback(() => {
    setAllUserAssumptions(null);
    setActiveSavedAssumptionsId(null);
    setActiveSavedAssumptionsIdState(null);
    refreshSavedAssumptions();
    showNotification('success', 'Loaded default assumptions.');
  }, [refreshSavedAssumptions, setAllUserAssumptions, showNotification]);

  const handleLoadSavedAssumptions = useCallback(
    (entry) => {
      if (!entry) {
        return;
      }

      if (entry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID) {
        if (!isUsingCustomValues) {
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
        const loadedResult = markSavedAssumptionsLoaded(entry.id);
        if (loadedResult.ok) {
          persistAsActive(entry.id);
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
    showNotification('info', 'Kept your current assumptions.');
  }, [showNotification]);

  const handleShareButtonClick = useCallback(() => {
    const prepareResult = commitPendingEdits();
    if (prepareResult?.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before sharing.');
      return;
    }

    if (isActiveSavedAssumptionsRemote && !hasUnsavedChanges && activeSavedAssumptionsEntry?.shareUrl) {
      setShareModalInitialResult({
        id: activeSavedAssumptionsEntry.id,
        reference: activeSavedAssumptionsEntry.reference,
        shareUrl: activeSavedAssumptionsEntry.shareUrl,
      });
    } else {
      setShareModalInitialResult(null);
    }

    setShareModalOpen(true);
  }, [
    activeSavedAssumptionsEntry?.id,
    activeSavedAssumptionsEntry?.reference,
    activeSavedAssumptionsEntry?.shareUrl,
    commitPendingEdits,
    hasUnsavedChanges,
    isActiveSavedAssumptionsRemote,
    showNotification,
  ]);

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

    setSaveModalDefaultLabel(activeSavedAssumptionsEntry?.label || 'My Current Assumptions');
    setSaveModalOpen(true);
  }, [
    activeSavedAssumptionsEntry?.label,
    commitPendingEdits,
    getNormalizedUserAssumptionsForSharing,
    showNotification,
  ]);

  const handleShareModalClose = useCallback(() => {
    setShareModalOpen(false);
    setShareModalInitialResult(null);
  }, []);

  const handleSaveModalClose = useCallback(() => {
    setSaveModalOpen(false);
  }, []);

  const handleShareSaved = useCallback(
    (sharedResult) => {
      const sharedReference = typeof sharedResult?.reference === 'string' ? sharedResult.reference.trim() : '';
      const assumptionsToShare = getNormalizedUserAssumptionsForSharing();

      if (sharedReference && assumptionsToShare) {
        const attachResult = attachSavedAssumptionsShareReference({
          reference: sharedReference,
          assumptions: assumptionsToShare,
          preferredId: activeSavedAssumptionsEntry?.id || null,
        });

        if (attachResult.ok && attachResult.entry?.id) {
          persistAsActive(attachResult.entry.id);
        } else if (!attachResult.ok && attachResult.errorCode === 'not_found') {
          const createResult = saveNewAssumptions({
            label: sharedReference,
            assumptions: assumptionsToShare,
            source: 'local',
            reference: sharedReference,
            resolveDuplicateLabel: true,
          });

          if (!createResult.ok || !createResult.entry?.id) {
            showNotification('error', 'Share link created, but could not save it to Saved Assumptions.');
            return;
          }

          persistAsActive(createResult.entry.id);
        } else {
          showNotification('error', 'Share link created, but could not sync it to Saved Assumptions.');
          return;
        }
      }

      showNotification('success', 'Share link created.');
    },
    [activeSavedAssumptionsEntry?.id, getNormalizedUserAssumptionsForSharing, persistAsActive, showNotification]
  );

  const handleSaveAssumptionsSubmit = useCallback(
    ({ label, mode }) => {
      const currentAssumptions = getNormalizedUserAssumptionsForSharing();
      if (!currentAssumptions) {
        return { ok: false, errorCode: 'no_custom_assumptions' };
      }

      const result =
        mode === 'update' && canUpdateExisting && activeSavedAssumptionsEntry && !activeSavedAssumptionsEntry.reference
          ? updateSavedAssumptions(activeSavedAssumptionsEntry.id, {
              label,
              assumptions: currentAssumptions,
              source: activeSavedAssumptionsEntry.source,
              reference: activeSavedAssumptionsEntry.reference,
            })
          : saveNewAssumptions({
              label,
              assumptions: currentAssumptions,
              source: 'local',
            });

      if (!result.ok) {
        if (result.errorCode !== 'duplicate_label' && result.errorCode !== 'over_limit') {
          showNotification('error', STORAGE_ERROR_MESSAGE);
        }
        return { ok: false, errorCode: result.errorCode || 'unknown_error' };
      }

      const nextActiveId = result.entry?.id || activeSavedAssumptionsEntry?.id;
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
      showNotification(evictionMessage ? 'info' : 'success', evictionMessage || successMessage);
      return { ok: true };
    },
    [
      activeSavedAssumptionsEntry,
      canUpdateExisting,
      getNormalizedUserAssumptionsForSharing,
      persistAsActive,
      refreshSavedAssumptions,
      showNotification,
    ]
  );

  const handleRenameSavedAssumptions = useCallback(
    (entryId, nextLabel) => {
      const result = renameSavedAssumptions(entryId, nextLabel);
      if (!result.ok) {
        if (result.errorCode !== 'duplicate_label') {
          showNotification('error', STORAGE_ERROR_MESSAGE);
        }
        return { ok: false, errorCode: result.errorCode || 'unknown_error' };
      }

      refreshSavedAssumptions();
      showNotification('success', 'Renamed saved assumptions.');
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
      showNotification('success', 'Deleted saved assumptions.');
    },
    [refreshSavedAssumptions, showNotification]
  );

  const handleCopySavedLink = useCallback(
    async (entry) => {
      if (!entry?.shareUrl) {
        showNotification('error', 'No share link available for this entry.');
        return;
      }

      try {
        await globalThis.navigator.clipboard.writeText(entry.shareUrl);
        showNotification('success', 'Copied share link.');
      } catch {
        showNotification('error', 'Could not copy link automatically. Please copy it manually.');
      }
    },
    [showNotification]
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
    showNotification('success', 'Saved your current assumptions.');
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="assumptions-title text-center text-4xl font-bold text-[var(--text-strong)] sm:text-left sm:text-5xl">
              Assumptions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Adjust the parameters used to calculate lives saved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            {isUsingCustomValues && (
              <button type="button" onClick={handleSaveAssumptionsClick} className="impact-btn impact-btn--secondary">
                Save Assumptions
              </button>
            )}
            {isUsingCustomValues && (
              <button type="button" onClick={handleShareButtonClick} className="impact-btn impact-btn--primary">
                Share Assumptions
              </button>
            )}
          </div>
        </div>

        <SavedAssumptionsPanel
          entries={savedAssumptions}
          activeId={activePanelEntryId}
          hasUnsavedChanges={hasUnsavedChanges}
          onLoad={handleLoadSavedAssumptions}
          onRename={handleRenameSavedAssumptions}
          onDelete={handleRequestDeleteSavedAssumptions}
          onCopyLink={handleCopySavedLink}
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
          onClose={handleShareModalClose}
          assumptions={assumptionsForSharing}
          onSaved={handleShareSaved}
          title="Share Assumptions"
          initialSavedResult={shareModalInitialResult}
        />

        <SaveAssumptionsModal
          isOpen={saveModalOpen}
          onClose={handleSaveModalClose}
          onSubmit={handleSaveAssumptionsSubmit}
          defaultLabel={saveModalDefaultLabel}
          canUpdateExisting={canUpdateExisting}
          duplicateOfLabel={duplicateSavedAssumptionsLabel}
        />

        <SharedImportDecisionModal
          isOpen={Boolean(pendingLoadEntry)}
          onContinue={handleContinuePendingLoad}
          onCancel={handleCancelPendingLoad}
          title="Load Saved Assumptions?"
          description="You already have custom assumptions in this browser. Continuing will replace them with this saved entry."
          continueLabel="Continue (Replace Mine)"
          cancelLabel="Cancel"
        />

        <SavedAssumptionsMigrationModal
          isOpen={migrationPromptOpen}
          onSaveCurrent={handleMigrationSave}
          onSkip={handleMigrationSkip}
        />

        <ConfirmActionModal
          isOpen={Boolean(pendingDeleteEntryId)}
          title="Delete Saved Assumptions?"
          description="This saved assumptions entry will be removed from this browser."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            handleDeleteSavedAssumptions(pendingDeleteEntryId);
            setPendingDeleteEntryId(null);
          }}
          onCancel={() => setPendingDeleteEntryId(null)}
        />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
