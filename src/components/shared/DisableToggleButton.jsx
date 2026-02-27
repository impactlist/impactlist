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
      className={`effect-toggle relative z-10 ${className}`.trim()}
      data-disabled={isDisabled}
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
