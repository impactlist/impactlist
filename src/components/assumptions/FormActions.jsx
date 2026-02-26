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

  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 transition-colors"
      >
        {resetLabel}
      </button>
      {showSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaveDisabled}
          className={`px-3 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 transition-colors ${
            isSaveDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Apply
        </button>
      )}
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
