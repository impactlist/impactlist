import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const SavedAssumptionsMigrationModal = ({ isOpen, onSaveCurrent, onSkip }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={onSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <h2 className="text-xl font-bold text-slate-900">Save Current Assumptions?</h2>
              <p className="mt-2 text-sm text-slate-600">
                You already have custom assumptions in this browser. Save them to your Assumptions Library now?
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onSkip}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={onSaveCurrent}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Current Assumptions
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SavedAssumptionsMigrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSaveCurrent: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default SavedAssumptionsMigrationModal;
