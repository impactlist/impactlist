import React, { useState, useEffect } from 'react';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../../utils/formatters';
import { getOverridePlaceholderValue, getMultiplierPlaceholderValue } from '../../../utils/effectFieldHelpers';
import TimeLimitMessage from '../../shared/TimeLimitMessage';
import SegmentedControl from '../../shared/SegmentedControl';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Component for editing QALY effect overrides/multipliers for recipients
 * Uses segmented control with a single context-aware input
 */
const RecipientQalyEffectInputs = ({
  effectIndex,
  defaultCategoryEffect,
  userCategoryEffect,
  defaultRecipientEffect,
  errors,
  overrides,
  multipliers,
  onChange,
  globalParameters,
  isDisabled,
}) => {
  // Track which mode is selected for each field
  const [fieldModes, setFieldModes] = useState({});

  // Initialize field modes based on existing data
  useEffect(() => {
    const modes = {};
    const fields = ['costPerQALY', 'startTime', 'windowLength'];

    fields.forEach((fieldName) => {
      if (overrides && overrides[fieldName] !== undefined && overrides[fieldName] !== '') {
        modes[fieldName] = 'override';
      } else if (multipliers && multipliers[fieldName] !== undefined && multipliers[fieldName] !== '') {
        modes[fieldName] = 'multiplier';
      } else {
        modes[fieldName] = 'default';
      }
    });

    setFieldModes(modes);
  }, [overrides, multipliers]);

  // Handle mode change for a field
  const handleModeChange = (fieldName, newMode) => {
    setFieldModes((prev) => ({
      ...prev,
      [fieldName]: newMode,
    }));

    // Clear both values when switching to default
    if (newMode === 'default') {
      onChange(effectIndex, fieldName, 'override', '');
      onChange(effectIndex, fieldName, 'multiplier', '');
    }
  };

  // Handle value change based on current mode
  const handleValueChange = (fieldName, value) => {
    const mode = fieldModes[fieldName];
    if (mode === 'override') {
      onChange(effectIndex, fieldName, 'override', value);
      // Clear multiplier when setting override
      onChange(effectIndex, fieldName, 'multiplier', '');
    } else if (mode === 'multiplier') {
      onChange(effectIndex, fieldName, 'multiplier', value);
      // Clear override when setting multiplier
      onChange(effectIndex, fieldName, 'override', '');
    }
  };

  // Get the current value for the input based on mode
  const getCurrentInputValue = (fieldName) => {
    const mode = fieldModes[fieldName];
    if (mode === 'override' && overrides && overrides[fieldName] !== undefined) {
      return overrides[fieldName];
    } else if (mode === 'multiplier' && multipliers && multipliers[fieldName] !== undefined) {
      return multipliers[fieldName];
    }
    return '';
  };

  // Get the appropriate placeholder based on mode
  const getPlaceholder = (fieldName) => {
    const mode = fieldModes[fieldName];
    if (mode === 'override') {
      const overridePlaceholder = getOverridePlaceholderValue(fieldName, {
        defaultCategoryEffect,
        userCategoryEffect,
        defaultRecipientEffect,
      });
      return overridePlaceholder !== null ? formatNumberWithCommas(overridePlaceholder) : 'Enter value';
    } else if (mode === 'multiplier') {
      const multiplierPlaceholder = getMultiplierPlaceholderValue(fieldName, {
        defaultRecipientEffect,
      });
      return multiplierPlaceholder !== null ? formatNumberWithCommas(multiplierPlaceholder) : '1';
    }
    return '';
  };

  // Get helper text showing current value
  const getHelperText = (fieldName) => {
    const mode = fieldModes[fieldName];
    const overridePlaceholder = getOverridePlaceholderValue(fieldName, {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

    if (mode === 'default' && overridePlaceholder !== null) {
      return `Currently: ${formatNumberWithCommas(overridePlaceholder)}`;
    } else if (mode === 'override') {
      const currentValue = getCurrentInputValue(fieldName);
      if (currentValue && currentValue !== '') {
        const numValue = parseFloat(currentValue.toString().replace(/,/g, ''));
        if (!isNaN(numValue) && overridePlaceholder !== null) {
          const defaultValue = parseFloat(overridePlaceholder);
          if (numValue !== defaultValue) {
            return `Default: ${formatNumberWithCommas(overridePlaceholder)}`;
          }
        }
      }
    } else if (mode === 'multiplier') {
      const currentValue = getCurrentInputValue(fieldName);
      if (currentValue && currentValue !== '' && overridePlaceholder !== null) {
        const multiplier = parseFloat(currentValue.toString().replace(/,/g, ''));
        if (!isNaN(multiplier)) {
          const resultValue = parseFloat(overridePlaceholder) * multiplier;
          return `Result: ${formatNumberWithCommas(resultValue)} (${formatNumberWithCommas(overridePlaceholder)} × ${formatNumberWithCommas(multiplier)})`;
        }
      }
    }
    return null;
  };

  const fields = [
    { name: 'costPerQALY', label: 'Cost per life-year', tooltip: getEffectTooltip('qaly', 'costPerQALY') },
    { name: 'startTime', label: 'Start Time (years)', tooltip: getEffectTooltip('qaly', 'startTime') },
    { name: 'windowLength', label: 'Window Length (years)', tooltip: getEffectTooltip('qaly', 'windowLength') },
  ];

  const segmentOptions = [
    { value: 'default', label: 'Default' },
    { value: 'override', label: 'Set value' },
    { value: 'multiplier', label: 'Multiply' },
  ];

  // Get effective values for time limit message
  const effectiveStartTime =
    (fieldModes['startTime'] === 'override' && overrides?.startTime) ||
    getOverridePlaceholderValue('startTime', {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

  const effectiveWindowLength =
    (fieldModes['windowLength'] === 'override' && overrides?.windowLength) ||
    getOverridePlaceholderValue('windowLength', {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const mode = fieldModes[field.name] || 'default';
        const currentValue = getCurrentInputValue(field.name);
        const overrideError = errors[`${effectIndex}-${field.name}-override`];
        const multiplierError = errors[`${effectIndex}-${field.name}-multiplier`];
        const error = mode === 'override' ? overrideError : mode === 'multiplier' ? multiplierError : null;
        const helperText = getHelperText(field.name);
        const placeholder = getPlaceholder(field.name);

        return (
          <div key={field.name}>
            {/* Field label with tooltip */}
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-900">{field.label}</label>
              {field.tooltip && (
                <div className="group relative inline-block">
                  <span className="text-xs text-gray-500 cursor-help">ⓘ</span>
                  <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                    {field.tooltip}
                  </div>
                </div>
              )}
            </div>

            {/* Segmented control and input */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <SegmentedControl
                  options={segmentOptions}
                  value={mode}
                  onChange={(newMode) => handleModeChange(field.name, newMode)}
                  disabled={isDisabled}
                />

                {/* Single context-aware input - always visible */}
                <input
                  type="text"
                  value={
                    mode === 'default'
                      ? formatNumberWithCommas(
                          getOverridePlaceholderValue(field.name, {
                            defaultCategoryEffect,
                            userCategoryEffect,
                            defaultRecipientEffect,
                          }) || ''
                        )
                      : formatNumberWithCommas(currentValue)
                  }
                  onChange={(e) => {
                    if (mode !== 'default') {
                      const inputElement = e.target;
                      const newValue = e.target.value;
                      const currentPosition = e.target.selectionStart;
                      const result = formatWithCursorHandling(newValue, currentPosition, inputElement);
                      handleValueChange(field.name, result.value);
                    }
                  }}
                  placeholder={placeholder}
                  disabled={isDisabled || mode === 'default'}
                  className={`flex-1 max-w-[150px] px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${
                    isDisabled || mode === 'default'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                      : error
                        ? 'border-red-300 focus:ring-red-500'
                        : currentValue && currentValue !== ''
                          ? 'border-indigo-300 bg-indigo-50 focus:ring-indigo-500'
                          : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
              </div>

              {/* Error message */}
              {error && <p className="text-xs text-red-600 ml-2">{error}</p>}

              {/* Helper text - only show for override/multiplier modes when there's a meaningful difference */}
              {mode !== 'default' && helperText && <p className="text-xs text-gray-500 ml-2">{helperText}</p>}
            </div>
          </div>
        );
      })}

      {/* Time limit message */}
      <TimeLimitMessage
        startTime={effectiveStartTime}
        windowLength={effectiveWindowLength}
        timeLimit={globalParameters?.timeLimit}
      />
    </div>
  );
};

export default RecipientQalyEffectInputs;
