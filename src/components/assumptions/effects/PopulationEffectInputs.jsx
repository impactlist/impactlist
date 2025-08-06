import React from 'react';
import PropTypes from 'prop-types';
import { formatNumberWithCommas } from '../../../utils/formatters';

/**
 * Input fields for population-based effects
 */
const PopulationEffectInputs = ({ effect, effectIndex, errors, onChange }) => {
  const handleInputChange = (fieldName, value) => {
    // Remove commas and convert to number
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);

    // Pass the numeric value to the parent
    onChange(effectIndex, fieldName, isNaN(numValue) ? 0 : numValue);
  };

  const formatValue = (value) => {
    if (value === undefined || value === null) return '';
    // For very small or very large numbers, use scientific notation if needed
    if (Math.abs(value) < 0.001 && value !== 0) {
      return value.toExponential(2);
    }
    if (Math.abs(value) > 1e9) {
      return value.toExponential(2);
    }
    return formatNumberWithCommas(value);
  };

  const getError = (fieldName) => {
    return errors[`${effectIndex}-${fieldName}`];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Cost per Microprobability */}
        <div>
          <label
            htmlFor={`effect-${effectIndex}-costPerMicroprobability`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Cost per Microprobability
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              id={`effect-${effectIndex}-costPerMicroprobability`}
              type="text"
              value={formatValue(effect.costPerMicroprobability)}
              onChange={(e) => handleInputChange('costPerMicroprobability', e.target.value)}
              className={`w-full pl-6 pr-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
                getError('costPerMicroprobability')
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="0"
            />
          </div>
          {getError('costPerMicroprobability') && (
            <p className="mt-1 text-xs text-red-600">{getError('costPerMicroprobability')}</p>
          )}
        </div>

        {/* Population Fraction Affected */}
        <div>
          <label
            htmlFor={`effect-${effectIndex}-populationFractionAffected`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Population Fraction Affected (0-1)
          </label>
          <input
            id={`effect-${effectIndex}-populationFractionAffected`}
            type="text"
            value={formatValue(effect.populationFractionAffected)}
            onChange={(e) => handleInputChange('populationFractionAffected', e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
              getError('populationFractionAffected')
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="1"
          />
          {getError('populationFractionAffected') && (
            <p className="mt-1 text-xs text-red-600">{getError('populationFractionAffected')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* QALY Improvement per Year */}
        <div>
          <label
            htmlFor={`effect-${effectIndex}-qalyImprovementPerYear`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            QALY Improvement/Year
          </label>
          <input
            id={`effect-${effectIndex}-qalyImprovementPerYear`}
            type="text"
            value={formatValue(effect.qalyImprovementPerYear)}
            onChange={(e) => handleInputChange('qalyImprovementPerYear', e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
              getError('qalyImprovementPerYear')
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="1"
          />
          {getError('qalyImprovementPerYear') && (
            <p className="mt-1 text-xs text-red-600">{getError('qalyImprovementPerYear')}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor={`effect-${effectIndex}-startTime`} className="block text-xs font-medium text-gray-700 mb-1">
            Start Time (years)
          </label>
          <input
            id={`effect-${effectIndex}-startTime`}
            type="text"
            value={formatValue(effect.startTime)}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
              getError('startTime')
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="0"
          />
          {getError('startTime') && <p className="mt-1 text-xs text-red-600">{getError('startTime')}</p>}
        </div>

        {/* Window Length */}
        <div>
          <label
            htmlFor={`effect-${effectIndex}-windowLength`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Window Length (years)
          </label>
          <input
            id={`effect-${effectIndex}-windowLength`}
            type="text"
            value={formatValue(effect.windowLength)}
            onChange={(e) => handleInputChange('windowLength', e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:outline-none ${
              getError('windowLength')
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            placeholder="0"
          />
          {getError('windowLength') && <p className="mt-1 text-xs text-red-600">{getError('windowLength')}</p>}
        </div>
      </div>
    </div>
  );
};

PopulationEffectInputs.propTypes = {
  effect: PropTypes.shape({
    costPerMicroprobability: PropTypes.number,
    populationFractionAffected: PropTypes.number,
    qalyImprovementPerYear: PropTypes.number,
    startTime: PropTypes.number,
    windowLength: PropTypes.number,
  }).isRequired,
  effectIndex: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PopulationEffectInputs;
