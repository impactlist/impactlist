import React from 'react';
import { formatNumberWithCommas, formatWithCursorHandling } from '../../../utils/formatters';

/**
 * Component for editing QALY effect overrides/multipliers for recipients
 * Each field has two inputs: one for override value, one for multiplier
 * Typing in one clears the other
 */
const RecipientQalyEffectInputs = ({ effectIndex, defaultEffect, errors, overrides, multipliers, onChange }) => {
  // Helper to handle the mutual exclusivity of override/multiplier
  const handleOverrideChange = (fieldName, value) => {
    // When typing in override, clear the multiplier
    onChange(effectIndex, fieldName, 'override', value);
    if (value !== '' && value !== null && value !== undefined) {
      onChange(effectIndex, fieldName, 'multiplier', '');
    }
  };

  const handleMultiplierChange = (fieldName, value) => {
    // When typing in multiplier, clear the override
    onChange(effectIndex, fieldName, 'multiplier', value);
    if (value !== '' && value !== null && value !== undefined) {
      onChange(effectIndex, fieldName, 'override', '');
    }
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
    { name: 'costPerQALY', label: 'Cost per QALY', tooltip: 'Cost to provide one quality-adjusted life year' },
    { name: 'startYear', label: 'Start Year', tooltip: 'Years until the effect begins' },
    { name: 'windowLength', label: 'Window Length', tooltip: 'Duration of the effect in years' },
    {
      name: 'populationFractionAffected',
      label: 'Population Fraction Affected',
      tooltip: 'Fraction of the population affected by this intervention',
    },
    {
      name: 'qalyImprovementPerYear',
      label: 'QALY Improvement per Year',
      tooltip: 'Quality-adjusted life years improved per year for affected population',
    },
  ];

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const overrideError = errors[`${effectIndex}-${field.name}-override`];
        const multiplierError = errors[`${effectIndex}-${field.name}-multiplier`];
        const defaultValue = defaultEffect ? defaultEffect[field.name] : null;
        const overrideValue = getOverrideValue(field.name);
        const multiplierValue = getMultiplierValue(field.name);

        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.tooltip && (
                <div className="group relative inline-block">
                  <span className="text-xs text-gray-500 cursor-help">ⓘ</span>
                  <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                    {field.tooltip}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Override input */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Override</label>
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
                  placeholder={defaultValue !== null ? formatNumberWithCommas(defaultValue) : 'None'}
                  className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                    overrideError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {overrideError && <p className="mt-1 text-xs text-red-600">{overrideError}</p>}
                {overrideValue &&
                  overrideValue !== '' &&
                  defaultValue !== null &&
                  parseFloat(overrideValue.toString().replace(/,/g, '')) !== parseFloat(defaultValue) && (
                    <p className="text-xs text-gray-500 mt-1">Default: {formatNumberWithCommas(defaultValue)}</p>
                  )}
              </div>

              {/* Multiplier input */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Multiplier</label>
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
                  placeholder="None"
                  className={`w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                    multiplierError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {multiplierError && <p className="mt-1 text-xs text-red-600">{multiplierError}</p>}
                {multiplierValue &&
                  multiplierValue !== '' &&
                  parseFloat(multiplierValue.toString().replace(/,/g, '')) !== 1.0 && (
                    <p className="text-xs text-gray-500 mt-1">Default: 1.0</p>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipientQalyEffectInputs;
