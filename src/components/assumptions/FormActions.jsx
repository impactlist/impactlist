import React from 'react';
import PropTypes from 'prop-types';

const FormActions = ({ onReset, onCancel, onSave, resetLabel, hasErrors = false }) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {resetLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={hasErrors}
        className={`px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          hasErrors ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        Save
      </button>
    </div>
  );
};

FormActions.propTypes = {
  onReset: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  resetLabel: PropTypes.string.isRequired,
  hasErrors: PropTypes.bool,
};

export default FormActions;
