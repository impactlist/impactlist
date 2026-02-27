import React from 'react';
import PropTypes from 'prop-types';
import PopulationEffectInputs from './PopulationEffectInputs';
import { POPULATION_EFFECT_FIELDS } from '../../../constants/effectFieldDefinitions';
import { useRecipientEffectAdapter } from '../../../hooks/useRecipientEffectAdapter';

/**
 * Recipient wrapper that reuses the category population input layout/styles.
 * Recipient edits are override-only in the UI, but existing multiplier data is still
 * resolved into effective values for display/backward compatibility.
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
  isDisabled,
}) => {
  const { effect, defaultEffect, normalizedErrors } = useRecipientEffectAdapter({
    fieldDefinitions: POPULATION_EFFECT_FIELDS,
    effectIndex,
    defaultCategoryEffect,
    userCategoryEffect,
    defaultRecipientEffect,
    errors,
    overrides,
    multipliers,
  });

  return (
    <PopulationEffectInputs
      effect={effect}
      effectIndex={effectIndex}
      defaultEffect={defaultEffect}
      errors={normalizedErrors}
      onChange={onChange}
      globalParameters={globalParameters}
      isDisabled={isDisabled}
    />
  );
};

RecipientPopulationEffectInputs.propTypes = {
  effectIndex: PropTypes.number.isRequired,
  defaultCategoryEffect: PropTypes.object,
  userCategoryEffect: PropTypes.object,
  defaultRecipientEffect: PropTypes.object,
  errors: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  multipliers: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  globalParameters: PropTypes.object,
  isDisabled: PropTypes.bool,
};

export default RecipientPopulationEffectInputs;
