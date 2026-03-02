import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
  isBusy = false,
}) => {
  const confirmButtonClass =
    confirmVariant === 'primary' ? 'impact-btn impact-btn--custom-accent' : 'impact-btn impact-btn--danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="impact-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex min-h-screen items-center justify-center px-4 py-6">
            <motion.div
              className="impact-modal__scrim"
              onClick={isBusy ? undefined : onCancel}
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
              <h2 className="impact-modal__title">{title}</h2>
              <p className="impact-modal__copy mt-2">{description}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onCancel} disabled={isBusy} className="impact-btn impact-btn--secondary">
                  {cancelLabel}
                </button>
                <button type="button" onClick={onConfirm} disabled={isBusy} className={confirmButtonClass}>
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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

ConfirmActionModal.defaultProps = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmVariant: 'danger',
  isBusy: false,
};

export default ConfirmActionModal;
