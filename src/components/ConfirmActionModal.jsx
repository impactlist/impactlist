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
    confirmVariant === 'primary'
      ? isBusy
        ? 'cursor-not-allowed bg-slate-400'
        : 'bg-indigo-600 hover:bg-indigo-700'
      : isBusy
        ? 'cursor-not-allowed bg-slate-400'
        : 'bg-red-600 hover:bg-red-700';

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
              onClick={isBusy ? undefined : onCancel}
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
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isBusy}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isBusy}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-white ${confirmButtonClass}`}
                >
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
