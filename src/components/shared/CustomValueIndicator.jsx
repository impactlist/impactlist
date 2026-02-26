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

  const colorClasses = hasError
    ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
    : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50';

  return (
    <button
      type="button"
      className={`${sizeClasses[size]} ${colorClasses} font-medium px-2 py-0.5 rounded-md transition-colors ${className}`}
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
