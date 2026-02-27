import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SharedImportDecisionModal from '../SharedImportDecisionModal';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { useNotificationActions } from '../../contexts/NotificationContext';
import { normalizeUserAssumptions } from '../../utils/assumptionsAPIHelpers';
import { fetchSharedAssumptions } from '../../utils/shareAssumptions';
import { buildEvictionNotificationMessage } from '../../utils/savedAssumptionsMessages';
import {
  createAssumptionsFingerprint,
  setActiveSavedAssumptionsId,
  upsertImportedSavedAssumptions,
} from '../../utils/savedAssumptionsStore';
import { isPlainObject } from '../../utils/typeGuards';

const GlobalSharedAssumptionsImport = () => {
  const { defaultAssumptions, isUsingCustomValues, setAllUserAssumptions, getNormalizedUserAssumptionsForSharing } =
    useAssumptions();
  const { showNotification } = useNotificationActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingSharedSnapshot, setPendingSharedSnapshot] = useState(null);
  const [isLoadingSharedSnapshot, setIsLoadingSharedSnapshot] = useState(false);
  const activeRequestIdRef = useRef(0);

  const sharedReference = searchParams.get('shared');

  const removeSharedParam = useCallback(
    (referenceToRemove = null) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new globalThis.URLSearchParams(currentParams);
          const currentShared = nextParams.get('shared');

          if (!currentShared) {
            return currentParams;
          }

          if (referenceToRemove && currentShared !== referenceToRemove) {
            return currentParams;
          }

          nextParams.delete('shared');
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
        setPendingSharedSnapshot(null);
        removeSharedParam(reference);
        return false;
      }

      const normalizedIncoming = normalizeUserAssumptions(snapshot.assumptions, defaultAssumptions);
      if (!normalizedIncoming) {
        showNotification('error', 'Shared assumptions link did not contain usable custom assumptions.');
        setPendingSharedSnapshot(null);
        removeSharedParam(reference);
        return false;
      }

      const incomingFingerprint = createAssumptionsFingerprint(normalizedIncoming);
      const currentFingerprint = createAssumptionsFingerprint(getNormalizedUserAssumptionsForSharing());
      const isAlreadyApplied = Boolean(incomingFingerprint) && incomingFingerprint === currentFingerprint;

      if (!isAlreadyApplied) {
        setAllUserAssumptions(normalizedIncoming);
      }
      const upsertResult = upsertImportedSavedAssumptions({
        label: snapshot?.name || snapshot?.slug || reference,
        assumptions: normalizedIncoming,
        reference,
      });

      if (upsertResult.ok && upsertResult.entry?.id) {
        setActiveSavedAssumptionsId(upsertResult.entry.id);
      }

      const statusPrefix = isAlreadyApplied ? 'Shared assumptions are already applied.' : 'Shared assumptions loaded.';

      if (!upsertResult.ok) {
        const failureSuffix =
          upsertResult.errorCode === 'over_limit'
            ? 'Saved Assumptions is full, so this import was not added.'
            : 'Could not save them to Saved Assumptions locally.';
        showNotification('info', `${statusPrefix} ${failureSuffix}`);
      } else {
        const evictionMessage = buildEvictionNotificationMessage({
          prefix: statusPrefix,
          result: upsertResult,
        });
        showNotification(evictionMessage ? 'info' : 'success', evictionMessage || statusPrefix);
      }
      setPendingSharedSnapshot(null);
      removeSharedParam(reference);
      return true;
    },
    [
      defaultAssumptions,
      getNormalizedUserAssumptionsForSharing,
      removeSharedParam,
      setAllUserAssumptions,
      showNotification,
    ]
  );

  useEffect(() => {
    if (!sharedReference || pendingSharedSnapshot?.reference === sharedReference) {
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

        if (isUsingCustomValues) {
          setPendingSharedSnapshot({ reference: requestReference, snapshot });
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
        setPendingSharedSnapshot(null);
        removeSharedParam(requestReference);
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
    isUsingCustomValues,
    pendingSharedSnapshot?.reference,
    removeSharedParam,
    showNotification,
    sharedReference,
  ]);

  const handleContinue = useCallback(() => {
    if (!pendingSharedSnapshot) {
      return;
    }
    applySharedSnapshot(pendingSharedSnapshot.snapshot, pendingSharedSnapshot.reference);
  }, [applySharedSnapshot, pendingSharedSnapshot]);

  const handleCancel = useCallback(() => {
    if (!pendingSharedSnapshot) {
      return;
    }
    setPendingSharedSnapshot(null);
    showNotification('info', 'Kept your local assumptions.');
    removeSharedParam(pendingSharedSnapshot.reference);
  }, [pendingSharedSnapshot, removeSharedParam, showNotification]);

  const showImportDecisionModal = Boolean(pendingSharedSnapshot);

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
