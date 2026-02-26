import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared component for indicating custom values with a reset button
 */
const CustomValueIndicator = ({ isCustom, hasError = false, onReset, className = '', size = 'xs' }) => {
  if (!isCustom) return null;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
  };

  const variantClass = hasError ? 'impact-btn--danger' : 'impact-btn--ghost';

  return (
    <button
      type="button"
      className={`impact-btn ${variantClass} ${sizeClasses[size]} ${className}`.trim()}
      style={{ paddingTop: '0.2rem', paddingBottom: '0.2rem' }}
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
