import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RecipientQalyEffectInputs from './effects/RecipientQalyEffectInputs';
import RecipientPopulationEffectInputs from './effects/RecipientPopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import DisableToggleButton from '../shared/DisableToggleButton';
import { applyRecipientEffectToBase, calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import {
  buildRecipientEditableEffects,
  calculateEffectCostPerLife,
  getRecipientEffectsChangeState,
  haveEffectsChanged,
  initializeRecipientFieldModes,
} from '../../utils/effectEditorUtils';
import { formatCurrency } from '../../utils/formatters';
import { getEffectType, validateRecipientEffectField } from '../../utils/effectValidation';
import { getEffectFieldNames } from '../../constants/effectFieldDefinitions';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { getCurrentYear } from '../../utils/donationDataHelpers';
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
  const [tempEditToEffects, setTempEditToEffects] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
  const [fieldModes, setFieldModes] = useState({});
  const { defaultAssumptions, userAssumptions } = useAssumptions();

  // Get default effects for this recipient category
  const defaultRecipientEffects = useMemo(() => {
    if (!defaultAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects) {
      return [];
    }
    return defaultAssumptions.recipients[recipientId].categories[categoryId].effects;
  }, [defaultAssumptions, recipientId, categoryId]);

  // Get base category effects for reference
  const baseCategoryEffects = useMemo(() => {
    if (!category?.effects) {
      return [];
    }
    return category.effects;
  }, [category]);

  const baselineEffects = useMemo(() => {
    const userRecipientEffects = userAssumptions?.recipients?.[recipientId]?.categories?.[categoryId]?.effects;
    return buildRecipientEditableEffects({
      baseCategoryEffects,
      defaultRecipientEffects,
      userRecipientEffects,
    });
  }, [baseCategoryEffects, defaultRecipientEffects, userAssumptions, recipientId, categoryId]);

  // Initialize temp effects from recipient's current effects
  useEffect(() => {
    setTempEditToEffects(baselineEffects);
    setFieldModes(initializeRecipientFieldModes(baselineEffects));
  }, [baselineEffects]);

  // Toggle disabled state for a recipient effect
  const toggleEffectDisabled = (effectIndex) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      newEffects[effectIndex] = {
        ...newEffects[effectIndex],
        disabled: !newEffects[effectIndex].disabled,
      };
      return newEffects;
    });
  };

  // Handle mode change for a field
  const handleModeChange = (effectIndex, fieldName, newMode) => {
    const modeKey = `${effectIndex}-${fieldName}`;
    setFieldModes((prev) => ({
      ...prev,
      [modeKey]: newMode,
    }));
  };

  // Update a specific field of an effect
  const updateEffectField = (effectIndex, fieldName, type, value) => {
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      const effect = { ...newEffects[effectIndex] };

      // Initialize objects if needed
      if (!effect.overrides) effect.overrides = {};
      if (!effect.multipliers) effect.multipliers = {};

      if (type === 'override') {
        effect.overrides = { ...effect.overrides, [fieldName]: value };
      } else if (type === 'multiplier') {
        effect.multipliers = { ...effect.multipliers, [fieldName]: value };
      }

      // Clean up empty values
      if (value === '' || value === null || value === undefined) {
        if (type === 'override') {
          delete effect.overrides[fieldName];
        } else {
          delete effect.multipliers[fieldName];
        }
      }

      newEffects[effectIndex] = effect;
      return newEffects;
    });

    // Validate this field immediately
    const error = validateRecipientEffectField(
      fieldName,
      value,
      type,
      getEffectType(tempEditToEffects[effectIndex]._baseEffect)
    );
    const errorKey = `${effectIndex}-${fieldName}-${type}`;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
      return newErrors;
    });
  };

  // Calculate cost per life for each effect
  const effectCostPerLife = useMemo(() => {
    // Use current year if previewYear is empty or invalid
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect, effectIndex) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      // Check if effect is disabled at either category or recipient level
      if (baseEffect.disabled || effect.disabled) {
        return Infinity;
      }

      // Build a clean effect to apply based on selected modes
      const effectToApply = {
        effectId: effect.effectId,
        overrides: {},
        multipliers: {},
      };

      const fieldNames = getEffectFieldNames(baseEffect);
      fieldNames.forEach((fieldName) => {
        const modeKey = `${effectIndex}-${fieldName}`;
        const selectedMode = fieldModes[modeKey] || 'override';

        if (selectedMode === 'override') {
          const value = effect.overrides?.[fieldName];
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.overrides[fieldName] = value;
          } else {
            // If override is empty, check for a default recipient value
            const defaultValue = effect._defaultRecipientEffect?.overrides?.[fieldName];
            if (defaultValue !== '' && defaultValue !== null && defaultValue !== undefined) {
              effectToApply.overrides[fieldName] = defaultValue;
            }
          }
        } else if (selectedMode === 'multiplier') {
          const value = effect.multipliers?.[fieldName];
          if (value !== '' && value !== null && value !== undefined) {
            effectToApply.multipliers[fieldName] = value;
          } else {
            // If multiplier is empty, check for a default recipient value
            const defaultValue = effect._defaultRecipientEffect?.multipliers?.[fieldName];
            if (defaultValue !== '' && defaultValue !== null && defaultValue !== undefined) {
              effectToApply.multipliers[fieldName] = defaultValue;
            }
          }
        }
      });

      // Create modified effect with overrides/multipliers applied
      const modifiedEffect = applyRecipientEffectToBase(baseEffect, effectToApply, `effect ${effect.effectId}`);
      return calculateEffectCostPerLife(modifiedEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear, fieldModes]);

  // Calculate base cost per life for each effect (without recipient-specific overrides)
  const baseEffectCostPerLife = useMemo(() => {
    // Use current year if previewYear is empty or invalid
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;

    return tempEditToEffects.map((effect) => {
      const baseEffect = effect._baseEffect;
      if (!baseEffect) return Infinity;

      // Calculate cost using only the base category effect
      return calculateEffectCostPerLife(baseEffect, globalParameters, yearForCalculation);
    });
  }, [tempEditToEffects, globalParameters, previewYear]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Check if any base effects have time intervals
  const hasTimeIntervals = useMemo(() => {
    return tempEditToEffects.some((effect) => {
      const baseEffect = effect._baseEffect;
      return (
        baseEffect?.validTimeInterval &&
        (baseEffect.validTimeInterval[0] !== null || baseEffect.validTimeInterval[1] !== null)
      );
    });
  }, [tempEditToEffects]);

  // Check if there are any errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const hasUnsavedChanges = useMemo(() => {
    return haveEffectsChanged(tempEditToEffects, baselineEffects);
  }, [tempEditToEffects, baselineEffects]);

  // Handle save
  const handleSave = () => {
    if (hasErrors) {
      return;
    }

    if (!hasUnsavedChanges) {
      return;
    }

    const { effectsToSave } = getRecipientEffectsChangeState(tempEditToEffects, fieldModes);
    onSave(effectsToSave);
  };

  return (
    <div className="p-2">
      <div className="bg-white">
        <EffectEditorHeader
          title={
            <>
              Edit effects for recipient
              <span className="group align-middle">
                <span className="text-sm text-slate-500 cursor-help ml-1 align-top">ⓘ</span>
                <span className="invisible group-hover:visible absolute left-6 z-50 p-2 mt-1 w-72 max-w-[calc(100%-3rem)] text-xs font-normal text-white bg-slate-800 rounded-lg shadow-lg">
                  See the FAQ to learn how to edit these assumptions, and for a description of what effects are.
                </span>
              </span>{' '}
              :{' '}
              <Link to={`/recipient/${recipientId}`} className="text-blue-600 hover:underline">
                {recipient.name}
              </Link>
              {' - '}
              <Link to={`/category/${categoryId}`} className="text-blue-600 hover:underline">
                {category.name}
              </Link>
            </>
          }
          description={
            tempEditToEffects.length > 1 && hasTimeIntervals ? (
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
          combinedCostPerLife={combinedCostPerLife}
          showCombinedCost={false}
        />

        {/* Effects List */}
        <div className="px-6 py-4">
          {/* Cost per life display - only show when there are multiple effects */}
          {tempEditToEffects.length > 1 && (
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-lg font-medium text-slate-800">
                Combined cost per life:{' '}
                <span
                  className={
                    combinedCostPerLife === Infinity || combinedCostPerLife < 0 ? 'text-red-600' : 'text-emerald-600'
                  }
                >
                  ${combinedCostPerLife === Infinity ? '∞' : formatCurrency(combinedCostPerLife).replace('$', '')}
                </span>
              </div>
            </div>
          )}

          {/* Effects */}
          <div className="space-y-4">
            {tempEditToEffects.map((effect, index) => {
              const baseEffect = effect._baseEffect;
              const effectType = getEffectType(baseEffect);
              const costPerLife = effectCostPerLife[index];
              const baseCost = baseEffectCostPerLife[index];

              // Get all the different effect sources for the input components
              const defaultRecipientEffect = defaultRecipientEffects.find((e) => e.effectId === effect.effectId);
              const defaultCategoryEffect = defaultAssumptions?.categories?.[categoryId]?.effects?.find(
                (e) => e.effectId === effect.effectId
              );
              const userCategoryEffect = userAssumptions?.categories?.[categoryId]?.effects?.find(
                (e) => e.effectId === effect.effectId
              );

              const isDisabledByCategory = baseEffect?.disabled || false;
              const isDisabledByRecipient = effect.disabled || false;
              const isFullyDisabled = isDisabledByCategory || isDisabledByRecipient;

              return (
                <div
                  key={effect.effectId}
                  className="rounded-xl p-4 border border-slate-200 bg-slate-50 transition-all duration-200"
                >
                  <div className="mb-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-base font-medium text-slate-800 whitespace-nowrap ${isFullyDisabled ? 'grayscale opacity-60' : ''}`}
                        >
                          Effect {index + 1}: {effect.effectId}
                        </h4>
                        {!isDisabledByCategory && (
                          <DisableToggleButton
                            isDisabled={isDisabledByRecipient}
                            onToggle={() => toggleEffectDisabled(index)}
                          />
                        )}
                        {isDisabledByCategory && (
                          <span className="text-xs text-slate-500 grayscale opacity-60">(Disabled in category)</span>
                        )}
                      </div>
                      <div className={isFullyDisabled ? 'grayscale opacity-60' : ''}>
                        <EffectCostDisplay
                          cost={costPerLife}
                          baseCost={baseCost}
                          showInfinity={true}
                          className="text-sm whitespace-nowrap"
                        />
                      </div>
                    </div>
                    {baseEffect?.validTimeInterval && (
                      <p className={`text-xs text-slate-500 mt-1 ${isFullyDisabled ? 'grayscale opacity-60' : ''}`}>
                        Active:{' '}
                        {baseEffect.validTimeInterval[0] === null
                          ? `Until ${baseEffect.validTimeInterval[1]}`
                          : `${baseEffect.validTimeInterval[0]} - ${baseEffect.validTimeInterval[1] || 'present'}`}
                        {(previewYear < baseEffect.validTimeInterval[0] ||
                          (baseEffect.validTimeInterval[1] && previewYear > baseEffect.validTimeInterval[1])) && (
                          <span className="ml-2 text-orange-600">(Not active in {previewYear})</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className={isFullyDisabled ? 'pointer-events-none grayscale opacity-60' : ''}>
                    {effectType === 'qaly' ? (
                      <RecipientQalyEffectInputs
                        effectIndex={index}
                        defaultCategoryEffect={defaultCategoryEffect}
                        userCategoryEffect={userCategoryEffect}
                        defaultRecipientEffect={defaultRecipientEffect}
                        errors={errors}
                        overrides={effect.overrides}
                        multipliers={effect.multipliers}
                        onChange={updateEffectField}
                        onModeChange={handleModeChange}
                        fieldModes={fieldModes}
                        globalParameters={globalParameters}
                        isDisabled={isFullyDisabled}
                      />
                    ) : effectType === 'population' ? (
                      <RecipientPopulationEffectInputs
                        effectIndex={index}
                        defaultCategoryEffect={defaultCategoryEffect}
                        userCategoryEffect={userCategoryEffect}
                        defaultRecipientEffect={defaultRecipientEffect}
                        errors={errors}
                        overrides={effect.overrides}
                        multipliers={effect.multipliers}
                        onChange={updateEffectField}
                        onModeChange={handleModeChange}
                        fieldModes={fieldModes}
                        globalParameters={globalParameters}
                        isDisabled={isFullyDisabled}
                      />
                    ) : (
                      <div className="text-sm text-red-600">Unknown effect type</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <EffectEditorFooter
          onSave={handleSave}
          onCancel={onCancel}
          hasErrors={hasErrors}
          disabled={!hasUnsavedChanges}
        />
      </div>
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
