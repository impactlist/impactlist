import React from 'react';
import PropTypes from 'prop-types';

/**
 * Shared card wrapper component with consistent styling for form sections.
 *
 * `onClick` makes the whole card a pointer target (e.g. the cause/recipient
 * cards open their editor). The card itself carries no keyboard handler or
 * role — an inner button must provide the keyboard/AT path, same pattern as
 * the AssumptionsDropdown rows.
 */
const SectionCard = ({
  children,
  hasError = false,
  isCustom = false,
  className = '',
  padding = 'default',
  showStateBadge = false,
  onClick = null,
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`assumption-card ${onClick ? 'assumption-card--clickable ' : ''}${className}`.trim()}
      data-state={state}
      onClick={onClick || undefined}
    >
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
  onClick: PropTypes.func,
};

export default SectionCard;
