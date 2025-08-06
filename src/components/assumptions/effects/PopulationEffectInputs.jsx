import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from '../../shared/NumericInput';

/**
 * Input fields for population-based effects
 */
const PopulationEffectInputs = ({ effect, effectIndex, errors, onChange }) => {
  const handleChange = (fieldName, value) => {
    onChange(effectIndex, fieldName, value);
  };

  const getError = (fieldName) => {
    return errors[`${effectIndex}-${fieldName}`];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Cost per Microprobability */}
        <NumericInput
          id={`effect-${effectIndex}-costPerMicroprobability`}
          label="Cost per Microprobability"
          value={effect.costPerMicroprobability}
          onChange={(value) => handleChange('costPerMicroprobability', value)}
          error={getError('costPerMicroprobability')}
          placeholder="0"
          prefix="$"
        />

        {/* Population Fraction Affected */}
        <NumericInput
          id={`effect-${effectIndex}-populationFractionAffected`}
          label="Population Fraction Affected (0-1)"
          value={effect.populationFractionAffected}
          onChange={(value) => handleChange('populationFractionAffected', value)}
          error={getError('populationFractionAffected')}
          placeholder="1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* QALY Improvement per Year */}
        <NumericInput
          id={`effect-${effectIndex}-qalyImprovementPerYear`}
          label="QALY Improvement/Year"
          value={effect.qalyImprovementPerYear}
          onChange={(value) => handleChange('qalyImprovementPerYear', value)}
          error={getError('qalyImprovementPerYear')}
          placeholder="1"
        />

        {/* Start Time */}
        <NumericInput
          id={`effect-${effectIndex}-startTime`}
          label="Start Time (years)"
          value={effect.startTime}
          onChange={(value) => handleChange('startTime', value)}
          error={getError('startTime')}
          placeholder="0"
        />

        {/* Window Length */}
        <NumericInput
          id={`effect-${effectIndex}-windowLength`}
          label="Window Length (years)"
          value={effect.windowLength}
          onChange={(value) => handleChange('windowLength', value)}
          error={getError('windowLength')}
          placeholder="0"
        />
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
