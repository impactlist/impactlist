import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared footer component for effect editors with save/cancel buttons
 */
const EffectEditorFooter = ({
  onSave,
  onCancel,
  hasErrors = false,
  errorMessage = 'Please fix errors before saving',
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  disabled = false,
}) => {
  const isDisabled = hasErrors || disabled;

  return (
    <div className="px-6 py-4 rounded-b-lg">
      <div className="flex items-center justify-between">
        <div className="text-sm">{hasErrors && <span className="text-red-600">{errorMessage}</span>}</div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isDisabled}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
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
