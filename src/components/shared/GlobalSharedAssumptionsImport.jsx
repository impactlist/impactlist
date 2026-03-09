import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SharedImportDecisionModal from '../SharedImportDecisionModal';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { useNotificationActions } from '../../contexts/NotificationContext';
import { normalizeUserAssumptions } from '../../utils/assumptionsAPIHelpers';
import { fetchSharedAssumptions } from '../../utils/shareAssumptions';
import {
  CURATED_ASSUMPTIONS_QUERY_PARAM,
  getCuratedAssumptionsEntries,
  getCuratedAssumptionsEntryByProfileId,
} from '../../utils/curatedAssumptionsProfiles';
import { isCurrentAssumptionsStateRepresentedByLibrary } from '../../utils/assumptionsLoadHelpers';
import { buildEvictionNotificationMessage } from '../../utils/savedAssumptionsMessages';
import {
  createAssumptionsFingerprint,
  createComparableAssumptionsFingerprint,
  getActiveSavedAssumptionsId,
  getSavedAssumptions,
  setActiveSavedAssumptionsId,
  upsertImportedSavedAssumptions,
} from '../../utils/savedAssumptionsStore';
import { isPlainObject } from '../../utils/typeGuards';

const GlobalSharedAssumptionsImport = () => {
  const { defaultAssumptions, isUsingCustomValues, setAllUserAssumptions, getNormalizedUserAssumptionsForSharing } =
    useAssumptions();
  const { showNotification } = useNotificationActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingImport, setPendingImport] = useState(null);
  const [isLoadingSharedSnapshot, setIsLoadingSharedSnapshot] = useState(false);
  const activeRequestIdRef = useRef(0);
  const handledCuratedReferenceRef = useRef(null);
  const curatedEntries = useMemo(() => getCuratedAssumptionsEntries(), []);
  const currentAssumptions = getNormalizedUserAssumptionsForSharing();
  const libraryEntries = [...curatedEntries, ...getSavedAssumptions()];
  const currentComparableFingerprint = useMemo(
    () => createComparableAssumptionsFingerprint(currentAssumptions),
    [currentAssumptions]
  );
  const hasUnsavedAssumptions = !isCurrentAssumptionsStateRepresentedByLibrary({
    isUsingCustomValues,
    currentFingerprint: currentComparableFingerprint,
    libraryEntries,
  });

  const sharedReference = searchParams.get('shared');
  const curatedReference = sharedReference ? null : searchParams.get(CURATED_ASSUMPTIONS_QUERY_PARAM);

  const removeImportParam = useCallback(
    (paramName, referenceToRemove = null) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new globalThis.URLSearchParams(currentParams);
          const currentReference = nextParams.get(paramName);

          if (!currentReference) {
            return currentParams;
          }

          if (referenceToRemove && currentReference !== referenceToRemove) {
            return currentParams;
          }

          nextParams.delete(paramName);
          return nextParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const applySharedSnapshot = useCallback(
    (snapshot, reference) => {
      if (!isPlainObject(snapshot) || !isPlainObject(snapshot.assumptions)) {
        showNotification('error', 'Shared assumptions payload is invalid.');
        setPendingImport(null);
        removeImportParam('shared', reference);
        return false;
      }

      const normalizedIncoming = normalizeUserAssumptions(snapshot.assumptions, defaultAssumptions);
      if (!normalizedIncoming) {
        showNotification('error', 'Shared assumptions link did not contain usable custom assumptions.');
        setPendingImport(null);
        removeImportParam('shared', reference);
        return false;
      }

      const incomingFingerprint = createAssumptionsFingerprint(normalizedIncoming);
      const currentFingerprint = createAssumptionsFingerprint(getNormalizedUserAssumptionsForSharing());
      const isAlreadyApplied = Boolean(incomingFingerprint) && incomingFingerprint === currentFingerprint;
      const previousActiveId = getActiveSavedAssumptionsId();

      if (!isAlreadyApplied) {
        setAllUserAssumptions(normalizedIncoming);
      }
      const upsertResult = upsertImportedSavedAssumptions({
        label: snapshot?.name || snapshot?.slug || reference,
        description: snapshot?.description || null,
        assumptions: normalizedIncoming,
        reference,
      });

      if (upsertResult.ok && upsertResult.entry?.id) {
        setActiveSavedAssumptionsId(upsertResult.entry.id);
      }

      const isSameActiveEntry = previousActiveId && previousActiveId === upsertResult.entry?.id;
      const statusPrefix =
        isAlreadyApplied && isSameActiveEntry
          ? 'Shared assumptions are already applied.'
          : 'Shared assumptions loaded.';

      if (!upsertResult.ok) {
        const failureSuffix =
          upsertResult.errorCode === 'over_limit'
            ? 'Assumptions Library is full, so this import was not added.'
            : 'Could not save them to the Assumptions Library locally.';
        showNotification('info', `${statusPrefix} ${failureSuffix}`);
      } else {
        const evictionMessage = buildEvictionNotificationMessage({
          prefix: statusPrefix,
          result: upsertResult,
        });
        showNotification(evictionMessage ? 'info' : 'success', evictionMessage || statusPrefix);
      }
      setPendingImport(null);
      removeImportParam('shared', reference);
      return true;
    },
    [
      defaultAssumptions,
      getNormalizedUserAssumptionsForSharing,
      removeImportParam,
      setAllUserAssumptions,
      showNotification,
    ]
  );

  const applyCuratedEntry = useCallback(
    (entry, profileId) => {
      if (!entry?.assumptions) {
        showNotification('error', 'Curated assumptions entry is invalid.');
        setPendingImport(null);
        removeImportParam(CURATED_ASSUMPTIONS_QUERY_PARAM, profileId);
        return false;
      }

      const incomingFingerprint = createAssumptionsFingerprint(entry.assumptions);
      const currentFingerprint = createAssumptionsFingerprint(getNormalizedUserAssumptionsForSharing());
      const isAlreadyApplied = Boolean(incomingFingerprint) && incomingFingerprint === currentFingerprint;
      const previousActiveId = getActiveSavedAssumptionsId();

      if (!isAlreadyApplied) {
        setAllUserAssumptions(entry.assumptions);
      }

      setActiveSavedAssumptionsId(entry.id);
      showNotification(
        'success',
        isAlreadyApplied && previousActiveId === entry.id
          ? 'Curated assumptions are already applied.'
          : 'Curated assumptions loaded.'
      );
      setPendingImport(null);
      removeImportParam(CURATED_ASSUMPTIONS_QUERY_PARAM, profileId);
      return true;
    },
    [getNormalizedUserAssumptionsForSharing, removeImportParam, setAllUserAssumptions, showNotification]
  );

  useEffect(() => {
    if (!curatedReference) {
      handledCuratedReferenceRef.current = null;
    }
  }, [curatedReference]);

  useEffect(() => {
    if (!sharedReference || pendingImport?.kind === 'shared' || pendingImport?.reference === sharedReference) {
      return;
    }

    const requestReference = sharedReference;
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    // Keep both guards:
    // - AbortController cancels in-flight fetches on cleanup.
    // - requestId prevents late microtask resolutions from stale requests from applying.
    const abortController = new globalThis.AbortController();
    setIsLoadingSharedSnapshot(true);

    fetchSharedAssumptions(requestReference, { signal: abortController.signal })
      .then((snapshot) => {
        if (activeRequestIdRef.current !== requestId) {
          return;
        }

        if (hasUnsavedAssumptions) {
          setPendingImport({ kind: 'shared', reference: requestReference, snapshot });
        } else {
          applySharedSnapshot(snapshot, requestReference);
        }
      })
      .catch((error) => {
        if (activeRequestIdRef.current !== requestId) {
          return;
        }
        if (error?.name === 'AbortError') {
          return;
        }
        showNotification('error', error.message || 'Could not load shared assumptions.');
        setPendingImport(null);
        removeImportParam('shared', requestReference);
      })
      .finally(() => {
        if (activeRequestIdRef.current === requestId) {
          setIsLoadingSharedSnapshot(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [
    applySharedSnapshot,
    hasUnsavedAssumptions,
    pendingImport?.kind,
    pendingImport?.reference,
    removeImportParam,
    showNotification,
    sharedReference,
  ]);

  useEffect(() => {
    if (!curatedReference || pendingImport?.kind === 'curated' || pendingImport?.reference === curatedReference) {
      return;
    }

    if (handledCuratedReferenceRef.current === curatedReference) {
      return;
    }

    const curatedEntry = getCuratedAssumptionsEntryByProfileId(curatedReference);
    if (!curatedEntry) {
      showNotification('error', 'Could not load curated assumptions.');
      removeImportParam(CURATED_ASSUMPTIONS_QUERY_PARAM, curatedReference);
      return;
    }

    if (hasUnsavedAssumptions) {
      setPendingImport({ kind: 'curated', reference: curatedReference, entry: curatedEntry });
      return;
    }

    handledCuratedReferenceRef.current = curatedReference;
    applyCuratedEntry(curatedEntry, curatedReference);
  }, [
    applyCuratedEntry,
    curatedReference,
    hasUnsavedAssumptions,
    pendingImport?.kind,
    pendingImport?.reference,
    removeImportParam,
    showNotification,
  ]);

  const handleContinue = useCallback(() => {
    if (!pendingImport) {
      return;
    }

    if (pendingImport.kind === 'curated') {
      applyCuratedEntry(pendingImport.entry, pendingImport.reference);
      return;
    }

    applySharedSnapshot(pendingImport.snapshot, pendingImport.reference);
  }, [applyCuratedEntry, applySharedSnapshot, pendingImport]);

  const handleCancel = useCallback(() => {
    if (!pendingImport) {
      return;
    }
    const paramName = pendingImport.kind === 'curated' ? CURATED_ASSUMPTIONS_QUERY_PARAM : 'shared';
    setPendingImport(null);
    removeImportParam(paramName, pendingImport.reference);
  }, [pendingImport, removeImportParam]);

  const showImportDecisionModal = Boolean(pendingImport);

  return (
    <>
      {isLoadingSharedSnapshot && (
        <div className="impact-notice-card" data-tone="info" role="status">
          <div className="impact-notice-card__row">
            <span className="impact-notice-card__text">Loading shared assumptions...</span>
          </div>
        </div>
      )}

      <SharedImportDecisionModal
        isOpen={showImportDecisionModal}
        onContinue={handleContinue}
        onCancel={handleCancel}
        isBusy={isLoadingSharedSnapshot}
      />
    </>
  );
};

export default GlobalSharedAssumptionsImport;
