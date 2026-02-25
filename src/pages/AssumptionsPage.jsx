import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import AssumptionsEditor from '../components/AssumptionsEditor';
import ShareAssumptionsModal from '../components/ShareAssumptionsModal';
import { useAssumptions } from '../contexts/AssumptionsContext';
import { useNotifications } from '../contexts/NotificationContext';

const AssumptionsPage = () => {
  const { isUsingCustomValues, getNormalizedUserAssumptionsForSharing } = useAssumptions();
  const { showNotification } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const assumptionsEditorRef = useRef(null);

  const initialTab = searchParams.get('tab') || 'global';
  const initialCategoryId = searchParams.get('categoryId') || null;
  const initialRecipientId = searchParams.get('recipientId') || null;
  const initialActiveCategory = searchParams.get('activeCategory') || null;
  const assumptionsForSharing = getNormalizedUserAssumptionsForSharing();

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

  const handleShareButtonClick = useCallback(() => {
    const prepareResult = assumptionsEditorRef.current?.prepareForShare?.();
    if (prepareResult && prepareResult.ok === false) {
      showNotification('error', prepareResult.message || 'Resolve unsaved edits before sharing.');
      return;
    }

    setShareModalOpen(true);
  }, [showNotification]);

  const handleShareModalClose = useCallback(() => {
    setShareModalOpen(false);
  }, []);

  const handleShareSaved = useCallback(() => {
    showNotification('success', 'Share link created.');
  }, [showNotification]);

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
              Share Assumptions
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
        />
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
