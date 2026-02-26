import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared footer component for effect editors with save/cancel buttons
 */
const EffectEditorFooter = ({
  onSave,
  onCancel,
  hasErrors = false,
  errorMessage = 'Please fix errors before applying',
  saveLabel = 'Apply',
  cancelLabel = 'Cancel',
  disabled = false,
}) => {
  const isDisabled = hasErrors || disabled;

  return (
    <div className="rounded-b-lg border-t border-[var(--border-subtle)] bg-[var(--bg-surface-alt)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">{hasErrors && <span className="text-[var(--danger)]">{errorMessage}</span>}</div>
        <div className="flex space-x-3">
          <button type="button" onClick={onCancel} className="impact-btn impact-btn--secondary">
            {cancelLabel}
          </button>
          <button type="button" onClick={onSave} disabled={isDisabled} className="impact-btn impact-btn--primary">
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

EffectEditorFooter.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool,
  errorMessage: PropTypes.string,
  saveLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

export default EffectEditorFooter;
