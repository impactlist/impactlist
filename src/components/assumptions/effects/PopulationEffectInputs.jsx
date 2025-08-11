import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../shared/FormField';

/**
 * Input fields for population-based effects
 */
const PopulationEffectInputs = ({ effect, effectIndex, defaultEffect, errors, onChange }) => {
  const handleChange = (fieldName) => (value) => {
    onChange(effectIndex, fieldName, value);
  };

  const getError = (fieldName) => {
    return errors[`${effectIndex}-${fieldName}`];
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          id={`effect-${effectIndex}-costPerMicroprobability`}
          label="Cost per microprobability"
          description="Cost to change the probability of an event happening by one in a million"
          value={effect.costPerMicroprobability}
          defaultValue={defaultEffect?.costPerMicroprobability}
          onChange={handleChange('costPerMicroprobability')}
          error={getError('costPerMicroprobability')}
          prefix="$"
        />

        <FormField
          id={`effect-${effectIndex}-populationFractionAffected`}
          label="Population fraction affected"
          description="Fraction of the population affected (0-1)"
          value={effect.populationFractionAffected}
          defaultValue={defaultEffect?.populationFractionAffected}
          onChange={handleChange('populationFractionAffected')}
          error={getError('populationFractionAffected')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FormField
          id={`effect-${effectIndex}-qalyImprovementPerYear`}
          label="Life-year improvement/year"
          description="Quality-adjusted life years improved per person per year"
          value={effect.qalyImprovementPerYear}
          defaultValue={defaultEffect?.qalyImprovementPerYear}
          onChange={handleChange('qalyImprovementPerYear')}
          error={getError('qalyImprovementPerYear')}
        />

        <FormField
          id={`effect-${effectIndex}-startTime`}
          label="Start time (years)"
          description="When the effect starts relative to the intervention"
          value={effect.startTime}
          defaultValue={defaultEffect?.startTime}
          onChange={handleChange('startTime')}
          error={getError('startTime')}
        />

        <FormField
          id={`effect-${effectIndex}-windowLength`}
          label="Window length (years)"
          description="Duration of the effect window"
          value={effect.windowLength}
          defaultValue={defaultEffect?.windowLength}
          onChange={handleChange('windowLength')}
          error={getError('windowLength')}
        />
      </div>
    </div>
  );
};

PopulationEffectInputs.propTypes = {
  effect: PropTypes.shape({
    costPerMicroprobability: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    populationFractionAffected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    qalyImprovementPerYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    windowLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  effectIndex: PropTypes.number.isRequired,
  defaultEffect: PropTypes.shape({
    costPerMicroprobability: PropTypes.number,
    populationFractionAffected: PropTypes.number,
    qalyImprovementPerYear: PropTypes.number,
    startTime: PropTypes.number,
    windowLength: PropTypes.number,
  }),
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PopulationEffectInputs;
