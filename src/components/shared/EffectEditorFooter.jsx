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
    <div className="px-6 py-4 border-t border-slate-100 rounded-b-lg">
      <div className="flex items-center justify-between">
        <div className="text-sm">{hasErrors && <span className="text-red-600">{errorMessage}</span>}</div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/20 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isDisabled}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/20 transition-colors ${
              isDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
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
