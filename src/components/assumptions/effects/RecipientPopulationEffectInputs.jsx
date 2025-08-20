import React from 'react';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../../utils/formatters';
import { getOverridePlaceholderValue, getMultiplierPlaceholderValue } from '../../../utils/effectFieldHelpers';
import TimeLimitMessage from '../../shared/TimeLimitMessage';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Component for editing Population effect overrides/multipliers for recipients
 * Each field has two inputs: one for override value, one for multiplier
 * Typing in one clears the other
 */
const RecipientPopulationEffectInputs = ({
  effectIndex,
  defaultCategoryEffect,
  userCategoryEffect,
  defaultRecipientEffect,
  errors,
  overrides,
  multipliers,
  onChange,
  globalParameters,
}) => {
  // Helper to handle the mutual exclusivity of override/multiplier
  const handleOverrideChange = (fieldName, value) => {
    // The parent component handles clearing the multiplier
    onChange(effectIndex, fieldName, 'override', value);
  };

  const handleMultiplierChange = (fieldName, value) => {
    // The parent component handles clearing the override
    onChange(effectIndex, fieldName, 'multiplier', value);
  };

  // Get the display value for a field (from overrides or multipliers)
  const getOverrideValue = (fieldName) => {
    if (overrides && overrides[fieldName] !== undefined) {
      return overrides[fieldName];
    }
    return '';
  };

  const getMultiplierValue = (fieldName) => {
    if (multipliers && multipliers[fieldName] !== undefined) {
      return multipliers[fieldName];
    }
    return '';
  };

  const fields = [
    {
      name: 'costPerMicroprobability',
      label: 'Cost per microprobability:',
      tooltip: getEffectTooltip('population', 'costPerMicroprobability'),
    },
    {
      name: 'populationFractionAffected',
      label: 'Population Fraction Affected:',
      tooltip: getEffectTooltip('population', 'populationFractionAffected'),
    },
    {
      name: 'qalyImprovementPerYear',
      label: 'Life-year improvement per year:',
      tooltip: getEffectTooltip('population', 'qalyImprovementPerYear'),
    },
    { name: 'startTime', label: 'Start Year:', tooltip: getEffectTooltip('population', 'startTime') },
    { name: 'windowLength', label: 'Window Length:', tooltip: getEffectTooltip('population', 'windowLength') },
  ];

  // Get effective values for time limit message
  const effectiveStartTime =
    getOverrideValue('startTime') ||
    getOverridePlaceholderValue('startTime', {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

  const effectiveWindowLength =
    getOverrideValue('windowLength') ||
    getOverridePlaceholderValue('windowLength', {
      defaultCategoryEffect,
      userCategoryEffect,
      defaultRecipientEffect,
    });

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const overrideError = errors[`${effectIndex}-${field.name}-override`];
        const multiplierError = errors[`${effectIndex}-${field.name}-multiplier`];
        const overrideValue = getOverrideValue(field.name);
        const multiplierValue = getMultiplierValue(field.name);

        // Get placeholder values using helper functions
        const overridePlaceholder = getOverridePlaceholderValue(field.name, {
          defaultCategoryEffect,
          userCategoryEffect,
          defaultRecipientEffect,
        });
        const multiplierPlaceholder = getMultiplierPlaceholderValue(field.name, {
          defaultRecipientEffect,
        });

        // Get the category value (user customized or default)
        const categoryValue =
          userCategoryEffect?.[field.name] !== undefined
            ? userCategoryEffect[field.name]
            : defaultCategoryEffect[field.name];

        return (
          <div key={field.name} className="space-y-1">
            <div className="flex items-center gap-2">
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

            <div className="grid grid-cols-2 gap-3">
              {/* Override input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-gray-600">Override</label>
                  {overrideValue && overrideValue !== '' && (
                    <button
                      type="button"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={() => handleOverrideChange(field.name, '')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formatNumberWithCommas(overrideValue)}
                  onChange={(e) => {
                    const inputElement = e.target;
                    const newValue = e.target.value;
                    const currentPosition = e.target.selectionStart;
                    const result = formatWithCursorHandling(newValue, currentPosition, inputElement);
                    handleOverrideChange(field.name, result.value);
                  }}
                  placeholder={overridePlaceholder !== null ? formatNumberWithCommas(overridePlaceholder) : 'None'}
                  className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                    overrideError
                      ? 'border-red-300 focus:ring-red-500'
                      : overrideValue && overrideValue !== ''
                        ? 'border-indigo-300 bg-indigo-50 focus:ring-indigo-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {overrideError && <p className="mt-1 text-xs text-red-600">{overrideError}</p>}
                {overrideValue &&
                  overrideValue !== '' &&
                  overridePlaceholder !== null &&
                  parseFloat(overrideValue.toString().replace(/,/g, '')) !== parseFloat(overridePlaceholder) && (
                    <p className="text-xs text-gray-500 mt-1">Default: {formatNumberWithCommas(overridePlaceholder)}</p>
                  )}
                {!overrideValue &&
                  overridePlaceholder !== null &&
                  categoryValue !== undefined &&
                  parseFloat(overridePlaceholder) !== parseFloat(categoryValue) && (
                    <p className="text-xs text-gray-500 mt-1">Category: {formatNumberWithCommas(categoryValue)}</p>
                  )}
              </div>

              {/* Multiplier input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-gray-600">Multiplier</label>
                  {multiplierValue && multiplierValue !== '' && (
                    <button
                      type="button"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={() => handleMultiplierChange(field.name, '')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formatNumberWithCommas(multiplierValue)}
                  onChange={(e) => {
                    const inputElement = e.target;
                    const newValue = e.target.value;
                    const currentPosition = e.target.selectionStart;
                    const result = formatWithCursorHandling(newValue, currentPosition, inputElement);
                    handleMultiplierChange(field.name, result.value);
                  }}
                  placeholder={multiplierPlaceholder !== null ? formatNumberWithCommas(multiplierPlaceholder) : 'None'}
                  className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                    multiplierError
                      ? 'border-red-300 focus:ring-red-500'
                      : multiplierValue && multiplierValue !== ''
                        ? 'border-indigo-300 bg-indigo-50 focus:ring-indigo-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {multiplierError && <p className="mt-1 text-xs text-red-600">{multiplierError}</p>}
                {multiplierValue &&
                  multiplierValue !== '' &&
                  multiplierPlaceholder !== null &&
                  parseFloat(multiplierValue.toString().replace(/,/g, '')) !== multiplierPlaceholder && (
                    <p className="text-xs text-gray-500 mt-1">
                      Default: {formatNumberWithCommas(multiplierPlaceholder)}
                    </p>
                  )}
              </div>
            </div>
            {field.name === 'windowLength' && (
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

export default RecipientPopulationEffectInputs;
