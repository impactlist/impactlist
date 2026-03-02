import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const SavedAssumptionsMigrationModal = ({ isOpen, onSaveCurrent, onSkip }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="impact-modal__scrim"
              onClick={onSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="impact-modal__panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <h2 className="impact-modal__title">Save Current Assumptions?</h2>
              <p className="impact-modal__copy mt-2">
                You already have custom assumptions in this browser. Save them to your Assumptions Library now?
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onSkip} className="impact-btn impact-btn--secondary">
                  Not now
                </button>
                <button type="button" onClick={onSaveCurrent} className="impact-btn impact-btn--custom-accent">
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
