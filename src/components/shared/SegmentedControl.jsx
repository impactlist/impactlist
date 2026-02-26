import React from 'react';

/**
 * Segmented control component for selecting between multiple options
 * Styled as a pill-in-container pattern matching TabNavigation
 */
const SegmentedControl = ({ options, value, onChange, disabled = false, testIdPrefix = undefined }) => {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1" role="group">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            data-testid={testIdPrefix ? `${testIdPrefix}-${option.value}` : undefined}
            className={`
              px-3 py-1 text-xs font-medium rounded-md transition-all duration-200
              ${isSelected ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100' : 'text-slate-500 hover:text-slate-700'}
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
