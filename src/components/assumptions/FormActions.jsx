import React from 'react';
import PropTypes from 'prop-types';

const FormActions = ({ onReset, onCancel, onSave, resetLabel }) => {
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
        className="px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
};

export default FormActions;
