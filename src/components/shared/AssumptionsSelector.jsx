import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getCuratedAssumptionsEntries, isCuratedAssumptionsEntryId } from '../../utils/curatedAssumptionsProfiles';
import {
  createComparableAssumptionsFingerprint,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  markSavedAssumptionsLoaded,
  SAVED_ASSUMPTIONS_CHANGED_EVENT,
  setActiveSavedAssumptionsId,
} from '../../utils/savedAssumptionsStore';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { useNotificationActions } from '../../contexts/NotificationContext';
import useAssumptionsShareActions from '../../hooks/useAssumptionsShareActions';
import {
  getAssumptionsLoadRequest,
  isCurrentAssumptionsStateRepresentedByLibrary,
  OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL,
} from '../../utils/assumptionsLoadHelpers';
import AssumptionsDescriptionModal from '../AssumptionsDescriptionModal';
import ShareAssumptionsModal from '../ShareAssumptionsModal';
import SharedImportDecisionModal from '../SharedImportDecisionModal';
import InfoTooltipIcon from './InfoTooltipIcon';
import AssumptionsDropdown, { DEFAULT_ASSUMPTIONS_ENTRY_ID } from './AssumptionsDropdown';

const AssumptionsSelector = ({ className = '' }) => {
  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsIdState, setActiveSavedAssumptionsIdState] = useState(null);
  const [pendingLoadEntry, setPendingLoadEntry] = useState(null);
  const [pendingDescriptionEntry, setPendingDescriptionEntry] = useState(null);
  const { getNormalizedUserAssumptionsForSharing, isUsingCustomValues, setAllUserAssumptions } = useAssumptions();
  const { showNotification } = useNotificationActions();

  const assumptionsForSharing = useMemo(
    () => getNormalizedUserAssumptionsForSharing(),
    [getNormalizedUserAssumptionsForSharing]
  );
  const curatedAssumptions = useMemo(() => getCuratedAssumptionsEntries(), []);
  const libraryEntries = useMemo(
    () => [...curatedAssumptions, ...savedAssumptions],
    [curatedAssumptions, savedAssumptions]
  );
  const currentAssumptionsFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(assumptionsForSharing),
    [assumptionsForSharing]
  );
  const activeLibraryEntry = useMemo(
    () => libraryEntries.find((entry) => entry.id === activeSavedAssumptionsIdState) || null,
    [activeSavedAssumptionsIdState, libraryEntries]
  );
  const activeLibraryEntryFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(activeLibraryEntry?.assumptions),
    [activeLibraryEntry?.assumptions]
  );
  const hasUnsavedChanges = activeLibraryEntry
    ? activeLibraryEntryFingerprint !== currentAssumptionsFingerprint
    : isUsingCustomValues;
  const isCurrentStateRepresentedBySavedAssumptions = useMemo(
    () =>
      isCurrentAssumptionsStateRepresentedByLibrary({
        isUsingCustomValues,
        currentFingerprint: currentAssumptionsFingerprint,
        libraryEntries,
      }),
    [currentAssumptionsFingerprint, isUsingCustomValues, libraryEntries]
  );
  // Keep `Share` available for unsaved custom assumptions and for local saved entries that
  // do not already have a share link, even when the current values happen to equal defaults.
  const shouldShowCurrentShareAction = isUsingCustomValues || hasUnsavedChanges;

  const refreshSavedAssumptions = useCallback(() => {
    const entries = getSavedAssumptions();
    const activeId = getActiveSavedAssumptionsId();
    const activeExists =
      activeId && (entries.some((entry) => entry.id === activeId) || isCuratedAssumptionsEntryId(activeId));

    setSavedAssumptions(entries);
    setActiveSavedAssumptionsIdState(activeExists ? activeId : null);
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

  const applyDefaultAssumptions = useCallback(() => {
    setAllUserAssumptions(null);
    setActiveSavedAssumptionsId(null);
    setActiveSavedAssumptionsIdState(null);
  }, [setAllUserAssumptions]);

  const applySavedAssumptionsEntry = useCallback(
    (entry) => {
      if (!entry?.assumptions) {
        return;
      }

      setAllUserAssumptions(entry.assumptions);

      if (entry.source !== 'curated') {
        markSavedAssumptionsLoaded(entry.id);
      }

      setActiveSavedAssumptionsId(entry.id);
      setActiveSavedAssumptionsIdState(entry.id);
    },
    [setAllUserAssumptions]
  );

  const handleLoad = useCallback(
    (entry) => {
      const loadRequest = getAssumptionsLoadRequest({
        entry,
        activeId: activeSavedAssumptionsIdState,
        currentFingerprint: currentAssumptionsFingerprint,
        isUsingCustomValues,
        isCurrentStateRepresentedBySavedAssumptions,
        defaultEntryId: DEFAULT_ASSUMPTIONS_ENTRY_ID,
      });

      if (loadRequest.type === 'already-default') {
        showNotification('info', 'Default assumptions are already loaded.');
        return;
      }

      if (loadRequest.type === 'confirm') {
        setPendingLoadEntry(entry);
        return;
      }

      if (loadRequest.type === 'apply-default') {
        applyDefaultAssumptions();
        return;
      }

      if (loadRequest.type === 'activate-matching-entry') {
        if (entry.source !== 'curated') {
          markSavedAssumptionsLoaded(entry.id);
        }
        setActiveSavedAssumptionsId(entry.id);
        setActiveSavedAssumptionsIdState(entry.id);
        return;
      }

      if (loadRequest.type === 'apply-entry') {
        applySavedAssumptionsEntry(entry);
      }
    },
    [
      activeSavedAssumptionsIdState,
      applyDefaultAssumptions,
      applySavedAssumptionsEntry,
      currentAssumptionsFingerprint,
      isCurrentStateRepresentedBySavedAssumptions,
      isUsingCustomValues,
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

  const handleDescriptionModalOpen = useCallback((entry) => {
    if (!entry?.id || (!entry.description && !entry.content)) {
      return;
    }

    setPendingDescriptionEntry(entry);
  }, []);

  const handleDescriptionModalClose = useCallback(() => {
    setPendingDescriptionEntry(null);
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
    shareModalInitialSlug,
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

  const inlineLabel = (
    <>
      <span>Active assumptions:</span>
      <InfoTooltipIcon
        className="assumptions-selector-bar__label-tooltip"
        iconClassName="h-4 w-4 text-muted"
        content={
          <>
            <p>Change the active assumptions to see how it affects the rankings.</p>
            <p className="mt-2">
              If you want to view the details of the existing assumptions or specify/save/share your own assumptions, go
              to the Assumptions page.
            </p>
          </>
        }
      />
    </>
  );

  return (
    <>
      <AssumptionsDropdown
        className={className}
        inlineLabel={inlineLabel}
        entries={libraryEntries}
        activeId={activeSavedAssumptionsIdState}
        hasUnsavedChanges={hasUnsavedChanges}
        menuAriaLabel="Assumptions options"
        allowEntryManagementActions={false}
        allowCopyLinkAction={true}
        showCurrentSaveAction={false}
        showCurrentShareAction={shouldShowCurrentShareAction}
        showShareForLocal={true}
        onLoad={handleLoad}
        onShareCurrent={handleOpenShareModal}
        onCopyLink={handleCopySavedLink}
        onDescription={handleDescriptionModalOpen}
      />

      <AssumptionsDescriptionModal
        isOpen={Boolean(pendingDescriptionEntry)}
        entryLabel={pendingDescriptionEntry?.label || ''}
        initialDescription={pendingDescriptionEntry?.content || pendingDescriptionEntry?.description || ''}
        isReadOnly={true}
        onClose={handleDescriptionModalClose}
      />
      <ShareAssumptionsModal
        isOpen={shareModalOpen}
        onClose={handleCloseShareModal}
        assumptions={assumptionsForSharing}
        assumptionName={activeLibraryEntry?.label || null}
        initialDescription={shareModalInitialDescription}
        initialSlug={shareModalInitialSlug}
        initialSavedResult={shareModalInitialResult}
        onSaved={handleShareSaved}
      />
      <SharedImportDecisionModal
        isOpen={Boolean(pendingLoadEntry)}
        title={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.title}
        description={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.description}
        continueLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.continueLabel}
        cancelLabel={OVERWRITE_UNSAVED_ASSUMPTIONS_MODAL.cancelLabel}
        onContinue={handleContinuePendingLoad}
        onCancel={handleCancelPendingLoad}
      />
    </>
  );
};

AssumptionsSelector.propTypes = {
  className: PropTypes.string,
};

export default AssumptionsSelector;
