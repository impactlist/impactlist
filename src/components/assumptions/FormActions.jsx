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
    <div className="flex flex-wrap items-center justify-end gap-3">
      {statusMessage && <p className="text-xs font-medium text-[var(--text-muted)]">{statusMessage}</p>}
      <div className="flex items-center gap-2">
        <button type="button" onClick={onReset} className="impact-btn impact-btn--secondary">
          {resetLabel}
        </button>
        {showSave && (
          <button type="button" onClick={onSave} disabled={isSaveDisabled} className="impact-btn impact-btn--primary">
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
