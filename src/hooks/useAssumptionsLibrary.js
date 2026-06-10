import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { useNotificationActions } from '../contexts/NotificationContext';
import { DEFAULT_ASSUMPTIONS_ENTRY_ID } from '../constants/assumptionsLibraryEntries';
import { getCuratedAssumptionsEntries, isCuratedAssumptionsEntryId } from '../utils/curatedAssumptionsProfiles';
import {
  createComparableAssumptionsFingerprint,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  markSavedAssumptionsLoaded,
  SAVED_ASSUMPTIONS_CHANGED_EVENT,
  setActiveSavedAssumptionsId,
} from '../utils/savedAssumptionsStore';
import {
  getAssumptionsLoadRequest,
  isCurrentAssumptionsStateRepresentedByLibrary,
} from '../utils/assumptionsLoadHelpers';
import { getActiveAssumptionsLabel } from '../utils/assumptionsSelectorDisplayPreference';

export const STORAGE_ERROR_MESSAGE = 'Could not save assumptions locally. Delete some saved assumptions and try again.';

/**
 * The saved-assumptions library state machine, shared by AssumptionsPage and
 * AssumptionsSelector (previously two hand-copied near-twins with drift):
 * entries (curated + saved), the active entry, fingerprint-based
 * unsaved-changes detection, the change-event subscription, and the
 * load/confirm/replace flow (`pendingLoadEntry` + the continue/cancel pair —
 * the caller renders the confirmation modal).
 *
 * `notifyOnEntrySwitch` adds the Assumptions page's informational
 * notifications when activating an entry whose values already match the
 * current state; the compact selector stays quiet.
 */
const useAssumptionsLibrary = ({ notifyOnEntrySwitch = false } = {}) => {
  const { getNormalizedUserAssumptionsForSharing, isUsingCustomValues, setAllUserAssumptions } = useAssumptions();
  const { showNotification } = useNotificationActions();

  const [savedAssumptions, setSavedAssumptions] = useState([]);
  const [activeSavedAssumptionsId, setActiveSavedAssumptionsIdState] = useState(null);
  const [pendingLoadEntry, setPendingLoadEntry] = useState(null);

  const assumptionsForSharing = useMemo(
    () => getNormalizedUserAssumptionsForSharing(),
    [getNormalizedUserAssumptionsForSharing]
  );
  const curatedAssumptions = useMemo(() => getCuratedAssumptionsEntries(), []);
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
  const isCurrentStateRepresentedBySavedAssumptions = useMemo(
    () =>
      isCurrentAssumptionsStateRepresentedByLibrary({
        isUsingCustomValues,
        currentFingerprint,
        libraryEntries,
      }),
    [currentFingerprint, isUsingCustomValues, libraryEntries]
  );
  const activeAssumptionsLabel = useMemo(
    () =>
      getActiveAssumptionsLabel({
        activeLibraryEntry,
        activeSavedAssumptionsId,
        hasUnsavedChanges,
      }),
    [activeLibraryEntry, activeSavedAssumptionsId, hasUnsavedChanges]
  );

  const refreshSavedAssumptions = useCallback(() => {
    const entries = getSavedAssumptions();
    const activeId = getActiveSavedAssumptionsId();
    const activeExists =
      activeId && (entries.some((entry) => entry.id === activeId) || isCuratedAssumptionsEntryId(activeId));

    // A persisted active id whose entry no longer exists is stale — clear it
    // from storage too, not just locally.
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

      try {
        setAllUserAssumptions(entry.assumptions);
      } catch (error) {
        // Saved entries can outlive a data update; loading one must not
        // crash the app.
        console.error('Failed to load saved assumptions entry', error);
        showNotification('error', `Could not load "${entry.label || 'saved assumptions'}": ${error.message}`);
        return;
      }

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

  const handleLoadEntry = useCallback(
    (entry) => {
      const loadRequest = getAssumptionsLoadRequest({
        entry,
        activeId: activeSavedAssumptionsId,
        currentFingerprint,
        isUsingCustomValues,
        isCurrentStateRepresentedBySavedAssumptions,
        defaultEntryId: DEFAULT_ASSUMPTIONS_ENTRY_ID,
      });

      if (loadRequest.type === 'already-default') {
        showNotification('info', 'Default assumptions are already loaded.');
        return;
      }

      if (loadRequest.type === 'activate-matching-entry') {
        if (entry.source !== 'curated') {
          const loadedResult = markSavedAssumptionsLoaded(entry.id);
          if (!loadedResult.ok) {
            // Storage failures are errors regardless of notifyOnEntrySwitch —
            // that option suppresses only the informational toasts below.
            showNotification('error', STORAGE_ERROR_MESSAGE);
            return;
          }
        }
        persistAsActive(entry.id);
        if (notifyOnEntrySwitch) {
          const isSameActiveEntry = activeSavedAssumptionsId === entry.id;
          showNotification(
            'info',
            isSameActiveEntry ? 'These assumptions are already loaded.' : 'Switched active saved assumptions entry.'
          );
        }
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

      if (loadRequest.type === 'apply-entry') {
        applySavedAssumptionsEntry(entry);
      }
    },
    [
      activeSavedAssumptionsId,
      applyDefaultAssumptions,
      applySavedAssumptionsEntry,
      currentFingerprint,
      isCurrentStateRepresentedBySavedAssumptions,
      isUsingCustomValues,
      notifyOnEntrySwitch,
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

  return {
    assumptionsForSharing,
    libraryEntries,
    savedAssumptions,
    activeSavedAssumptionsId,
    activeLibraryEntry,
    activeLibraryEntryFingerprint,
    currentFingerprint,
    hasUnsavedChanges,
    isCurrentStateRepresentedBySavedAssumptions,
    activeAssumptionsLabel,
    pendingLoadEntry,
    handleLoadEntry,
    handleContinuePendingLoad,
    handleCancelPendingLoad,
    applyDefaultAssumptions,
    applySavedAssumptionsEntry,
    persistAsActive,
    refreshSavedAssumptions,
  };
};

export default useAssumptionsLibrary;
