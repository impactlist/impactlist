import React from 'react';
import PropTypes from 'prop-types';

/**
 * Toggle button for enabling/disabling effects
 * Shows "Disable" when enabled, "Enable" when disabled
 */
const DisableToggleButton = ({ isDisabled, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200 relative z-10
        ${
          isDisabled
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
        }
        ${className}
      `}
      aria-label={isDisabled ? 'Enable effect' : 'Disable effect'}
    >
      {isDisabled ? 'Enable' : 'Disable'}
    </button>
  );
};

DisableToggleButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default DisableToggleButton;
