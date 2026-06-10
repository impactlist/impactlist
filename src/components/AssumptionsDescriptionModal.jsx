import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ModalShell, { ModalHeader } from './shared/ModalShell';
import {
  ASSUMPTION_DESCRIPTION_REMAINING_COUNT_THRESHOLD,
  MAX_ASSUMPTION_DESCRIPTION_LENGTH,
} from '../constants/assumptionsDescription';
import MarkdownContent from './shared/MarkdownContent';

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
    <ModalShell isOpen={isOpen} onClose={handleRequestClose} labelledBy="assumptions-description-modal-title">
      <ModalHeader
        title={entryLabel || 'Unnamed assumption'}
        titleId="assumptions-description-modal-title"
        onClose={handleRequestClose}
      />

      {isReadOnly ? (
        <>
          <p id="assumptions-description-modal-label" className="impact-modal__label mb-1 block">
            Description:
          </p>
          <div
            aria-labelledby="assumptions-description-modal-label"
            className="impact-modal__markdown-scroll"
            role="region"
          >
            <MarkdownContent
              content={description || 'No description available.'}
              className="impact-modal__markdown"
              delay={0}
            />
          </div>
        </>
      ) : (
        <>
          <label htmlFor="assumptions-description-modal" className="impact-modal__label mb-1 block">
            Description:
          </label>
          <textarea
            id="assumptions-description-modal"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="impact-modal__input impact-modal__textarea"
            rows={6}
            maxLength={MAX_ASSUMPTION_DESCRIPTION_LENGTH}
            placeholder="Add notes about this assumptions set."
          />
        </>
      )}
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
    </ModalShell>
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
