import React from 'react';
import BaseRecipientEffectInputs from './BaseRecipientEffectInputs';
import { QALY_EFFECT_FIELDS } from '../../../constants/effectFieldDefinitions';

/**
 * Component for editing QALY effect overrides/multipliers for recipients
 * Wrapper around BaseRecipientEffectInputs with QALY-specific fields
 */
const RecipientQalyEffectInputs = (props) => {
  return <BaseRecipientEffectInputs {...props} fields={QALY_EFFECT_FIELDS} />;
};

export default RecipientQalyEffectInputs;
