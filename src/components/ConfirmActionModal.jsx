import PropTypes from 'prop-types';
import ModalShell from './shared/ModalShell';

const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
  isBusy = false,
}) => {
  const confirmButtonClass =
    confirmVariant === 'primary' ? 'impact-btn impact-btn--custom-accent' : 'impact-btn impact-btn--danger';

  return (
    <ModalShell isOpen={isOpen} onClose={onCancel} dismissible={!isBusy} labelledBy="confirm-action-modal-title">
      <h2 id="confirm-action-modal-title" className="impact-modal__title">
        {title}
      </h2>
      <p className="impact-modal__copy mt-2">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={isBusy} className="impact-btn impact-btn--secondary">
          {cancelLabel}
        </button>
        <button type="button" onClick={onConfirm} disabled={isBusy} className={confirmButtonClass}>
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
};

ConfirmActionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmVariant: PropTypes.oneOf(['primary', 'danger']),
  isBusy: PropTypes.bool,
};

export default ConfirmActionModal;
