import React from 'react';
import FormField from '../../shared/FormField';
import { formatNumberWithCommas } from '../../../utils/formatters';

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

  // Check if a field has been customized
  const isFieldCustomized = (fieldName) => {
    return (
      (overrides && overrides[fieldName] !== undefined && overrides[fieldName] !== '') ||
      (multipliers && multipliers[fieldName] !== undefined && multipliers[fieldName] !== '')
    );
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
              {isFieldCustomized(field.name) && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Custom
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Override input */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Override {defaultValue !== null && `(default: ${formatNumberWithCommas(defaultValue)})`}
                </label>
                <FormField
                  value={getOverrideValue(field.name)}
                  onChange={(value) => handleOverrideChange(field.name, value)}
                  placeholder={defaultValue !== null ? formatNumberWithCommas(defaultValue) : ''}
                  error={overrideError}
                  className={`w-full ${overrideError ? 'border-red-300' : ''}`}
                />
                {overrideError && <p className="mt-1 text-xs text-red-600">{overrideError}</p>}
              </div>

              {/* Multiplier input */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Multiplier (default: 1.0)</label>
                <FormField
                  value={getMultiplierValue(field.name)}
                  onChange={(value) => handleMultiplierChange(field.name, value)}
                  placeholder="1.0"
                  error={multiplierError}
                  className={`w-full ${multiplierError ? 'border-red-300' : ''}`}
                />
                {multiplierError && <p className="mt-1 text-xs text-red-600">{multiplierError}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipientQalyEffectInputs;
