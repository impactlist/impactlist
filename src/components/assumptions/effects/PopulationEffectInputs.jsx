import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../shared/FormField';
import TimeLimitMessage from '../../shared/TimeLimitMessage';

/**
 * Input fields for population-based effects
 */
const PopulationEffectInputs = ({ effect, effectIndex, defaultEffect, errors, onChange, globalParameters }) => {
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
          description="Cost to change the probability of an event happening by one in a million."
          value={effect.costPerMicroprobability}
          defaultValue={defaultEffect?.costPerMicroprobability}
          onChange={handleChange('costPerMicroprobability')}
          error={getError('costPerMicroprobability')}
          prefix="$"
        />

        <FormField
          id={`effect-${effectIndex}-populationFractionAffected`}
          label="Population fraction affected"
          description="Fraction (0-1) of the population affected if the event happens. For instance if the event is a pandemic that kills 10% of the population, the population fraction affected is 0.1."
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
          description="Quality-adjusted life years gained or lost per person per year if the event happens. For instance if the event kills everyone it affects, the life-year improvement per year is -1 (each person loses one life-year per year after they die)."
          value={effect.qalyImprovementPerYear}
          defaultValue={defaultEffect?.qalyImprovementPerYear}
          onChange={handleChange('qalyImprovementPerYear')}
          error={getError('qalyImprovementPerYear')}
        />

        <FormField
          id={`effect-${effectIndex}-startTime`}
          label="Start time (years)"
          description="Number of years after the intervention starts until the event is expected to happen, if it happens."
          value={effect.startTime}
          defaultValue={defaultEffect?.startTime}
          onChange={handleChange('startTime')}
          error={getError('startTime')}
        />

        <div className="flex flex-col">
          <FormField
            id={`effect-${effectIndex}-windowLength`}
            label="Window length (years)"
            description="Duration of the effect of the event, if it happens."
            value={effect.windowLength}
            defaultValue={defaultEffect?.windowLength}
            onChange={handleChange('windowLength')}
            error={getError('windowLength')}
          />
          <TimeLimitMessage
            startTime={effect.startTime}
            windowLength={effect.windowLength}
            timeLimit={globalParameters?.timeLimit}
          />
        </div>
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
  globalParameters: PropTypes.object,
};

export default PopulationEffectInputs;
