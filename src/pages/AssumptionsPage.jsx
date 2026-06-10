import { useCallback, useEffect, useRef, useState } from 'react';
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
import useAssumptionsSelectorPreference from '../hooks/useAssumptionsSelectorPreference';
import useSaveAssumptionsModal from '../hooks/useSaveAssumptionsModal';
import useAssumptionsShareActions from '../hooks/useAssumptionsShareActions';
import { ASSUMPTIONS_SELECTOR_PREFERENCE_CONTROL_ENABLED } from '../utils/assumptionsSelectorDisplayPreference';
import { OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL } from '../utils/assumptionsLoadHelpers';
import { hasCuratedAssumptionsLabel } from '../utils/curatedAssumptionsProfiles';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useAssumptionsLibrary, { STORAGE_ERROR_MESSAGE } from '../hooks/useAssumptionsLibrary';
import {
  completeSavedAssumptionsMigration,
  deleteSavedAssumptions,
  maybeRunSavedAssumptionsMigration,
  renameSavedAssumptions,
  updateSavedAssumptions,
} from '../utils/savedAssumptionsStore';
import { DEFAULT_ASSUMPTIONS_ENTRY_ID } from '../constants/assumptionsLibraryEntries';

const AssumptionsPage = () => {
  useDocumentTitle('Assumptions Editor');
  const { isUsingCustomValues, getNormalizedUserAssumptionsForSharing } = useAssumptions();
  const { showNotification } = useNotificationActions();
  const [showSelectorEveryPage, setShowSelectorEveryPage] = useAssumptionsSelectorPreference();
  const shouldReduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const {
    assumptionsForSharing,
    libraryEntries,
    activeSavedAssumptionsId,
    activeLibraryEntry,
    activeLibraryEntryFingerprint,
    currentFingerprint,
    hasUnsavedChanges,
    activeAssumptionsLabel,
    pendingLoadEntry,
    handleLoadEntry,
    handleContinuePendingLoad,
    handleCancelPendingLoad,
    persistAsActive,
    refreshSavedAssumptions,
  } = useAssumptionsLibrary({ notifyOnEntrySwitch: true });

  const activePanelEntryId = activeSavedAssumptionsId || DEFAULT_ASSUMPTIONS_ENTRY_ID;
  // `isUsingCustomValues` becomes false when the current state matches the built-in default assumptions,
  // but users can still have unsaved edits relative to a previously loaded saved set. Keep summary-row
  // Save/Share actions visible in that case so they can preserve or share the diverged state.
  const shouldShowCurrentAssumptionsActions = isUsingCustomValues || hasUnsavedChanges;

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

  const {
    shareModalOpen,
    shareModalInitialResult,
    shareModalInitialDescription,
    shareModalInitialSlug,
    shareAssumptionName,
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

  const handleShareButtonClick = useCallback(() => {
    const prepareResult = commitPendingEdits();
    if (prepareResult?.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before sharing.');
      return;
    }

    handleOpenShareModal();
  }, [commitPendingEdits, handleOpenShareModal, showNotification]);
  const { handleSaveAssumptionsClick, saveModalProps } = useSaveAssumptionsModal({
    activeLibraryEntry,
    activeLibraryEntryFingerprint,
    currentAssumptionsFingerprint: currentFingerprint,
    libraryEntries,
    hasUnsavedChanges,
    getCurrentAssumptions: getNormalizedUserAssumptionsForSharing,
    persistAsActive,
    refreshSavedAssumptions,
    showNotification,
    beforeSave: commitPendingEdits,
  });

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
          onLoad={handleLoadEntry}
          onSaveCurrent={handleSaveAssumptionsClick}
          onShareCurrent={handleShareButtonClick}
          onRename={handleRenameSavedAssumptions}
          onDelete={handleRequestDeleteSavedAssumptions}
          onCopyLink={handleCopySavedLink}
          onDescription={handleDescriptionModalOpen}
          footer={
            ASSUMPTIONS_SELECTOR_PREFERENCE_CONTROL_ENABLED ? (
              <div className="saved-assumptions-panel__preference">
                <span className="saved-assumptions-panel__preference-eyebrow">Display preference</span>
                <label className="saved-assumptions-panel__preference-row">
                  <input
                    type="checkbox"
                    checked={showSelectorEveryPage}
                    onChange={(event) => setShowSelectorEveryPage(event.target.checked)}
                    className="saved-assumptions-panel__preference-switch"
                  />
                  <span className="saved-assumptions-panel__preference-text">
                    Show assumption selector on all pages
                  </span>
                </label>
              </div>
            ) : null
          }
        />

        <div className="assumptions-shell overflow-hidden">
          <AssumptionsEditor
            ref={assumptionsEditorRef}
            initialTab={initialTab}
            initialCategoryId={initialCategoryId}
            initialRecipientId={initialRecipientId}
            initialActiveCategory={initialActiveCategory}
            activeAssumptionsLabel={activeAssumptionsLabel}
            onParamsChange={handleParamsChange}
          />
        </div>

        <ShareAssumptionsModal
          isOpen={shareModalOpen}
          onClose={handleCloseShareModal}
          assumptions={assumptionsForSharing}
          assumptionName={shareAssumptionName}
          onSaved={handleShareSaved}
          title="Share Assumptions"
          initialDescription={shareModalInitialDescription}
          initialSlug={shareModalInitialSlug}
          initialSavedResult={shareModalInitialResult}
        />

        <SaveAssumptionsModal {...saveModalProps} />

        <SharedImportDecisionModal
          isOpen={Boolean(pendingLoadEntry)}
          onContinue={handleContinuePendingLoad}
          onCancel={handleCancelPendingLoad}
          title={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.title}
          description={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.description}
          continueLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.continueLabel}
          cancelLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.cancelLabel}
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
              pendingDescriptionEntry?.source === 'custom' ||
              pendingDescriptionEntry?.id === DEFAULT_ASSUMPTIONS_ENTRY_ID
          )}
          onClose={handleDescriptionModalClose}
          onSave={handleSaveDescription}
        />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
