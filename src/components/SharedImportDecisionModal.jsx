import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const SharedImportDecisionModal = ({ isOpen, onSaveMineFirst, onReplaceMine, onKeepMine, isBusy }) => {
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
              <h2 className="text-xl font-bold text-slate-900">Import Shared Assumptions?</h2>
              <p className="mt-2 text-sm text-slate-600">
                You already have custom assumptions in this browser. Choose how to handle the shared assumptions link.
              </p>
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={onSaveMineFirst}
                  disabled={isBusy}
                  className={`w-full rounded-md px-3 py-2 text-sm font-medium text-white ${
                    isBusy ? 'cursor-not-allowed bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Save Mine First
                </button>
                <button
                  type="button"
                  onClick={onReplaceMine}
                  disabled={isBusy}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Replace Mine
                </button>
                <button
                  type="button"
                  onClick={onKeepMine}
                  disabled={isBusy}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Keep Mine
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SharedImportDecisionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSaveMineFirst: PropTypes.func.isRequired,
  onReplaceMine: PropTypes.func.isRequired,
  onKeepMine: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
};

SharedImportDecisionModal.defaultProps = {
  isBusy: false,
};

export default SharedImportDecisionModal;
