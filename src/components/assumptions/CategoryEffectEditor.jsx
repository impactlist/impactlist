import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import QalyEffectInputs from './effects/QalyEffectInputs';
import PopulationEffectInputs from './effects/PopulationEffectInputs';
import EffectCostDisplay from '../shared/EffectCostDisplay';
import EffectEditorHeader from '../shared/EffectEditorHeader';
import EffectEditorFooter from '../shared/EffectEditorFooter';
import { calculateEffectCostPerLife, cleanEffectsForSave } from '../../utils/effectEditorUtils';
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

  // Initialize temp effects from category with user overrides if they exist
  useEffect(() => {
    if (category && category.effects) {
      // Get user effects if they exist
      const userEffects = userAssumptions?.categories?.[categoryId]?.effects;

      // Use the existing mergeEffects function to properly merge user and default effects
      const mergedEffects = mergeEffects(category.effects, userEffects);

      // Set the merged effects (already deep cloned by mergeEffects)
      setTempEditToEffects(mergedEffects);
    }
  }, [category, categoryId, userAssumptions]);

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

  // Handle save
  const handleSave = () => {
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
    <div className="h-full p-2">
      <div className="h-full flex flex-col border border-gray-300 rounded-lg bg-white shadow-sm">
        <EffectEditorHeader
          title={`Editing assumptions for category: ${category.name}`}
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
            ) : (
              `Preview calculations for year ${previewYear}`
            )
          }
          combinedCostPerLife={tempEditToEffects.length > 1 ? combinedCostPerLife : undefined}
          showCombinedCost={tempEditToEffects.length > 1}
          onClose={onCancel}
        />

        {/* Effects List */}
        <div className="overflow-y-auto px-3 py-3 max-h-[calc(80vh-300px)]">
          <div className="space-y-3">
            {tempEditToEffects.map((effect, index) => {
              const effectType = getEffectType(effect);
              const costPerLife = effectCostPerLife[index];

              return (
                <div key={index} className="border border-gray-400 rounded-lg p-3">
                  <div className="mb-2 flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Effect {index + 1}: {effect.effectId}
                      </h4>
                      {effect.validTimeInterval && (
                        <p className="text-xs text-gray-500 mt-1">
                          Active:{' '}
                          {effect.validTimeInterval[0] === null
                            ? `Until ${effect.validTimeInterval[1]}`
                            : `${effect.validTimeInterval[0]} - ${effect.validTimeInterval[1] || 'present'}`}
                          {(previewYear < effect.validTimeInterval[0] ||
                            (effect.validTimeInterval[1] && previewYear > effect.validTimeInterval[1])) && (
                            <span className="ml-2 text-orange-600">(Not active in {previewYear})</span>
                          )}
                        </p>
                      )}
                    </div>
                    <EffectCostDisplay cost={costPerLife} showInfinity={true} className="text-sm" />
                  </div>

                  {effectType === 'qaly' ? (
                    <QalyEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                      globalParameters={globalParameters}
                    />
                  ) : effectType === 'population' ? (
                    <PopulationEffectInputs
                      effect={effect}
                      effectIndex={index}
                      defaultEffect={defaultEffects.find((e) => e.effectId === effect.effectId)}
                      errors={errors}
                      onChange={updateEffectField}
                      globalParameters={globalParameters}
                    />
                  ) : (
                    <div className="text-sm text-red-600">Unknown effect type</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <EffectEditorFooter onSave={handleSave} onCancel={onCancel} hasErrors={hasErrors} />
      </div>
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
