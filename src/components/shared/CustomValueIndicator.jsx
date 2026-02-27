import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared component for indicating custom values with a reset button
 */
const CustomValueIndicator = ({ isCustom, hasError = false, onReset, className = '', size = 'xs' }) => {
  if (!isCustom) return null;

  const sizeClasses = {
    xs: 'impact-btn--xs',
    sm: 'impact-btn--sm',
    md: '',
  };

  const variantClass = hasError ? 'impact-btn--danger' : 'impact-btn--ghost';

  return (
    <button
      type="button"
      className={`impact-btn ${variantClass} ${sizeClasses[size]} ${className}`.trim()}
      onClick={onReset}
    >
      Reset
    </button>
  );
};

CustomValueIndicator.propTypes = {
  isCustom: PropTypes.bool.isRequired,
  hasError: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
};

export default CustomValueIndicator;
