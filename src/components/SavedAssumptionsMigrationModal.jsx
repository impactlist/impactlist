import PropTypes from 'prop-types';
import ModalShell from './shared/ModalShell';

const SavedAssumptionsMigrationModal = ({ isOpen, onSaveCurrent, onSkip }) => {
  return (
    <ModalShell isOpen={isOpen} onClose={onSkip} labelledBy="saved-assumptions-migration-modal-title">
      <h2 id="saved-assumptions-migration-modal-title" className="impact-modal__title">
        Save Current Assumptions?
      </h2>
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
    </ModalShell>
  );
};

SavedAssumptionsMigrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSaveCurrent: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default SavedAssumptionsMigrationModal;
