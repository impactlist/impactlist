import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ASSUMPTION_DESCRIPTION_REMAINING_COUNT_THRESHOLD,
  MAX_ASSUMPTION_DESCRIPTION_LENGTH,
} from '../constants/assumptionsDescription';

const getSubmitErrorMessage = (errorCode) => {
  if (errorCode === 'duplicate_label') {
    return 'You already have saved assumptions with that name. Choose a different name.';
  }

  if (errorCode === 'over_limit') {
    return 'Saved assumptions are full. Delete some saved assumptions and try again.';
  }

  if (errorCode === 'no_custom_assumptions') {
    return 'No custom assumptions to save.';
  }

  return 'Could not save assumptions locally. Delete some saved assumptions and try again.';
};

const SaveAssumptionsModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultLabel = '',
  defaultDescription = '',
  canUpdateExisting = false,
  duplicateOfLabel = null,
}) => {
  const [label, setLabel] = useState(defaultLabel);
  const [description, setDescription] = useState(defaultDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    setLabel(defaultLabel);
    setDescription(defaultDescription);
    setError('');
  }, [defaultDescription, defaultLabel, isOpen]);

  const validateLabel = (mode) => {
    const trimmed = label.trim();
    if (!trimmed) {
      if (mode === 'update') {
        const fallbackLabel = defaultLabel.trim();
        if (fallbackLabel) {
          return fallbackLabel;
        }
      }

      setError('Label is required.');
      return null;
    }

    return trimmed;
  };

  const handleSubmit = (mode) => {
    const normalizedLabel = validateLabel(mode);
    if (!normalizedLabel) {
      return;
    }

    const result = onSubmit({ label: normalizedLabel, description, mode });
    if (result?.ok === false) {
      setError(getSubmitErrorMessage(result.errorCode));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="impact-modal__scrim"
              onClick={onClose}
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
                <h2 className="impact-modal__title">Save to Library</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="impact-modal__close text-sm font-medium"
                >
                  X
                </button>
              </div>

              <p className="impact-modal__copy mb-4">Save the current assumptions to your local Assumptions Library.</p>

              {duplicateOfLabel && (
                <p className="impact-modal__warning mb-4">
                  You are about to save a duplicate copy of{' '}
                  <strong className="font-semibold">{duplicateOfLabel}</strong>.
                </p>
              )}

              <label htmlFor="save-assumptions-label" className="impact-modal__label mb-1 block">
                Label
              </label>
              <input
                id="save-assumptions-label"
                type="text"
                value={label}
                onChange={(event) => {
                  setLabel(event.target.value);
                  setError('');
                }}
                className="impact-modal__input"
              />

              <label htmlFor="save-assumptions-description" className="impact-modal__label mb-1 mt-4 block">
                Description (optional)
              </label>
              <textarea
                id="save-assumptions-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setError('');
                }}
                placeholder="What changed in this version, why you saved it, or what scenario it represents."
                className="impact-modal__input impact-modal__textarea"
                rows={4}
                maxLength={MAX_ASSUMPTION_DESCRIPTION_LENGTH}
              />
              {description.length > ASSUMPTION_DESCRIPTION_REMAINING_COUNT_THRESHOLD && (
                <p className="impact-modal__char-count">
                  {MAX_ASSUMPTION_DESCRIPTION_LENGTH - description.length} characters remaining
                </p>
              )}

              {error && <p className="impact-modal__error">{error}</p>}

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button type="button" onClick={onClose} className="impact-btn impact-btn--secondary">
                  Cancel
                </button>

                {canUpdateExisting && (
                  <button
                    type="button"
                    onClick={() => handleSubmit('update')}
                    className="impact-btn impact-btn--secondary"
                  >
                    Update Current Library Entry
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSubmit('new')}
                  className="impact-btn impact-btn--custom-accent"
                >
                  {canUpdateExisting ? 'Save as New' : 'Save to Library'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SaveAssumptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultLabel: PropTypes.string,
  defaultDescription: PropTypes.string,
  canUpdateExisting: PropTypes.bool,
  duplicateOfLabel: PropTypes.string,
};

SaveAssumptionsModal.defaultProps = {
  defaultLabel: '',
  defaultDescription: '',
  canUpdateExisting: false,
  duplicateOfLabel: null,
};

export default SaveAssumptionsModal;
