import React, { useState, useEffect } from 'react';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../../utils/formatters';
import { getOverridePlaceholderValue, getMultiplierPlaceholderValue } from '../../../utils/effectFieldHelpers';
import TimeLimitMessage from '../../shared/TimeLimitMessage';
import SegmentedControl from '../../shared/SegmentedControl';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Base component for editing effect overrides/multipliers for recipients
 * Uses segmented control with a single context-aware input
 *
 * @param {Array} fields - Array of field definitions with name, label, and tooltip info
 * @param {string} effectType - Type of effect ('qaly' or 'population') for tooltip lookup
 */
const BaseRecipientEffectInputs = ({
  fields,
  effectType,
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

  // Extract field names for initialization - memoized to prevent recreating on every render
  const fieldNames = React.useMemo(
    () => fields.map((field) => (typeof field === 'string' ? field : field.name)),
    [fields]
  );

  // Initialize field modes based on existing data
  useEffect(() => {
    const modes = {};

    fieldNames.forEach((fieldName) => {
      if (overrides && overrides[fieldName] !== undefined && overrides[fieldName] !== '') {
        modes[fieldName] = 'override';
      } else if (multipliers && multipliers[fieldName] !== undefined && multipliers[fieldName] !== '') {
        modes[fieldName] = 'multiplier';
      } else {
        modes[fieldName] = 'default';
      }
    });

    setFieldModes(modes);
  }, [overrides, multipliers, fieldNames]);

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

  const segmentOptions = [
    { value: 'default', label: 'Default' },
    { value: 'override', label: 'Set value' },
    { value: 'multiplier', label: 'Multiply' },
  ];

  // Get effective values for time limit message
  const getEffectiveValue = (fieldName) => {
    const mode = fieldModes[fieldName];
    const defaultValue = getOverridePlaceholderValue(fieldName, {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

    if (mode === 'override' && overrides?.[fieldName]) {
      const value = parseFloat(overrides[fieldName].toString().replace(/,/g, ''));
      return !isNaN(value) ? value : defaultValue;
    } else if (mode === 'multiplier' && multipliers?.[fieldName]) {
      const multiplier = parseFloat(multipliers[fieldName].toString().replace(/,/g, ''));
      if (!isNaN(multiplier) && defaultValue !== null) {
        return parseFloat(defaultValue) * multiplier;
      }
    }

    return defaultValue;
  };

  const effectiveStartTime = getEffectiveValue('startTime');
  const effectiveWindowLength = getEffectiveValue('windowLength');

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        // Support both string fields and object fields
        const fieldName = typeof field === 'string' ? field : field.name;
        const fieldLabel = typeof field === 'string' ? fieldName : field.label;
        const fieldTooltip =
          typeof field === 'string'
            ? getEffectTooltip(effectType, fieldName)
            : field.tooltip || getEffectTooltip(effectType, fieldName);

        const mode = fieldModes[fieldName] || 'default';
        const currentValue = getCurrentInputValue(fieldName);
        const overrideError = errors[`${effectIndex}-${fieldName}-override`];
        const multiplierError = errors[`${effectIndex}-${fieldName}-multiplier`];
        const error = mode === 'override' ? overrideError : mode === 'multiplier' ? multiplierError : null;
        const helperText = getHelperText(fieldName);
        const placeholder = getPlaceholder(fieldName);

        return (
          <div key={fieldName} className="space-y-2">
            {/* All on one line: label, tooltip, segmented control, and input */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Field label with tooltip - stays on first line */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-sm font-medium text-gray-900">{fieldLabel}</label>
                {fieldTooltip && (
                  <div className="group relative inline-block">
                    <span className="text-xs text-gray-500 cursor-help">ⓘ</span>
                    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                      {fieldTooltip}
                    </div>
                  </div>
                )}
              </div>

              {/* Segmented control and input - wraps together first, then input wraps separately */}
              <div className="flex flex-wrap items-center gap-2 min-w-0 [&:not(:first-child)]:ml-2">
                <SegmentedControl
                  options={segmentOptions}
                  value={mode}
                  onChange={(newMode) => handleModeChange(fieldName, newMode)}
                  disabled={isDisabled}
                />

                {/* Single context-aware input - always visible */}
                <input
                  type="text"
                  value={
                    mode === 'default'
                      ? formatNumberWithCommas(
                          getOverridePlaceholderValue(fieldName, {
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
                      handleValueChange(fieldName, result.value);
                    }
                  }}
                  placeholder={placeholder}
                  disabled={isDisabled || mode === 'default'}
                  className={`w-40 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${
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
            </div>

            {/* Error message and helper text on separate lines */}
            {error && <p className="text-xs text-red-600 ml-2">{error}</p>}
            {mode !== 'default' && helperText && <p className="text-xs text-gray-500 ml-2">{helperText}</p>}

            {/* Show time limit message only for windowLength field */}
            {fieldName === 'windowLength' && (
              <TimeLimitMessage
                startTime={effectiveStartTime}
                windowLength={effectiveWindowLength}
                timeLimit={globalParameters?.timeLimit}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BaseRecipientEffectInputs;
