import React from 'react';
import PropTypes from 'prop-types';

const FormActions = ({
  onReset,
  onSave,
  resetLabel,
  showSave = false,
  hasErrors = false,
  hasUnsavedChanges = true,
}) => {
  const isSaveDisabled = hasErrors || !hasUnsavedChanges;
  const statusMessage = hasErrors ? 'Fix validation errors before applying.' : '';

  return (
    <div className="assumptions-form-actions">
      {statusMessage && <p className="assumptions-form-actions__status">{statusMessage}</p>}
      <div className="assumptions-form-actions__buttons">
        <button type="button" onClick={onReset} className="assumptions-form-actions__reset">
          {resetLabel}
        </button>
        {showSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaveDisabled}
            className="impact-btn impact-btn--custom-accent assumptions-form-actions__apply"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

FormActions.propTypes = {
  onReset: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  resetLabel: PropTypes.string.isRequired,
  showSave: PropTypes.bool,
  hasErrors: PropTypes.bool,
  hasUnsavedChanges: PropTypes.bool,
};

export default FormActions;
