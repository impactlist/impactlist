import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared card wrapper component with consistent styling for form sections
 */
const SectionCard = ({ children, hasError = false, isCustom = false, className = '', padding = 'default' }) => {
  const stateClasses = hasError
    ? 'border-red-200 ring-1 ring-red-100 bg-red-50/50'
    : isCustom
      ? 'border-indigo-200 ring-1 ring-indigo-100 bg-indigo-50/40'
      : 'border-slate-200';

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`
        rounded-xl border shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${stateClasses}
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
