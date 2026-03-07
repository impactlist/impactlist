import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ASSUMPTION_DESCRIPTION_REMAINING_COUNT_THRESHOLD,
  MAX_ASSUMPTION_DESCRIPTION_LENGTH,
} from '../constants/assumptionsDescription';

const AssumptionsDescriptionModal = ({
  isOpen,
  entryLabel,
  initialDescription = '',
  isReadOnly = false,
  onClose,
  onSave = () => {},
}) => {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription, isOpen]);

  const handleSave = () => {
    onSave(description);
  };

  const isDirty = !isReadOnly && description !== initialDescription;

  const handleRequestClose = () => {
    if (isDirty && typeof globalThis.confirm === 'function') {
      const shouldDiscard = globalThis.confirm('Discard unsaved description changes?');
      if (!shouldDiscard) {
        return;
      }
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="impact-modal__scrim"
              onClick={handleRequestClose}
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
              <div className="mb-4 flex items-center justify-between">
                <h2 className="impact-modal__title">{entryLabel || 'Unnamed assumption'}</h2>
                <button
                  type="button"
                  onClick={handleRequestClose}
                  aria-label="Close modal"
                  className="impact-modal__close text-sm font-medium"
                >
                  X
                </button>
              </div>

              <label htmlFor="assumptions-description-modal" className="impact-modal__label mb-1 block">
                Description:
              </label>
              <textarea
                id="assumptions-description-modal"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="impact-modal__input impact-modal__textarea"
                rows={6}
                readOnly={isReadOnly}
                maxLength={MAX_ASSUMPTION_DESCRIPTION_LENGTH}
                placeholder={isReadOnly ? 'No description available.' : 'Add notes about this assumptions set.'}
              />
              {!isReadOnly && description.length > ASSUMPTION_DESCRIPTION_REMAINING_COUNT_THRESHOLD && (
                <p className="impact-modal__char-count">
                  {MAX_ASSUMPTION_DESCRIPTION_LENGTH - description.length} characters remaining
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
                  {isReadOnly ? 'Close' : 'Cancel'}
                </button>
                {!isReadOnly && (
                  <button type="button" onClick={handleSave} className="impact-btn impact-btn--custom-accent">
                    Save Description
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AssumptionsDescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  entryLabel: PropTypes.string,
  initialDescription: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default AssumptionsDescriptionModal;
