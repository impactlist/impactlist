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
        px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 relative z-10
        ${
          isDisabled
            ? 'bg-green-600 text-white hover:bg-green-700 enable-button'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }
        ${className}
      `}
      style={isDisabled ? { filter: 'none !important', opacity: '1 !important' } : {}}
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
