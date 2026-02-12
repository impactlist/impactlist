import React from 'react';

/**
 * Segmented control component for selecting between multiple options
 * Styled as a connected button group
 */
const SegmentedControl = ({ options, value, onChange, disabled = false, testIdPrefix = undefined }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            data-testid={testIdPrefix ? `${testIdPrefix}-${option.value}` : undefined}
            className={`
              px-3 py-1 text-xs font-medium border transition-colors
              ${isFirst ? 'rounded-l-md' : ''}
              ${isLast ? 'rounded-r-md' : ''}
              ${!isFirst ? 'border-l-0' : ''}
              ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 z-10'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
