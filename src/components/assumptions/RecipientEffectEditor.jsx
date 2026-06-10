import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import EffectEditorActionButtons from '../shared/EffectEditorActionButtons';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import RecipientEffectCard from './RecipientEffectCard';
import useRecipientEffectsDraft from '../../hooks/useRecipientEffectsDraft';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import { buildCausePath } from '../../utils/causeRoutes';
import YearSelector from '../shared/YearSelector';

/**
 * Component for editing all effects of a recipient's category
 */
const RecipientEffectEditor = ({
  recipient,
  recipientId,
  category,
  categoryId,
  globalParameters,
  onSave,
  onCancel,
}) => {
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
  const { defaultAssumptions, userAssumptions } = useAssumptions();

  const {
    effects,
    errors,
    hasErrors,
    hasUnsavedChanges,
    hasTimeIntervals,
    effectCostPerLife,
    combinedCostPerLife,
    effectInputSources,
    toggleEffectDisabled,
    updateEffectField,
    getEffectsToSave,
  } = useRecipientEffectsDraft({
    recipientId,
    categoryId,
    category,
    globalParameters,
    previewYear,
    defaultAssumptions,
    userAssumptions,
  });

  const handleSave = () => {
    if (hasErrors || !hasUnsavedChanges) {
      return;
    }
    onSave(getEffectsToSave());
  };

  const showHeaderActions = effects.length > 1;
  const headerActions = showHeaderActions ? (
    <EffectEditorActionButtons
      onSave={handleSave}
      onCancel={onCancel}
      isSaveDisabled={hasErrors || !hasUnsavedChanges}
      compact={true}
    />
  ) : null;

  return (
    <div className="assumptions-shell assumptions-shell--editor overflow-hidden">
      <EffectEditorHeader
        title={
          <>
            Edit effects for recipient
            <InfoTooltipIcon
              className="effect-editor-help"
              content="See the FAQ to learn how to edit these assumptions, and for a description of what effects are."
            />{' '}
            :{' '}
            <Link to={`/recipient/${recipientId}`} className="assumptions-link">
              {recipient.name}
            </Link>
            {' - '}
            <Link to={buildCausePath(categoryId)} className="assumptions-link">
              {category.name}
            </Link>
          </>
        }
        description={
          effects.length > 1 && hasTimeIntervals ? (
            <div className="flex items-center gap-2">
              <YearSelector
                value={previewYear}
                onChange={setPreviewYear}
                label="Preview calculations for year:"
                id="recipient-effect-preview-year"
                className=""
              />
            </div>
          ) : null
        }
        combinedCostPerLife={showHeaderActions ? combinedCostPerLife : undefined}
        showCombinedCost={showHeaderActions}
        headerActions={headerActions}
      />

      {/* Effects List */}
      <div className="px-3 py-2">
        <div className="space-y-3">
          {effects.map((effect, index) => (
            <RecipientEffectCard
              key={effect.effectId}
              effect={effect}
              index={index}
              costPerLife={effectCostPerLife[index]}
              sources={effectInputSources[index]}
              errors={errors}
              onChange={updateEffectField}
              onToggleDisabled={() => toggleEffectDisabled(index)}
              globalParameters={globalParameters}
              previewYear={previewYear}
              headingLevel="h3"
            />
          ))}
        </div>
      </div>

      <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} disabled={!hasUnsavedChanges} />
    </div>
  );
};

RecipientEffectEditor.propTypes = {
  recipient: PropTypes.object.isRequired,
  recipientId: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RecipientEffectEditor;
