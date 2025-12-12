import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable button component for adjusting cost per life assumptions.
 */
const AdjustAssumptionsButton = ({ onClick, className = '', isUsingCustomValues = false }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 border border-white text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 ${isUsingCustomValues ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-700 hover:bg-indigo-600'} ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
      Edit Assumptions
    </button>
  );
};

AdjustAssumptionsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isUsingCustomValues: PropTypes.bool,
};

export default AdjustAssumptionsButton;
