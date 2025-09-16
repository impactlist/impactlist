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
  // Extract field names for initialization - memoized to prevent recreating on every render
  const fieldNames = React.useMemo(
    () => fields.map((field) => (typeof field === 'string' ? field : field.name)),
    [fields]
  );

  // Helper to check if a value is non-empty (handles both strings and numbers)
  const hasValue = (value) => {
    return value !== undefined && value !== null && value !== '';
  };

  // Initialize field modes based on existing data
  const [fieldModes, setFieldModes] = useState(() => {
    const modes = {};

    fieldNames.forEach((fieldName) => {
      if (overrides && hasValue(overrides[fieldName])) {
        modes[fieldName] = 'override';
      } else if (multipliers && hasValue(multipliers[fieldName])) {
        modes[fieldName] = 'multiplier';
      } else {
        modes[fieldName] = 'default';
      }
    });

    return modes;
  });

  // Track if initial setup is done
  const [isInitialized, setIsInitialized] = useState(false);

  // Set correct modes once when props are first available
  useEffect(() => {
    // Only run once when we first get real data
    if (!isInitialized && (overrides !== undefined || multipliers !== undefined)) {
      const modes = {};

      fieldNames.forEach((fieldName) => {
        // Check for values properly handling both strings and numbers
        if (overrides && hasValue(overrides[fieldName])) {
          modes[fieldName] = 'override';
        } else if (multipliers && hasValue(multipliers[fieldName])) {
          modes[fieldName] = 'multiplier';
        } else {
          modes[fieldName] = 'default';
        }
      });

      setFieldModes(modes);
      setIsInitialized(true);
    }
  }, [overrides, multipliers, fieldNames, isInitialized]);

  // Handle mode change for a field
  const handleModeChange = (fieldName, newMode) => {
    const prevMode = fieldModes[fieldName];

    setFieldModes((prev) => ({
      ...prev,
      [fieldName]: newMode,
    }));

    // Only clear the "other" value type to prevent conflicts
    // Don't clear when switching TO default (preserves values for switching back)
    // But do clear when switching FROM default to a specific mode
    if (newMode === 'override') {
      // Always clear multiplier when switching to override
      onChange(effectIndex, fieldName, 'multiplier', '');
    } else if (newMode === 'multiplier') {
      // Always clear override when switching to multiplier
      onChange(effectIndex, fieldName, 'override', '');
    } else if (newMode === 'default' && prevMode === 'override') {
      // When switching from override to default, keep the override value
      // but clear multiplier just in case
      onChange(effectIndex, fieldName, 'multiplier', '');
    } else if (newMode === 'default' && prevMode === 'multiplier') {
      // When switching from multiplier to default, keep the multiplier value
      // but clear override just in case
      onChange(effectIndex, fieldName, 'override', '');
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
    if (mode === 'override') {
      // Show the override value if it exists, even if empty string
      return overrides?.[fieldName] ?? '';
    } else if (mode === 'multiplier') {
      // Show the multiplier value if it exists, even if empty string
      return multipliers?.[fieldName] ?? '';
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
                  className={`w-40 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${(() => {
                    if (isDisabled) {
                      return 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200';
                    }

                    if (mode === 'default') {
                      // Check if choosing "default" is actually overriding a recipient-specific default
                      const hasRecipientDefault =
                        hasValue(defaultRecipientEffect?.overrides?.[fieldName]) ||
                        hasValue(defaultRecipientEffect?.multipliers?.[fieldName]);

                      // If recipient has a default, choosing "default" mode is a customization
                      return hasRecipientDefault
                        ? 'bg-indigo-50 text-gray-500 cursor-not-allowed border-indigo-300'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200';
                    }

                    if (error) {
                      return 'border-red-300 focus:ring-red-500';
                    }

                    // Check if this is a custom value (different from default)
                    let isCustomValue = false;
                    if (hasValue(currentValue)) {
                      // Get the default value for comparison
                      const defaultValue =
                        mode === 'override'
                          ? defaultRecipientEffect?.overrides?.[fieldName]
                          : mode === 'multiplier'
                            ? defaultRecipientEffect?.multipliers?.[fieldName]
                            : null;

                      // Compare current with default (handle string/number conversion)
                      if (hasValue(defaultValue)) {
                        const currentNum = parseFloat(currentValue.toString().replace(/,/g, ''));
                        const defaultNum = parseFloat(defaultValue.toString().replace(/,/g, ''));
                        isCustomValue = !isNaN(currentNum) && !isNaN(defaultNum) && currentNum !== defaultNum;
                      } else {
                        // No default means any value is custom
                        isCustomValue = true;
                      }
                    }

                    return isCustomValue
                      ? 'border-indigo-300 bg-indigo-50 focus:ring-indigo-500'
                      : 'border-gray-300 focus:ring-indigo-500';
                  })()}`}
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
