import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../shared/FormField';
import TimeLimitMessage from '../../shared/TimeLimitMessage';
import { getEffectTooltip } from '../../../constants/effectTooltips';

/**
 * Input fields for QALY-based effects
 */
const QalyEffectInputs = ({ effect, effectIndex, defaultEffect, errors, onChange, globalParameters, isDisabled }) => {
  const handleChange = (fieldName) => (value) => {
    onChange(effectIndex, fieldName, value);
  };

  const getError = (fieldName) => {
    return errors[`${effectIndex}-${fieldName}`];
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <FormField
        id={`effect-${effectIndex}-costPerQALY`}
        label="Cost per life-year"
        description={getEffectTooltip('qaly', 'costPerQALY')}
        value={effect.costPerQALY}
        defaultValue={defaultEffect?.costPerQALY}
        onChange={handleChange('costPerQALY')}
        error={getError('costPerQALY')}
        prefix="$"
        disabled={isDisabled}
      />

      <FormField
        id={`effect-${effectIndex}-startTime`}
        label="Start Time (years)"
        description={getEffectTooltip('qaly', 'startTime')}
        value={effect.startTime}
        defaultValue={defaultEffect?.startTime}
        onChange={handleChange('startTime')}
        error={getError('startTime')}
        disabled={isDisabled}
      />

      <div className="flex flex-col">
        <FormField
          id={`effect-${effectIndex}-windowLength`}
          label="Duration (years)"
          description={getEffectTooltip('qaly', 'windowLength')}
          value={effect.windowLength}
          defaultValue={defaultEffect?.windowLength}
          onChange={handleChange('windowLength')}
          error={getError('windowLength')}
          disabled={isDisabled}
        />
        <TimeLimitMessage
          startTime={effect.startTime}
          windowLength={effect.windowLength}
          timeLimit={globalParameters?.timeLimit}
        />
      </div>
    </div>
  );
};

QalyEffectInputs.propTypes = {
  effect: PropTypes.shape({
    costPerQALY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    windowLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  effectIndex: PropTypes.number.isRequired,
  defaultEffect: PropTypes.shape({
    costPerQALY: PropTypes.number,
    startTime: PropTypes.number,
    windowLength: PropTypes.number,
  }),
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  globalParameters: PropTypes.object,
  isDisabled: PropTypes.bool,
};

export default QalyEffectInputs;
