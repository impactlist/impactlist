import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from '../../shared/NumericInput';

/**
 * Input fields for QALY-based effects
 */
const QalyEffectInputs = ({ effect, effectIndex, errors, onChange }) => {
  const handleChange = (fieldName, value) => {
    onChange(effectIndex, fieldName, value);
  };

  const getError = (fieldName) => {
    return errors[`${effectIndex}-${fieldName}`];
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Cost per QALY */}
      <NumericInput
        id={`effect-${effectIndex}-costPerQALY`}
        label="Cost per QALY"
        value={effect.costPerQALY}
        onChange={(value) => handleChange('costPerQALY', value)}
        error={getError('costPerQALY')}
        placeholder="0"
        prefix="$"
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
  );
};

QalyEffectInputs.propTypes = {
  effect: PropTypes.shape({
    costPerQALY: PropTypes.number,
    startTime: PropTypes.number,
    windowLength: PropTypes.number,
  }).isRequired,
  effectIndex: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default QalyEffectInputs;
