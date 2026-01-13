import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/shared/BackButton';
import AssumptionsEditor from '../components/AssumptionsEditor';
import { useAssumptions } from '../contexts/AssumptionsContext';

const AssumptionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setRecipientSearchTerm } = useAssumptions();

  // Parse URL params
  const initialTab = searchParams.get('tab') || 'global';
  const initialCategoryId = searchParams.get('categoryId') || null;
  const initialRecipientId = searchParams.get('recipientId') || null;
  const initialActiveCategory = searchParams.get('activeCategory') || null;

  // Cleanup on unmount - clear recipient search term from context
  useEffect(() => {
    return () => {
      setRecipientSearchTerm('');
    };
  }, [setRecipientSearchTerm]);

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

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton to="/" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Assumptions</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AssumptionsEditor
            initialTab={initialTab}
            initialCategoryId={initialCategoryId}
            initialRecipientId={initialRecipientId}
            initialActiveCategory={initialActiveCategory}
            onParamsChange={handleParamsChange}
            isActive={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssumptionsPage;
