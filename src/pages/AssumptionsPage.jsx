import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import AssumptionsEditor from '../components/AssumptionsEditor';
import ShareAssumptionsModal from '../components/ShareAssumptionsModal';
import SharedImportDecisionModal from '../components/SharedImportDecisionModal';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { fetchSharedAssumptions } from '../utils/shareAssumptions';

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const AssumptionsPage = () => {
  const { isUsingCustomValues, setAllUserAssumptions, getNormalizedUserAssumptionsForSharing } = useAssumptions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalMode, setShareModalMode] = useState('manual');
  const [pendingSharedSnapshot, setPendingSharedSnapshot] = useState(null);
  const [isLoadingSharedSnapshot, setIsLoadingSharedSnapshot] = useState(false);
  const requestedSharedReferenceRef = useRef(null);

  // Parse URL params
  const initialTab = searchParams.get('tab') || 'global';
  const initialCategoryId = searchParams.get('categoryId') || null;
  const initialRecipientId = searchParams.get('recipientId') || null;
  const initialActiveCategory = searchParams.get('activeCategory') || null;
  const sharedReference = searchParams.get('shared');
  const assumptionsForSharing = getNormalizedUserAssumptionsForSharing();

  const setPageStatus = useCallback((type, text) => {
    setStatusMessage({ type, text });
  }, []);

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timeoutId = setTimeout(() => {
      setStatusMessage(null);
    }, 4500);

    return () => clearTimeout(timeoutId);
  }, [statusMessage]);

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

  useEffect(() => {
    if (!sharedReference) {
      requestedSharedReferenceRef.current = null;
    }
  }, [sharedReference]);

  // Handle URL param changes from the editor
  // Uses replace for tab changes, push for entity edit/exit
  const handleParamsChange = useCallback(
    (newParams, usePush = false) => {
      // Build new search params as object
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
      if (searchParams.get('shared')) {
        paramsObj.shared = searchParams.get('shared');
      }

      // Only update if params actually changed (avoid update loops)
      // Compare by checking each expected param
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

  const applySharedSnapshot = useCallback(
    (snapshot, reference) => {
      if (!isPlainObject(snapshot) || !isPlainObject(snapshot.assumptions)) {
        setPageStatus('error', 'Shared assumptions payload is invalid.');
        setPendingSharedSnapshot(null);
        removeSharedParam(reference);
        return false;
      }

      setAllUserAssumptions(snapshot.assumptions);
      setPageStatus('success', 'Shared assumptions loaded.');
      setPendingSharedSnapshot(null);
      removeSharedParam(reference);
      return true;
    },
    [removeSharedParam, setAllUserAssumptions, setPageStatus]
  );

  useEffect(() => {
    if (
      !sharedReference ||
      pendingSharedSnapshot?.reference === sharedReference ||
      requestedSharedReferenceRef.current === sharedReference
    ) {
      return;
    }

    let isCancelled = false;
    requestedSharedReferenceRef.current = sharedReference;
    setIsLoadingSharedSnapshot(true);

    Promise.resolve()
      .then(() => fetchSharedAssumptions(sharedReference))
      .then((snapshot) => {
        if (isCancelled) {
          return;
        }

        if (isUsingCustomValues) {
          setPendingSharedSnapshot({ reference: sharedReference, snapshot });
        } else {
          applySharedSnapshot(snapshot, sharedReference);
        }
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        setPageStatus('error', error.message || 'Could not load shared assumptions.');
        setPendingSharedSnapshot(null);
        removeSharedParam(sharedReference);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingSharedSnapshot(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [
    applySharedSnapshot,
    isUsingCustomValues,
    pendingSharedSnapshot?.reference,
    removeSharedParam,
    setPageStatus,
    sharedReference,
  ]);

  const handleReplaceMine = useCallback(() => {
    if (!pendingSharedSnapshot) {
      return;
    }
    applySharedSnapshot(pendingSharedSnapshot.snapshot, pendingSharedSnapshot.reference);
  }, [applySharedSnapshot, pendingSharedSnapshot]);

  const handleKeepMine = useCallback(() => {
    if (!pendingSharedSnapshot) {
      return;
    }
    setPendingSharedSnapshot(null);
    setPageStatus('info', 'Kept your local assumptions.');
    removeSharedParam(pendingSharedSnapshot.reference);
  }, [pendingSharedSnapshot, removeSharedParam, setPageStatus]);

  const handleSaveMineFirst = useCallback(() => {
    setShareModalMode('saveMineFirst');
    setShareModalOpen(true);
  }, []);

  const handleShareButtonClick = useCallback(() => {
    setShareModalMode('manual');
    setShareModalOpen(true);
  }, []);

  const handleShareModalClose = useCallback(() => {
    setShareModalOpen(false);
  }, []);

  const handleShareSaved = useCallback(() => {
    if (shareModalMode === 'saveMineFirst' && pendingSharedSnapshot) {
      applySharedSnapshot(pendingSharedSnapshot.snapshot, pendingSharedSnapshot.reference);
      setShareModalOpen(false);
      return;
    }

    setPageStatus('success', 'Share link created.');
  }, [applySharedSnapshot, pendingSharedSnapshot, setPageStatus, shareModalMode]);

  const showImportDecisionModal = Boolean(pendingSharedSnapshot) && !shareModalOpen;

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton to="/" label="Back to top donors" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold text-slate-900 text-center sm:text-left">Assumptions</h1>
          {isUsingCustomValues && (
            <button
              type="button"
              onClick={handleShareButtonClick}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save & Share
            </button>
          )}
        </div>

        {statusMessage && (
          <div
            className={`mb-4 rounded-md px-4 py-3 text-sm ${
              statusMessage.type === 'error'
                ? 'bg-red-50 text-red-700'
                : statusMessage.type === 'info'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-emerald-50 text-emerald-700'
            }`}
            role="status"
          >
            {statusMessage.text}
          </div>
        )}

        {isLoadingSharedSnapshot && (
          <div className="mb-4 rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Loading shared assumptions...
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AssumptionsEditor
            initialTab={initialTab}
            initialCategoryId={initialCategoryId}
            initialRecipientId={initialRecipientId}
            initialActiveCategory={initialActiveCategory}
            onParamsChange={handleParamsChange}
          />
        </div>

        <SharedImportDecisionModal
          isOpen={showImportDecisionModal}
          onSaveMineFirst={handleSaveMineFirst}
          onReplaceMine={handleReplaceMine}
          onKeepMine={handleKeepMine}
          isBusy={isLoadingSharedSnapshot}
        />

        <ShareAssumptionsModal
          isOpen={shareModalOpen}
          onClose={handleShareModalClose}
          assumptions={assumptionsForSharing}
          onSaved={handleShareSaved}
          autoCloseOnSave={shareModalMode === 'saveMineFirst'}
          title={shareModalMode === 'saveMineFirst' ? 'Save Yours First' : 'Share Assumptions'}
        />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
