import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared card wrapper component with consistent styling for form sections
 */
const SectionCard = ({
  children,
  hasError = false,
  isCustom = false,
  className = '',
  padding = 'default',
  showStateBadge = true,
}) => {
  const state = hasError ? 'error' : isCustom ? 'custom' : 'default';
  const stateLabels = {
    default: 'Default',
    custom: 'Custom',
    error: 'Error',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2.5',
    default: 'p-3.5',
    lg: 'p-4',
  };

  return (
    <div className={`assumption-card ${className}`.trim()} data-state={state}>
      <div className={paddingClasses[padding]}>
        {showStateBadge && (
          <div className="mb-2.5 flex justify-end">
            <span className="assumption-state-pill" data-state={state}>
              {stateLabels[state]}
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

SectionCard.propTypes = {
  children: PropTypes.node.isRequired,
  hasError: PropTypes.bool,
  isCustom: PropTypes.bool,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  showStateBadge: PropTypes.bool,
};

export default SectionCard;
