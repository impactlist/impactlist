import PropTypes from 'prop-types';
import ConfirmActionModal from './ConfirmActionModal';

const SharedImportDecisionModal = ({
  isOpen,
  onContinue,
  onCancel,
  isBusy,
  title = 'Import Shared Assumptions?',
  description = 'You already have custom assumptions in this browser. Continuing will replace them. If you want to keep a link to your current assumptions, click Cancel, then use Share Assumptions to get a link.',
  continueLabel = 'Continue (Replace Mine)',
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

SharedImportDecisionModal.defaultProps = {
  isBusy: false,
  title: 'Import Shared Assumptions?',
  description:
    'You already have custom assumptions in this browser. Continuing will replace them. If you want to keep a link to your current assumptions, click Cancel, then use Share Assumptions to get a link.',
  continueLabel: 'Continue (Replace Mine)',
  cancelLabel: 'Cancel',
};

export default SharedImportDecisionModal;
