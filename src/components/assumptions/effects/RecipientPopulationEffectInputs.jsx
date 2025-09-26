import React from 'react';
import BaseRecipientEffectInputs from './BaseRecipientEffectInputs';
import { POPULATION_EFFECT_FIELDS } from '../../../constants/effectFieldDefinitions';

/**
 * Component for editing population effect overrides/multipliers for recipients
 * Wrapper around BaseRecipientEffectInputs with population-specific fields
 */
const RecipientPopulationEffectInputs = (props) => {
  return <BaseRecipientEffectInputs {...props} fields={POPULATION_EFFECT_FIELDS} />;
};

export default RecipientPopulationEffectInputs;
