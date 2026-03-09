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
import AssumptionsDescriptionModal from '../AssumptionsDescriptionModal';
import ShareAssumptionsModal from '../ShareAssumptionsModal';
import AssumptionsDropdown, { DEFAULT_ASSUMPTIONS_ENTRY_ID } from './AssumptionsDropdown';

const AssumptionsSelector = ({ className = '' }) => {
  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsIdState, setActiveSavedAssumptionsIdState] = useState(null);
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

  const handleLoad = useCallback(
    (entry) => {
      if (entry.id === DEFAULT_ASSUMPTIONS_ENTRY_ID) {
        setAllUserAssumptions(null);
        setActiveSavedAssumptionsId(null);
        setActiveSavedAssumptionsIdState(null);
        return;
      }

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

  return (
    <>
      <AssumptionsDropdown
        className={className}
        inlineLabel="Active assumptions:"
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
        initialSavedResult={shareModalInitialResult}
        onSaved={handleShareSaved}
      />
    </>
  );
};

AssumptionsSelector.propTypes = {
  className: PropTypes.string,
};

export default AssumptionsSelector;
