import React from 'react';

/**
 * Segmented control component for selecting between multiple options
 * Styled as a connected button group
 */
const SegmentedControl = ({ options, value, onChange, disabled = false, testIdPrefix = undefined }) => {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)] p-0.5"
      role="group"
    >
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
              px-3 py-1 text-xs font-semibold border transition-colors
              ${isFirst ? 'rounded-l-full' : ''}
              ${isLast ? 'rounded-r-full' : ''}
              ${!isFirst ? 'border-l-0' : ''}
              ${
                isSelected
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] z-10'
                  : 'bg-white/85 text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-strong)]'
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
