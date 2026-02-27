import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import DisableToggleButton from '../shared/DisableToggleButton';
import InfoTooltipIcon from '../shared/InfoTooltipIcon';
import {
  calculateEffectCostPerLife,
  cleanEffectsForSave,
  haveEffectsChanged,
  sortEffectsByActiveDate,
} from '../../utils/effectEditorUtils';
import { calculateCombinedCostPerLife } from '../../utils/effectsCalculation';
import { getEffectType, validateEffectField, validateEffects } from '../../utils/effectValidation';
import { useAssumptions } from '../../contexts/AssumptionsContext';
import { mergeEffects } from '../../utils/assumptionsDataHelpers';
import { getCurrentYear } from '../../utils/donationDataHelpers';
import YearSelector from '../shared/YearSelector';

/**
 * Component for editing all effects of a category
 */

const CategoryEffectEditor = ({ category, categoryId, globalParameters, onSave, onCancel }) => {
  const [tempEditToEffects, setTempEditToEffects] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewYear, setPreviewYear] = useState(getCurrentYear());
  const { defaultAssumptions, userAssumptions } = useAssumptions();

  // Get default effects for comparison
  const defaultEffects = useMemo(() => {
    if (!defaultAssumptions?.categories?.[categoryId]?.effects) {
      return [];
    }
    return defaultAssumptions.categories[categoryId].effects;
  }, [defaultAssumptions, categoryId]);

  const baselineEffects = useMemo(() => {
    if (!category?.effects) {
      return [];
    }

    const userEffects = userAssumptions?.categories?.[categoryId]?.effects;
    const mergedEffects = mergeEffects(category.effects, userEffects);
    return sortEffectsByActiveDate(mergedEffects);
  }, [category, categoryId, userAssumptions]);

  // Initialize temp effects from category with user overrides if they exist
  useEffect(() => {
    setTempEditToEffects(baselineEffects);
  }, [baselineEffects]);

  // Validate all effects on mount and when effects change
  useEffect(() => {
    if (tempEditToEffects.length > 0) {
      const validation = validateEffects(tempEditToEffects);
      setErrors(validation.errors);
    }
  }, [tempEditToEffects]);

  // Update a specific field of an effect
  const updateEffectField = (effectIndex, fieldName, value) => {
    // Store the value as-is (string with formatting)
    // The validation will clean it when checking
    setTempEditToEffects((prev) => {
      const newEffects = [...prev];
      newEffects[effectIndex] = {
        ...newEffects[effectIndex],
        [fieldName]: value,
      };
      return newEffects;
    });

    // Validate this field immediately
    const effect = { ...tempEditToEffects[effectIndex], [fieldName]: value };
    const effectType = getEffectType(effect);
    const error = validateEffectField(fieldName, value, effectType);
    const errorKey = `${effectIndex}-${fieldName}`;

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

  // Toggle disabled state for an effect
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

  // Calculate cost per life for each effect
  const effectCostPerLife = useMemo(() => {
    // Use current year if previewYear is empty or invalid
    const yearForCalculation = previewYear === '' || isNaN(previewYear) ? getCurrentYear() : previewYear;
    return tempEditToEffects.map((effect) => calculateEffectCostPerLife(effect, globalParameters, yearForCalculation));
  }, [tempEditToEffects, globalParameters, previewYear]);

  // Calculate combined cost per life
  const combinedCostPerLife = useMemo(() => {
    return calculateCombinedCostPerLife(effectCostPerLife);
  }, [effectCostPerLife]);

  // Check if any effects have time intervals
  const hasTimeIntervals = useMemo(() => {
    return tempEditToEffects.some(
      (effect) =>
        effect.validTimeInterval && (effect.validTimeInterval[0] !== null || effect.validTimeInterval[1] !== null)
    );
  }, [tempEditToEffects]);

  // Check if there are any validation errors
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const hasUnsavedChanges = useMemo(() => {
    return haveEffectsChanged(tempEditToEffects, baselineEffects);
  }, [tempEditToEffects, baselineEffects]);

  // Handle save
  const handleSave = () => {
    if (!hasUnsavedChanges) {
      return;
    }

    try {
      const cleanedEffects = cleanEffectsForSave(tempEditToEffects);

      // Re-validate all effects before saving
      const validation = validateEffects(cleanedEffects);
      if (validation.isValid) {
        onSave(cleanedEffects);
      } else {
        setErrors(validation.errors);
      }
    } catch (error) {
      console.error('Error cleaning effects for save:', error);
      // Fail hard and loud - throw the error to prevent silent failures
      throw error;
    }
  };

  if (!category) return null;

  return (
    <div className="assumptions-shell assumptions-shell--editor overflow-hidden">
      <EffectEditorHeader
        title={
          <>
            Edit effects for category
            <InfoTooltipIcon
              className="effect-editor-help"
              content="See the FAQ to learn how to edit these assumptions, and for a description of what effects are."
            />{' '}
            :{' '}
            <Link to={`/category/${categoryId}`} className="assumptions-link">
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
                id="category-effect-preview-year"
                className=""
              />
            </div>
          ) : null
        }
        combinedCostPerLife={tempEditToEffects.length > 1 ? combinedCostPerLife : undefined}
        showCombinedCost={tempEditToEffects.length > 1}
      />

      {/* Effects List */}
      <div className="px-3 py-3">
        <div className="space-y-3">
          {tempEditToEffects.map((effect, index) => {
            const effectType = getEffectType(effect);
            const costPerLife = effectCostPerLife[index];

            return (
              <div key={index} className="effect-card effect-card--section transition-all duration-200">
                <div className="mb-2">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`effect-card__title ${effect.disabled ? 'effect-disabled' : ''}`}>
                        Effect {index + 1}: {effect.effectId}
                      </h4>
                      <DisableToggleButton
                        isDisabled={effect.disabled || false}
                        onToggle={() => toggleEffectDisabled(index)}
                      />
                    </div>
                    <div className={effect.disabled ? 'effect-disabled' : ''}>
                      <EffectCostDisplay cost={costPerLife} showInfinity={true} className="text-sm whitespace-nowrap" />
                    </div>
                  </div>
                  {effect.validTimeInterval && (
                    <p className={`effect-card__meta mt-1 ${effect.disabled ? 'effect-disabled' : ''}`}>
                      Active:{' '}
                      {effect.validTimeInterval[0] === null
                        ? `Until ${effect.validTimeInterval[1]}`
                        : `${effect.validTimeInterval[0]} - ${effect.validTimeInterval[1] || 'present'}`}
                      {(previewYear < effect.validTimeInterval[0] ||
                        (effect.validTimeInterval[1] && previewYear > effect.validTimeInterval[1])) && (
                        <span className="effect-card__meta--inactive ml-2">(Not active in {previewYear})</span>
                      )}
                    </p>
                  )}
                </div>

                <div className={effect.disabled ? 'effect-disabled-content' : ''}>
                  {effectType === 'qaly' ? (
                    <QalyEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                      globalParameters={globalParameters}
                      isDisabled={effect.disabled || false}
                    />
                  ) : effectType === 'population' ? (
                    <PopulationEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                      globalParameters={globalParameters}
                      isDisabled={effect.disabled || false}
                    />
                  ) : (
                    <div className="text-sm text-[var(--danger)]">Unknown effect type</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} disabled={!hasUnsavedChanges} />
    </div>
  );
};

CategoryEffectEditor.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    effects: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  categoryId: PropTypes.string.isRequired,
  globalParameters: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CategoryEffectEditor;
