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

  const colorClasses = hasError ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800';

  return (
    <button type="button" className={`${sizeClasses[size]} ${colorClasses} font-medium ${className}`} onClick={onReset}>
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
