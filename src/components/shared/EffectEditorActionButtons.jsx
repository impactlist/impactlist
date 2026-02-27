import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared save/cancel action buttons used by effect editors.
 */
const EffectEditorActionButtons = ({
  onSave,
  onCancel,
  isSaveDisabled = false,
  saveLabel = 'Apply',
  cancelLabel = 'Cancel',
  compact = false,
  className = '',
}) => {
  const sizeClass = compact ? 'impact-btn--sm' : '';

  return (
    <div className={`flex items-center space-x-3 ${className}`.trim()}>
      <button type="button" onClick={onCancel} className={`impact-btn impact-btn--secondary ${sizeClass}`.trim()}>
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaveDisabled}
        className={`impact-btn impact-btn--custom-accent ${sizeClass}`.trim()}
      >
        {saveLabel}
      </button>
    </div>
  );
};

EffectEditorActionButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaveDisabled: PropTypes.bool,
  saveLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default EffectEditorActionButtons;
