import React from 'react';
import PropTypes from 'prop-types';
import EffectCostDisplay from './EffectCostDisplay';

/**
 * Shared header component for effect editors
 */
const EffectEditorHeader = ({ title, description, combinedCostPerLife, showCombinedCost = true, onClose }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {showCombinedCost && combinedCostPerLife !== undefined && (
        <div className="mt-2">
          <EffectCostDisplay cost={combinedCostPerLife} label="Combined Cost per Life:" showInfinity={false} />
        </div>
      )}
    </div>
  );
};

EffectEditorHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  combinedCostPerLife: PropTypes.number,
  showCombinedCost: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EffectEditorHeader;
