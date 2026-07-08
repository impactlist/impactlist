import PropTypes from 'prop-types';
import ModalShell from './shared/ModalShell';

/**
 * Navigation-guard prompt for un-applied edits (global parameters and/or an
 * open effect editor's draft). Rendered by the assumptions editor when a
 * navigation is blocked; the caller words `message` for what's actually at
 * risk. Escape and the scrim behave like "Keep editing".
 */
const UnappliedEditsModal = ({ isOpen, message, onApplyAndLeave, onDiscardAndLeave, onStay }) => (
  <ModalShell isOpen={isOpen} onClose={onStay} labelledBy="unapplied-edits-modal-title">
    <h2 id="unapplied-edits-modal-title" className="impact-modal__title">
      Apply your edits before leaving?
    </h2>
    <p className="impact-modal__copy mt-2">{message}</p>
    <div className="mt-6 flex flex-wrap justify-end gap-2">
      <button type="button" onClick={onStay} className="impact-btn impact-btn--secondary">
        Keep editing
      </button>
      <button type="button" onClick={onDiscardAndLeave} className="impact-btn impact-btn--danger">
        Discard and leave
      </button>
      <button type="button" onClick={onApplyAndLeave} className="impact-btn impact-btn--custom-accent">
        Apply and leave
      </button>
    </div>
  </ModalShell>
);

UnappliedEditsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  onApplyAndLeave: PropTypes.func.isRequired,
  onDiscardAndLeave: PropTypes.func.isRequired,
  onStay: PropTypes.func.isRequired,
};

export default UnappliedEditsModal;
