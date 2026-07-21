import PropTypes from 'prop-types';
import ConfirmActionModal from './ConfirmActionModal';

const SharedImportDecisionModal = ({
  isOpen,
  onContinue,
  onCancel,
  isBusy = false,
  title = 'Import Shared Assumptions?',
  description = 'You have custom assumptions that are not saved as a named set. Continuing will replace them. If you want to keep a reusable copy first, click “Cancel”, go to the Assumptions page, and click “Save as…”',
  continueLabel = 'Continue (overwrite yours)',
  cancelLabel = 'Cancel',
}) => {
  return (
    <ConfirmActionModal
      isOpen={isOpen}
      title={title}
      description={description}
      confirmLabel={continueLabel}
      cancelLabel={cancelLabel}
      onConfirm={onContinue}
      onCancel={onCancel}
      confirmVariant="primary"
      isBusy={isBusy}
    />
  );
};

SharedImportDecisionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  continueLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

export default SharedImportDecisionModal;
