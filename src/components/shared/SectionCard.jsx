import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared card wrapper component with consistent styling for form sections
 */
const SectionCard = ({ children, hasError = false, isCustom = false, className = '', padding = 'default' }) => {
  const borderColorClass = hasError ? 'border-red-300' : isCustom ? 'border-indigo-300' : 'border-gray-200';

  const bgColorClass = hasError ? 'bg-red-50' : isCustom ? 'bg-indigo-50' : '';

  const paddingClasses = {
    none: '',
    sm: 'py-1.5 px-2',
    default: 'py-2 px-3',
    lg: 'py-3 px-4',
  };

  return (
    <div
      className={`
        rounded border 
        ${borderColorClass} 
        ${bgColorClass} 
        ${paddingClasses[padding]} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

SectionCard.propTypes = {
  children: PropTypes.node.isRequired,
  hasError: PropTypes.bool,
  isCustom: PropTypes.bool,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
};

export default SectionCard;
